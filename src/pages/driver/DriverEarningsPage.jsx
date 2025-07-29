import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, BarChart, Loader2, Calendar, AlertTriangle, Banknote, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const DriverEarningsPage = () => {
  const { t } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    today: 0,
    todayRides: 0,
    thisWeek: 0,
    thisWeekRides: 0,
    allTime: 0,
    allTimeRides: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isPayoutActive, setIsPayoutActive] = useState(false);
  const [isCashingOut, setIsCashingOut] = useState(false);

  const fetchEarnings = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('bookings')
      .select('actual_price, booking_time')
      .eq('driver_id', user.id)
      .eq('status', 'completed')
      .not('actual_price', 'is', null);

    if (error) {
      toast({ title: t('common.error'), description: "Impossible de charger les gains.", variant: 'destructive' });
      setLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Lundi comme premier jour
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    let todayEarnings = 0;
    let todayRidesCount = 0;
    let weekEarnings = 0;
    let weekRidesCount = 0;
    let allTimeEarnings = 0;
    let allTimeRidesCount = 0;

    data.forEach(ride => {
      const rideDate = new Date(ride.booking_time);
      const ridePrice = ride.actual_price || 0;

      allTimeEarnings += ridePrice;
      allTimeRidesCount++;
      
      if (rideDate >= startOfWeek) {
        weekEarnings += ridePrice;
        weekRidesCount++;
      }
      
      if (rideDate >= today) {
        todayEarnings += ridePrice;
        todayRidesCount++;
      }
    });

    setStats({
      today: todayEarnings,
      todayRides: todayRidesCount,
      thisWeek: weekEarnings,
      thisWeekRides: weekRidesCount,
      allTime: allTimeEarnings,
      allTimeRides: allTimeRidesCount,
    });
    
    setIsPayoutActive(new Date().getDay() === 1); // Actif le Lundi
    setLoading(false);
  }, [user, t, toast]);

  useEffect(() => {
    if (user) {
      fetchEarnings();
    }
  }, [user, fetchEarnings]);

  const handleCashOut = () => {
    setIsCashingOut(true);
    toast({
      title: "Demande de virement",
      description: "Votre demande de virement est en cours de traitement. Vous recevrez une confirmation bientôt.",
      variant: "success"
    });
    setTimeout(() => setIsCashingOut(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('driver.earnings.title')}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title={t('driver.earnings.today')} value={`${stats.today.toFixed(2)}€`} icon={DollarSign} description={`${stats.todayRides} courses`} />
        <StatCard title={t('driver.earnings.thisWeek')} value={`${stats.thisWeek.toFixed(2)}€`} icon={BarChart} description={`${stats.thisWeekRides} courses`} />
        <StatCard title="Total" value={`${stats.allTime.toFixed(2)}€`} icon={History} description={`${stats.allTimeRides} courses au total`} />
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('driver.earnings.detailsTitle')}</CardTitle>
            <CardDescription>{t('driver.earnings.detailsSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-muted-foreground">Les graphiques détaillés des gains seront bientôt disponibles.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="bg-gradient-to-r from-blue-500 to-primary text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Calendar className="h-5 w-5" /> Gains de la semaine</CardTitle>
            <CardDescription className="text-blue-100">Total des gains du Lundi au Dimanche.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-4xl font-bold">{stats.thisWeek.toFixed(2)}€</p>
                <p className="text-blue-200">{stats.thisWeekRides} courses effectuées cette semaine.</p>
              </div>
              <Button 
                onClick={handleCashOut}
                disabled={!isPayoutActive || stats.thisWeek === 0 || isCashingOut} 
                className="bg-white text-primary hover:bg-gray-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg"
                size="lg"
              >
                {isCashingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Banknote className="mr-2 h-5 w-5" />
                )}
                Encaisser vos gains
              </Button>
            </div>
            {!isPayoutActive && (
              <div className="mt-4 flex items-center gap-2 text-sm text-blue-100 bg-black/10 p-2 rounded-md">
                <AlertTriangle className="h-4 w-4" />
                <span>Le bouton d'encaissement est activé tous les lundis.</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DriverEarningsPage;