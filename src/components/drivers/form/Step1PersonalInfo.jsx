import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { UserCheck, Eye, EyeOff, Home, MapPin } from 'lucide-react';

const Step1PersonalInfo = ({ formData, setFormData }) => {
  const { t } = useLocale();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <motion.div key="step1" variants={itemVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <h3 className="text-xl font-bold text-center text-foreground flex items-center justify-center gap-2">
        <UserCheck className="h-6 w-6 text-primary"/>Informations personnelles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">{t('drivers.formFirstNameLabel')}</Label>
          <Input id="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1" required />
        </div>
        <div>
          <Label htmlFor="lastName">{t('drivers.formLastNameLabel')}</Label>
          <Input id="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1" required />
        </div>
      </div>
      <div>
        <Label htmlFor="email">{t('drivers.formEmailLabel')}</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1" required />
      </div>
      <div>
        <Label htmlFor="phone">{t('drivers.formPhoneLabel')}</Label>
        <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="mt-1" required />
      </div>
      <div>
        <Label htmlFor="city">{t('drivers.formCityLabel')}</Label>
        <Input id="city" value={formData.city} onChange={handleInputChange} className="mt-1" required />
      </div>
      <div>
        <Label htmlFor="streetAddress">{t('drivers.formStreetAddressLabel', {defaultValue: "Adresse (N° et rue)"})}</Label>
        <div className="relative mt-1">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input id="streetAddress" placeholder={t('drivers.formStreetAddressPlaceholder', {defaultValue: "Votre adresse complète"})} value={formData.streetAddress} onChange={handleInputChange} className="pl-10" required/>
        </div>
      </div>
      <div>
        <Label htmlFor="postalCode">{t('drivers.formPostalCodeLabel', {defaultValue: "Code Postal"})}</Label>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input id="postalCode" placeholder={t('drivers.formPostalCodePlaceholder', {defaultValue: "Ex: 67000"})} value={formData.postalCode} onChange={handleInputChange} className="pl-10" required />
        </div>
      </div>
      <div className="relative">
        <Label htmlFor="password">{t('login.passwordLabel')}</Label>
        <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} className="mt-1" required />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[2.3rem] text-muted-foreground">
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
      <div>
        <Label htmlFor="confirmPassword">{t('register.confirmPasswordLabel')}</Label>
        <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className="mt-1" required />
      </div>
    </motion.div>
  );
};

export default Step1PersonalInfo;