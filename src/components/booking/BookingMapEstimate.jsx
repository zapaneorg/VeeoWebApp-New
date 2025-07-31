import React, { useState, useEffect, useCallback, useRef } from 'react';
import BookingMapDisplay from '@/components/booking/BookingMapDisplay';
import BookingEstimateDetails from '@/components/booking/BookingEstimateDetails';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { BookingSteps, useBookingContext } from '@/contexts/BookingContext';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const defaultCenter = {
  lat: 48.8566, 
  lng: 2.3522   
};

const BookingMapEstimate = ({ step }) => {
  const { 
    bookingData,
    estimatedPrice, setEstimatedPrice,
    estimatedDuration, setEstimatedDuration,
    estimatedDistance, setEstimatedDistance,
    isGoogleMapsApiLoaded
  } = useBookingContext();
  const { t } = useLocale();

  const { pickupCoords, dropoffCoords, pickupLocation, dropoffLocation, stops } = bookingData;

  const [map, setMap] = useState(null); 
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(10);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const { toast } = useToast();

  const directionsServiceRef = useRef(null);

  // Debounce coordinates to prevent excessive API calls
  const debouncedPickupCoords = useDebounce(pickupCoords, 500);
  const debouncedDropoffCoords = useDebounce(dropoffCoords, 500);
  const debouncedStops = useDebounce(stops, 500);

  const calculateRoute = useCallback(async () => {
    if (!debouncedPickupCoords || !debouncedDropoffCoords || !isGoogleMapsApiLoaded) {
      setDirectionsResponse(null);
      setEstimatedPrice(null);
      setEstimatedDuration(null);
      setEstimatedDistance(null);
      return;
    }

    if (!window.google || !window.google.maps || !window.google.maps.DirectionsService) {
      console.error("Google Maps DirectionsService is not available.");
      toast({ title: t('bookingMap.errorTitle', {defaultValue: "Erreur Carte"}), description: t('bookingMap.directionsUnavailable', {defaultValue: "Le service de calcul d'itinéraire est indisponible."}), variant: "destructive" });
      return;
    }
    
    setIsCalculatingRoute(true);

    if (!directionsServiceRef.current) {
        directionsServiceRef.current = new window.google.maps.DirectionsService();
    }

    const origin = new window.google.maps.LatLng(debouncedPickupCoords.lat, debouncedPickupCoords.lng);
    const destination = new window.google.maps.LatLng(debouncedDropoffCoords.lat, debouncedDropoffCoords.lng);
    const waypoints = debouncedStops
      .filter(stop => stop.coords)
      .map(stop => ({
        location: new window.google.maps.LatLng(stop.coords.lat, stop.coords.lng),
        stopover: true,
      }));

    directionsServiceRef.current.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsCalculatingRoute(false);
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
          
          let totalDistance = 0;
          let totalDuration = 0;
          result.routes[0].legs.forEach(leg => {
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;
          });

          const distanceInKm = totalDistance / 1000;
          const durationInMinutes = Math.ceil(totalDuration / 60);

          const basePrice = 5; 
          const pricePerKm = 1.5; 
          const pricePerMinute = 0.2;
          let calculatedPrice = basePrice + (distanceInKm * pricePerKm) + (durationInMinutes * pricePerMinute);
          calculatedPrice = Math.max(calculatedPrice, 10); 

          setEstimatedPrice(`${calculatedPrice.toFixed(2)}€`);
          setEstimatedDuration(`${durationInMinutes} minutes`);
          setEstimatedDistance(`${distanceInKm.toFixed(1)} km`);
          
          if (result.routes && result.routes.length > 0 && result.routes[0].bounds) {
            const bounds = result.routes[0].bounds;
            if (map) {
              map.fitBounds(bounds);
            }
            setMapCenter(bounds.getCenter().toJSON());
            
          } else {
             setMapCenter(origin.toJSON());
             setMapZoom(12);
          }

        } else {
          console.error(`Error fetching directions ${result}, status: ${status}`);
          setDirectionsResponse(null);
          setEstimatedPrice(null);
          setEstimatedDuration(null);
          setEstimatedDistance(null);
          let errorMessage = t('bookingMap.routeCalculationErrorGeneric', {defaultValue: "Impossible de calculer l'itinéraire. Veuillez vérifier les adresses."});
          if (status === "REQUEST_DENIED") {
            errorMessage = t('bookingMap.routeCalculationErrorDenied', {defaultValue: "Le calcul d'itinéraire a été refusé. Cela peut être dû à un problème de configuration de l'API Google Maps (clé, facturation, ou API non activées)."});
          } else if (status === "ZERO_RESULTS") {
            errorMessage = t('bookingMap.routeCalculationErrorZeroResults', {defaultValue: "Aucun itinéraire trouvé entre les adresses spécifiées."});
          } else if (status === "NOT_FOUND") {
            errorMessage = t('bookingMap.routeCalculationErrorNotFound', {defaultValue: "Au moins une des adresses (départ ou arrivée) n'a pas pu être géocodée."});
          }
          toast({ title: t('bookingMap.routeErrorTitle', {defaultValue: "Erreur d'itinéraire"}), description: errorMessage, variant: "destructive" });
        }
      }
    );
  }, [debouncedPickupCoords, debouncedDropoffCoords, debouncedStops, isGoogleMapsApiLoaded, setEstimatedPrice, setEstimatedDuration, setEstimatedDistance, toast, map, t]);

  useEffect(() => {
    const allStopsHaveCoords = debouncedStops.every(stop => stop.coords);
    if (debouncedPickupCoords && debouncedDropoffCoords && allStopsHaveCoords && isGoogleMapsApiLoaded && step === BookingSteps.FORM) {
      calculateRoute();
    } else if (!debouncedPickupCoords || !debouncedDropoffCoords) {
      setDirectionsResponse(null);
      setEstimatedPrice(null);
      setEstimatedDuration(null);
      setEstimatedDistance(null);
      setMapCenter(defaultCenter);
      setMapZoom(10);
    }
  }, [debouncedPickupCoords, debouncedDropoffCoords, debouncedStops, isGoogleMapsApiLoaded, calculateRoute, step, setEstimatedPrice, setEstimatedDuration, setEstimatedDistance]);
  
  useEffect(() => {
    if (pickupCoords && !dropoffCoords) {
        setMapCenter(pickupCoords);
        setMapZoom(14);
    } else if (!pickupCoords && dropoffCoords) {
        setMapCenter(dropoffCoords);
        setMapZoom(14);
    } else if (!pickupCoords && !dropoffCoords) {
        setMapCenter(defaultCenter);
        setMapZoom(10);
    }
  }, [pickupCoords, dropoffCoords]);


  if (!isGoogleMapsApiLoaded && step !== BookingSteps.TRACKING) {
    return (
        <div className="p-6 bg-gray-100 border border-gray-300 rounded-xl shadow-lg text-center text-gray-700">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto mb-3" />
            {t('bookingMap.loadingMap', {defaultValue: "Chargement de la carte..."})}
        </div>
    );
  }

  return (
    <div className="sticky top-24 space-y-6">
      <div className="p-4 bg-gray-100 border border-gray-300 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {step === BookingSteps.TRACKING ? t('bookingMap.trackingTitle', {defaultValue: "Suivi de Course"}) : t('bookingMap.estimationTitle', {defaultValue: "Estimation & Carte"})}
          </h2>
          
          {isCalculatingRoute && (
            <div className="flex items-center justify-center my-4">
              <Loader2 className="h-6 w-6 animate-spin text-brand-primary mr-2" />
              <span className="text-gray-700">{t('bookingMap.calculatingRoute', {defaultValue: "Calcul de l'itinéraire..."})}</span>
            </div>
          )}

          <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden border border-gray-300 mb-4">
            {step !== BookingSteps.TRACKING && (
              <BookingMapDisplay
                  setMapInstance={setMap}
                  mapCenter={mapCenter}
                  mapZoom={mapZoom}
                  directionsResponse={directionsResponse}
                  pickupCoords={pickupCoords}
                  dropoffCoords={dropoffCoords}
              />
            )}
            
            {step === BookingSteps.TRACKING && (
               <BookingMapDisplay
                  setMapInstance={setMap}
                  mapCenter={pickupCoords || defaultCenter} 
                  zoom={15}
                  directionsResponse={null} 
                  pickupCoords={pickupCoords} 
                  dropoffCoords={null} 
               />
            )}
          </div>

          <BookingEstimateDetails
            step={step}
            estimatedPrice={estimatedPrice}
            estimatedDuration={estimatedDuration}
            estimatedDistance={estimatedDistance}
            isGoogleMapsApiLoaded={isGoogleMapsApiLoaded}
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            stops={stops}
          />
      </div>
    </div>
  );
};

export default BookingMapEstimate;