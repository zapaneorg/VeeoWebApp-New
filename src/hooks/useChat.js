import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export const useChat = (bookingId) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = useCallback(async () => {
    if (!bookingId) return;
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*, sender:sender_id(*)')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel(`chat:${bookingId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `booking_id=eq.${bookingId}` }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, fetchMessages]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !user) return;
    const { error } = await supabase
      .from('chat_messages')
      .insert([{ booking_id: bookingId, sender_id: user.id, message: newMessage }]);
    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  return { messages, newMessage, setNewMessage, sendMessage };
};
