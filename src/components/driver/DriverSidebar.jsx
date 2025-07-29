import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, History, DollarSign, FileText, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/ui/StarRating';

const SidebarNavLink = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center px-4 py-3 text-gray-200 rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-white',
        isActive && 'bg-primary text-white'
      )
    }
  >
    <Icon className="h-5 w-5 mr-3" />
    <span className="font-medium">{children}</span>
  </NavLink>
);

const DriverSidebar = () => {
  const { user, logout } = useAuth();
  const { t } = useLocale();

  const userFirstName = user?.first_name || '';
  const userLastName = user?.last_name || '';
  const userInitials = `${userFirstName?.charAt(0) || ''}${userLastName?.charAt(0) || ''}`.toUpperCase();
  
  const logoFontClass = "font-['Poppins_Bold',_sans-serif] font-black tracking-tighter";

  const navItems = [
    { to: '/driver/dashboard', labelKey: 'driver.sidebar.dashboard', icon: LayoutDashboard },
    { to: '/driver/profile', labelKey: 'driver.sidebar.profile', icon: User },
    { to: '/driver/history', labelKey: 'driver.sidebar.history', icon: History },
    { to: '/driver/earnings', labelKey: 'driver.sidebar.earnings', icon: DollarSign },
    { to: '/driver/documents', labelKey: 'driver.sidebar.documents', icon: FileText },
  ];

  const bottomNavItems = [
    { to: '/driver/settings', labelKey: 'driver.sidebar.settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <Link to="/driver/dashboard" className="flex items-baseline gap-2">
          <div className={cn('text-3xl text-white flex items-center', logoFontClass)}>
            Veeo
            <span className="inline-block ml-1 text-sky-400 text-4xl relative -top-1">.</span>
          </div>
          <span className="text-xl font-semibold text-gray-400">Driver</span>
        </Link>
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto flex flex-col justify-between">
        <nav>
          {navItems.map(item => (
            <SidebarNavLink key={item.to} to={item.to} icon={item.icon}>
              {t(item.labelKey)}
            </SidebarNavLink>
          ))}
        </nav>
        <nav>
          {bottomNavItems.map(item => (
            <SidebarNavLink key={item.to} to={item.to} icon={item.icon}>
              {t(item.labelKey)}
            </SidebarNavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-3 border-2 border-primary/50">
            <AvatarImage src={user?.profile_pic_url} alt={`${userFirstName} ${userLastName}`} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{userFirstName} {userLastName}</p>
            <StarRating rating={user?.average_rating || 0} size="h-4 w-4" className="text-white" showValue={false} />
            <p className="text-xs text-gray-400">Chauffeur</p>
          </div>
        </div>
        <Button onClick={logout} variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/20 hover:text-red-300">
          <LogOut className="h-5 w-5 mr-3" />
          {t('header.logout')}
        </Button>
      </div>
    </div>
  );
};

export default DriverSidebar;