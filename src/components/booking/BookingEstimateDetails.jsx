import React from 'react';
import { Car, Clock, Thermometer, Info, MapPin, Flag } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const BookingEstimateDetails = ({ 
  step, 
  estimatedPrice, 
  estimatedDuration, 
  estimatedDistance, 
  isGoogleMapsApiLoaded,
  pickupLocation,
  dropoffLocation,
  stops
}) => {
  const { t } = useLocale();

  if (step === 3) { 
    return (
      <div className="text-center mt-4">
        <p className="text-lg font-semibold text-green-600">{t('bookingEstimate.driverEnRoute', {defaultValue: "Chauffeur en route !"})}</p>
        <p className="text-sm text-gray-600 mt-1">{t('bookingEstimate.driverPositionSimulation', {defaultValue: "La position du chauffeur sera mise à jour en temps réel (simulation)."})}</p>
      </div>
    );
  }

  if (!isGoogleMapsApiLoaded && step === 1) {
    return (
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-400 rounded-md text-yellow-700 text-sm flex items-start">
        <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <span>{t('bookingEstimate.mapsApiLimitedWarning', {defaultValue: "L'estimation précise du trajet et l'affichage de la carte sont limités car l'API Google Maps n'est pas chargée."})}</span>
      </div>
    );
  }

  if (estimatedPrice && (step === 1 || step === 2)) {
    return (
      <div className="space-y-4 text-gray-800 mt-4">
        <div className="space-y-2">
          {pickupLocation && (
            <div className="flex items-start text-sm">
              <MapPin className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-500">{t('bookingEstimate.pickupLabel', {defaultValue: "Départ"})}:</span>
                <p className="text-gray-900">{pickupLocation}</p>
              </div>
            </div>
          )}
          {(stops || []).map((stop, index) => (
            <div key={`stop-estimate-${index}`} className="flex items-start text-sm">
              <Flag className="h-5 w-5 mr-3 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-500">Arrêt {index + 1}:</span>
                <p className="text-gray-900">{stop.location}</p>
              </div>
            </div>
          ))}
          {dropoffLocation && (
            <div className="flex items-start text-sm">
              <MapPin className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-500">{t('bookingEstimate.dropoffLabel', {defaultValue: "Arrivée"})}:</span>
                <p className="text-gray-900">{dropoffLocation}</p>
              </div>
            </div>
          )}
        </div>
        
        {(pickupLocation || dropoffLocation) && <hr className="border-gray-200 my-2" />}

        <div className="flex items-center justify-between">
          <span className="flex items-center text-gray-600"><Car className="h-5 w-5 mr-2 text-gray-700"/> {t('bookingEstimate.distanceLabel', {defaultValue: "Distance"})}:</span> 
          <span className="font-semibold text-lg text-gray-900">{estimatedDistance}</span>
        </div>
        <div className="flex items-center justify-between">
           <span className="flex items-center text-gray-600"><Clock className="h-5 w-5 mr-2 text-gray-700"/> {t('bookingEstimate.durationLabel', {defaultValue: "Durée"})}:</span>
           <span className="font-semibold text-lg text-gray-900">{estimatedDuration}</span>
        </div>
        <hr className="border-gray-300 my-2"/>
        <div className="flex items-center justify-between">
          <span className="flex items-center text-gray-700 text-xl"><Thermometer className="h-6 w-6 mr-2 text-green-600"/> {t('bookingEstimate.estimatedPriceLabel', {defaultValue: "Prix estimé"})}:</span>
          <span className="text-2xl font-bold text-green-700">{estimatedPrice}</span>
        </div>
      </div>
    );
  }

  if (step === 1 && !estimatedPrice) {
    return (
      <p className="text-gray-500 text-center mt-4">{t('bookingEstimate.enterAddressesPrompt', {defaultValue: "Entrez les lieux de départ et d'arrivée pour obtenir une estimation."})}</p>
    );
  }

  return null; 
};

export default BookingEstimateDetails;