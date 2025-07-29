import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, History, MapPin, DollarSign, Star } from 'lucide-react';
import RideOrderReceipt from '@/components/tracking/RideOrderReceipt';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/ui/StarRating';

const DriverHistoryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, client:user_id(*)')
      .eq('driver_id', user.id)
      .in('status', ['completed', 'cancelled'])
      .order('booking_time', { ascending: false });

    if (error) {
      toast({ title: t('common.error'), description: t('driver.history.fetchError'), variant: 'destructive' });
      console.error(error);
    } else {
      setRides(data);
    }
    setLoading(false);
  }, [user, t, toast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('driver.history.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('driver.history.listTitle')}</CardTitle>
          <CardDescription>{t('driver.history.listSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rides.length === 0 ? (
            <div className="text-center py-10">
              <History className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-muted-foreground">{t('driver.history.noRides')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rides.map(ride => (
                <div key={ride.id} className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-bold text-lg">{new Date(ride.booking_time).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-sm text-muted-foreground">{new Date(ride.booking_time).toLocaleTimeString('fr-FR')}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full self-start sm:self-center ${ride.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {t(`driverDashboard.status.${ride.status}`)}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-green-500" /> {ride.pickup_location_text}</p>
                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" /> {ride.dropoff_location_text}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={ride.client?.profile_pic_url} />
                        <AvatarFallback>{ride.client?.first_name?.[0]}{ride.client?.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{ride.client?.first_name || 'Client'} {ride.client?.last_name || ''}</p>
                        {ride.rating && (
                          <div className="flex items-center text-xs">
                            <p className="mr-1">Note client:</p>
                            <StarRating rating={ride.rating} size="h-3 w-3" showValue={false} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <p className="flex items-center font-semibold text-lg text-primary"><DollarSign className="w-5 h-5 mr-1" /> {ride.actual_price?.toFixed(2) || ride.estimated_price?.toFixed(2)}€</p>
                      {ride.status === 'completed' && (
                        <RideOrderReceipt 
                          booking={ride} 
                          driver={user} 
                          client={ride.client} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverHistoryPage;