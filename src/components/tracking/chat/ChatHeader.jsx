import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const ChatHeader = ({ opponent, connectionStatus }) => {
  const handlePhoneCall = (e) => {
    e.stopPropagation();
    if (opponent?.phone) {
      window.location.href = `tel:${opponent.phone}`;
    }
  };

  return (
    <div className="p-4 border-b bg-gray-50 rounded-t-2xl relative">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage src={opponent?.profile_pic_url} alt={opponent?.first_name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                 {opponent?.first_name?.[0] || <User size={20} />}
              </AvatarFallback>
            </Avatar>
            <span className={cn(
              "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-50",
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            )} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {opponent?.first_name || 'Interlocuteur'}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {opponent?.vehicle_model || (connectionStatus === 'connected' ? 'En ligne' : 'Hors ligne')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 pr-8 z-10">
          {opponent?.phone && (
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={handlePhoneCall}
            >
              <Phone className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;