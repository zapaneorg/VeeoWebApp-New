import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, MessageSquare, Users2 } from 'lucide-react';

const OtherOptions = ({ bookingData, handlers, t }) => {
  const { handleSelectChange, handleCheckboxChange, handleChange } = handlers;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <Label htmlFor="luggage" className="text-brand-gray-700">{t('bookingForm.luggageLabel')}</Label>
          <Select value={String(bookingData.luggage)} onValueChange={(value) => handleSelectChange('luggage', parseInt(value, 10))}>
            <SelectTrigger className="w-full mt-1 bg-white border-gray-300 text-brand-dark-gray focus:ring-brand-primary">
               <Briefcase className="inline h-4 w-4 mr-2 text-gray-500" />
               <SelectValue placeholder={t('bookingForm.luggagePlaceholder')} />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-brand-dark-gray">
              {[0, 1, 2, 3, 4].map(num => (
                <SelectItem key={`luggage-${num}`} value={String(num)}>
                  {t('bookingForm.luggageCount', { count: num })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 mt-6 md:mt-7">
          <Checkbox id="childSeat" checked={bookingData.childSeat} onCheckedChange={(checked) => handleCheckboxChange('childSeat', checked)} className="border-gray-400 data-[state=checked]:bg-brand-primary data-[state=checked]:text-white data-[state=checked]:border-brand-primary"/>
          <Label htmlFor="childSeat" className="text-brand-gray-700 cursor-pointer">{t('bookingForm.childSeatLabel')}</Label>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mt-1">
        <Checkbox id="sharedRide" checked={bookingData.sharedRide || false} onCheckedChange={(checked) => handleCheckboxChange('sharedRide', checked)} className="border-gray-400 data-[state=checked]:bg-brand-primary data-[state=checked]:text-white data-[state=checked]:border-brand-primary"/>
        <Label htmlFor="sharedRide" className="text-brand-gray-700 cursor-pointer flex items-center">
          <Users2 className="h-4 w-4 mr-2 text-gray-500"/> {t('bookingForm.sharedRideLabel')}
        </Label>
      </div>

      <div>
        <Label htmlFor="comments" className="text-brand-gray-700">{t('bookingForm.commentsLabel')}</Label>
        <div className="relative mt-1">
          <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Textarea id="comments" placeholder={t('bookingForm.commentsPlaceholder')} value={bookingData.comments} onChange={(e) => handleChange('comments', e.target.value)} className="pl-10 bg-white border-gray-300 focus:ring-brand-primary text-brand-dark-gray placeholder-gray-500" />
        </div>
      </div>
    </>
  );
};

export default OtherOptions;