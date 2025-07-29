import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Navigation, CheckCircle, HeartHandshake, MapPin, Clock } from 'lucide-react';

import { useLocale } from '@/contexts/LocaleContext.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import { supabase } from '@/lib/supabaseClient';

import HeroSection from '@/components/home/HeroSection';
import WhyVeeoSection from '@/components/home/WhyVeeoSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import QualityCommitmentSection from '@/components/home/QualityCommitmentSection';
import FleetSection from '@/components/home/FleetSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsSection from '@/components/home/NewsSection';
import DriveWithVeeoSection from '@/components/home/DriveWithVeeoSection';
import DriverDashboardMap from '@/components/driver/DriverDashboardMap';

const HomePage = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [availableDrivers, setAvailableDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, lat, lng, first_name, last_name, vehicle_model, phone, profile_pic_url, status')
        .eq('role', 'driver')
        .eq('status', 'active');
      
      if (error) {
        console.error("Error fetching drivers for homepage map", error);
        toast({ title: "Erreur de chargement", description: "Impossible de récupérer les chauffeurs disponibles. " + error.message, variant: "destructive" });
      } else {
        setAvailableDrivers(data || []);
      }
    };
    fetchDrivers();

    const driversSubscription = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: 'role=eq.driver' }, (payload) => {
        fetchDrivers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(driversSubscription);
    };
  }, [toast]);
  
  const exampleImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/899b637d65f18cdded4d470f70515c72.webp";
  const exampleNewsImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/899b637d65f18cdded4d470f70515c72.webp";

  const whyVeeoFeatures = [
    { icon: <MapPin className="h-8 w-8 text-primary" />, titleKey: "home.featureLocationTitle", descriptionKey: "home.featureLocationDescription" },
    { icon: <Clock className="h-8 w-8 text-primary" />, titleKey: "home.featureAvailabilityTitle", descriptionKey: "home.featureAvailabilityDescription" },
    { icon: <ShieldCheck className="h-8 w-8 text-primary" />, titleKey: "home.featureSafetyTitle", descriptionKey: "home.featureSafetyDescription" },
    { icon: <HeartHandshake className="h-8 w-8 text-primary" />, titleKey: "home.featureCustomerServiceTitle", descriptionKey: "home.featureCustomerServiceDescription" },
  ];

  const howItWorksSteps = [
    { icon: <Navigation className="h-10 w-10 text-primary" />, titleKey: "home.howItWorksStep1Title", descriptionKey: "home.howItWorksStep1Desc" },
    { icon: <CheckCircle className="h-10 w-10 text-primary" />, titleKey: "home.howItWorksStep2Title", descriptionKey: "home.howItWorksStep2Desc" },
    { icon: <Users className="h-10 w-10 text-primary" />, titleKey: "home.howItWorksStep3Title", descriptionKey: "home.howItWorksStep3Desc" },
  ];
  
  const testimonials = t('home.testimonials', { returnObjects: true, defaultValue: [] });
  
  const newsItems = t('home.news', { returnObjects: true, defaultValue: [] });

  return (
    <div className="bg-background text-foreground">
      <div className="py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-center">
          <div className="lg:pr-8">
            <HeroSection t={t} navigate={navigate} toast={toast} />
          </div>
          <div className="lg:h-[600px] h-[400px] rounded-lg overflow-hidden shadow-xl border border-border">
            <DriverDashboardMap drivers={availableDrivers} rides={[]} isHomePage={true} />
          </div>
        </div>
      </div>
      <WhyVeeoSection t={t} features={whyVeeoFeatures} />
      <HowItWorksSection t={t} steps={howItWorksSteps} />
      <QualityCommitmentSection t={t} />
      <FleetSection t={t} />
      <TestimonialsSection t={t} items={testimonials} exampleImageUrl={exampleImageUrl} />
      <NewsSection t={t} items={newsItems} exampleNewsImageUrl={exampleNewsImageUrl} toast={toast} />
      <DriveWithVeeoSection t={t} />
    </div>
  );
};

export default HomePage;