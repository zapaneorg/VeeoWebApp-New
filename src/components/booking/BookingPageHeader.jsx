import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BookingSteps } from '@/contexts/BookingContext.jsx';
import { useLocale } from '@/contexts/LocaleContext.jsx';

export const PageHeader = ({ currentStep, title, onBack }) => {
  const { t } = useLocale();
  return (
    <div className="flex items-center mb-8 md:mb-12">
      {currentStep !== BookingSteps.FORM && ( 
        <Button variant="ghost" onClick={onBack} className="mr-4 text-brand-gray-700 hover:bg-gray-100 hover:text-brand-dark-gray">
          <ArrowLeft className="h-5 w-5 mr-2" /> {t('booking.back') || "Retour"}
        </Button>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-brand-dark-gray">
        {title}
      </h1>
    </div>
  );
};