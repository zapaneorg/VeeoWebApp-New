import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Briefcase, ArrowRight, XCircle, Car, Route, CreditCard, Coins as HandCoins, Flag } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/ui/StarRating';
import { cn } from '@/lib/utils';

const RideRequestCard = ({ ride, onAccept, onDecline, isNotifying }) => {
  const { t } = useLocale();

  const vehicleTypeName = t(`vehicleTypes.${ride.vehicle_type}`, { defaultValue: ride.vehicle_type });
  const isCashPayment = ride.payment_method_id === 'cash';
  const paymentMethodText = isCashPayment 
    ? t('driverDashboard.paymentCash', { defaultValue: 'Paiement en espèces' })
    : t('driverDashboard.paymentApp', { defaultValue: 'Paiement via l\'application' });
    
  const client = ride.client;
  const clientInitials = client ? `${client.first_name?.charAt(0) || ''}${client.last_name?.charAt(0) || ''}`.toUpperCase() : '..';
  const stops = ride.stops || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={cn(
        'shadow-lg flex flex-col rounded-2xl overflow-hidden max-w-md mx-auto w-full',
        isNotifying && 'notification-border-effect'
      )}
    >
      <div className="bg-card/90 backdrop-blur-sm rounded-2xl flex flex-col h-full relative">
        {isNotifying && (
          <motion.div
            className="absolute inset-0 z-0 bg-blue-500/10"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div className="relative z-10 bg-transparent flex flex-col h-full">
          <CardHeader className="p-4 space-y-3">
            <div className="bg-black text-white px-4 py-2 rounded-lg text-center font-bold text-lg flex items-center justify-center">
              <Car className="mr-2 h-5 w-5" />
              <span>{vehicleTypeName}</span>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold mb-2 ${isCashPayment ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {isCashPayment ? <HandCoins className="mr-2 h-4 w-4" /> : <CreditCard className="mr-2 h-4 w-4" />}
                {paymentMethodText}
              </div>
              <p className="text-5xl font-extrabold text-foreground">{ride.estimated_price}€</p>
              <p className="text-sm text-muted-foreground">{t('bookingEstimate.price')}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow p-4">
            {client && (
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.profile_pic_url} alt={`${client.first_name} ${client.last_name}`} />
                  <AvatarFallback>{clientInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">Client</p>
                  <p className="font-bold text-card-foreground">{client.first_name} {client.last_name}</p>
                  <StarRating rating={client.average_rating || 0} size="h-4 w-4" />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">{t('driverDashboard.pickupAddress')}</p>
                  <p className="text-card-foreground font-medium">{ride.pickup_location_text}</p>
                </div>
              </div>

              {stops.map((stop, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Flag className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">Arrêt {index + 1}</p>
                    <p className="text-card-foreground font-medium">{stop.location}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">{t('driverDashboard.dropoffAddress')}</p>
                  <p className="text-card-foreground font-medium">{ride.dropoff_location_text}</p>
                </div>
              </div>
            </div>

            {ride.approach_duration_minutes !== undefined && ride.approach_distance_km !== undefined && (
              <div className="border-t border-border pt-3 mt-3">
                <p className="font-semibold text-sm text-center text-muted-foreground mb-2">{t('driverDashboard.toReachClient', { defaultValue: 'Pour rejoindre le client' })}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground justify-center">
                    <Car className="h-4 w-4" />
                    <span className="font-medium">{ride.approach_distance_km.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground justify-center">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{ride.approach_duration_minutes} min</span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-border pt-3 mt-3 grid grid-cols-2 gap-3 text-sm">
               <div className="flex items-center space-x-2 text-muted-foreground">
                <Route className="h-4 w-4" />
                <span className="font-medium">{ride.distance_km ? `${ride.distance_km.toFixed(1)} km` : 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{ride.estimated_duration_minutes} min</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="font-medium">{ride.passengers}</span>
              </div>
               <div className="flex items-center space-x-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">{ride.luggage || 0}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-3 p-3 bg-muted/50 border-t">
            <Button variant="outline" size="lg" className="font-bold py-6" onClick={() => onDecline(ride.id)}>
              <XCircle className="mr-2 h-5 w-5" />
              {t('driverDashboard.declineRide', { defaultValue: 'Refuser' })}
            </Button>
            <Button size="lg" className="w-full font-bold py-6" onClick={() => onAccept(ride)}>
              {t('driverDashboard.acceptRide', { defaultValue: 'Accepter' })} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </div>
      </div>
    </motion.div>
  );
};

export default RideRequestCard;