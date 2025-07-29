import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, CalendarDays, Clock, Navigation, AlertTriangle } from 'lucide-react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { fadeIn } from './animations';

const GOOGLE_MAPS_API_KEY = "AIzaSyAezXvXrmIL6fKuM7mOwgAVgYAwldHhziY"; 
const libraries = ["places"];

const HeroSection = ({ t, navigate, toast }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingFor, setBookingFor] = useState('me');
  const [passengerDetails, setPassengerDetails] = useState({ firstName: '', lastName: '', phone: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const pickupAutocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
    preventGoogleFontsLoading: true,
  });

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps API load error on HomePage:", loadError);
      toast({title: t('auth.googleMapsError'), description: t('auth.googleMapsLoadError'), variant: "destructive"});
    }
  }, [loadError, toast, t]);

  const onPlaceChanged = (type) => {
    let autocompleteRef;
    let setLocationFunc;
    let setCoordsFunc;

    if (type === 'pickup') {
      autocompleteRef = pickupAutocompleteRef.current;
      setLocationFunc = setPickupLocation;
      setCoordsFunc = setPickupCoords;
    } else {
      autocompleteRef = dropoffAutocompleteRef.current;
      setLocationFunc = setDropoffLocation;
      setCoordsFunc = setDropoffCoords;
    }

    if (autocompleteRef !== null && autocompleteRef.getPlace) {
      const place = autocompleteRef.getPlace();
      if (place && place.formatted_address && place.geometry && place.geometry.location) {
        setLocationFunc(place.formatted_address);
        setCoordsFunc({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      } else {
         console.warn(`No geometry for ${type} place:`, place);
         setLocationFunc(place?.name || '');
         setCoordsFunc(null);
      }
    }
  };

  const proceedToBooking = () => {
     if (!pickupLocation || !dropoffLocation) {
      toast({ title: t('home.missingInfoTitle', {defaultValue: "Informations manquantes"}), description: t('home.missingInfoDesc', {defaultValue: "Veuillez renseigner un point de départ et d'arrivée."}), variant: "destructive" });
      return;
    }
    
    const bookingDetails = {
      pickupLocation,
      dropoffLocation,
      pickupCoords,
      dropoffCoords,
      bookingDate: bookingDate || '',
      bookingTime: bookingTime || '',
      bookingType: (bookingDate && bookingTime) ? 'later' : 'instant',
      bookingFor,
      passengerDetails: bookingFor === 'other' ? passengerDetails : null,
    };
    
    localStorage.setItem('bookingParams', JSON.stringify(bookingDetails));
    
    navigate('/book');
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (bookingFor === 'other') {
      if (!passengerDetails.firstName || !passengerDetails.lastName || !passengerDetails.phone) {
        toast({ title: t('home.missingInfoTitle'), description: t('home.passengerInfoMissing'), variant: 'destructive' });
        return;
      }
      setIsModalOpen(true);
    } else {
      proceedToBooking();
    }
  };

  const handleModalConfirm = () => {
    if (isConsentChecked) {
      setIsModalOpen(false);
      proceedToBooking();
    }
  };
  
  const handlePassengerChange = (field, value) => {
    setPassengerDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.section
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="text-left"
    >
        <motion.h1 variants={fadeIn} className="text-hero-title mb-6 text-primary">
          {t('home.heroTitle', { city: "Strasbourg" })}
        </motion.h1>
        <motion.p variants={fadeIn} className="text-body-emphasis mb-10 max-w-2xl text-muted-foreground">
          {t('home.heroSubtitle', { city: "Strasbourg", region: "Bas-Rhin" })}
        </motion.p>
        <motion.div variants={fadeIn} className="bg-background p-6 sm:p-8 rounded-xl shadow-xl border border-border">
          <form onSubmit={handleBookingSubmit} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <Label htmlFor="pickup" className="sr-only">{t('home.pickupLabel')}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={(ref) => pickupAutocompleteRef.current = ref}
                        onPlaceChanged={() => onPlaceChanged('pickup')}
                        options={{ fields: ["formatted_address", "geometry.location", "name", "place_id"], componentRestrictions: { country: "fr" } }}
                      >
                        <Input type="text" id="pickup" placeholder={t('home.pickupPlaceholder')} value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="pl-10 py-3 h-12 text-base bg-input border-border focus:ring-ring text-foreground" required />
                      </Autocomplete>
                    ) : (
                      <Input type="text" id="pickup" placeholder={t('home.pickupPlaceholder')} value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="pl-10 py-3 h-12 text-base bg-input border-border focus:ring-ring text-foreground" required />
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="destination" className="sr-only">{t('home.destinationLabel')}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={(ref) => dropoffAutocompleteRef.current = ref}
                        onPlaceChanged={() => onPlaceChanged('dropoff')}
                        options={{ fields: ["formatted_address", "geometry.location", "name", "place_id"], componentRestrictions: { country: "fr" } }}
                      >
                        <Input type="text" id="destination" placeholder={t('home.destinationPlaceholder')} value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} className="pl-10 py-3 h-12 text-base bg-input border-border focus:ring-ring text-foreground" required />
                      </Autocomplete>
                    ) : (
                      <Input type="text" id="destination" placeholder={t('home.destinationPlaceholder')} value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} className="pl-10 py-3 h-12 text-base bg-input border-border focus:ring-ring text-foreground" required />
                    )}
                  </div>
                </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">{t('home.passengerOptions.title')}</Label>
              <RadioGroup value={bookingFor} onValueChange={setBookingFor} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="me" id="heroForMe" />
                  <Label htmlFor="heroForMe">{t('home.passengerOptions.forMe')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="heroForOther" />
                  <Label htmlFor="heroForOther">{t('home.passengerOptions.forOther')}</Label>
                </div>
              </RadioGroup>
            </div>

            <AnimatePresence>
              {bookingFor === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-muted p-4 rounded-lg border"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="passengerFirstName">{t('home.otherPassengerDetails.firstName')}</Label>
                        <Input id="passengerFirstName" value={passengerDetails.firstName} onChange={(e) => handlePassengerChange('firstName', e.target.value)} placeholder={t('common.firstName')} required={bookingFor === 'other'} className="h-10"/>
                      </div>
                      <div>
                        <Label htmlFor="passengerLastName">{t('home.otherPassengerDetails.lastName')}</Label>
                        <Input id="passengerLastName" value={passengerDetails.lastName} onChange={(e) => handlePassengerChange('lastName', e.target.value)} placeholder={t('common.lastName')} required={bookingFor === 'other'} className="h-10"/>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="passengerPhone">{t('home.otherPassengerDetails.phone')}</Label>
                      <Input id="passengerPhone" type="tel" value={passengerDetails.phone} onChange={(e) => handlePassengerChange('phone', e.target.value)} placeholder="0612345678" required={bookingFor === 'other'} className="h-10"/>
                      <p className="text-xs text-muted-foreground mt-1">{t('home.otherPassengerDetails.phoneDisclaimer')}</p>
                    </div>
                     <div className="flex items-start space-x-2 p-2 bg-yellow-100/60 rounded-lg border border-yellow-200/80">
                         <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-800">{t('home.otherPassengerDetails.warning')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date" className="sr-only">{t('home.dateLabel')}</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="date" id="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="pl-10 py-3 h-12 text-base bg-input border-border focus:ring-ring text-foreground date-input" />
                </div>
              </div>
              <div>
                <Label htmlFor="time" className="sr-only">{t('home.timeLabel')}</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="time" id="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="pl-10 py-3 h-12 text-base bg-input border-border focus:ring-ring text-foreground time-input" />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full h-12 text-base">
                <Navigation className="mr-2 h-5 w-5" /> {t('home.bookNow')}
              </Button>
            </div>
          </form>
        </motion.div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('home.otherPassengerDetails.modalTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('home.otherPassengerDetails.modalDescription')}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-start space-x-3 py-4">
                    <Checkbox id="heroConsent" checked={isConsentChecked} onCheckedChange={setIsConsentChecked} />
                    <Label htmlFor="heroConsent" className="text-sm text-muted-foreground leading-normal">
                        {t('home.otherPassengerDetails.modalCheckboxLabel')}
                    </Label>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
                    <Button onClick={handleModalConfirm} disabled={!isConsentChecked}>{t('home.otherPassengerDetails.modalConfirmButton')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </motion.section>
  );
};

export default HeroSection;