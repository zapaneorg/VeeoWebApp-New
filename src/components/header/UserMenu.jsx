import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut, CalendarPlus, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import StarRating from '@/components/ui/StarRating';

const UserMenu = ({ onLinkClick }) => {
  const { user, logout } = useAuth();
  const { t } = useLocale();
  
  const userFirstName = user?.first_name || user?.user_metadata?.first_name || 'User';
  const userLastName = user?.last_name || user?.user_metadata?.last_name || '';
  const userInitials = `${userFirstName?.charAt(0) || ''}${userLastName?.charAt(0) || ''}`.toUpperCase();

  const isDriver = user?.role === 'driver';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1 text-white hover:text-gray-200 hover:bg-brand-accent-gray rounded-full">
          <Avatar className="h-8 w-8 border-2 border-gray-400">
            <AvatarImage src={user?.profile_pic_url || ''} alt={`${userFirstName} ${userLastName}`} />
            <AvatarFallback className="bg-brand-accent-gray text-brand-dark-gray text-xs font-semibold">{userInitials}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline font-medium text-white">{userFirstName}</span>
          <ChevronDown className="h-4 w-4 opacity-70 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border-gray-200 text-brand-dark-gray shadow-xl rounded-lg" align="end">
        <DropdownMenuLabel className="px-2 py-1.5 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userFirstName} {userLastName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            <div className="pt-1">
              <StarRating rating={user?.average_rating || 0} size="h-4 w-4" />
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200" />
        
        {isDriver ? (
          <DropdownMenuItem asChild className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer rounded-md mx-1">
            <Link to="/driver/dashboard" onClick={onLinkClick} className="flex items-center w-full px-2 py-1.5">
              <LayoutDashboard className="mr-2 h-4 w-4" /> {t('driver.dashboard.title')}
            </Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer rounded-md mx-1">
              <Link to="/profile" onClick={onLinkClick} className="flex items-center w-full px-2 py-1.5">
                <UserCircle className="mr-2 h-4 w-4" /> {t('header.profile')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer rounded-md mx-1">
              <Link to="/book" onClick={onLinkClick} className="flex items-center w-full px-2 py-1.5">
                <CalendarPlus className="mr-2 h-4 w-4" /> {t('header.myBookings')}
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem onClick={() => { logout(); if(onLinkClick) onLinkClick();}} className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 cursor-pointer rounded-md mx-1 px-2 py-1.5">
          <LogOut className="mr-2 h-4 w-4" /> {t('header.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;