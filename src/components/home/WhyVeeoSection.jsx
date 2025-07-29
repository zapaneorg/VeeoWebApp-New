import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardTitle } from '@/components/ui/card';
import { fadeIn } from './animations';

const WhyVeeoSection = ({ t, features }) => (
  <motion.section
    variants={fadeIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="py-16 md:py-24"
  >
    <div className="container mx-auto px-4">
      <motion.h2 variants={fadeIn} className="text-section-title text-center mb-4 text-primary">
        {t('home.whyVeeo')}
      </motion.h2>
      <motion.p variants={fadeIn} className="text-body-emphasis text-center mb-12 md:mb-16 max-w-xl mx-auto text-muted-foreground">
        {t('home.featureIntro', { city: "Strasbourg" })}
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div key={index} variants={fadeIn} custom={index}>
            <Card className="text-center p-6 h-full bg-card border-border shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <CardTitle className="text-xl mb-2 text-card-foreground">{t(feature.titleKey)}</CardTitle>
              <p className="text-sm text-muted-foreground">{t(feature.descriptionKey)}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default WhyVeeoSection;