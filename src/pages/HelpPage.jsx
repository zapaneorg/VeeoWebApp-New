import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Search, LifeBuoy, UserCircle, CalendarPlus, CreditCard, ShieldCheck, Smartphone, Users } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const HelpPage = () => {
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');

  const popularTopics = [
    { titleKey: 'help.accountManagement', icon: <UserCircle className="h-6 w-6 mr-3 text-primary" /> },
    { titleKey: 'help.bookingRides', icon: <CalendarPlus className="h-6 w-6 mr-3 text-primary" /> },
    { titleKey: 'help.paymentsBilling', icon: <CreditCard className="h-6 w-6 mr-3 text-primary" /> },
    { titleKey: 'help.safetySecurity', icon: <ShieldCheck className="h-6 w-6 mr-3 text-primary" /> },
    { titleKey: 'help.usingTheApp', icon: <Smartphone className="h-6 w-6 mr-3 text-primary" /> },
    { titleKey: 'help.driverInfo', icon: <Users className="h-6 w-6 mr-3 text-primary" /> },
  ];

  const faqs = [
    { qKey: 'help.q1', aKey: 'help.a1' },
    { qKey: 'help.q2', aKey: 'help.a2' },
    { qKey: 'help.q3', aKey: 'help.a3' },
    { qKey: 'help.q4', aKey: 'help.a4' },
    { qKey: 'help.q5', aKey: 'help.a5' },
    { qKey: 'help.q6', aKey: 'help.a6' },
  ];

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
    }),
  };
  
  const sectionVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } }
  };


  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="bg-background text-foreground"
    >
      <div className="container mx-auto py-12 md:py-20 px-4">
        <motion.section 
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          className="text-center mb-12 md:mb-16"
        >
          <LifeBuoy className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-hero-title mb-4 text-primary">
            {t('help.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('help.subtitle')}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          className="mb-12 md:mb-16 max-w-2xl mx-auto"
        >
          <div className="flex space-x-2">
            <Input
              type="search"
              placeholder={t('help.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-input border-border focus:ring-ring text-foreground"
            />
            <Button type="button" variant="default">
              <Search className="h-5 w-5 mr-2" /> {t('help.searchButton')}
            </Button>
          </div>
        </motion.section>

        <motion.section 
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          className="mb-12 md:mb-16"
        >
          <h2 className="text-section-title mb-8 text-primary text-center">
            {t('help.popularTopicsTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTopics.map((topic, index) => (
              <motion.div
                key={topic.titleKey}
                custom={index}
                variants={itemVariants}
                className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-border cursor-pointer"
              >
                <div className="flex items-center">
                  {React.cloneElement(topic.icon, { className: "h-6 w-6 mr-3 text-primary"})}
                  <span className="font-semibold text-card-foreground">{t(topic.titleKey)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          className="mb-12 md:mb-16"
        >
          <h2 className="text-section-title mb-8 text-primary text-center">
            {t('help.faqTitle')}
          </h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div key={faq.qKey} custom={index} variants={itemVariants}>
                <AccordionItem value={`item-${index}`} className="border-b border-border">
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-4 text-base">
                    {t(faq.qKey)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 pt-1 text-sm">
                    {t(faq.aKey)}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.section>

        <motion.section 
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          className="text-center py-10 bg-card rounded-lg shadow-md border border-border"
        >
          <h3 className="text-xl font-semibold mb-3 text-primary">{t('help.stillNeedHelp')}</h3>
          <Link to="/contact">
            <Button variant="default">
              {t('help.contactSupport')}
            </Button>
          </Link>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default HelpPage;