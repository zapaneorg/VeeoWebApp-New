import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ArrowRight, CheckCircle, Car, ChevronDown, ChevronUp, Phone, Flag, User, MessageCircle, Star as StarIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocale } from '@/contexts/LocaleContext';
import { updateExistingBooking } from '@/lib/authService';
import { useToast } from '@/components/ui/use-toast';
import ChatDialog from '@/components/tracking/ChatDialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';

const ActiveRide = ({ ride, onRideComplete }) => {
  const { user } = useAuth();
  const { t } = useLocale();
  const { toast } = useToast();
  const [currentRide, setCurrentRide] = useState(ride);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const client = currentRide.client;

  useEffect(() => {
    setCurrentRide(ride);
    if (ride.status === 'completed' && !ride.driver_rating) {
      setShowRatingForm(true);
    }
  }, [ride]);

  const handleStatusUpdate = async (newStatus) => {
    const { data, error } = await updateExistingBooking(currentRide.id, { status: newStatus });
    if (error) {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le statut de la course.", variant: "destructive" });
    } else {
      setCurrentRide(data);
      toast({ title: "Statut mis à jour", description: `La course est maintenant : ${t(`driverDashboard.status.${newStatus}`)}`, variant: "success" });
      if (newStatus === 'completed') {
        setShowRatingForm(true);
      }
    }
  };

  const handleRatingSubmit = async () => {
    if (currentRating === 0) {
      toast({ title: "Note requise", description: "Veuillez sélectionner une note pour le client.", variant: "destructive" });
      return;
    }
    setIsSubmittingRating(true);
    const { error } = await supabase
      .from('bookings')
      .update({ driver_rating: currentRating, driver_rating_comment: feedbackText })
      .eq('id', currentRide.id);

    if (error) {
      toast({ title: "Erreur", description: "Impossible d'enregistrer la note.", variant: "destructive" });
    } else {
      toast({ title: "Note enregistrée", description: "Merci pour votre évaluation.", variant: "success" });
      onRideComplete();
    }
    setIsSubmittingRating(false);
  };

  const renderActionButtons = () => {
    switch (currentRide.status) {
      case 'confirmed':
        return <Button onClick={() => handleStatusUpdate('en_route_pickup')} className="w-full font-bold text-lg py-6"><Car className="mr-2 h-5 w-5" />{t('driverDashboard.actions.start_drive_to_pickup')}</Button>;
      case 'en_route_pickup':
        return <Button onClick={() => handleStatusUpdate('at_pickup')} className="w-full font-bold text-lg py-6"><MapPin className="mr-2 h-5 w-5" />{t('driverDashboard.actions.arrived_at_pickup')}</Button>;
      case 'at_pickup':
        return <Button onClick={() => handleStatusUpdate('in_progress')} className="w-full font-bold text-lg py-6"><ArrowRight className="mr-2 h-5 w-5" />{t('driverDashboard.actions.start_ride')}</Button>;
      case 'in_progress':
        return <Button onClick={() => handleStatusUpdate('completed')} className="w-full font-bold text-lg py-6"><CheckCircle className="mr-2 h-5 w-5" />{t('driverDashboard.actions.complete_ride')}</Button>;
      default:
        return null;
    }
  };
  
  const handlePhoneCall = () => {
    if (client?.phone) {
      window.location.href = `tel:${client.phone}`;
    }
  };

  if (showRatingForm) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-card border-border shadow-2xl rounded-2xl max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Évaluer le client</CardTitle>
            <CardDescription>Comment s'est passée la course avec {client.first_name} ?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-10 w-10 cursor-pointer transition-all ${ (hoverRating || currentRating) >= star ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-muted-foreground'}`}
                  onClick={() => setCurrentRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <Textarea 
              placeholder="Laissez un commentaire (optionnel)..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleRatingSubmit} disabled={isSubmittingRating} className="w-full">
              {isSubmittingRating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Terminer et envoyer
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-card border-border shadow-2xl rounded-t-2xl max-w-lg mx-auto">
        <div className="cursor-pointer p-3 flex justify-between items-center" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
            <div>
              <CardTitle className="text-lg text-foreground">{t('driverDashboard.activeRide')}</CardTitle>
              <CardDescription>Statut: <span className="font-semibold text-primary">{t(`driverDashboard.status.${currentRide.status}`)}</span></CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ChatDialog booking={currentRide} driver={user} />
              {client?.phone && (
                <Button variant="outline" size="icon" className="rounded-full" onClick={handlePhoneCall}>
                  <Phone className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                {isDetailsOpen ? 'Masquer' : 'Détails'}
                {isDetailsOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>
        </div>
        <AnimatePresence>
          {isDetailsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CardContent className="space-y-4 pt-0 p-4 border-t border-border">
                {client && (
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.profile_pic_url} alt={`${client.first_name} ${client.last_name}`} />
                        <AvatarFallback>{client.first_name?.charAt(0)}{client.last_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Client</p>
                        <p className="font-bold text-card-foreground">{client.first_name} {client.last_name}</p>
                        <StarRating rating={client.average_rating || 0} size="h-4 w-4" />
                      </div>
                    </div>
                )}
                
                <div className="flex items-start space-x-3 pt-2">
                  <MapPin className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">Départ</p>
                    <p className="text-card-foreground">{currentRide.pickup_location_text}</p>
                  </div>
                </div>

                 {(currentRide.stops || []).map((stop, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Flag className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">Arrêt {index + 1}</p>
                      <p className="text-card-foreground">{stop.address}</p>
                    </div>
                  </div>
                ))}

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">Arrivée</p>
                    <p className="text-card-foreground">{currentRide.dropoff_location_text}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-3 mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{currentRide.estimated_duration_minutes} min</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{currentRide.passengers} passager(s)</span>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
        <CardFooter className="p-2 border-t border-border">
          {renderActionButtons()}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ActiveRide;