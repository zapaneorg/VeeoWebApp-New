
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, MapPin, XCircle, Clock, Route as RouteIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';

const BookingConfirmedPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError(t('bookingConfirmed.missingId', {defaultValue: 'ID de réservation manquant.'}));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select('id, pickup_location_text, dropoff_location_text, status, created_at, distance_km, estimated_duration_minutes')
          .eq('id', bookingId)
          .single();

        if (fetchError) throw fetchError;
        
        setBooking(data);

      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(t('bookingConfirmed.fetchError', {defaultValue: 'Impossible de récupérer les détails de la réservation.'}));
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, t]);
  
  useEffect(() => {
    if (!bookingId) return;

    const channel = supabase
      .channel(`booking-confirmed-page-${bookingId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'bookings', 
        filter: `id=eq.${bookingId}` 
      }, (payload) => {
        setBooking(prev => ({ ...prev, ...payload.new }));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  const handleCancel = () => {
    // Placeholder for cancellation logic
    navigate('/book');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-white">
        <Loader2 className="h-16 w-16 animate-spin text-gray-800" />
        <p className="mt-4 text-gray-600">Chargement de votre confirmation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-white text-gray-800 p-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <div className="space-y-2">
          <Button asChild>
            <Link to="/book">{t('bookingConfirmed.backToBooking', {defaultValue: 'Nouvelle réservation'})}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-var(--header-height,80px))] bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-lg bg-white border-gray-200 shadow-xl text-gray-800">
          <CardHeader className="text-center items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              className="mx-auto flex justify-center items-center h-20 w-20 rounded-full bg-green-100"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>
            <CardTitle className="text-3xl text-gray-900 mt-4">{t('bookingConfirmed.title', {defaultValue: 'Réservation Confirmée !'})}</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              {booking?.status === 'pending_confirmation' 
                ? t('bookingConfirmed.subtitle', {defaultValue: 'Nous recherchons un chauffeur pour vous.'})
                : "Un chauffeur a été trouvé !"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            {booking && (
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{t('bookingConfirmed.pickupLabel', {defaultValue: 'Départ'})}</p>
                    <p>{booking.pickup_location_text}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{t('bookingConfirmed.dropoffLabel', {defaultValue: 'Arrivée'})}</p>
                    <p>{booking.dropoff_location_text}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                      <RouteIcon className="h-4 w-4" />
                      <span className="font-medium text-gray-700">{booking.distance_km ? `${booking.distance_km.toFixed(1)} km` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium text-gray-700">{booking.estimated_duration_minutes} min</span>
                  </div>
                </div>
              </div>
            )}
            <p className="text-sm text-center text-gray-500 pt-2">{t('bookingConfirmed.trackingInfo', {defaultValue: 'Vous pouvez suivre la progression de votre chauffeur depuis la page de suivi.'})}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-6">
            <Button asChild size="lg" className="w-full font-semibold">
              <Link to={`/track/${bookingId}`}>
                {t('bookingConfirmed.trackButton', {defaultValue: 'Suivre mon chauffeur'})}
              </Link>
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleCancel}>
              <XCircle className="mr-2 h-4 w-4" />
              Annuler la course
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/">
                {t('bookingConfirmed.homeButton', {defaultValue: "Retour à l'accueil"})}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BookingConfirmedPage;
