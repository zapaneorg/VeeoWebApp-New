import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Edit3, Loader2, Home, MapPin, Hash, Building } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const ProfileInfoForm = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    streetNumber: '',
    postalCode: '',
    department: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || user.displayName?.split(' ')[0] || '',
        lastName: user.last_name || user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
        streetAddress: user.street_address || '',
        streetNumber: user.street_number || '',
        postalCode: user.postal_code || '',
        department: user.department || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updatedUserData = { 
      first_name: formData.firstName, 
      last_name: formData.lastName, 
      email: formData.email, 
      phone: formData.phone,
      street_address: formData.streetAddress,
      street_number: formData.streetNumber,
      postal_code: formData.postalCode,
      department: formData.department,
    };
    
    const success = await updateUser(updatedUserData);
    if (success) {
      toast({
        title: t('profile.updateSuccessTitle'),
        description: t('profile.updateSuccessMessage'),
        variant: "success"
      });
    } else {
      toast({
        title: t('profile.updateErrorTitle'),
        description: t('profile.updateErrorMessage'),
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  if (!user) return null;
  const isLoading = authLoading || isSubmitting;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center"><Edit3 className="mr-2 h-6 w-6"/>{t('profile.editInfoTitle', {defaultValue: "Modifier mes informations"})}</CardTitle>
        <CardDescription className="text-muted-foreground">{t('profile.editInfoSubtitle', {defaultValue: "Mettez à jour vos informations personnelles."})}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" className="text-foreground">{t('profile.firstNameLabel')}</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="firstName" value={formData.firstName} onChange={handleChange} className="pl-10 bg-input border-border focus:ring-primary text-foreground" disabled={isLoading}/>
              </div>
            </div>
            <div>
              <Label htmlFor="lastName" className="text-foreground">{t('profile.lastNameLabel')}</Label>
                <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="lastName" value={formData.lastName} onChange={handleChange} className="pl-10 bg-input border-border focus:ring-primary text-foreground" disabled={isLoading}/>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-foreground">{t('profile.emailLabel', {defaultValue: "Email"})}</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="email" type="email" value={formData.email} onChange={handleChange} className="pl-10 bg-input border-border focus:ring-primary text-foreground" disabled={isLoading}/>
            </div>
          </div>
          <div>
            <Label htmlFor="phone" className="text-foreground">{t('profile.phoneLabel')}</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder={t('common.optional')} className="pl-10 bg-input border-border focus:ring-primary text-foreground" disabled={isLoading}/>
            </div>
          </div>

          <hr className="my-6 border-border"/>
          <h3 className="text-lg font-medium text-primary">{t('profile.addressSectionTitle', {defaultValue: "Adresse Postale"})}</h3>
          
          <div>
            <Label htmlFor="streetAddress" className="text-foreground">{t('profile.streetAddressLabel', {defaultValue: "Adresse (Rue)"})}</Label>
            <div className="relative mt-1">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder={t('profile.streetAddressPlaceholder', {defaultValue: "Ex: 123 Rue de Paris"})} className="pl-10 bg-input border-border focus:ring-primary text-foreground" disabled={isLoading}/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="streetNumber" className="text-foreground">{t('profile.streetNumberLabel', {defaultValue: "Numéro"})}</Label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="streetNumber" value={formData.streetNumber} onChange={handleChange} placeholder={t('profile.streetNumberPlaceholder', {defaultValue: "Ex: Bis, Ter..."})} className="pl-10 bg-input border-border focus:ring-primary text-foreground" disabled={isLoading}/>
              </div>
            </div>
            <div>
              <Label htmlFor="postalCode" className="text-foreground">{t('profile.postalCodeLabel', {defaultValue: "Code Postal"})}</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="postalCode" value={formData.postalCode} onChange={handleChange} placeholder={t('profile.postalCodePlaceholder', {defaultValue: "Ex: 75001"})} className="pl-10 bg-input border-border focus:ring-primary text-foreground" disabled={isLoading}/>
              </div>
            </div>
            <div>
              <Label htmlFor="department" className="text-foreground">{t('profile.departmentLabel', {defaultValue: "Département"})}</Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="department" value={formData.department} onChange={handleChange} placeholder={t('profile.departmentPlaceholder', {defaultValue: "Ex: Paris"})} className="pl-10 bg-input border-border focus:ring-primary text-foreground" disabled={isLoading}/>
              </div>
            </div>
          </div>

          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('profile.saveChangesButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoForm;