import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Users, Briefcase } from 'lucide-react';

const RideDetails = ({ bookingData, handlers, t }) => {
  const { handleSelectChange } = handlers;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="vehicleType" className="text-brand-gray-700">{t('bookingForm.vehicleTypeLabel')}</Label>
        <Select value={bookingData.vehicleType} onValueChange={(value) => handleSelectChange('vehicleType', value)}>
          <SelectTrigger className="w-full mt-1 bg-white border-gray-300 text-brand-dark-gray focus:ring-brand-primary">
             <Car className="inline h-4 w-4 mr-2 text-gray-500" /> <SelectValue placeholder={t('bookingForm.vehicleTypePlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 text-brand-dark-gray">
            <SelectItem value="veooX">{t('vehicleTypes.veooX')}</SelectItem>
            <SelectItem value="veooXL">{t('vehicleTypes.veooXL')}</SelectItem>
            <SelectItem value="veooPet">{t('vehicleTypes.veooPet')}</SelectItem>
            <SelectItem value="veooGreen">{t('vehicleTypes.veooGreen')}</SelectItem>
            <SelectItem value="veooVan">{t('vehicleTypes.veooVan')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="passengers" className="text-brand-gray-700">{t('bookingForm.passengersLabel')}</Label>
        <Select value={String(bookingData.passengers)} onValueChange={(value) => handleSelectChange('passengers', parseInt(value, 10))}>
          <SelectTrigger className="w-full mt-1 bg-white border-gray-300 text-brand-dark-gray focus:ring-brand-primary">
             <Users className="inline h-4 w-4 mr-2 text-gray-500" />
             <SelectValue placeholder={t('bookingForm.passengersPlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 text-brand-dark-gray">
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
              <SelectItem key={`passengers-${num}`} value={String(num)}>
                {t('bookingForm.passengerCount', { count: num })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RideDetails;