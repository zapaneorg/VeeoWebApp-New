
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import BookingForm from '@/components/booking/BookingForm';
import BookingMapEstimate from '@/components/booking/BookingMapEstimate';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import BookingTracking from '@/components/booking/BookingTracking';
import { Loader2 } from 'lucide-react';
import { useLoadScript } from '@react-google-maps/api';
import { BookingSteps, useBookingContext, BookingProvider } from '@/contexts/BookingContext.jsx';
import { PageHeader } from '@/components/booking/BookingPageHeader.jsx';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { createBooking } from '@/lib/authService'; 

const GOOGLE_MAPS_API_KEY = "AIzaSyAezXvXrmIL6fKuM7mOwgAVgYAwldHhziY"; 
const libraries = ["places", "directions"];

const BookingPageCore = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();
  const bookingContext = useBookingContext();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
    preventGoogleFontsLoading: true,
  });

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps API load error:", loadError);
      toast({title: t('auth.googleMapsError'), description: t('auth.googleMapsLoadError'), variant: "destructive"});
    }
  }, [loadError, toast, t]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      toast({
        title: t('auth.restrictedAccess'),
        description: t('auth.pleaseLoginToBook'),
        variant: "destructive",
      });
    }
  }, [user, navigate, toast, authLoading, t]);
  
  useEffect(() => {
    if (bookingContext && bookingContext.setIsGoogleMapsApiLoaded) {
      bookingContext.setIsGoogleMapsApiLoaded(isLoaded);
    }
  }, [isLoaded, bookingContext]);


  if (!bookingContext) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-white">
        <Loader2 className="h-16 w-16 animate-spin text-brand-primary" />
        <p className="mt-4 text-brand-gray-700 text-lg">{t('booking.loadingContext', {defaultValue: "Chargement du contexte de réservation..."})}</p>
      </div>
    );
  }

  const {
    step, setStep,
    bookingData, setBookingData,
    estimatedPrice, setEstimatedPrice,
    estimatedDuration, setEstimatedDuration,
    estimatedDistance, setEstimatedDistance,
    bookingId, setBookingId,
    isSubmitting, setIsSubmitting,
    isGoogleMapsApiLoaded
  } = bookingContext;


  const handleFormSubmit = () => {
    if (!bookingData.pickupLocation || !bookingData.dropoffLocation) {
      toast({ title: t('auth.missingFields'), description: t('auth.enterPickupDropoff'), variant: "destructive" });
      return;
    }
    if (bookingData.bookingType === 'later' && (!bookingData.bookingDate || !bookingData.bookingTime)) {
      toast({ title: t('auth.missingFields'), description: t('auth.specifyDateTimeForLater'), variant: "destructive" });
      return;
    }
     if (bookingData.bookingFor === 'other' && (!bookingData.passengerDetails.firstName || !bookingData.passengerDetails.lastName || !bookingData.passengerDetails.phone)) {
      toast({ title: t('home.missingInfoTitle'), description: t('home.passengerInfoMissing'), variant: 'destructive' });
      return;
    }
    
    if(isGoogleMapsApiLoaded && bookingData.pickupCoords && bookingData.dropoffCoords) {
      // Handled by BookingMapEstimate
    } else if (!isGoogleMapsApiLoaded && !loadError) {
        setEstimatedPrice('25.00€'); 
        setEstimatedDuration('30 minutes'); 
        setEstimatedDistance('10 km'); 
    } else if (isGoogleMapsApiLoaded && (!bookingData.pickupCoords || !bookingData.dropoffCoords)) {
        toast({ title: t('auth.invalidAddresses'), description: t('auth.selectValidAddresses'), variant: "destructive" });
        return;
    }
    setStep(BookingSteps.CONFIRMATION); 
  };

  const handleBookingConfirm = async () => {
    if (!user) {
      toast({ title: t('auth.error'), description: t('auth.userNotConnected'), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const bookingDateTime = bookingData.bookingType === 'later' 
      ? `${bookingData.bookingDate}T${bookingData.bookingTime}:00` 
      : new Date().toISOString();

    const newBookingPayload = {
      user_id: user.id, 
      pickup_location_text: bookingData.pickupLocation,
      dropoff_location_text: bookingData.dropoffLocation,
      pickup_lat: bookingData.pickupCoords?.lat || null,
      pickup_lng: bookingData.pickupCoords?.lng || null,
      dropoff_lat: bookingData.dropoffCoords?.lat || null,
      dropoff_lng: bookingData.dropoffCoords?.lng || null,
      stops: bookingData.stops,
      booking_time: bookingData.bookingType === 'later' ? new Date(bookingDateTime).toISOString() : new Date().toISOString(),
      status: 'pending_confirmation', 
      vehicle_type: bookingData.vehicleType,
      estimated_price: parseFloat(estimatedPrice?.replace('€', '') || 0),
      estimated_duration_minutes: parseInt(estimatedDuration?.match(/\d+/)?.[0] || 0),
      distance_km: parseFloat(estimatedDistance?.match(/[\d.]+/)?.[0] || 0),
      passengers: bookingData.passengers,
      luggage: bookingData.luggage,
      child_seat: bookingData.childSeat,
      comments: bookingData.comments,
      payment_method_id: bookingData.paymentMethodId || 'default_card', 
      payment_status: 'pending',
      passenger_first_name: bookingData.bookingFor === 'other' ? bookingData.passengerDetails.firstName : null,
      passenger_last_name: bookingData.bookingFor === 'other' ? bookingData.passengerDetails.lastName : null,
      passenger_phone: bookingData.bookingFor === 'other' ? bookingData.passengerDetails.phone : null,
    };

    try {
      const { data, error } = await createBooking(newBookingPayload);

      if (error) {
        console.error('Booking creation error:', error);
        throw error;
      }
      
      setBookingId(data.id);
      
      toast({ 
        title: t('auth.bookingConfirmed'), 
        description: t('auth.rideInProgress'), 
        variant: "success" 
      });
      
      navigate(`/booking-confirmed/${data.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({ 
        title: t('auth.bookingError'), 
        description: error.message || t('auth.cannotCreateBooking'), 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBooking = () => {
    setStep(BookingSteps.FORM);
  };

  const handleCancelBooking = () => {
    setStep(BookingSteps.FORM);
    toast({
      title: "Annulé",
      description: "Votre réservation a été annulée.",
      variant: "default",
    });
  };

  const handleBack = () => {
    if (step === BookingSteps.CONFIRMATION) {
      setStep(BookingSteps.FORM);
    } else if (step === BookingSteps.TRACKING) {
       setStep(BookingSteps.FORM); 
    } else {
      navigate('/'); 
    }
  };

  const isLoading = authLoading || (!isGoogleMapsApiLoaded && !loadError && GOOGLE_MAPS_API_KEY);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-white">
        <Loader2 className="h-16 w-16 animate-spin text-brand-primary" />
        <p className="mt-4 text-brand-gray-700 text-lg">{t('booking.loadingBookingServices')}</p>
        {authLoading && <p className="text-sm text-gray-500">{t('booking.checkingAuth')}</p>}
        {!isGoogleMapsApiLoaded && !loadError && GOOGLE_MAPS_API_KEY && <p className="text-sm text-gray-500">{t('booking.loadingMap')}</p>}
      </div>
    );
  }
  
  const renderStepContent = () => {
    switch (step) {
      case BookingSteps.FORM:
        return (
          <BookingForm 
            bookingData={bookingData} 
            setBookingData={setBookingData} 
            onSubmit={handleFormSubmit}
            isGoogleMapsApiLoaded={isGoogleMapsApiLoaded}
          />
        );
      case BookingSteps.CONFIRMATION:
        return (
          <BookingConfirmation 
            bookingData={bookingData}
            estimatedPrice={estimatedPrice}
            estimatedDuration={estimatedDuration}
            estimatedDistance={estimatedDistance}
            onConfirm={handleBookingConfirm}
            onEdit={handleEditBooking} 
            onCancel={handleCancelBooking}
          />
        );
      case BookingSteps.TRACKING:
        return <BookingTracking 
                  bookingId={bookingId} 
                  bookingData={bookingData} 
                  estimatedPrice={estimatedPrice} 
                  onCancel={handleCancelBooking} 
                />;
      default:
        return <p className="text-brand-dark-gray">{t('booking.unknownStep') || "Étape inconnue"}</p>;
    }
  };
  
  const pageTitles = {
    [BookingSteps.FORM]: t('booking.newBooking'),
    [BookingSteps.CONFIRMATION]: t('booking.confirmRide'),
    [BookingSteps.TRACKING]: t('booking.trackRide'),
  };

  const isConfirmationStep = step === BookingSteps.CONFIRMATION;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-brand-dark-gray min-h-[calc(100vh-var(--header-height,80px))]"
    >
      <div className={`py-8 md:py-12 ${isConfirmationStep ? 'flex flex-col items-center' : ''}`}>
        <PageHeader currentStep={step} title={pageTitles[step] || t('booking.title', {defaultValue: "Réservation"})} onBack={handleBack} />

        <div className={`grid grid-cols-1 ${isConfirmationStep ? 'w-full max-w-4xl' : 'lg:grid-cols-3'} gap-8 items-start`}>
          <div className={`${isConfirmationStep ? 'col-span-1 w-full' : 'lg:col-span-2'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-content-${step}`}
                initial={{ opacity: 0, x: step === BookingSteps.FORM ? 0 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={isConfirmationStep ? 'flex justify-center' : ''}
              >
                {isSubmitting && step === BookingSteps.CONFIRMATION ? (
                  <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
                    <Loader2 className="h-12 w-12 animate-spin text-brand-primary mb-4" />
                    <p className="text-brand-gray-700 text-lg">{t('booking.confirmingInProgress')}</p>
                  </div>
                ) : renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className={`hidden ${isConfirmationStep ? '' : 'lg:block'}`}>
             {!isConfirmationStep && (
              <BookingMapEstimate 
                step={step}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BookingPage = () => {
  return (
    <BookingProvider>
      <BookingPageCore />
    </BookingProvider>
  );
};
export default BookingPage;
