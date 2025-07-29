import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Settings, VolumeX, Snowflake, MessageCircle, Car, Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const ProfileRidePreferences = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [preferences, setPreferences] = useState({
    silence: false,
    ac: false,
    discussion: false,
  });
  const [defaultVehicleType, setDefaultVehicleType] = useState('berline');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.ride_preferences) {
        setPreferences({
          silence: user.ride_preferences.silence || false,
          ac: user.ride_preferences.ac || false,
          discussion: user.ride_preferences.discussion || false,
        });
      }
      setDefaultVehicleType(user.default_vehicle_type || 'berline');
    }
  }, [user]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    const success = await updateUser({ 
      ride_preferences: preferences,
      default_vehicle_type: defaultVehicleType 
    });
    if (success) {
      toast({ title: t('profile.ridePrefs.saveSuccessTitle', {defaultValue: "Préférences sauvegardées"}), description: t('profile.ridePrefs.saveSuccessDesc', {defaultValue: "Vos choix ont été enregistrés."}), variant: "success" });
    } else {
      toast({ title: t('common.error'), description: t('profile.ridePrefs.saveErrorDesc', {defaultValue: "Impossible de sauvegarder les préférences."}), variant: "destructive" });
    }
    setIsLoading(false);
  };

  const preferenceItems = [
    { id: 'silence', labelKey: 'profile.ridePrefs.silence', icon: <VolumeX className="mr-2 h-5 w-5 text-primary" /> },
    { id: 'ac', labelKey: 'profile.ridePrefs.ac', icon: <Snowflake className="mr-2 h-5 w-5 text-primary" /> },
    { id: 'discussion', labelKey: 'profile.ridePrefs.discussion', icon: <MessageCircle className="mr-2 h-5 w-5 text-primary" /> },
  ];

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center"><Settings className="mr-2 h-6 w-6"/>{t('profile.ridePrefs.title', {defaultValue: "Préférences de course"})}</CardTitle>
        <CardDescription className="text-muted-foreground">{t('profile.ridePrefs.subtitle', {defaultValue: "Personnalisez votre expérience de voyage."})}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="defaultVehicleType" className="text-foreground block mb-2">{t('profile.ridePrefs.defaultVehicleLabel', {defaultValue: "Type de véhicule par défaut"})}</Label>
          <Select value={defaultVehicleType} onValueChange={setDefaultVehicleType}>
            <SelectTrigger id="defaultVehicleType" className="w-full bg-input border-border text-foreground focus:ring-primary">
              <Car className="inline h-4 w-4 mr-2 text-muted-foreground" /> <SelectValue placeholder={t('bookingForm.vehicleTypePlaceholder')} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-foreground">
              <SelectItem value="berline" className="hover:bg-accent focus:bg-accent">{t('vehicleTypes.berline')}</SelectItem>
              <SelectItem value="van" className="hover:bg-accent focus:bg-accent">{t('vehicleTypes.van')}</SelectItem>
              <SelectItem value="premium" className="hover:bg-accent focus:bg-accent">{t('vehicleTypes.premium')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {preferenceItems.map(item => (
          <div key={item.id} className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg border border-border">
            <Checkbox 
              id={item.id} 
              checked={preferences[item.id]} 
              onCheckedChange={(checked) => handlePreferenceChange(item.id, checked)}
              className="border-muted data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
            />
            {item.icon}
            <Label htmlFor={item.id} className="text-foreground font-medium cursor-pointer">{t(item.labelKey)}</Label>
          </div>
        ))}
        <Button onClick={handleSavePreferences} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('common.save')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileRidePreferences;