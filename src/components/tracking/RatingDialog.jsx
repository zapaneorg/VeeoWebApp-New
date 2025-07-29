import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const RatingDialog = ({ booking, driver, open, onOpenChange }) => {
  const { t } = useLocale();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('bookings')
      .update({ driver_rating: rating, review_comment: comment })
      .eq('id', booking.id);

    if (error) {
      toast({
        title: t('rating.submitErrorTitle'),
        description: t('rating.submitErrorMessage'),
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('rating.submitSuccessTitle'),
        description: t('rating.submitSuccessMessage'),
        variant: 'success',
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('rating.title', { driverName: driver?.first_name || 'Driver' })}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-8 w-8 cursor-pointer ${rating > i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <Textarea
            placeholder={t('rating.commentPlaceholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            {t('rating.submitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
