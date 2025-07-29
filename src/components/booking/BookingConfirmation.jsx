
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { CreditCard, Edit, Users2, Wallet, DollarSign, MapPin, XCircle } from 'lucide-react';
import { useLocale }from '@/contexts/LocaleContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

const BookingConfirmation = ({ bookingData, estimatedPrice, estimatedDuration, estimatedDistance, onConfirm, onEdit, onCancel }) => {
  const { t } = useLocale();
  const { user } = useAuth();
  const walletBalance = user?.wallet_balance ? parseFloat(user.wallet_balance).toFixed(2) : '0.00';


  return (
    <Card className="bg-white border-gray-200 shadow-lg text-black">
      <CardHeader>
        <CardTitle className="text-2xl text-black">{t('bookingConfirmation.title')}</CardTitle>
        <CardDescription className="text-gray-600">{t('bookingConfirmation.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-700">
        <div className="space-y-2">
            <p className="flex items-start"><MapPin className="h-5 w-5 mr-2 mt-1 text-green-500 flex-shrink-0" /><strong className="text-black mr-2">{t('bookingConfirmation.pickupLabel')}:</strong> {bookingData.pickupLocation}</p>
            {bookingData.stops && bookingData.stops.map((stop, index) => (
                <p key={index} className="flex items-start pl-7"><MapPin className="h-5 w-5 mr-2 mt-1 text-yellow-500 flex-shrink-0" /><strong className="text-black mr-2">{t('bookingForm.stopLabel', { count: index + 1 })}:</strong> {stop.location}</p>
            ))}
            <p className="flex items-start"><MapPin className="h-5 w-5 mr-2 mt-1 text-red-500 flex-shrink-0" /><strong className="text-black mr-2">{t('bookingConfirmation.dropoffLabel')}:</strong> {bookingData.dropoffLocation}</p>
        </div>
        {bookingData.bookingType === 'later' && <p><strong className="text-black">{t('bookingConfirmation.dateTimeLabel')}:</strong> {bookingData.bookingDate} {t('bookingConfirmation.atTime')} {bookingData.bookingTime}</p>}
        <p><strong className="text-black">{t('bookingConfirmation.vehicleLabel')}:</strong> {t(`vehicleTypes.${bookingData.vehicleType}`)}</p>
        <p><strong className="text-black">{t('bookingConfirmation.passengersLabel')}:</strong> {bookingData.passengers}</p>
        {bookingData.luggage > 0 && <p><strong className="text-black">{t('bookingConfirmation.luggageLabel')}:</strong> {bookingData.luggage}</p>}
        {bookingData.childSeat && <p><strong className="text-black">{t('bookingConfirmation.childSeatLabel')}:</strong> {t('bookingConfirmation.childSeatValue')}</p>}
        {bookingData.sharedRide && <p className="flex items-center"><Users2 className="h-4 w-4 mr-2 text-primary" /><strong className="text-black">{t('bookingConfirmation.sharedRideLabel')}:</strong> {t('bookingConfirmation.sharedRideValue')}</p>}
        {bookingData.comments && <p><strong className="text-black">{t('bookingConfirmation.commentsLabel')}:</strong> {bookingData.comments}</p>}
        
        <hr className="border-gray-200 my-4"/>
        
        <p className="text-lg"><strong className="text-black">{t('bookingConfirmation.estimatedDistanceLabel')}:</strong> {estimatedDistance}</p>
        <p className="text-lg"><strong className="text-black">{t('bookingConfirmation.estimatedDurationLabel')}:</strong> {estimatedDuration}</p>
        <p className="text-2xl font-bold"><strong className="text-black">{t('bookingConfirmation.estimatedPriceLabel')}:</strong> <span className="text-primary">{estimatedPrice}</span></p>
        
        <div>
          <Label className="text-gray-700 block mb-2">{t('bookingConfirmation.paymentMethodLabel')}</Label>
          <Select defaultValue="card_default" onValueChange={(value) => bookingData.paymentMethodId = value}>
            <SelectTrigger className="w-full bg-white border-gray-300 text-black focus:ring-primary">
              <SelectValue placeholder={t('bookingConfirmation.selectPaymentPlaceholder')} />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-black">
              <SelectItem value="card_default" className="hover:bg-gray-100 focus:bg-gray-100">
                <CreditCard className="inline h-4 w-4 mr-2 text-gray-500" /> {t('bookingConfirmation.defaultCard')}
              </SelectItem>
              <SelectItem value="wallet" className="hover:bg-gray-100 focus:bg-gray-100">
                <Wallet className="inline h-4 w-4 mr-2 text-gray-500" /> {t('bookingConfirmation.useWallet', { balance: walletBalance })}
              </SelectItem>
               <SelectItem value="cash" className="hover:bg-gray-100 focus:bg-gray-100">
                <DollarSign className="inline h-4 w-4 mr-2 text-gray-500" /> {t('bookingConfirmation.cashPayment')}
              </SelectItem>
              <SelectItem value="add_card" className="hover:bg-gray-100 focus:bg-gray-100">{t('bookingConfirmation.addNewCard')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </CardContent>
      <CardFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button variant="destructive" onClick={onCancel} className="w-full sm:w-auto">
          <XCircle className="mr-2 h-4 w-4" /> Annuler
        </Button>
        <Button variant="outline" onClick={onEdit} className="w-full sm:w-auto border-gray-800 text-black hover:bg-gray-100">
          <Edit className="mr-2 h-4 w-4" /> {t('bookingConfirmation.editButton')}
        </Button>
        <Button onClick={onConfirm} size="lg" className="w-full sm:w-auto py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-semibold">
          {t('bookingConfirmation.confirmButton')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;
