import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const { toast } = useToast();
  const { sendPasswordResetEmail, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Champ requis",
        description: "Veuillez entrer votre adresse e-mail.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await sendPasswordResetEmail(email);
    if (success) {
      setMessageSent(true);
      // Toast est géré dans AuthContext
    }
    // Toast d'erreur est géré dans AuthContext
  };

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
            Mot de passe oublié ?
          </h1>
          <p className="text-gray-400">
            {messageSent 
              ? "Consultez votre boîte de réception (et vos spams)."
              : "Entrez votre e-mail pour recevoir un lien de réinitialisation."
            }
          </p>
        </div>
        {!messageSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300">Adresse e-mail</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votreadresse@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 focus:ring-sky-500 text-gray-100"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold py-3" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Envoyer le lien de réinitialisation"}
            </Button>
          </form>
        ) : (
           <div className="text-center">
             <p className="text-gray-300 mb-6">Un e-mail a été envoyé à <span className="font-semibold text-sky-400">{email}</span> avec des instructions pour réinitialiser votre mot de passe.</p>
           </div>
        )}
        <div className="text-center">
          <Link to="/login" className="text-sm text-sky-400 hover:underline flex items-center justify-center">
            <ArrowLeft className="mr-1 h-4 w-4" /> Retour à la connexion
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;