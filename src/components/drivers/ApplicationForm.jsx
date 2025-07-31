import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { Send, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Step1PersonalInfo from './form/Step1PersonalInfo';
import Step2VehicleInfo from './form/Step2VehicleInfo';
import Step3Documents from './form/Step3Documents';
import Step4Summary from './form/Step4Summary';
import { performDriverRegistration, uploadDriverDocument, updateUserProfile, updateDriverStatus } from '@/lib/authService';
import { useAuth } from '@/contexts/AuthContext';
import { validateDriverRegistration } from '@/lib/validation';
import { handleError } from '@/lib/errorHandler';

const ApplicationForm = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  
  const [step, setStep] = useState(1);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'Strasbourg',
    streetAddress: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    vehicleBrand: '',
    vehicleModel: '',
    licensePlate: '',
  });

  const [files, setFiles] = useState({
    drivingLicenseFront: null,
    drivingLicenseBack: null,
    vtcCardFront: null,
    vtcCardBack: null,
    rcExploitation: null,
    idCardFront: null,
    idCardBack: null,
    revtcAttestation: null,
    kbisExtract: null,
    vehicleRegistrationFront: null,
    vehicleRegistrationBack: null,
    idPhoto: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && session) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user, session]);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const nextStep = () => {
    scrollToForm();
    setStep(s => s + 1);
  };

  const prevStep = () => {
    scrollToForm();
    setStep(s => s - 1);
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, phone, city, password, confirmPassword, streetAddress, postalCode } = formData;
    if (!firstName || !lastName || !email || !phone || !city || !streetAddress || !postalCode) {
      toast({ title: t('drivers.formErrorTitle'), description: t('drivers.missingFieldsDesc'), variant: "destructive" });
      return false;
    }
    // Only validate password if user is not logged in
    if (!user) {
      if (!password || !confirmPassword) {
        toast({ title: t('drivers.formErrorTitle'), description: t('drivers.missingFieldsDesc'), variant: "destructive" });
        return false;
      }
      if (password !== confirmPassword) {
        toast({ title: t('drivers.formErrorTitle'), description: t('drivers.passwordMismatch'), variant: "destructive" });
        return false;
      }
      if (password.length < 8) {
        toast({ title: t('drivers.formErrorTitle'), description: t('drivers.passwordTooShort'), variant: "destructive" });
        return false;
      }
    }
    return true;
  };
  
  const validateStep2 = () => {
    const { vehicleBrand, vehicleModel, licensePlate } = formData;
    if (!vehicleBrand || !vehicleModel || !licensePlate) {
      toast({ title: t('drivers.formErrorTitle'), description: t('drivers.missingFieldsDesc'), variant: "destructive" });
      return false;
    }
    return true;
  };
  
  const validateStep3 = () => {
    for (const key in files) {
      if (files[key] === null) {
        toast({ title: t('drivers.formErrorTitle'), description: "Veuillez téléverser tous les documents requis.", variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!validateStep1() || !validateStep2() || !validateStep3()) return;
      
      // Enhanced validation
      validateDriverRegistration(formData);
    } catch (error) {
      handleError(error, 'Driver Registration Validation');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let userId;

      if (user && session) {
        // User is already logged in, update their profile to become a driver
        userId = user.id;
        const profileUpdates = {
          role: 'driver',
          status: 'pending_approval',
          city: formData.city,
          street_address: formData.streetAddress,
          postal_code: formData.postalCode,
          vehicle_model: `${formData.vehicleBrand} ${formData.vehicleModel}`,
          license_plate: formData.licensePlate,
        };
        const { error: profileError } = await updateUserProfile(userId, profileUpdates);
        if (profileError) {
          throw profileError;
        }
      } else {
        // New user registration
        const { data: authResponse, error: registrationError } = await performDriverRegistration(formData);
        if (registrationError || !authResponse.user) {
          throw registrationError || new Error("Échec de la création de l'utilisateur.");
        }
        userId = authResponse.user.id;
      }
  
      for (const [docType, file] of Object.entries(files)) {
        const { error: uploadError } = await uploadDriverDocument(userId, docType, file);
        if (uploadError) {
          console.error(`Error uploading ${docType}:`, uploadError);
          throw new Error(`Erreur lors du téléversement du document : ${docType}.`);
        }
      }

      toast({
        title: t('drivers.formSuccessTitle'),
        description: t('drivers.formSuccessMessage', { name: formData.firstName }),
        variant: "success",
      });

      navigate('/driver-pending-approval');

    } catch (error) {
      handleError(error, 'Driver Registration Submission');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1PersonalInfo formData={formData} setFormData={setFormData} isUserConnected={!!user} />;
      case 2:
        return <Step2VehicleInfo formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3Documents files={files} setFiles={setFiles} />;
      case 4:
        return <Step4Summary formData={formData} files={files} />;
      default:
        return null;
    }
  };

  return (
    <section id="application-form" ref={formRef} className="py-16 md:py-24 bg-card border-t border-border scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto p-8 bg-background rounded-xl shadow-2xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-section-title text-center mb-4 text-primary">
            {t('drivers.formTitle', { appName: "Veeo" })}
          </h2>
          <p className="text-center text-muted-foreground mb-8">Étape {step} sur 4</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-12 dark:bg-gray-700">
            <motion.div 
              className="bg-primary h-2 rounded-full" 
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <form onSubmit={handleSubmit} className="overflow-hidden relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
            
            <div className="flex justify-between mt-12">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
                </Button>
              )}
              {step < 4 && <div className="flex-grow"></div>}
              {step < 4 && (
                <Button type="button" onClick={() => {
                   if (step === 1 && !validateStep1()) return;
                   if (step === 2 && !validateStep2()) return;
                   if (step === 3 && !validateStep3()) return;
                   nextStep();
                }}>
                  Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {step === 4 && (
                <Button type="submit" variant="default" className="w-full py-3 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? "Envoi en cours..." : "Envoyer mon dossier"}
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ApplicationForm;