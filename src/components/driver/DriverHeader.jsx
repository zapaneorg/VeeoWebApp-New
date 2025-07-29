import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VeeoLogo from '@/components/VeeoLogo';

const DriverHeader = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const { user } = useAuth();
  const userFirstName = user?.first_name || '';
  const userLastName = user?.last_name || '';
  const userInitials = `${userFirstName?.charAt(0) || ''}${userLastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <header className="md:hidden flex items-center justify-between h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sticky top-0 z-40">
      <Link to="/driver/dashboard" className="flex items-baseline gap-2">
        <VeeoLogo className="text-3xl text-brand-dark-gray" />
        <span className="text-xl font-semibold text-gray-500">Driver</span>
      </Link>
      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profile_pic_url} alt={`${userFirstName} ${userLastName}`} />
          <AvatarFallback className="bg-primary/20 text-primary font-bold">{userInitials}</AvatarFallback>
        </Avatar>
        <Button onClick={toggleMobileMenu} variant="ghost" size="icon">
          {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </Button>
      </div>
    </header>
  );
};

export default DriverHeader;