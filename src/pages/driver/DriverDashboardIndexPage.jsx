
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { acceptBooking } from '@/lib/authService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, BellOff } from 'lucide-react';
import RideRequestCard from '@/components/driver/RideRequestCard';
import ActiveRide from '@/components/driver/ActiveRide';
import { useLocale } from '@/contexts/LocaleContext';
import DriverDashboardMap from '@/components/driver/DriverDashboardMap';
import { useNotifications } from '@/hooks/useNotifications';
import useSoundNotification from '@/hooks/useSoundNotification';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const DriverDashboardIndexPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const { sendPushNotification, requestPermission } = useNotifications();
  const { play: playNotificationSound, stop: stopNotificationSound } = useSoundNotification('/sounds/notification.mp3');

  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotifying, setIsNotifying] = useState(false);
  const notificationTimeoutRef = useRef(null);

  const stopNotification = useCallback(() => {
    setIsNotifying(false);
    stopNotificationSound();
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
  }, [stopNotificationSound]);

  useEffect(() => {
    requestPermission();
    return () => {
      stopNotification();
    };
  }, [requestPermission, stopNotification]);

  useEffect(() => {
    if (rides.length > 0 && !activeRide) {
      if (!isNotifying) {
        setIsNotifying(true);
        playNotificationSound();
        
        notificationTimeoutRef.current = setTimeout(() => {
          stopNotification();
        }, 15000); // 15 seconds duration
      }
    } else {
      stopNotification();
    }
  }, [rides, activeRide, isNotifying, playNotificationSound, stopNotification]);

  const addApproachInfoToRides = useCallback((newRides) => {
    if (!user || !user.lat || !user.lng) {
      return newRides;
    }
    return newRides.map(ride => {
      const distance = calculateDistance(user.lat, user.lng, ride.pickup_lat, ride.pickup_lng);
      const duration = Math.round(distance * 2); // Rough estimation: 2 mins per km
      return {
        ...ride,
        approach_distance_km: distance,
        approach_duration_minutes: duration
      };
    });
  }, [user]);

  const fetchInitialData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [ridesResponse, driversResponse, activeRideResponse] = await Promise.all([
        supabase.from('bookings').select('*, client:profiles!user_id(*)').eq('status', 'pending_confirmation').order('booking_time', { ascending: true }),
        supabase.from('profiles').select('id, lat, lng, first_name, last_name, vehicle_model, phone, profile_pic_url, status').eq('role', 'driver').eq('status', 'active'),
        supabase.from('bookings').select('*, client:profiles!user_id(*)').eq('driver_id', user.id).in('status', ['confirmed', 'en_route_pickup', 'at_pickup', 'in_progress']).single()
      ]);

      if (ridesResponse.error) {
        console.error('Rides fetch error:', ridesResponse.error);
        toast({ title: "Erreur", description: "Impossible de charger les courses disponibles.", variant: "destructive" });
      } else {
        setRides(addApproachInfoToRides(ridesResponse.data || []));
      }

      if (driversResponse.error) {
        console.error('Drivers fetch error:', driversResponse.error);
        toast({ title: "Erreur", description: "Impossible de charger les chauffeurs.", variant: "destructive" });
      } else {
        setDrivers(driversResponse.data || []);
      }
      
      if (activeRideResponse.data) {
        setActiveRide(activeRideResponse.data);
      }
    } catch (error) {
      console.error('Unexpected error in fetchInitialData:', error);
      toast({ title: "Erreur", description: "Une erreur inattendue s'est produite.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast, user?.id, addApproachInfoToRides]);

  useEffect(() => {
    if (user && user.role === 'driver' && user.status === 'active') {
      fetchInitialData();
    }
  }, [user, fetchInitialData]);

  useEffect(() => {
    if (user?.status !== 'active' || !user?.id) return;

    const bookingsChannel = supabase
      .channel('driver_bookings_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings', filter: 'status=eq.pending_confirmation' }, async (payload) => {
        const { data: clientProfile, error } = await supabase.from('profiles').select('*').eq('id', payload.new.user_id).single();
        if (error) {
          console.error("Could not fetch client profile for new ride", error);
        }
        const newRideWithClient = { ...payload.new, client: clientProfile };

        setRides(currentRides => {
          const rideExists = currentRides.some(ride => ride.id === newRideWithClient.id);
          if (rideExists) return currentRides;
          const newRides = [...currentRides, newRideWithClient].sort((a,b) => new Date(a.booking_time) - new Date(b.booking_time));
          return addApproachInfoToRides(newRides);
        });
        
        const notificationTitle = "🚗 Nouvelle course disponible !";
        const notificationBody = `De ${payload.new.pickup_location_text} à ${payload.new.dropoff_location_text}`;
        
        toast({ 
          title: notificationTitle, 
          description: notificationBody, 
          variant: "success", 
          duration: 10000 
        });
        sendPushNotification(notificationTitle, notificationBody);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings' }, (payload) => {
        if (payload.old.status === 'pending_confirmation' && payload.new.status !== 'pending_confirmation') {
          setRides(currentRides => currentRides.filter(r => r.id !== payload.new.id));
        }
        
        if (activeRide && activeRide.id === payload.new.id) {
          if (payload.new.status === 'cancelled') {
            toast({ title: "Course annulée", description: "La course a été annulée par le client.", variant: "warning" });
            setActiveRide(null);
            fetchInitialData();
          } else {
            setActiveRide(prev => ({...prev, ...payload.new}));
          }
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookings' }, (payload) => {
        setRides(currentRides => currentRides.filter(r => r.id !== payload.old.id));
      })
      .subscribe();
      
    const profilesChannel = supabase
      .channel('driver_profiles_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `role=eq.driver` }, (payload) => {
        setDrivers(currentDrivers => 
          currentDrivers.map(d => d.id === payload.new.id ? payload.new : d)
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [toast, activeRide, user, fetchInitialData, sendPushNotification, addApproachInfoToRides]);

  const handleAcceptRide = async (rideToAccept) => {
    stopNotification();
    try {
      const { data, error } = await acceptBooking(rideToAccept.id, user.id);

      if (error) {
        console.error('Accept booking error:', error);
        toast({ title: "Erreur", description: "Cette course n'est plus disponible.", variant: "destructive" });
        setRides(currentRides => currentRides.filter(r => r.id !== rideToAccept.id));
      } else {
        toast({ title: "🎉 Course acceptée !", description: "La course vous a été assignée avec succès.", variant: "success" });
        setActiveRide({...data, client: rideToAccept.client });
        setRides([]);
      }
    } catch (error) {
      console.error('Unexpected error accepting ride:', error);
      toast({ title: "Erreur", description: "Une erreur inattendue s'est produite.", variant: "destructive" });
    }
  };
  
  const handleDeclineRide = (rideId) => {
    stopNotification();
    setRides(currentRides => currentRides.filter(ride => ride.id !== rideId));
    toast({ title: "Course refusée", description: "Vous avez refusé cette course.", variant: "default" });
  };

  const handleRideComplete = () => {
    toast({ title: "🏁 Course terminée !", description: "Félicitations pour avoir terminé cette course avec succès.", variant: "success" });
    setActiveRide(null);
    fetchInitialData();
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden">
      <DriverDashboardMap drivers={drivers} rides={rides} user={user} activeRide={activeRide} isNotifying={isNotifying} />
      
      <AnimatePresence>
        {activeRide && (
          <motion.div 
            key="active-ride"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 p-4 w-full z-20"
          >
            <ActiveRide ride={activeRide} onRideComplete={handleRideComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rides.length > 0 && !activeRide && (
          <motion.div
            key={`ride-request-${rides[0].id}`}
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 p-4 z-30"
          >
            <RideRequestCard 
              ride={rides[0]} 
              onAccept={handleAcceptRide} 
              onDecline={() => handleDeclineRide(rides[0].id)} 
              isNotifying={isNotifying}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!activeRide && rides.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 z-10 text-center p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm max-w-xs"
        >
          <BellOff className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            {t('driverDashboard.noRidesTitle', { defaultValue: 'Aucune course' })}
          </h3>
          <p className="text-xs text-gray-500">
            {t('driverDashboard.noRidesDescription', { defaultValue: 'En attente...' })}
          </p>
          <div className="mt-2 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></div>
            <span className="text-xs text-green-600 font-medium">En ligne</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DriverDashboardIndexPage;
