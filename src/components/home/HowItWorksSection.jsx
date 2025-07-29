import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from './animations';

const HowItWorksSection = ({ t, steps }) => (
  <motion.section
    variants={fadeIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="py-16 md:py-24 bg-card border-y border-border"
  >
    <div className="container mx-auto px-4">
      <motion.h2 variants={fadeIn} className="text-section-title text-center mb-12 md:mb-16 text-primary">
        {t('home.howItWorksTitle')}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, index) => (
          <motion.div key={index} variants={fadeIn} custom={index} className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-background rounded-full shadow-lg border border-border">
                {step.icon}
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-card-foreground">{t(step.titleKey)}</h3>
            <p className="text-muted-foreground">{t(step.descriptionKey)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default HowItWorksSection;