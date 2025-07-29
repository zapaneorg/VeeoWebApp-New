import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { FileText, Users, UserCheck, CreditCard, AlertCircle, Shield, Edit3, Contact, Gavel } from 'lucide-react';

const TermsPage = () => {
  const { t } = useLocale();

  const sections = [
    { icon: <FileText className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'terms.introductionTitle', contentKey: 'terms.introductionContent' },
    { icon: <Users className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'terms.servicesTitle', contentKey: 'terms.servicesContent' },
    { icon: <UserCheck className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'terms.userAccountTitle', contentKey: 'terms.userAccountContent' },
    { icon: <CreditCard className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'terms.paymentTitle', contentKey: 'terms.paymentContent' },
    { icon: <AlertCircle className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'terms.cancellationTitle', contentKey: 'terms.cancellationContent' },
    { icon: <Shield className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'terms.limitationTitle', contentKey: 'terms.limitationContent' },
    { icon: <Gavel className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'terms.governingLawTitle', contentKey: 'terms.governingLawContent' },
    { icon: <Edit3 className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'terms.changesTitle', contentKey: 'terms.changesContent' },
    { icon: <Contact className="h-6 w-6 mr-3 text-primary"/>, titleKey: 'terms.contactUsTitle', contentKey: 'terms.contactUsContent' },
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
        <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-hero-title mb-3 text-primary">
          {t('terms.mainTitle')}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t('terms.lastUpdated')}
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
         <motion.section
            custom={sections.length}
            variants={sectionVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-card p-6 md:p-8 rounded-lg shadow-md border border-border"
          >
            <p className="mt-6 text-sm text-muted-foreground">
              Ceci est un modèle de Conditions Générales d'Utilisation. Il est fortement recommandé de consulter un professionnel du droit pour rédiger des CGU adaptées à votre activité spécifique et conformes à la législation en vigueur.
            </p>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default TermsPage;