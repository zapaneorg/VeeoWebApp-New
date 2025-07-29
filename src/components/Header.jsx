import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, Car, UserCog, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { Button } from '@/components/ui/button';
import NavLink from './header/NavLink';
import UserMenu from './header/UserMenu';
import MobileMenuPanel from './header/MobileMenuPanel';
import VeeoLogo from '@/components/VeeoLogo';

const Header = () => {
  const { user, activeRide } = useAuth();
  const { t } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const navItems = [
    { to: "/book", labelKey: "header.book" },
    { to: "/services", labelKey: "header.services" },
    { to: "/about", labelKey: "header.about" },
    { to: "/drivers", labelKey: "header.driveWithVeeo", icon: Car },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 transition-shadow duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.2)] bg-brand-dark-gray/90 backdrop-blur-lg text-white">
        <nav className="container mx-auto px-4 h-20 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/">
              <VeeoLogo className="text-3xl text-white" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:flex space-x-2 items-center"
          >
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} className="text-gray-200 hover:text-white" icon={item.icon}>
                {t(item.labelKey)}
              </NavLink>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            {user ? (
              <div className="flex items-center gap-2">
                {activeRide && (
                  <Link to={`/track/${activeRide.id}`}>
                    <Button variant="secondary" size="sm" className="bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 hover:text-white border border-sky-500/30">
                      <Map className="mr-2 h-4 w-4 animate-pulse" />
                      Suivre votre course
                    </Button>
                  </Link>
                )}
                <UserMenu onLinkClick={() => setIsMobileMenuOpen(false)} />
              </div>
            ) : (
              <>
                <div className="hidden lg:flex items-center space-x-2">
                  <NavLink to="/login" className="px-4 py-2 rounded-md text-gray-200 hover:bg-brand-accent-gray hover:text-white">{t('header.login')}</NavLink>
                  <Link to="/register">
                    <Button size="sm" className="bg-white text-brand-dark-gray hover:bg-gray-200 transition-colors px-4 py-2">
                      {t('header.register')}
                    </Button>
                  </Link>
                   <div className="border-l border-gray-500/50 h-6 mx-2"></div>
                   <NavLink to="/driver-login" className="px-4 py-2 rounded-md text-gray-200 hover:bg-brand-accent-gray hover:text-white flex items-center">
                    <UserCog className="mr-2 h-4 w-4" /> {t('header.driverLogin', { defaultValue: 'Espace Chauffeur' })}
                  </NavLink>
                </div>
                <div className="flex items-center space-x-1 lg:hidden">
                  <Link to="/login">
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-brand-accent-gray">
                      <LogIn className="h-6 w-6" />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-brand-accent-gray">
                      <UserPlus className="h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
            <div className="lg:hidden">
              <Button onClick={toggleMobileMenu} variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-brand-accent-gray">
                {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </Button>
            </div>
          </motion.div>
        </nav>
      </header>
      <MobileMenuPanel isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
    </>
  );
};

export default Header;