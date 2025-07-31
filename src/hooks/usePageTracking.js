import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/lib/analytics';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pageName = location.pathname.replace('/', '') || 'home';
    analytics.trackPageView(pageName);
  }, [location]);
};