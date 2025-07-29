import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { UserCheck } from 'lucide-react';
import HeroSection from '@/components/drivers/HeroSection';
import BenefitsSection from '@/components/drivers/BenefitsSection';
import RequirementsSection from '@/components/drivers/RequirementsSection';
import TestimonialsSection from '@/components/drivers/TestimonialsSection';
import ApplicationForm from '@/components/drivers/ApplicationForm';

const DriversPage = () => {
  const { t } = useLocale();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="bg-background text-foreground"
    >
      <HeroSection />
      <BenefitsSection />
      <RequirementsSection />
      <TestimonialsSection />
      <ApplicationForm />
    </motion.div>
  );
};

export default DriversPage;