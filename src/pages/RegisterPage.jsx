import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { Checkbox } from "@/components/ui/checkbox"


const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, loading: authLoading, user } = useAuth();
  const { t } = useLocale();

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/profile');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast({
        title: t('register.registrationErrorTitle'),
        description: t('register.missingFieldsDesc') || "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: t('register.registrationErrorTitle'),
        description: t('register.passwordMismatch'),
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
        toast({
          title: t('register.registrationErrorTitle'),
          description: t('register.passwordTooShortDesc') || "Le mot de passe doit contenir au moins 6 caractères.",
          variant: "destructive",
        });
        return;
      }
    if (!agreedToTerms) {
      toast({
        title: t('register.registrationErrorTitle'),
        description: t('register.mustAgreeToTerms') || "Vous devez accepter les conditions générales et la politique de confidentialité.",
        variant: "destructive",
      });
      return;
    }

    const success = await register(firstName, lastName, email, password);
    if (success) {
      navigate('/login'); 
    }
  };

  // Si l'authentification est en cours ET qu'il n'y a pas encore d'utilisateur, afficher un loader.
  // Cela couvre le cas où on vérifie la session initiale.
  if (authLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height,80px)-var(--footer-height,80px))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Si l'utilisateur est défini ET que l'authentification n'est plus en cours,
  // cela signifie que l'utilisateur est connecté, donc on ne rend rien ici car useEffect va rediriger.
  if (user && !authLoading) {
      return null; 
  }
  
  // Si l'utilisateur n'est pas défini ET que l'authentification n'est plus en cours,
  // cela signifie que l'utilisateur n'est pas connecté, on affiche donc le formulaire.
  // C'est le cas principal pour afficher le formulaire d'inscription.
  if (!user && !authLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,80px)-var(--footer-height,80px))] py-12 bg-background text-foreground px-4"
      >
        <div className="w-full max-w-lg p-8 space-y-6 bg-card rounded-xl shadow-xl border border-border">
          <div className="text-center">
            <h1 className="text-4xl font-black text-primary mb-2">
              {t('register.title')}
            </h1>
            <p className="text-muted-foreground">{t('register.subtitle')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-foreground">{t('register.firstNameLabel')}</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t('register.firstNamePlaceholder')}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 bg-input border-border focus:ring-ring text-foreground placeholder:text-muted-foreground"
                    required
                    disabled={authLoading}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName" className="text-foreground">{t('register.lastNameLabel')}</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t('register.lastNamePlaceholder')}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 bg-input border-border focus:ring-ring text-foreground placeholder:text-muted-foreground"
                    required
                    disabled={authLoading}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground">{t('register.emailLabel')}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('register.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-border focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  required
                  disabled={authLoading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">{t('register.passwordLabel')}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('register.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-input border-border focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  required
                  disabled={authLoading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-foreground">{t('register.confirmPasswordLabel')}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-input border-border focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  required
                  disabled={authLoading}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} disabled={authLoading} />
              <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                {t('register.termsAccept', {
                  termsLink: <Link to="/terms" className="underline hover:text-primary">{t('register.termsLinkText')}</Link>,
                  privacyLink: <Link to="/privacy" className="underline hover:text-primary">{t('register.privacyLinkText')}</Link>
                })}
              </Label>
            </div>
            <Button type="submit" variant="default" className="w-full font-semibold py-3 mt-2" disabled={authLoading}>
              {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('register.registerButton')}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 hover:underline">
              {t('register.loginLink')}
            </Link>
          </p>
        </div>
      </motion.div>
    );
  }

  // Fallback au cas où aucune des conditions ci-dessus n'est remplie (ne devrait pas arriver)
  // ou si authLoading est vrai mais que user est aussi défini (ce qui est géré par la redirection)
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height,80px)-var(--footer-height,80px))]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};

export default RegisterPage;