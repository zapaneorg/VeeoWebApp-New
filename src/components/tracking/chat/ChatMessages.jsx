import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChatMessages = ({ messages, opponent, user, isOpponentTyping, messagesEndRef }) => {

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="font-semibold">Commencez la conversation</h3>
        <p className="text-sm">Envoyez un message à {opponent?.first_name || 'votre interlocuteur'}.</p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const isSender = message.sender_id === user.id;
          const senderProfile = isSender ? user : message.sender;
          
          return (
            <motion.div
              key={message.id || `msg-${index}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: isSender ? 20 : -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn("flex items-end gap-2", isSender ? "justify-end" : "justify-start")}
            >
              {!isSender && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={senderProfile?.profile_pic_url} />
                  <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                    {senderProfile?.first_name?.[0] || <User size={14} />}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                "p-3 rounded-2xl max-w-[80%] shadow-sm", 
                "bg-white border border-gray-200 text-black",
                isSender ? "rounded-br-lg" : "rounded-bl-lg"
              )}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{message.message}</p>
              </div>
              {message.sending && (
                <Clock className="w-3 h-3 text-gray-400 animate-spin" />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      <AnimatePresence>
        {isOpponentTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start items-end gap-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={opponent?.profile_pic_url} />
              <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                {opponent?.first_name?.[0] || <User size={14} />}
              </AvatarFallback>
            </Avatar>
            <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={messagesEndRef} />
    </>
  );
};

export default ChatMessages;