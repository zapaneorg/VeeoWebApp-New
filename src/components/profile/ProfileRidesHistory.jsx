import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { MapPin, CalendarDays, DollarSign, Clock, Star as StarIcon, Loader2, Car } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import RideOrderReceipt from '@/components/tracking/RideOrderReceipt';
import StarRating from '@/components/ui/StarRating';

const RideCard = ({ ride, onRate, user }) => {
  const { t } = useLocale();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [currentRating, setCurrentRating] = useState(ride.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState(ride.client_rating_comment || '');
  const { toast } = useToast();
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleRating = (ratingValue) => {
    if (ride.rating) return;
    setCurrentRating(ratingValue);
  };

  const handleFeedbackSubmit = async () => {
    if (currentRating === 0) {
      toast({ title: t('profile.ridesHistory.ratingRequiredTitle', { defaultValue: "Note requise" }), description: t('profile.ridesHistory.ratingRequiredDesc', { defaultValue: "Veuillez sélectionner une note." }), variant: "destructive" });
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          rating: currentRating,
          client_rating_comment: feedbackText,
        })
        .eq('id', ride.id);

      if (error) throw error;

      onRate(ride.id, currentRating, feedbackText);
      setShowFeedbackForm(false);
      toast({ title: t('profile.ridesHistory.feedbackSuccessTitle', { defaultValue: "Merci !" }), description: t('profile.ridesHistory.feedbackSuccessDesc', { defaultValue: "Votre avis a été enregistré." }), variant: "success" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({ title: t('common.error'), description: t('profile.ridesHistory.feedbackErrorDesc', { defaultValue: "Impossible d'enregistrer l'avis." }), variant: "destructive" });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const rideDate = ride.booking_time ? new Date(ride.booking_time).toLocaleDateString('fr-FR') : 'N/A';
  const rideTime = ride.booking_time ? new Date(ride.booking_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <motion.div
      key={ride.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-secondary/50 rounded-lg shadow-sm border border-border"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-lg font-semibold text-foreground flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-primary" />{rideDate} {rideTime && `à ${rideTime}`}
          </p>
          <p className="text-sm text-muted-foreground">{t('profile.ridesHistory.driverLabel', { defaultValue: "Chauffeur" })}: {ride.driver_name || t('profile.ridesHistory.driverPending', { defaultValue: "En attente" })}</p>
        </div>
        <p className="text-xl font-bold text-primary">{ride.estimated_price ? `${ride.estimated_price.toFixed(2)}€` : 'N/A'}</p>
      </div>
      <div className="space-y-2 text-sm">
        <p className="text-foreground flex items-center"><MapPin className="h-4 w-4 mr-2 text-muted-foreground" />{t('profile.ridesHistory.fromLabel', { defaultValue: "Départ" })}: {ride.pickup_location_text}</p>
        <p className="text-foreground flex items-center"><MapPin className="h-4 w-4 mr-2 text-muted-foreground" />{t('profile.ridesHistory.toLabel', { defaultValue: "Arrivée" })}: {ride.dropoff_location_text}</p>
        <div className="flex justify-between text-muted-foreground pt-2">
          <p className="flex items-center"><Clock className="h-4 w-4 mr-1" />{ride.estimated_duration_minutes ? `${ride.estimated_duration_minutes} min` : 'N/A'}</p>
          <p className="flex items-center"><DollarSign className="h-4 w-4 mr-1" />{ride.distance_km ? `${ride.distance_km.toFixed(1)} km` : 'N/A'}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex items-end justify-between">
        <div>
          {ride.status === 'completed' && (
            ride.rating ? (
              <div>
                <p className="text-sm text-foreground mb-1">{t('profile.ridesHistory.yourRatingLabel', { defaultValue: "Votre évaluation" })}:</p>
                <StarRating rating={ride.rating} showValue={false} />
                {ride.client_rating_comment && <p className="text-xs text-muted-foreground mt-1 italic">"{ride.client_rating_comment}"</p>}
              </div>
            ) : (
              !showFeedbackForm ? (
                <Button variant="outline" size="sm" onClick={() => setShowFeedbackForm(true)} className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  {t('profile.ridesHistory.rateButton', { defaultValue: "Évaluer cette course" })}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-foreground mb-1">{t('profile.ridesHistory.yourRatingPrompt', { defaultValue: "Votre note" })}:</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-6 w-6 cursor-pointer ${ (hoverRating || currentRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                          onClick={() => handleRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Textarea
                      placeholder={t('profile.ridesHistory.feedbackPlaceholder', { defaultValue: "Laissez un commentaire (optionnel)..." })}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="bg-input border-border text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleFeedbackSubmit} disabled={isSubmittingFeedback} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {isSubmittingFeedback && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('common.submit')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowFeedbackForm(false)} className="text-muted-foreground hover:text-foreground">{t('common.cancel')}</Button>
                  </div>
                </div>
              )
            )
          )}
        </div>
        {ride.status === 'completed' && (
          <RideOrderReceipt booking={ride} driver={ride.driver} client={user} />
        )}
      </div>
    </motion.div>
  );
};

const ProfileRidesHistory = () => {
  const { user } = useAuth();
  const { t } = useLocale();
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadRides = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          driver:driver_id (
            first_name,
            last_name,
            vehicle_model,
            license_plate,
            profile_pic_url
          )
        `)
        .eq('user_id', user.id)
        .order('booking_time', { ascending: false });

      if (error) {
        console.error("Error fetching rides history:", error);
      } else {
        const formattedRides = data.map(ride => ({
          ...ride,
          driver_name: ride.driver ? `${ride.driver.first_name || ''} ${ride.driver.last_name || ''}`.trim() : t('profile.ridesHistory.driverPending', { defaultValue: "En attente" }),
        }));
        setRides(formattedRides || []);
      }
      setIsLoading(false);
    };
    loadRides();
  }, [user, t]);

  const handleRateRide = (rideId, rating, feedback) => {
    setRides(prevRides => prevRides.map(r =>
      r.id === rideId ? { ...r, rating, client_rating_comment: feedback } : r
    ));
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center"><Car className="mr-2 h-6 w-6" />{t('profile.ridesHistory.title', { defaultValue: "Historique des courses" })}</CardTitle>
        <CardDescription className="text-muted-foreground">{t('profile.ridesHistory.subtitle', { defaultValue: "Consultez vos trajets passés et laissez un avis." })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>}
        {!isLoading && rides.length === 0 && (
          <p className="text-muted-foreground text-center py-8">{t('profile.ridesHistory.noRides', { defaultValue: "Aucune course dans votre historique pour le moment." })}</p>
        )}
        {!isLoading && rides.length > 0 && rides.map(ride => (
          <RideCard key={ride.id} ride={ride} onRate={handleRateRide} user={user} />
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfileRidesHistory;