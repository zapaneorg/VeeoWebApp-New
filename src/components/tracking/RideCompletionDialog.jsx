import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useLocale } from '@/contexts/LocaleContext';
import { useNavigate } from 'react-router-dom';
import RideOrderReceipt from './RideOrderReceipt';
import RatingDialog from './RatingDialog';

const RideCompletionDialog = ({ open, onOpenChange, booking, driver }) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [showRating, setShowRating] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    navigate('/book');
  };

  const handleRateDriver = () => {
    setShowRating(true);
  };

  if (showRating) {
    return <RatingDialog open={showRating} onOpenChange={setShowRating} booking={booking} driver={driver} />;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('rideComplete.title')}</DialogTitle>
          <DialogDescription>{t('rideComplete.description')}</DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <RideOrderReceipt booking={booking} driver={driver} />
        </div>
        <DialogFooter>
          <Button onClick={handleRateDriver} variant="outline">{t('rideComplete.rateDriverButton')}</Button>
          <Button onClick={handleClose}>{t('rideComplete.closeButton')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RideCompletionDialog;