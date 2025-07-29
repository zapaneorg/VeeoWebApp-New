import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, KeyRound as UsersRound } from 'lucide-react';
import { fadeIn } from './animations';

const DriveWithVeeoSection = ({ t }) => (
  <motion.section
    variants={fadeIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="py-20 md:py-32 text-center"
  >
    <div className="container mx-auto px-4">
      <UsersRound className="h-16 w-16 text-primary mx-auto mb-6" />
      <motion.h2 variants={fadeIn} className="text-section-title mb-6 text-primary">
        {t('home.driveWithVeeoTitle', { city: "Strasbourg" })}
      </motion.h2>
      <motion.p variants={fadeIn} className="text-body-emphasis mb-10 max-w-xl mx-auto text-muted-foreground">
        {t('home.driveWithVeeoDesc', { city: "Strasbourg" })}
      </motion.p>
      <motion.div variants={fadeIn}>
        <Link to="/drivers">
          <Button size="lg" variant="default">
            {t('home.driveWithVeeoButton')} <Zap className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </motion.section>
);

export default DriveWithVeeoSection;