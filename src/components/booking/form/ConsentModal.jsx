import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const ConsentModal = ({ isOpen, onOpenChange, isConsentChecked, onConsentChange, onSubmit, t }) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('bookingForm.otherPassengerDetails.modalTitle')}</DialogTitle>
        <DialogDescription>
          {t('bookingForm.otherPassengerDetails.modalDescription')}
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-start space-x-3 py-4">
        <Checkbox id="consent" checked={isConsentChecked} onCheckedChange={onConsentChange} />
        <Label htmlFor="consent" className="text-sm text-muted-foreground leading-normal">
          {t('bookingForm.otherPassengerDetails.modalCheckboxLabel')}
        </Label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
        <Button onClick={onSubmit} disabled={!isConsentChecked}>{t('bookingForm.otherPassengerDetails.modalConfirmButton')}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConsentModal;