import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { CheckCircle } from 'lucide-react';

const RequirementsSection = () => {
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

  const requirements = [
    { textKey: "drivers.requirementAge" },
    { textKey: "drivers.requirementLicense" },
    { textKey: "drivers.requirementExperience" },
    { textKey: "drivers.requirementVehicle" },
    { textKey: "drivers.requirementBackgroundCheck" },
  ];

  return (
    <section className="py-16 md:py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-section-title text-center mb-12 text-primary"
        >
          {t('drivers.requirementsTitle')}
        </motion.h2>
        <div className="max-w-2xl mx-auto">
          <ul className="space-y-4">
            {requirements.map((req, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                initial="initial"
                whileInView="animate"
                custom={index}
                viewport={{ once: true, amount: 0.2 }}
                className="flex items-start p-4 bg-background rounded-lg shadow border border-border"
              >
                <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <span className="text-foreground">{t(req.textKey)}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;