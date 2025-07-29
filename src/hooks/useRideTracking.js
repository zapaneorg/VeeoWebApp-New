import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';

function calculateBearing(lat1, lng1, lat2, lng2) {
  if (lat1 === null || lng1 === null || lat2 === null || lng2 === null) return 0;
  const dLng = (lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  let brng = Math.atan2(y, x);
  brng = brng * (180 / Math.PI);
  brng = (brng + 360) % 360;
  return brng;
}

export const useRideTracking = (bookingId, isEnabled = true) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendPushNotification } = useNotifications();
  
  const [booking, setBooking] = useState(null);
  const [driver, setDriver] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(isEnabled);
  const [error, setError] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [estimatedPickupTime, setEstimatedPickupTime] = useState(null);
  
  const lastPos = useRef(null);
  const channelsRef = useRef([]);

  const cleanupChannels = useCallback(() => {
    if (channelsRef.current.length > 0) {
      supabase.removeChannels(channelsRef.current);
      channelsRef.current = [];
    }
  }, []);

  const fetchBookingData = useCallback(async () => {
    if (!bookingId || !user) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .select('*, driver:driver_id(*), client:user_id(*)')
        .eq('id', bookingId)
        .single();

      if (bookingError) {
        if (bookingError.code === 'PGRST116') {
          throw new Error("Cette course n'existe pas ou a été annulée.");
        }
        throw bookingError;
      }
      
      if (!data) {
        throw new Error("Cette course n'existe pas ou a été annulée.");
      }

      setBooking(data);
      if (data.driver) {
        setDriver(data.driver);
        if (data.driver.lat && data.driver.lng) {
          lastPos.current = { lat: data.driver.lat, lng: data.driver.lng };
        }
      }
      if (data.client) {
        setClient(data.client);
      }
      setConnectionStatus('connected');
    } catch (e) {
      console.error("Error fetching booking:", e);
      setError(e.message);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  }, [bookingId, user]);

  useEffect(() => {
    if (isEnabled) {
        fetchBookingData();
    } else {
        setLoading(false);
    }
    
    return () => cleanupChannels();
  }, [isEnabled, fetchBookingData, cleanupChannels]);


  useEffect(() => {
    if (!isEnabled || !bookingId || !user) return;

    const handleBookingUpdate = async (payload) => {
      const oldStatus = booking?.status;
      const newBookingData = payload.new;

      setBooking(prev => ({ ...prev, ...newBookingData }));
      setLastUpdate(new Date());

      if (newBookingData.driver_id && (!driver || newBookingData.driver_id !== driver.id)) {
        const { data: newDriver, error: driverError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newBookingData.driver_id)
          .single();
        if (!driverError && newDriver) {
          setDriver(newDriver);
        }
      }

      if (oldStatus !== newBookingData.status) {
        const statusMessages = {
          'confirmed': "Votre chauffeur est confirmé !",
          'en_route_pickup': "Votre chauffeur est en route.",
          'at_pickup': "Votre chauffeur est arrivé.",
          'in_progress': "Votre course a commencé.",
          'completed': "Course terminée. Merci !",
          'cancelled': "La course a été annulée."
        };
        const message = statusMessages[newBookingData.status];
        if (message) {
          toast({
            title: 'Mise à jour de la course',
            description: message,
            variant: newBookingData.status === 'cancelled' ? 'destructive' : 'success'
          });
          sendPushNotification('Mise à jour de la course', message);
        }
      }
    };

    const setupChannels = () => {
      cleanupChannels();

      const bookingChannel = supabase
        .channel(`booking-updates:${bookingId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${bookingId}` }, handleBookingUpdate)
        .subscribe(status => {
          setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
          if (status !== 'SUBSCRIBED') {
            setTimeout(() => {
              if (bookingChannel.state !== 'joined') {
                setConnectionStatus('reconnecting');
              }
            }, 3000)
          }
        });
      
      channelsRef.current.push(bookingChannel);

      if (booking?.driver_id) {
        const driverChannel = supabase
          .channel(`driver-location:${booking.driver_id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${booking.driver_id}` },
            (payload) => {
              const newDriverData = payload.new;
              setDriver(prev => ({ ...prev, ...newDriverData }));
              setLastUpdate(new Date());

              if (newDriverData.lat && newDriverData.lng) {
                const newPos = { lat: newDriverData.lat, lng: newDriverData.lng };
                if (lastPos.current && lastPos.current.lat !== newPos.lat && lastPos.current.lng !== newPos.lng) {
                  const newRotation = calculateBearing(lastPos.current.lat, lastPos.current.lng, newPos.lat, newPos.lng);
                  setRotation(newRotation);
                }
                lastPos.current = newPos;
              }
            }
          ).subscribe();
        channelsRef.current.push(driverChannel);
      }
    };
    
    if (booking) {
      setupChannels();
    }

    return () => cleanupChannels();

  }, [isEnabled, bookingId, booking?.id, booking?.driver_id, user, toast, sendPushNotification, cleanupChannels]);


  // Calculate ETA to pickup
  useEffect(() => {
    if (user?.role === 'client' && driver?.lat && booking?.pickup_lat && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route({
        origin: { lat: parseFloat(driver.lat), lng: parseFloat(driver.lng) },
        destination: { lat: parseFloat(booking.pickup_lat), lng: parseFloat(booking.pickup_lng) },
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const durationInMinutes = Math.round(result.routes[0].legs[0].duration.value / 60);
          setEstimatedPickupTime(durationInMinutes);
        }
      });
    } else {
      setEstimatedPickupTime(null);
    }
  }, [driver?.lat, driver?.lng, booking?.pickup_lat, booking?.pickup_lng, user?.role]);

  return {
    booking,
    driver,
    client,
    loading,
    error,
    rotation,
    connectionStatus,
    lastUpdate,
    estimatedPickupTime,
  };
};