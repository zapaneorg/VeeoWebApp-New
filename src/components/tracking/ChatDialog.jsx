import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { MessageCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';

const ChatDialog = ({ booking, driver }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);
  const typingChannelRef = useRef(null);
  const { toast } = useToast();
  const { sendPushNotification, requestPermission } = useNotifications();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpponentTyping]);
  
  useEffect(() => {
    if (isOpen) {
      requestPermission();
    }
  }, [isOpen, requestPermission]);
  
  const sendTypingIndicator = useCallback((isTyping) => {
    if (typingChannelRef.current?.state === 'joined') {
      typingChannelRef.current.track({
          event: 'typing',
          payload: { user_id: user.id, is_typing: isTyping }
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (!booking?.id || !user?.id) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('ride_messages')
        .select('*, sender:sender_id(*)')
        .eq('booking_id', booking.id)
        .order('created_at', { ascending: true });
      
      if (!error && data) setMessages(data);
    };

    if (isOpen) {
      fetchMessages();
    }
    
    const handleNewMessage = async (payload) => {
      const { data: fullMessage, error } = await supabase
        .from('ride_messages')
        .select('*, sender:sender_id(*)')
        .eq('id', payload.new.id)
        .single();

      if (error) {
        console.error("Error fetching full message:", error);
        return;
      }
      
      setMessages(prev => {
        if (prev.some(m => m.id === fullMessage.id)) return prev;
        return [...prev, fullMessage];
      });
      
      if (fullMessage.sender_id !== user.id) {
        if (!document.hasFocus() || !isOpen) {
           setUnreadCount(prev => prev + 1);
        }
        const senderName = fullMessage.sender?.first_name || (user.role === 'driver' ? 'Votre client' : 'Votre chauffeur');

        toast({
          title: `Nouveau message de ${senderName}`,
          description: fullMessage.message,
          variant: 'default',
          duration: 8000
        });
        sendPushNotification(
          `Nouveau message de ${senderName}`,
          fullMessage.message
        );
      }
    };

    channelRef.current = supabase.channel(`ride-chat:${booking.id}`);
    
    channelRef.current
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'ride_messages',
        filter: `booking_id=eq.${booking.id}`
      }, handleNewMessage)
      .subscribe((status) => {
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
      });

    typingChannelRef.current = supabase.channel(`typing:${booking.id}`);
    typingChannelRef.current
        .on('broadcast', { event: 'typing' }, ({ payload }) => {
            if (payload.user_id !== user.id) {
                setIsOpponentTyping(payload.is_typing);
            }
        })
        .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current).catch(console.error);
      if (typingChannelRef.current) supabase.removeChannel(typingChannelRef.current).catch(console.error);
    };
  }, [booking?.id, user?.id, isOpen, toast, sendPushNotification, user.role]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !booking?.id || isSending || !user) return;

    setIsSending(true);
    sendTypingIndicator(false);
    
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      booking_id: booking.id,
      sender_id: user.id,
      sender_type: user.role,
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
      sending: true,
      sender: {
        profile_pic_url: user.profile_pic_url,
        first_name: user.first_name,
        last_name: user.last_name,
      }
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      const { error } = await supabase.from('ride_messages').insert({
        booking_id: booking.id,
        sender_id: user.id,
        sender_type: user.role,
        message: optimisticMessage.message
      });

      if (error) throw error;
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: "Erreur", description: "Votre message n'a pas pu être envoyé.", variant: "destructive" });
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      setNewMessage(optimisticMessage.message);
    } finally {
      setIsSending(false);
    }
  };


  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    if(value) {
      sendTypingIndicator(true);
      setTimeout(() => sendTypingIndicator(false), 2000);
    } else {
      sendTypingIndicator(false);
    }
  };
  
  const opponent = user.role === 'driver' ? (booking.client || { first_name: 'Client', profile_pic_url: null }) : driver;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/90 backdrop-blur-sm">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Discuter</span>
          </Button>
          {unreadCount > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white"
            >
              {unreadCount}
            </motion.div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md h-[90vh] max-h-[700px] flex flex-col p-0 gap-0 rounded-2xl">
        <DialogHeader className="p-0 relative">
          <ChatHeader 
            opponent={opponent} 
            connectionStatus={connectionStatus} 
          />
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 z-20">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <ChatMessages 
            messages={messages} 
            opponent={opponent} 
            user={user}
            isOpponentTyping={isOpponentTyping} 
            messagesEndRef={messagesEndRef} 
          />
        </div>

        <ChatInput 
          newMessage={newMessage}
          onInputChange={handleInputChange}
          onSendMessage={sendMessage}
          isSending={isSending}
          connectionStatus={connectionStatus}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;