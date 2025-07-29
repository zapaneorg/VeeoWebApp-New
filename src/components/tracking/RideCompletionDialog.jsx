import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { updateExistingBooking } from '@/lib/authService';
import InteractiveStarRating from './InteractiveStarRating';
import { Loader2, PartyPopper, Gift } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const RideCompletionDialog = ({ open, onOpenChange, booking, driver }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const driverFirstName = driver?.first_name || 'Votre chauffeur';
  const driverLastName = driver?.last_name || '';
  const driverInitials = `${driverFirstName?.charAt(0) || ''}${driverLastName?.charAt(0) || ''}`.toUpperCase();

  const handleRatingSubmit = async () => {
    if (rating === 0 && !comment) return;

    setIsSubmitting(true);
    const { error } = await updateExistingBooking(booking.id, {
      rating: rating || null,
      client_rating_comment: comment || null,
    });
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de soumettre votre évaluation. Veuillez réessayer.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Merci !",
        description: "Votre évaluation a été enregistrée.",
        variant: "success",
      });
    }
  };

  const handleTipSubmit = async () => {
    const finalTip = tip > 0 ? tip : parseFloat(customTip) || 0;
    if (finalTip <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez sélectionner ou entrer un pourboire valide.",
        variant: "warning",
      });
      return;
    }
    
    const { error } = await updateExistingBooking(booking.id, { tip_amount: finalTip });

    if (error) {
       toast({
        title: "Erreur",
        description: "Impossible d'ajouter le pourboire. Veuillez réessayer.",
        variant: "destructive",
      });
    } else {
       toast({
        title: "🚧 Fonctionnalité en cours de développement",
        description: `Le paiement de pourboire de ${finalTip}€ n'est pas encore activé, mais votre intention a été enregistrée. Merci pour votre générosité !`,
        variant: "warning",
        duration: 7000,
      });
    }
  };

  const handleClose = async () => {
    if (rating > 0 || comment) {
      await handleRatingSubmit();
    }
    onOpenChange(false);
    navigate('/book', { replace: true });
  };

  const tipOptions = [1, 2, 5, 10];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-md p-0" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-6 pb-4 text-center bg-gray-50 rounded-t-lg items-center">
          <PartyPopper className="h-12 w-12 text-primary" />
          <DialogTitle className="text-2xl font-bold mt-2">Course terminée !</DialogTitle>
          <DialogDescription>
            Merci d'avoir voyagé avec Veeo. Nous espérons vous revoir bientôt.
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Évaluez votre chauffeur</h3>
            <div className="p-6 bg-slate-100 rounded-lg flex flex-col items-center gap-4 relative">
                <Avatar className="h-20 w-20 absolute -top-10 border-4 border-white shadow-lg">
                    <AvatarImage src={driver?.profile_pic_url} alt={`${driverFirstName} ${driverLastName}`} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl">{driverInitials}</AvatarFallback>
                </Avatar>
                <p className="font-medium text-lg mt-8">Comment était votre course avec {driverFirstName} ?</p>
              <InteractiveStarRating onRatingChange={setRating} />
              <Textarea
                placeholder={`Laissez un commentaire pour ${driverFirstName}... (optionnel)`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 justify-center"><Gift className="h-5 w-5 text-primary"/> Laisser un pourboire ?</h3>
            <div className="p-4 bg-slate-100 rounded-lg space-y-4">
              <p className="text-sm text-muted-foreground text-center">Montrez votre appréciation à {driverFirstName} pour son excellent service.</p>
              <div className="grid grid-cols-4 gap-2">
                {tipOptions.map((amount) => (
                  <Button
                    key={amount}
                    variant={tip === amount ? 'default' : 'outline'}
                    onClick={() => { setTip(amount); setCustomTip(''); }}
                  >
                    {amount} €
                  </Button>
                ))}
              </div>
              <div>
                <Label htmlFor="custom-tip" className="text-center block mb-1">Ou montant libre</Label>
                <Input
                  id="custom-tip"
                  type="number"
                  placeholder="Ex: 3.50"
                  value={customTip}
                  onChange={(e) => { setCustomTip(e.target.value); setTip(0); }}
                  className="mt-1 bg-white text-center"
                />
              </div>
              <Button onClick={handleTipSubmit} className="w-full" disabled={(tip === 0 && !customTip) || parseFloat(customTip) <= 0}>
                Ajouter un pourboire de {tip > 0 ? tip : parseFloat(customTip) || 0} €
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-gray-50 rounded-b-lg">
          <Button onClick={handleClose} className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {rating > 0 || comment ? 'Soumettre et Fermer' : 'Fermer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RideCompletionDialog;