import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { ShieldCheck, Database, UserCog, FileText, Contact } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const { t } = useLocale();

  const sections = [
    { icon: <FileText className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'privacy.introductionTitle', contentKey: 'privacy.introductionContent' },
    { icon: <Database className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'privacy.dataCollectedTitle', contentKey: 'privacy.dataCollectedContent' },
    { icon: <UserCog className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'privacy.dataUsageTitle', contentKey: 'privacy.dataUsageContent' },
    { icon: <ShieldCheck className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'privacy.dataProtectionTitle', contentKey: 'privacy.dataProtectionContent' },
    { icon: <UserCog className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'privacy.userRightsTitle', contentKey: 'privacy.userRightsContent' },
    { icon: <FileText className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'privacy.cookiePolicyTitle', contentKey: 'privacy.cookiePolicyContent' },
    { icon: <FileText className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'privacy.policyChangesTitle', contentKey: 'privacy.policyChangesContent' },
    { icon: <Contact className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'privacy.contactUsTitle', contentKey: 'privacy.contactUsContent' },
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sectionVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="container mx-auto py-12 md:py-20 px-4 bg-background text-foreground"
    >
      <motion.div 
        variants={sectionVariants}
        className="text-center mb-12 md:mb-16"
      >
        <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-hero-title mb-3 text-primary">
          {t('privacy.mainTitle')}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t('privacy.lastUpdated')}
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-10">
        {sections.map((section, index) => (
          <motion.section
            key={section.titleKey}
            custom={index}
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-card p-6 md:p-8 rounded-lg shadow-md border border-border"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center text-primary">
              {section.icon}
              {t(section.titleKey)}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              {t(section.contentKey).split('\n\n').map((paragraph, pIndex) => (
                <p key={pIndex} className="text-foreground">{paragraph}</p>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
};

export default PrivacyPolicyPage;