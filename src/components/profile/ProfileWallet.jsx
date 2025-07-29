import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Wallet, PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const ProfileWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();

  const walletBalance = user?.wallet_balance ? parseFloat(user.wallet_balance).toFixed(2) : '0.00';

  const handleRecharge = () => {
    toast({
      title: t('profile.wallet.featureComingSoonTitle', {defaultValue: "Fonctionnalité à venir"}),
      description: t('profile.wallet.rechargeNotImplemented', {defaultValue: "🚧 La recharge de portefeuille n'est pas encore implémentée. Vous pourrez demander cette fonctionnalité plus tard ! 🚀"}),
    });
  };

  return (
    <Card className="mt-8 bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center"><Wallet className="mr-2 h-6 w-6"/>{t('profile.wallet.title', {defaultValue: "Mon Portefeuille"})}</CardTitle>
        <CardDescription className="text-muted-foreground">{t('profile.wallet.subtitle', {defaultValue: "Consultez votre solde et rechargez votre compte."})}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 bg-secondary/50 rounded-lg border border-border text-center">
          <p className="text-muted-foreground text-sm">{t('profile.wallet.currentBalanceLabel', {defaultValue: "Solde actuel"})}</p>
          <p className="text-4xl font-bold text-green-600">{walletBalance} €</p>
        </div>
        <Button onClick={handleRecharge} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
          <PlusCircle className="mr-2 h-5 w-5" /> {t('profile.wallet.rechargeButton', {defaultValue: "Recharger le portefeuille"})}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileWallet;