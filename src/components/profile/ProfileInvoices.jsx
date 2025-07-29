import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { FileText, Download, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient'; 
import { useToast } from '@/components/ui/use-toast';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const ProfileInvoices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data: bookingsData, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed') 
          .order('booking_time', { ascending: false });

        if (error) throw error;

        const fetchedInvoices = bookingsData.map(doc => ({
          id: `INV-${doc.id.substring(0,8).toUpperCase()}`,
          rideId: doc.id, 
          date: new Date(doc.booking_time).toLocaleDateString('fr-FR'), 
          amount: doc.estimated_price ? `${doc.estimated_price.toFixed(2)}€` : 'N/A' 
        }));
        setInvoices(fetchedInvoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast({ title: t('common.error'), description: t('profile.invoices.fetchError', {defaultValue: "Impossible de charger les factures."}), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, [user, t, toast]);

  const handleDownloadInvoice = (invoiceId) => {
    toast({
      title: t('profile.invoices.downloadFeatureTitle', {defaultValue: "Fonctionnalité à venir"}),
      description: t('profile.invoices.downloadFeatureDesc', {defaultValue: `🚧 Le téléchargement de la facture ${invoiceId} n'est pas encore implémenté. 🚀`}),
    });
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center"><FileText className="mr-2 h-6 w-6"/>{t('profile.invoices.title')}</CardTitle>
        <CardDescription className="text-muted-foreground">{t('profile.invoices.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>}
        {!isLoading && invoices.length === 0 && (
            <p className="text-muted-foreground text-center py-8">{t('profile.invoices.noInvoices')}</p>
        )}
        {!isLoading && invoices.map(invoice => (
          <motion.div 
            key={invoice.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border"
          >
            <div>
              <p className="font-semibold text-foreground">{t('profile.invoices.invoiceNumber')} {invoice.id}</p>
              <p className="text-sm text-muted-foreground">{t('profile.invoices.dateLabel', {defaultValue: "Course du"})} {invoice.date} - {t('profile.invoices.amountLabel', {defaultValue: "Montant"})}: {invoice.amount}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => handleDownloadInvoice(invoice.id)}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Download className="mr-2 h-4 w-4" /> {t('profile.invoices.downloadButton')}
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfileInvoices;