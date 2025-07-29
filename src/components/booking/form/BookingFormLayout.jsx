import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Info } from 'lucide-react';

const BookingFormLayout = ({ t, children, isGoogleMapsApiLoaded }) => (
  <Card className="bg-gray-50 border-gray-200 shadow-lg text-brand-dark-gray">
    <CardHeader>
      <CardTitle className="text-2xl text-brand-dark-gray">{t('bookingForm.title')}</CardTitle>
    </CardHeader>
    <CardContent>
      {!isGoogleMapsApiLoaded && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-700 text-sm flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{t('bookingForm.mapsApiDisabledWarning')}</span>
        </div>
      )}
      {children}
    </CardContent>
  </Card>
);

export default BookingFormLayout;