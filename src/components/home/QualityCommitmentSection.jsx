import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { fadeIn } from './animations';

const QualityCommitmentSection = ({ t }) => (
  <motion.section
    variants={fadeIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="py-16 md:py-24 bg-primary text-primary-foreground"
  >
    <div className="container mx-auto px-4 text-center">
      <Info className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
      <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl font-bold mb-6">
        {t('services.qualityCommitmentTitleStart')} <span className="opacity-80">{t('services.qualityCommitmentTitleBrand')}</span>
      </motion.h2>
      <motion.p variants={fadeIn} className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-primary-foreground/80">
        {t('services.qualityCommitmentText', { city: "Strasbourg" })}
      </motion.p>
      <motion.div variants={fadeIn}>
        <Link to="/about">
          <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            {t('services.learnMoreButton')}
          </Button>
        </Link>
      </motion.div>
    </div>
  </motion.section>
);

export default QualityCommitmentSection;