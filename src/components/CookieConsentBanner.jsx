import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'veeo_cookie_consent';

const CookieConsentBanner = () => {
  const { t } = useLocale();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    // Here you could initialize analytics or other cookie-dependent services
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
    // Handle declined state, e.g., disable non-essential cookies
  };

  const bannerVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: "0%", opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.5 } },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6 bg-primary text-primary-foreground shadow-2xl border-t border-border"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start md:items-center text-sm">
              <Cookie className="h-8 w-8 mr-3 mt-1 md:mt-0 text-primary-foreground flex-shrink-0" />
              <p>
                {t('cookieConsent.message')}{' '}
                <Link to="/privacy" className="underline hover:text-primary-foreground/80 font-semibold">
                  {t('cookieConsent.learnMore')}
                </Link>.
              </p>
            </div>
            <div className="flex space-x-3 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleDecline} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                {t('cookieConsent.decline')}
              </Button>
              <Button variant="default" size="sm" onClick={handleAccept} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border border-primary-foreground/50">
                {t('cookieConsent.accept')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;