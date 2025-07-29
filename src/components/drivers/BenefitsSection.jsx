import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { DollarSign, CalendarDays, Users, ShieldCheck } from 'lucide-react';

const BenefitsSection = () => {
  const { t } = useLocale();

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
  };

  const benefits = [
    { icon: <DollarSign className="h-8 w-8 text-primary" />, titleKey: "drivers.benefitIncomeTitle", descriptionKey: "drivers.benefitIncomeDesc" },
    { icon: <CalendarDays className="h-8 w-8 text-primary" />, titleKey: "drivers.benefitFlexibilityTitle", descriptionKey: "drivers.benefitFlexibilityDesc" },
    { icon: <Users className="h-8 w-8 text-primary" />, titleKey: "drivers.benefitCommunityTitle", descriptionKey: "drivers.benefitCommunityDesc" },
    { icon: <ShieldCheck className="h-8 w-8 text-primary" />, titleKey: "drivers.benefitSupportTitle", descriptionKey: "drivers.benefitSupportDesc" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-section-title text-center mb-12 md:mb-16 text-primary"
        >
          {t('drivers.benefitsTitle', { appName: "Veeo" })}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="initial"
              whileInView="animate"
              custom={index}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="text-center p-6 h-full bg-card border-border shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg">
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl mb-2 text-card-foreground font-semibold">{t(benefit.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(benefit.descriptionKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;