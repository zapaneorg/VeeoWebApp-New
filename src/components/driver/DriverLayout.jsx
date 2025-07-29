import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DriverSidebar from './DriverSidebar';
import DriverHeader from './DriverHeader';
import DriverMobileMenu from './DriverMobileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';

const DriverLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/driver/dashboard' || location.pathname === '/driver';

  useEffect(() => {
    if (location.pathname === '/driver') {
      navigate('/driver/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    let watchId;

    const updateLocation = (lat, lng) => {
      if (user && user.id) {
        supabase
          .from('profiles')
          .update({ lat, lng, updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating driver location:', error);
            }
          });
      }
    };

    if (user && user.role === 'driver') {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateLocation(latitude, longitude);
          },
          (error) => {
            console.error('Error getting geolocation:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [user]);


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 w-full">
      <DriverSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DriverHeader isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className={cn("w-full", isDashboard ? "h-full" : "container mx-auto px-6 py-8")}>
            <Outlet />
          </div>
        </main>
      </div>
      <DriverMobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
    </div>
  );
};

export default DriverLayout;