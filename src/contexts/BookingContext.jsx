import React, { createContext, useState, useContext, useEffect } from 'react';

export const BookingSteps = {
  FORM: 1,
  CONFIRMATION: 2,
  TRACKING: 3,
};

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [step, setStep] = useState(BookingSteps.FORM);
  const [bookingData, setBookingData] = useState({
    pickupLocation: '',
    stops: [], // { location: '', coords: null }
    dropoffLocation: '',
    pickupCoords: null,
    dropoffCoords: null,
    bookingType: 'instant',
    bookingDate: '',
    bookingTime: '',
    vehicleType: 'veooX',
    passengers: 1,
    luggage: 0,
    childSeat: false,
    comments: '',
    sharedRide: false,
    bookingFor: 'me',
    passengerDetails: {
      firstName: '',
      lastName: '',
      phone: '',
    },
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [estimatedDuration, setEstimatedDuration] = useState(null);
  const [estimatedDistance, setEstimatedDistance] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleMapsApiLoaded, setIsGoogleMapsApiLoaded] = useState(false);

  useEffect(() => {
    const prefillDataJSON = localStorage.getItem('bookingParams');
    if (prefillDataJSON) {
      try {
        const prefillData = JSON.parse(prefillDataJSON);
        setBookingData(prevData => ({
          ...prevData,
          ...prefillData,
          passengerDetails: prefillData.passengerDetails || prevData.passengerDetails,
          stops: prefillData.stops || [],
        }));
        localStorage.removeItem('bookingParams');
      } catch (error) {
        console.error("Error parsing pre-fill booking data from localStorage:", error);
        localStorage.removeItem('bookingParams');
      }
    }
  }, []);

  const value = {
    step, setStep,
    bookingData, setBookingData,
    estimatedPrice, setEstimatedPrice,
    estimatedDuration, setEstimatedDuration,
    estimatedDistance, setEstimatedDistance,
    bookingId, setBookingId,
    isSubmitting, setIsSubmitting,
    isGoogleMapsApiLoaded, setIsGoogleMapsApiLoaded 
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};