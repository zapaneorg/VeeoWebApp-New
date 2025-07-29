import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, PlusCircle, XCircle } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';
import { AnimatePresence, motion } from 'framer-motion';

const LocationFields = ({
  bookingData,
  isGoogleMapsApiLoaded,
  onPlaceChanged,
  pickupAutocompleteRef,
  dropoffAutocompleteRef,
  stopAutocompleteRefs,
  handlers,
  t
}) => {
  const { handleAddStop, handleRemoveStop, handleStopChange, handleChange } = handlers;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pickupLocation" className="text-brand-gray-700">{t('bookingForm.pickupLabel')}</Label>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          {isGoogleMapsApiLoaded ? (
            <Autocomplete
              onLoad={(ref) => pickupAutocompleteRef.current = ref}
              onPlaceChanged={() => onPlaceChanged('pickup')}
              options={{ fields: ["formatted_address", "geometry.location", "name", "place_id"] }}
            >
              <Input id="pickupLocation" placeholder={t('bookingForm.pickupPlaceholder')} value={bookingData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)} className="pl-10 bg-white border-gray-300 focus:ring-brand-primary text-brand-dark-gray placeholder-gray-500" required />
            </Autocomplete>
          ) : (
            <Input id="pickupLocation" placeholder={t('bookingForm.pickupPlaceholder')} value={bookingData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)} className="pl-10 bg-white border-gray-300 focus:ring-brand-primary text-brand-dark-gray placeholder-gray-500" required />
          )}
        </div>
      </div>

      <AnimatePresence>
        {bookingData.stops.map((stop, index) => (
          <motion.div
            key={`stop-${index}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Label htmlFor={`stopLocation-${index}`} className="text-brand-gray-700">{t('bookingForm.stopLabel', { count: index + 1 })}</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              {isGoogleMapsApiLoaded ? (
                <Autocomplete
                  onLoad={(ref) => stopAutocompleteRefs.current[index] = ref}
                  onPlaceChanged={() => onPlaceChanged('stop', index)}
                  options={{ fields: ["formatted_address", "geometry.location", "name", "place_id"] }}
                >
                  <Input id={`stopLocation-${index}`} placeholder={t('bookingForm.stopPlaceholder')} value={stop.location} onChange={(e) => handleStopChange(index, e.target.value)} className="pl-10 pr-10 bg-white border-gray-300 focus:ring-brand-primary text-brand-dark-gray placeholder-gray-500" required />
                </Autocomplete>
              ) : (
                <Input id={`stopLocation-${index}`} placeholder={t('bookingForm.stopPlaceholder')} value={stop.location} onChange={(e) => handleStopChange(index, e.target.value)} className="pl-10 pr-10 bg-white border-gray-300 focus:ring-brand-primary text-brand-dark-gray placeholder-gray-500" required />
              )}
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveStop(index)} className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8">
                <XCircle className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {bookingData.stops.length < 3 && (
        <Button type="button" variant="outline" onClick={handleAddStop} className="w-full border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" /> {t('bookingForm.addStop')}
        </Button>
      )}

      <div>
        <Label htmlFor="dropoffLocation" className="text-brand-gray-700">{t('bookingForm.dropoffLabel')}</Label>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
           {isGoogleMapsApiLoaded ? (
            <Autocomplete
              onLoad={(ref) => dropoffAutocompleteRef.current = ref}
              onPlaceChanged={() => onPlaceChanged('dropoff')}
              options={{ fields: ["formatted_address", "geometry.location", "name", "place_id"] }}
            >
              <Input id="dropoffLocation" placeholder={t('bookingForm.dropoffPlaceholder')} value={bookingData.dropoffLocation} onChange={(e) => handleChange('dropoffLocation', e.target.value)} className="pl-10 bg-white border-gray-300 focus:ring-brand-primary text-brand-dark-gray placeholder-gray-500" required />
            </Autocomplete>
          ) : (
            <Input id="dropoffLocation" placeholder={t('bookingForm.dropoffPlaceholder')} value={bookingData.dropoffLocation} onChange={(e) => handleChange('dropoffLocation', e.target.value)} className="pl-10 bg-white border-gray-300 focus:ring-brand-primary text-brand-dark-gray placeholder-gray-500" required />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationFields;