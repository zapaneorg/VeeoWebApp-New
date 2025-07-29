import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // useAuth
import { supabase } from '@/lib/supabaseClient'; // Direct supabase for initial check

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, loading } = useAuth(); // Get resetPassword and loading from context

  useEffect(() => {
    // Check if the URL contains an access token fragment, which is typical for Supabase password reset links
    const hash = location.hash;
    if (!hash.includes('access_token') && !hash.includes('error_description')) {
      // Attempt to get current session. If no session and no token in URL, link is likely invalid/expired
      // This check is basic. Supabase handles token validation on updateUser.
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Lien invalide ou expiré",
            description: "Le lien de réinitialisation semble invalide. Veuillez en demander un nouveau si besoin.",
            variant: "destructive",
          });
          navigate('/login');
        }
      };
      checkSession();
    } else if (hash.includes('error_description')) {
        const params = new URLSearchParams(hash.substring(1)); // remove #
        const errorDescription = params.get('error_description');
        toast({
            title: "Erreur de réinitialisation",
            description: errorDescription || "Une erreur est survenue avec le lien de réinitialisation.",
            variant: "destructive",
        });
        navigate('/login');
    }
  }, [location, navigate, toast]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Votre mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Les mots de passe ne correspondent pas",
        description: "Veuillez vérifier vos mots de passe.",
        variant: "destructive",
      });
      return;
    }

    const success = await resetPassword(password);

    if (success) {
      setResetSuccess(true);
      // Toast de succès et redirection gérés dans AuthContext via onAuthStateChange event 'PASSWORD_RECOVERY'
    } 
    // Toast d'erreur géré dans AuthContext
  };

  if (resetSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 text-center"
      >
        <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Mot de passe réinitialisé avec succès !</h1>
        <p className="text-gray-400 mb-6">Vous allez être redirigé vers la page de connexion.</p>
        <Button onClick={() => navigate('/login')} variant="cta">Aller à la connexion</Button>
      </motion.div>
    );
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12"
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-2">
            Réinitialiser votre mot de passe
          </h1>
          <p className="text-gray-400">Entrez votre nouveau mot de passe ci-dessous.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-slate-700 border-slate-600 focus:ring-sky-500 text-gray-100"
                required
                disabled={loading}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sky-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 bg-slate-700 border-slate-600 focus:ring-sky-500 text-gray-100"
                required
                disabled={loading}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sky-400">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold py-3" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;