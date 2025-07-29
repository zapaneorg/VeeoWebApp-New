import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CalendarDays, Clock } from 'lucide-react';

const BookingOptions = ({ bookingData, handlers, t }) => {
  const { handleSelectChange, handleChange } = handlers;

  return (
    <>
      <div>
        <Label className="text-brand-gray-700">{t('bookingForm.bookingTypeLabel')}</Label>
        <Select value={bookingData.bookingType} onValueChange={(value) => handleSelectChange('bookingType', value)}>
          <SelectTrigger className="w-full mt-1 bg-white border-gray-300 text-brand-dark-gray focus:ring-brand-primary">
            <SelectValue placeholder={t('bookingForm.bookingTypePlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 text-brand-dark-gray">
            <SelectItem value="instant">{t('bookingForm.bookingTypeInstant')}</SelectItem>
            <SelectItem value="later">{t('bookingForm.bookingTypeLater')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {bookingData.bookingType === 'later' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bookingDate" className="text-brand-gray-700">{t('bookingForm.dateLabel')}</Label>
            <div className="relative mt-1">
              <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input id="bookingDate" type="date" value={bookingData.bookingDate} onChange={(e) => handleChange('bookingDate', e.target.value)} className="pl-10 bg-white border-gray-300 focus:ring-brand-primary text-brand-dark-gray placeholder-gray-500 date-input" required={bookingData.bookingType === 'later'} />
            </div>
          </div>
          <div>
            <Label htmlFor="bookingTime" className="text-brand-gray-700">{t('bookingForm.timeLabel')}</Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input id="bookingTime" type="time" value={bookingData.bookingTime} onChange={(e) => handleChange('bookingTime', e.target.value)} className="pl-10 bg-white border-gray-300 focus:ring-brand-primary text-brand-dark-gray placeholder-gray-500 time-input" required={bookingData.bookingType === 'later'} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingOptions;