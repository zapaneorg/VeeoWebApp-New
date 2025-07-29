import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, CalendarPlus, Car, Users as UsersIcon, LifeBuoy, Mail, X, BookOpen, Phone, Mail as MailIcon, UserCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import NavLink from './NavLink';
import StarRating from '@/components/ui/StarRating';
import VeeoLogo from '@/components/VeeoLogo';

const MobileMenuPanel = ({ isOpen, toggleMenu }) => {
  const { user, logout } = useAuth();
  const { t } = useLocale();
  
  const userFirstName = user?.first_name || user?.user_metadata?.first_name || 'User';
  const userLastName = user?.last_name || user?.user_metadata?.last_name || '';
  const userFullName = `${userFirstName} ${userLastName}`.trim();
  const userInitials = `${userFirstName?.charAt(0) || ''}${userLastName?.charAt(0) || ''}`.toUpperCase();
  const userEmail = user?.email || '';
  const userPhone = user?.phone || user?.user_metadata?.phone || '';

  const mobileMenuVariants = {
    closed: { x: "-100%", opacity: 0, transition: { type: "tween", duration: 0.3, ease: "easeIn" } },
    open: { x: 0, opacity: 1, transition: { type: "tween", duration: 0.3, ease: "easeOut" } },
  };
  
  const backdropVariants = {
    closed: { opacity: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, transition: { duration: 0.3 } },
  };

  const mainNavItems = [
    { to: "/book", labelKey: "header.book", icon: CalendarPlus },
    { to: "/services", labelKey: "header.services", icon: Car },
    { to: "/about", labelKey: "header.about", icon: UsersIcon },
    { to: "/drivers", labelKey: "header.driveWithVeeo", icon: Car },
  ];

  const secondaryNavItems = [
    { to: "/driver-resources", labelKey: "header.driverResources", icon: BookOpen },
    { to: "/help", labelKey: "header.helpCenter", icon: LifeBuoy },
    { to: "/contact", labelKey: "header.contact", icon: Mail },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
            onClick={toggleMenu}
            aria-hidden="true"
          />
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 bottom-0 w-full sm:w-4/5 sm:max-w-xs bg-white/90 backdrop-blur-xl shadow-2xl p-6 flex flex-col z-50 lg:hidden"
            aria-modal="true"
            role="dialog"
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={toggleMenu}>
                 <VeeoLogo className="text-3xl text-brand-primary" />
              </Link>
              <Button onClick={toggleMenu} variant="ghost" size="icon" className="text-gray-700 hover:text-brand-primary hover:bg-gray-200/70">
                <X className="h-7 w-7" />
              </Button>
            </div>
            
            <nav className="flex-grow flex flex-col space-y-1 overflow-y-auto pr-2 -mr-2">
              {user && (
                <div className="mb-6 p-4 bg-gray-50/80 rounded-lg border border-gray-200/80">
                  <Link to="/profile" onClick={toggleMenu} className="block group">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-16 w-16 border-2 border-gray-300 group-hover:border-primary transition-colors">
                         <AvatarImage src={user.profile_pic_url || ''} alt={userFullName} />
                         <AvatarFallback className="bg-brand-accent-gray text-brand-dark-gray font-semibold text-xl">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-semibold text-xl text-brand-dark-gray group-hover:text-primary transition-colors">{userFullName}</p>
                          <StarRating rating={user.average_rating || 0} />
                      </div>
                    </div>
                  </Link>
                  {userEmail && (
                    <div className="flex items-center text-sm text-gray-700 mt-3 pt-2 border-t border-gray-200/70">
                      <MailIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{userEmail}</span>
                    </div>
                  )}
                  {userPhone && (
                    <div className="flex items-center text-sm text-gray-700 mt-1">
                      <Phone className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{userPhone}</span>
                    </div>
                  )}
                </div>
              )}

              {mainNavItems.map(item => (
                 <NavLink 
                    key={item.to} 
                    to={item.to} 
                    onClick={toggleMenu} 
                    isMobile={true} 
                    icon={item.icon}
                    className="text-brand-dark-gray hover:bg-gray-100/80 text-lg py-3"
                  >
                    {t(item.labelKey)}
                  </NavLink>
              ))}
              
              <div className="border-t border-gray-200/70 my-3"></div>

              {secondaryNavItems.map(item => (
                 <NavLink 
                    key={item.to} 
                    to={item.to} 
                    onClick={toggleMenu} 
                    isMobile={true} 
                    icon={item.icon}
                    className="text-brand-dark-gray hover:bg-gray-100/80 text-lg py-3"
                  >
                    {t(item.labelKey)}
                  </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-200/70">
              {user ? (
                <Button 
                  onClick={() => { logout(); toggleMenu(); }} 
                  variant="ghost" 
                  className="w-full justify-start text-lg py-3 text-red-600 hover:bg-red-100/80 hover:text-red-700"
                >
                  <LogOut className="mr-3 h-5 w-5" /> {t('header.logout')}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={toggleMenu} className="block">
                    <Button variant="outline" className="w-full text-lg py-3 border-primary text-primary hover:bg-primary/5">
                      {t('header.login')}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu} className="block">
                    <Button variant="default" className="w-full text-lg py-3">
                      {t('header.register')}
                    </Button>
                  </Link>
                  <div className="border-t border-gray-200/70 my-3"></div>
                  <Link to="/driver-login" onClick={toggleMenu} className="block">
                    <Button variant="outline" className="w-full text-lg py-3 border-primary text-primary hover:bg-primary/5">
                        <UserCog className="mr-2 h-5 w-5" />
                        {t('header.driverLogin')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenuPanel;