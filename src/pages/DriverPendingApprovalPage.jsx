import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { Clock, Mail, LogOut, Home } from 'lucide-react';

const DriverPendingApprovalPage = () => {
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[calc(100vh-var(--header-height,80px)-var(--footer-height,80px))] bg-background text-foreground px-4 py-12"
    >
      <div className="w-full max-w-lg p-8 md:p-12 space-y-8 bg-card rounded-xl shadow-xl border border-border text-center">
        <Clock className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-card-foreground">
          {t('auth.pendingApproval.title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('auth.pendingApproval.subtitle', { name: user?.user_metadata?.first_name || 'Chauffeur' })}
        </p>
        <div className="bg-muted/50 p-6 rounded-lg border border-border">
          <p className="text-foreground">
            {t('auth.pendingApproval.message')}
          </p>
          <div className="flex items-center justify-center mt-4 text-primary font-semibold">
            <Mail className="h-5 w-5 mr-2" />
            <span>{user?.email}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              {t('auth.pendingApproval.backToHome')}
            </Link>
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            {t('header.logout')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DriverPendingApprovalPage;