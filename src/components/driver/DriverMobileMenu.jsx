import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, History, DollarSign, FileText, LogOut, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/ui/StarRating';

const panelVariants = {
  open: {
    x: 0,
    transition: { type: 'tween', duration: 0.3, ease: 'easeOut' },
  },
  closed: {
    x: '100%',
    transition: { type: 'tween', duration: 0.3, ease: 'easeIn' },
  },
};

const backdropVariants = {
  closed: { opacity: 0, transition: { duration: 0.3 } },
  open: { opacity: 1, transition: { duration: 0.3 } },
};

const MobileNavLink = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex items-center p-3 text-brand-dark-gray rounded-lg transition-colors hover:bg-gray-100/80 text-lg font-bold',
        isActive && 'bg-primary/10 text-primary'
      )
    }
  >
    <Icon className="mr-4 h-6 w-6" />
    {children}
  </NavLink>
);

const DriverMobileMenu = ({ isOpen, toggleMenu }) => {
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const location = useLocation();

  React.useEffect(() => {
    if (isOpen) {
      // This logic is simplified to just handle the open state.
      // Closing is handled by click events.
    }
  }, [location, isOpen, toggleMenu]);
  
  const handleLinkClick = () => {
      toggleMenu();
  };

  const userFirstName = user?.first_name || '';
  const userLastName = user?.last_name || '';
  const userInitials = `${userFirstName?.charAt(0) || ''}${userLastName?.charAt(0) || ''}`.toUpperCase();

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

  const logoFontClass = "font-['Poppins_Bold',_sans-serif] font-black tracking-tighter";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleMenu}
            aria-hidden="true"
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-xs bg-white/90 backdrop-blur-xl text-brand-dark-gray shadow-2xl z-50 md:hidden flex flex-col"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200/80">
               <Link to="/driver/dashboard" onClick={handleLinkClick} className="flex items-baseline gap-2">
                <div className={cn('text-3xl text-brand-dark-gray flex items-center', logoFontClass)}>
                  Veeo
                  <span className="inline-block ml-1 text-sky-400 text-4xl relative -top-1">.</span>
                </div>
                <span className="text-xl font-semibold text-gray-500">Driver</span>
              </Link>
              <Button onClick={toggleMenu} variant="ghost" size="icon" className="text-gray-700 hover:text-primary hover:bg-gray-200/70">
                <X className="h-7 w-7" />
              </Button>
            </div>
            
            <div className="flex-grow p-4 space-y-2 overflow-y-auto">
              {navItems.map(item => (
                <MobileNavLink key={item.to} to={item.to} icon={item.icon} onClick={handleLinkClick}>
                  {t(item.labelKey)}
                </MobileNavLink>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200/80">
              <div className="space-y-2 mb-4">
                {bottomNavItems.map(item => (
                  <MobileNavLink key={item.to} to={item.to} icon={item.icon} onClick={handleLinkClick}>
                    {t(item.labelKey)}
                  </MobileNavLink>
                ))}
              </div>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-3 border-2 border-primary/50">
                  <AvatarImage src={user?.profile_pic_url} alt={`${userFirstName} ${userLastName}`} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-brand-dark-gray">{userFirstName} {userLastName}</p>
                  <StarRating rating={user?.average_rating || 0} size="h-4 w-4" />
                  <p className="text-xs text-muted-foreground">Chauffeur</p>
                </div>
              </div>
              <Button onClick={() => { logout(); toggleMenu(); }} variant="ghost" className="w-full justify-start text-lg py-3 text-red-600 hover:bg-red-100/80 hover:text-red-700">
                <LogOut className="h-5 w-5 mr-3" />
                {t('header.logout')}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DriverMobileMenu;