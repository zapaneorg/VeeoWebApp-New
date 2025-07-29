import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, ChevronUp, Phone, Clock, Car, Route as RouteIcon, CreditCard, XCircle, Flag } from 'lucide-react';
import ChatDialog from './ChatDialog';
import RideOrderReceipt from './RideOrderReceipt';
import StarRating from '@/components/ui/StarRating';
import { useToast } from '@/components/ui/use-toast';
import { updateExistingBooking } from '@/lib/authService';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const RideStatusPanel = ({ 
  booking, 
  driver, 
  user, 
  isDetailsOpen, 
  setIsDetailsOpen,
  estimatedPickupTime
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);

  const statusMessages = {
    'pending_confirmation': "En attente de confirmation...",
    'confirmed': "Chauffeur confirmé",
    'en_route_pickup': "Chauffeur en route",
    'at_pickup': "Chauffeur à votre porte",
    'in_progress': "Course en cours",
    'completed': "Course terminée",
    'cancelled': "Course annulée",
  };

  const handlePhoneCall = (e) => {
    e.stopPropagation();
    if (driver?.phone) {
      window.location.href = `tel:${driver.phone}`;
    }
  };

  const handleConfirmCancel = async () => {
    if (!booking || !user) return;
    setIsCancelling(true);
    
    const { error } = await updateExistingBooking(booking.id, {
      status: 'cancelled',
      cancelled_by: user.role,
      cancellation_reason: "Annulée par le client",
    });

    setIsCancelling(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la course. Veuillez réessayer.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Course annulée",
        description: "Votre course a bien été annulée.",
        variant: "success",
      });
      navigate('/book');
    }
  };

  const isCancelable = ['pending_confirmation', 'confirmed', 'en_route_pickup'].includes(booking?.status);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
    >
      <div className="max-w-md mx-auto p-2 sm:p-4 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md text-gray-900 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <motion.div 
            className="cursor-pointer p-3 sm:p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg text-foreground">
                {statusMessages[booking?.status] || "Statut inconnu"}
              </p>
              {driver && (
                <p className="text-sm text-gray-600 truncate">
                  {driver.first_name} - {driver.vehicle_model}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {driver && booking && user && (
                <ChatDialog booking={booking} driver={driver} />
              )}
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <motion.div
                  animate={{ rotate: isDetailsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="h-5 w-5" />
                </motion.div>
              </Button>
            </div>
          </motion.div>

          <AnimatePresence>
            {isDetailsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="max-h-[calc(100vh-250px)] sm:max-h-[400px] overflow-y-auto p-3 sm:p-4 border-t border-gray-200 bg-gray-50/50 space-y-4">
                  
                  {driver && (
                    <div className="flex items-center space-x-4 p-3 bg-white rounded-xl border border-gray-100">
                      <Avatar className="h-16 w-16 ring-2 ring-blue-100">
                        <AvatarImage src={driver.profile_pic_url} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                          {driver.first_name?.[0]}{driver.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-gray-900">
                          {driver.first_name} {driver.last_name}
                        </p>
                        <div className="text-sm text-gray-600">
                          <StarRating rating={driver.average_rating || 0} size="h-4 w-4" />
                        </div>
                        <p className="text-sm text-gray-500 font-mono">
                          {driver.vehicle_model} - {driver.license_plate}
                        </p>
                      </div>
                      {driver.phone && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handlePhoneCall}
                            className="rounded-full flex-shrink-0"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Départ</p>
                        <p className="text-card-foreground font-medium">{booking.pickup_location_text}</p>
                      </div>
                    </div>
                    {(booking.stops || []).map((stop, index) => (
                      <div key={`stop-panel-${index}`} className="flex items-start space-x-3">
                        <Flag className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-muted-foreground">Arrêt {index + 1}</p>
                          <p className="text-card-foreground font-medium">{stop.address}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">Arrivée</p>
                        <p className="text-card-foreground font-medium">{booking.dropoff_location_text}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">{booking.payment_method_id === 'cash' ? 'Espèces' : 'Carte'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Car className="h-4 w-4" />
                      <span className="font-medium">{booking.vehicle_type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <RouteIcon className="h-4 w-4" />
                      <span className="font-medium">{booking.distance_km ? `${booking.distance_km.toFixed(1)} km` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{booking.estimated_duration_minutes} min</span>
                    </div>
                  </div>

                  <div className="text-center pt-3">
                    <p className="text-4xl font-extrabold text-foreground">{booking.estimated_price}€</p>
                    <p className="text-sm text-muted-foreground">Prix estimé</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    {booking && driver && user && (
                      <RideOrderReceipt booking={booking} driver={driver} client={user} />
                    )}
                    {isCancelable && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            <XCircle className="mr-2 h-4 w-4" />
                            Annuler ma course
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir annuler cette course ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Retour</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmCancel} disabled={isCancelling}>
                              {isCancelling ? 'Annulation...' : 'Confirmer'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default RideStatusPanel;