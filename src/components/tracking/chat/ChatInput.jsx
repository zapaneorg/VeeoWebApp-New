import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInput = ({ 
  newMessage, 
  onInputChange, 
  onSendMessage, 
  isSending, 
  connectionStatus
}) => {
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex gap-2 items-center">
        <Textarea
          value={newMessage}
          onChange={onInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Écrivez un message..."
          className="flex-1 resize-none rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12 min-h-[40px]"
          rows={1}
          maxRows={4}
          disabled={isSending || connectionStatus !== 'connected'}
        />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onSendMessage} 
            size="icon" 
            className="rounded-full bg-blue-600 hover:bg-blue-700 h-10 w-10 flex-shrink-0"
            disabled={!newMessage.trim() || isSending || connectionStatus !== 'connected'}
          >
            {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Send className="h-5 w-5" />
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatInput;