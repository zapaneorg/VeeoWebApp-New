import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase, CalendarHeart, Plane, Building, ShieldCheck, Star, ArrowRight, Sparkles, Train } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const ServicesPage = () => {
  const { t } = useLocale();
  const exampleImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/899b637d65f18cdded4d470f70515c72.webp";
  const airportServiceImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/8634c06c0e6c90d663813d3d32bba032.png";
  const trainStationServiceImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/3e64e4927c0590c2550d297f7a6dcf3f.png";
  const businessTravelImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/ebfd4b25f0e0e0e79c0b3dee73d6f265.png";

  const services = [
    {
      id: 'airport',
      icon: <Plane className="h-10 w-10 text-primary" />,
      imgUrl: airportServiceImageUrl,
      imgAltTextKey: 'services.airportTransferAlt',
      titleKey: 'services.airportTransferTitle',
      descriptionKey: 'services.airportTransferDescription',
      detailsKey: 'services.airportTransferDetails'
    },
    {
      id: 'trainStation',
      icon: <Train className="h-10 w-10 text-primary" />,
      imgUrl: trainStationServiceImageUrl,
      imgAltTextKey: 'services.trainStationTransferAlt',
      titleKey: 'services.trainStationTransferTitle',
      descriptionKey: 'services.trainStationTransferDescription',
      detailsKey: 'services.trainStationTransferDetails'
    },
    {
      id: 'business',
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      imgUrl: businessTravelImageUrl,
      imgAltTextKey: 'services.businessTravelAlt',
      titleKey: 'services.businessTravelTitle',
      descriptionKey: 'services.businessTravelDescription',
      detailsKey: 'services.businessTravelDetails'
    },
    {
      id: 'events',
      icon: <CalendarHeart className="h-10 w-10 text-primary" />,
      imgUrl: exampleImageUrl,
      imgAltTextKey: 'services.specialEventsAlt',
      titleKey: 'services.specialEventsTitle',
      descriptionKey: 'services.specialEventsDescription',
      detailsKey: 'services.specialEventsDetails'
    },
    {
      id: 'city',
      icon: <Building className="h-10 w-10 text-primary" />,
      imgUrl: exampleImageUrl,
      imgAltTextKey: 'services.cityToursAlt',
      titleKey: 'services.cityToursTitle',
      descriptionKey: 'services.cityToursDescription',
      detailsKey: 'services.cityToursDetails'
    }
  ];

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const headerVariants = {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3 + services.length * 0.1, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="bg-background text-foreground"
    >
      <div className="py-12 md:py-20">
        <motion.div 
          variants={headerVariants}
          className="text-center mb-16 md:mb-24"
        >
          <Sparkles className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-hero-title mb-4 text-primary">
            {t('services.title', { appName: "Veeo" })}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle', { city: "Strasbourg", region: "Bas-Rhin" })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 md:mb-32">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index}
              variants={cardVariants}
              initial="initial" 
              whileInView="animate" 
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="h-full bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col overflow-hidden group">
                <div className="relative h-60 w-full overflow-hidden">
                  <img src={service.imgUrl} 
                    alt={t(service.imgAltTextKey, { city: "Strasbourg" })}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-primary-foreground">
                      {React.cloneElement(service.icon, { className: "h-8 w-8 mb-1 text-primary-foreground"})}
                      <CardTitle className="text-2xl text-primary-foreground">{t(service.titleKey)}</CardTitle>
                    </div>
                </div>
                <CardHeader className="pt-5 pb-2">
                   <CardDescription className="text-muted-foreground">{t(service.descriptionKey, { city: "Strasbourg" })}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow px-6 pb-6">
                  <ul className="space-y-2 text-sm text-muted-foreground mt-2">
                    {(t(service.detailsKey, { returnObjects: true, defaultValue: [] }) || []).map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <ShieldCheck className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Link to="/book">
                    <Button variant="default" className="w-full">
                      {t('services.bookButton')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.section 
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="py-16 md:py-24 bg-primary text-primary-foreground rounded-xl shadow-2xl"
        >
          <div className="container mx-auto px-6 text-center">
            <div className="inline-block p-3 bg-primary-foreground/10 rounded-full mb-6">
                <Star className="h-10 w-10 text-yellow-400" />
            </div>
            <h2 className="text-section-title mb-6 text-primary-foreground">
              {t('services.qualityCommitmentTitleStart')} <span className="opacity-80">{t('services.qualityCommitmentTitleBrand')}</span>
            </h2>
            <p className="text-primary-foreground/80 max-w-3xl mx-auto mb-8 text-base md:text-lg">
              {t('services.qualityCommitmentText', { appName: "Veeo", city: "Strasbourg" })}
            </p>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors px-8 py-3 rounded-lg">
                {t('services.learnMoreButton')}
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default ServicesPage;