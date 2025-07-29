import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { AlertTriangle } from 'lucide-react';

const PassengerDetails = ({ bookingData, handlers, t }) => {
  const { handleChange, handlePassengerChange } = handlers;

  return (
    <>
      <div>
        <Label className="text-brand-gray-700 mb-2 block">{t('bookingForm.passengerOptions.title')}</Label>
        <RadioGroup value={bookingData.bookingFor} onValueChange={(value) => handleChange('bookingFor', value)} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="me" id="forMe" />
            <Label htmlFor="forMe">{t('bookingForm.passengerOptions.forMe')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="forOther" />
            <Label htmlFor="forOther">{t('bookingForm.passengerOptions.forOther')}</Label>
          </div>
        </RadioGroup>
      </div>

      <AnimatePresence>
        {bookingData.bookingFor === 'other' && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-muted p-4 rounded-lg border"
          >
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">{t('bookingForm.otherPassengerDetails.title')}</CardTitle>
                <CardDescription>{t('bookingForm.otherPassengerDetails.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="passengerFirstName">{t('bookingForm.otherPassengerDetails.firstName')}</Label>
                        <Input id="passengerFirstName" value={bookingData.passengerDetails?.firstName || ''} onChange={(e) => handlePassengerChange('firstName', e.target.value)} placeholder={t('common.firstName')} required={bookingData.bookingFor === 'other'} />
                    </div>
                    <div>
                        <Label htmlFor="passengerLastName">{t('bookingForm.otherPassengerDetails.lastName')}</Label>
                        <Input id="passengerLastName" value={bookingData.passengerDetails?.lastName || ''} onChange={(e) => handlePassengerChange('lastName', e.target.value)} placeholder={t('common.lastName')} required={bookingData.bookingFor === 'other'} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="passengerPhone">{t('bookingForm.otherPassengerDetails.phone')}</Label>
                    <Input id="passengerPhone" type="tel" value={bookingData.passengerDetails?.phone || ''} onChange={(e) => handlePassengerChange('phone', e.target.value)} placeholder="0612345678" required={bookingData.bookingFor === 'other'} />
                    <p className="text-xs text-muted-foreground mt-1">{t('bookingForm.otherPassengerDetails.phoneDisclaimer')}</p>
                </div>
                <div className="flex items-start space-x-2 p-3 bg-yellow-100/60 rounded-lg border border-yellow-200/80">
                     <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-800">{t('bookingForm.otherPassengerDetails.warning')}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PassengerDetails;