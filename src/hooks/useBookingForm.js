import { useRef, useState, useCallback } from 'react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

export const useBookingForm = (bookingData, setBookingData, onSubmit) => {
  const { t } = useLocale();
  const pickupAutocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);
  const stopAutocompleteRefs = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const handleChange = useCallback((field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  }, [setBookingData]);

  const handleSelectChange = useCallback((field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  }, [setBookingData]);
  
  const handleCheckboxChange = useCallback((field, checked) => {
    setBookingData(prev => ({ ...prev, [field]: checked }));
  }, [setBookingData]);

  const handlePassengerChange = useCallback((field, value) => {
    setBookingData(prev => ({
      ...prev,
      passengerDetails: {
        ...prev.passengerDetails,
        [field]: value,
      },
    }));
  }, [setBookingData]);

  const onPlaceChanged = useCallback((type, index = -1) => {
    let autocompleteRef;
    let locationField;
    let coordsField;

    if (type === 'pickup') {
      autocompleteRef = pickupAutocompleteRef.current;
      locationField = 'pickupLocation';
      coordsField = 'pickupCoords';
    } else if (type === 'dropoff') {
      autocompleteRef = dropoffAutocompleteRef.current;
      locationField = 'dropoffLocation';
      coordsField = 'dropoffCoords';
    } else if (type === 'stop') {
      autocompleteRef = stopAutocompleteRefs.current[index];
    }

    if (autocompleteRef) {
      const place = autocompleteRef.getPlace();
      if (place && place.formatted_address && place.geometry && place.geometry.location) {
        const newCoords = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        if (type === 'stop') {
          const newStops = [...bookingData.stops];
          newStops[index] = { location: place.formatted_address, coords: newCoords };
          setBookingData(prev => ({ ...prev, stops: newStops }));
        } else {
          setBookingData(prev => ({
            ...prev,
            [locationField]: place.formatted_address,
            [coordsField]: newCoords
          }));
        }
      } else {
         if (type === 'stop') {
            const newStops = [...bookingData.stops];
            newStops[index] = { location: place?.name || bookingData.stops[index].location, coords: null };
            setBookingData(prev => ({ ...prev, stops: newStops }));
         } else {
            setBookingData(prev => ({ ...prev, [coordsField]: null, [locationField]: place?.name || prev[locationField] }));
         }
      }
    }
  }, [bookingData.stops, setBookingData]);

  const handleAddStop = useCallback(() => {
    if (bookingData.stops.length < 3) {
      setBookingData(prev => ({
        ...prev,
        stops: [...prev.stops, { location: '', coords: null }]
      }));
    }
  }, [bookingData.stops.length, setBookingData]);

  const handleRemoveStop = useCallback((index) => {
    const newStops = bookingData.stops.filter((_, i) => i !== index);
    setBookingData(prev => ({ ...prev, stops: newStops }));
  }, [bookingData.stops, setBookingData]);

  const handleStopChange = useCallback((index, value) => {
    const newStops = [...bookingData.stops];
    newStops[index].location = value;
    setBookingData(prev => ({ ...prev, stops: newStops }));
  }, [bookingData.stops, setBookingData]);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    if (bookingData.bookingFor === 'other' && (!bookingData.passengerDetails.firstName || !bookingData.passengerDetails.lastName || !bookingData.passengerDetails.phone)) {
        return;
    }
    if (bookingData.bookingFor === 'other') {
      setIsModalOpen(true);
    } else {
      onSubmit();
    }
  }, [bookingData, onSubmit]);

  const handleModalSubmit = useCallback(() => {
    if (isConsentChecked) {
      setIsModalOpen(false);
      onSubmit();
    }
  }, [isConsentChecked, onSubmit]);

  return {
    t,
    pickupAutocompleteRef,
    dropoffAutocompleteRef,
    stopAutocompleteRefs,
    isModalOpen,
    isConsentChecked,
    setIsModalOpen,
    setIsConsentChecked,
    formHandlers: {
      handleChange,
      handleSelectChange,
      handleCheckboxChange,
      handlePassengerChange,
      onPlaceChanged,
      handleAddStop,
      handleRemoveStop,
      handleStopChange,
      handleFormSubmit,
      handleModalSubmit,
    },
  };
};