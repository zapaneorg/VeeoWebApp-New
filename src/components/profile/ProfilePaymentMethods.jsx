import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, PlusCircle, Trash2, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const ProfilePaymentMethods = () => {
  const { toast } = useToast();
  const { t } = useLocale();

  const handleAddCard = () => {
    toast({
      title: t('profile.payments.featureComingSoonTitle', {defaultValue: "Fonctionnalité à venir"}),
      description: t('profile.payments.addCardNotImplemented', {defaultValue: "🚧 L'ajout de carte n'est pas encore implémenté. Vous pourrez demander cette fonctionnalité plus tard ! 🚀"}),
    });
  };
  
  const handleCashOption = () => {
     toast({
      title: t('profile.payments.cashInfoTitle', {defaultValue: "Paiement en espèces"}),
      description: t('profile.payments.cashInfoDesc', {defaultValue: "L'option de paiement en espèces sera disponible selon les réglementations locales et la disponibilité du chauffeur."}),
    });
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center"><CreditCard className="mr-2 h-6 w-6"/>{t('profile.payments.title', {defaultValue: "Méthodes de paiement"})}</CardTitle>
        <CardDescription className="text-muted-foreground">{t('profile.payments.subtitle', {defaultValue: "Gérez vos cartes et options de paiement."})}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="font-semibold text-foreground">{t('profile.payments.defaultCardExample', {defaultValue: "Visa **** **** **** 1234"})}</p>
                <p className="text-sm text-muted-foreground">{t('profile.payments.cardExpiryExample', {defaultValue: "Expire le 12/2028"})}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive/80">
              <Trash2 className="h-4 w-4 mr-1 sm:mr-2"/> <span className="hidden sm:inline">{t('common.delete')}</span>
            </Button>
          </div>

          <Button onClick={handleAddCard} className="w-full bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> {t('profile.payments.addNewCardButton', {defaultValue: "Ajouter une nouvelle carte bancaire"})}
          </Button>
          
          <Button onClick={handleCashOption} variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 hover:text-primary/90">
            <DollarSign className="mr-2 h-4 w-4" /> {t('profile.payments.cashOptionButton', {defaultValue: "Information sur le paiement en espèces"})}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePaymentMethods;