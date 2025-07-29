import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Mail, Lock, Loader2, Chrome } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, socialLogin, loading, user } = useAuth();
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/book";

  useEffect(() => {
    if (user && !loading) {
      if (user.role === 'driver') {
        navigate('/driver/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, loading, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: t('login.loginErrorTitle'),
        description: t('login.loginErrorGeneric'), 
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    const { success, user: loggedInUser } = await login(email, password, false);
    setIsSubmitting(false);

    if (success && loggedInUser) {
      toast({
        title: t('login.loginSuccessTitle'),
        description: t('login.loginSuccessMessage'),
        variant: "success",
      });
    }
  };

  const handleGoogleLogin = async () => {
    await socialLogin('google');
  };

  const isLoading = loading || isSubmitting;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,80px)-var(--footer-height,80px))] py-12 bg-background text-foreground px-4"
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-xl border border-border">
        <div className="text-center">
          <h1 className="text-4xl font-black text-primary mb-2">
            {t('login.title')}
          </h1>
          <p className="text-muted-foreground">{t('login.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-foreground">{t('login.emailLabel')}</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-input border-border focus:ring-ring text-foreground placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="text-foreground">{t('login.passwordLabel')}</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-input border-border focus:ring-ring text-foreground placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 hover:underline">
              {t('login.forgotPassword')}
            </Link>
          </div>
          <Button type="submit" variant="default" className="w-full font-semibold py-3" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('login.loginButton')}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{t('common.or')}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full font-medium py-3" onClick={handleGoogleLogin} disabled={isLoading}>
          <Chrome className="mr-2 h-4 w-4" /> {t('login.googleLoginButton', {defaultValue: "Continuer avec Google"})}
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary/80 hover:underline">
            {t('login.registerLink')}
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;