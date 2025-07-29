import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { UserCheck } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLocale();

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 md:py-32 bg-card border-b border-border text-center">
      <div className="container mx-auto px-4">
        <UserCheck className="h-20 w-20 text-primary mx-auto mb-6" />
        <motion.h1 variants={itemVariants} className="text-hero-title mb-4 text-primary">
          {t('drivers.heroTitle', { appName: "Veeo" })}
        </motion.h1>
        <motion.p variants={itemVariants} transition={{ delay: 0.1 }} className="text-body-emphasis max-w-2xl mx-auto text-muted-foreground mb-8">
          {t('drivers.heroSubtitle', { city: "Strasbourg", region: "Bas-Rhin" })}
        </motion.p>
        <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
          <Button size="lg" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}>
            {t('drivers.applyButton')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;