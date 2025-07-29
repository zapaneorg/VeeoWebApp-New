import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, MapPin, HelpCircle, Send } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const ContactPage = () => {
  const { toast } = useToast();
  const { t } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [openAccordionItem, setOpenAccordionItem] = useState(null);
  const exampleImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/899b637d65f18cdded4d470f70515c72.webp";


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast({
        title: t('contact.formErrorTitle'),
        description: t('contact.formErrorMessage'),
        variant: "destructive",
      });
      return;
    }
    console.log({ name, email, subject, message });
    toast({
      title: t('contact.formSuccessTitle'),
      description: t('contact.formSuccessMessage'),
      variant: "success",
    });
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const faqItems = [
    { qKey: 'contact.faq1q', aKey: 'contact.faq1a' },
    { qKey: 'contact.faq2q', aKey: 'contact.faq2a' },
    { qKey: 'contact.faq3q', aKey: 'contact.faq3a' },
    { qKey: 'contact.faq4q', aKey: 'contact.faq4a' },
    { qKey: 'contact.faq5q', aKey: 'contact.faq5a' },
  ];

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 md:py-20 px-4 bg-background text-foreground"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-hero-title mb-4 text-primary">
          {t('contact.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('contact.subtitle', { appName: "Veeo Strasbourg" })}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card p-8 rounded-xl shadow-lg border border-border"
        >
          <h2 className="text-3xl font-bold mb-6 text-primary flex items-center">
            <Send className="h-7 w-7 mr-3 text-primary" /> {t('contact.formHeading')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-foreground">{t('contact.formNameLabel')}</Label>
              <Input id="name" type="text" placeholder={t('contact.formNamePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-input border-border focus:ring-ring text-foreground" />
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground">{t('contact.formEmailLabel')}</Label>
              <Input id="email" type="email" placeholder={t('contact.formEmailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 bg-input border-border focus:ring-ring text-foreground" />
            </div>
            <div>
              <Label htmlFor="subject" className="text-foreground">{t('contact.formSubjectLabel')}</Label>
              <Input id="subject" type="text" placeholder={t('contact.formSubjectPlaceholder')} value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 bg-input border-border focus:ring-ring text-foreground" />
            </div>
            <div>
              <Label htmlFor="message" className="text-foreground">{t('contact.formMessageLabel')}</Label>
              <Textarea id="message" placeholder={t('contact.formMessagePlaceholder')} value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="mt-1 bg-input border-border focus:ring-ring text-foreground" />
            </div>
            <Button type="submit" variant="default" className="w-full py-3">
              {t('contact.formSubmitButton')}
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
            <h2 className="text-3xl font-bold mb-6 text-primary">{t('contact.infoHeading')}</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="flex items-start">
                <MapPin className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
                <span className="text-foreground">{t('contact.address', { city: "Strasbourg", postalCode: "67000" })}</span>
              </p>
              <p className="flex items-center">
                <Phone className="h-6 w-6 mr-3 text-primary" />
                <a href={`tel:${t('contact.phoneLink')}`} className="text-foreground hover:text-primary transition-colors">{t('contact.phoneDisplay')}</a>
              </p>
              <p className="flex items-center">
                <Mail className="h-6 w-6 mr-3 text-primary" />
                <a href={`mailto:${t('contact.email', { domain: "veeo-strasbourg.fr" })}`} className="text-foreground hover:text-primary transition-colors">{t('contact.email', { domain: "veeo-strasbourg.fr" })}</a>
              </p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
            <img src={exampleImageUrl} alt={t('contact.mapAlt', { city: "Strasbourg" })} className="w-full h-48 object-cover rounded-lg mb-4" />
            <p className="text-muted-foreground text-sm">{t('contact.officeHours')}</p>
          </div>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-card p-8 md:p-12 rounded-xl shadow-2xl border border-border"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-primary flex items-center justify-center">
          <HelpCircle className="h-8 w-8 mr-3 text-primary" /> {t('contact.faqHeading')}
        </h2>
        <Accordion type="single" collapsible className="w-full" value={openAccordionItem} onValueChange={setOpenAccordionItem}>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-lg text-foreground hover:text-primary hover:no-underline data-[state=open]:text-primary data-[state=open]:font-semibold py-4 text-left group">
                {t(item.qKey)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 text-base data-[state=open]:text-foreground">
                {t(item.aKey)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.section>
    </motion.div>
  );
};

export default ContactPage;