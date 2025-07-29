import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, UploadCloud, User, Phone, Car, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import StarRating from '@/components/ui/StarRating';

const DriverProfilePage = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    vehicleModel: '',
    licensePlate: '',
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        vehicleModel: user.vehicle_model || '',
        licensePlate: user.license_plate || '',
      });
      setProfilePicPreview(user.profile_pic_url || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: t('profile.fileTooLargeTitle'), description: t('profile.fileTooLargeMessage'), variant: 'destructive' });
        return;
      }
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updates = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      vehicle_model: formData.vehicleModel,
      license_plate: formData.licensePlate,
    };

    if (profilePicFile) {
      updates.profile_pic_file = profilePicFile;
    }

    const success = await updateUser(updates);

    if (success) {
      toast({ title: t('profile.updateSuccessTitle'), description: t('profile.updateSuccessMessage'), variant: 'success' });
      setProfilePicFile(null);
    } else {
      toast({ title: t('profile.updateErrorTitle'), description: t('profile.updateErrorMessage'), variant: 'destructive' });
    }

    setIsSubmitting(false);
  };

  const isLoading = authLoading || isSubmitting;

  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('driver.profile.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('driver.profile.editTitle')}</CardTitle>
          <CardDescription>{t('driver.profile.editSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-2 border-primary/50 shadow-lg">
                  <AvatarImage src={profilePicPreview} />
                  <AvatarFallback className="text-3xl bg-primary/20 text-primary">
                    {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="profilePicInput" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                  <UploadCloud className="h-8 w-8 text-white" />
                </Label>
                <Input id="profilePicInput" type="file" className="hidden" onChange={handlePicChange} accept="image/*" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="mt-2">
                  <StarRating rating={user?.average_rating || 0} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">{t('profile.firstNameLabel')}</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="firstName" value={formData.firstName} onChange={handleChange} className="pl-10" disabled={isLoading} />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">{t('profile.lastNameLabel')}</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="lastName" value={formData.lastName} onChange={handleChange} className="pl-10" disabled={isLoading} />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">{t('profile.phoneLabel')}</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="pl-10" disabled={isLoading} />
                </div>
              </div>
            </div>

            <div className="border-t pt-8 space-y-6">
              <h3 className="text-lg font-semibold text-primary">{t('driver.profile.vehicleInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vehicleModel">{t('driver.profile.vehicleModel')}</Label>
                  <div className="relative mt-1">
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className="pl-10" disabled={isLoading} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="licensePlate">{t('driver.profile.licensePlate')}</Label>
                  <div className="relative mt-1">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="licensePlate" value={formData.licensePlate} onChange={handleChange} className="pl-10" disabled={isLoading} />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common.save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DriverProfilePage;