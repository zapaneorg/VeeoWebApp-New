import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const SubmitButton = ({ t }) => (
  <Button type="submit" variant="outline" size="lg" className="w-full py-3 font-semibold">
    {t('bookingForm.submitButton')} <ArrowRight className="ml-2 h-5 w-5" />
  </Button>
);

export default SubmitButton;