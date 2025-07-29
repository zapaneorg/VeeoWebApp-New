import React from 'react';
import BookingFormLayout from './form/BookingFormLayout';
import LocationFields from './form/LocationFields';
import BookingOptions from './form/BookingOptions';
import PassengerDetails from './form/PassengerDetails';
import RideDetails from './form/RideDetails';
import OtherOptions from './form/OtherOptions';
import SubmitButton from './form/SubmitButton';
import ConsentModal from './form/ConsentModal';
import { useBookingForm } from '@/hooks/useBookingForm';

const BookingForm = ({ bookingData, setBookingData, onSubmit, isGoogleMapsApiLoaded }) => {
  const {
    t,
    pickupAutocompleteRef,
    dropoffAutocompleteRef,
    stopAutocompleteRefs,
    isModalOpen,
    isConsentChecked,
    setIsModalOpen,
    setIsConsentChecked,
    formHandlers,
  } = useBookingForm(bookingData, setBookingData, onSubmit);

  const {
    onPlaceChanged,
    handleFormSubmit,
    handleModalSubmit,
    ...handlers
  } = formHandlers;

  return (
    <BookingFormLayout t={t}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <LocationFields
          bookingData={bookingData}
          isGoogleMapsApiLoaded={isGoogleMapsApiLoaded}
          onPlaceChanged={onPlaceChanged}
          pickupAutocompleteRef={pickupAutocompleteRef}
          dropoffAutocompleteRef={dropoffAutocompleteRef}
          stopAutocompleteRefs={stopAutocompleteRefs}
          handlers={handlers}
          t={t}
        />
        <PassengerDetails
          bookingData={bookingData}
          handlers={handlers}
          t={t}
        />
        <BookingOptions
          bookingData={bookingData}
          handlers={handlers}
          t={t}
        />
        <RideDetails
          bookingData={bookingData}
          handlers={handlers}
          t={t}
        />
        <OtherOptions
          bookingData={bookingData}
          handlers={handlers}
          t={t}
        />
        <SubmitButton t={t} />
      </form>
      <ConsentModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        isConsentChecked={isConsentChecked}
        onConsentChange={setIsConsentChecked}
        onSubmit={handleModalSubmit}
        t={t}
      />
    </BookingFormLayout>
  );
};

export default BookingForm;