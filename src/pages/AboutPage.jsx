import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Users, Target, Award, HeartHandshake, Rocket } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const AboutPage = () => {
  const { t } = useLocale();
  const missionImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/3e8f50329e305c9940a45d4f5657677b.png";
  const visionImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/7ed86049f94cd03536ca2fd5d714bc56.png";
  const exampleTeamMemberImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/899b637d65f18cdded4d470f70515c72.webp";


  const values = [
    { icon: <ShieldCheck className="h-8 w-8 text-primary" />, titleKey: "about.valueSafetyTitle", descriptionKey: "about.valueSafetyDesc" },
    { icon: <Award className="h-8 w-8 text-primary" />, titleKey: "about.valueQualityTitle", descriptionKey: "about.valueQualityDesc" },
    { icon: <Zap className="h-8 w-8 text-primary" />, titleKey: "about.valueReliabilityTitle", descriptionKey: "about.valueReliabilityDesc" },
    { icon: <Target className="h-8 w-8 text-primary" />, titleKey: "about.valueInnovationTitle", descriptionKey: "about.valueInnovationDesc" },
    { icon: <HeartHandshake className="h-8 w-8 text-primary" />, titleKey: "about.valueRespectTitle", descriptionKey: "about.valueRespectDesc" },
  ];

  const teamMembers = [
    { name: "Alice Dupont", role: "CEO & Co-fondatrice Veeo Strasbourg", imgUrl: exampleTeamMemberImageUrl, altText: "Alice Dupont, CEO Veeo - VTC Strasbourg"},
    { name: "Marc Petit", role: "CTO & Co-fondateur Veeo Strasbourg", imgUrl: exampleTeamMemberImageUrl, altText: "Marc Petit, CTO Veeo - Chauffeur privé Strasbourg"},
    { name: "Sophie Martin", role: "Responsable Opérations Bas-Rhin", imgUrl: exampleTeamMemberImageUrl, altText: "Sophie Martin, Ops Veeo - Transport Bas-Rhin"},
  ];

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
  };
  
  const cardHover = {
    scale: 1.03,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.05)",
    transition: { type: "spring", stiffness: 300 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="bg-background text-foreground"
    >
      <motion.section
        variants={sectionVariants}
        className="py-20 md:py-32 bg-card border-b border-border text-center"
      >
        <div className="container mx-auto px-4">
          <Rocket className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-hero-title mb-4 text-primary">{t('about.title', { appName: "Veeo Strasbourg" })}</h1>
          <p className="text-body-emphasis max-w-2xl mx-auto text-muted-foreground">{t('about.subtitle', { city: "Strasbourg", region: "Bas-Rhin" })}</p>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img src={missionImageUrl}
              alt="Véhicule Veeo VTC sur une route côtière pittoresque, représentant notre mission d'excellence" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
          <div className="prose prose-lg max-w-none">
            <h2 className="text-section-title mb-6 text-primary">{t('about.missionTitle')}</h2>
            <p className="text-foreground">{t('about.missionText1', { appName: "Veeo", city: "Strasbourg" })}</p>
            <p className="text-foreground">{t('about.missionText2', { region: "Bas-Rhin" })}</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        custom={2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 md:py-24 bg-card border-y border-border"
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="prose prose-lg max-w-none md:order-2">
            <h2 className="text-section-title mb-6 text-primary">{t('about.visionTitle')}</h2>
            <p className="text-card-foreground">{t('about.visionText', { city: "Strasbourg", region: "Bas-Rhin" })}</p>
          </div>
          <div className="md:order-1">
            <img src={visionImageUrl}
              alt="Vue intérieure d'un véhicule Veeo VTC, symbolisant notre vision du transport moderne" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        custom={3}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-section-title text-center mb-12 md:mb-16 text-primary">{t('about.valuesTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                variants={sectionVariants} 
                custom={index * 0.5} 
                whileHover={cardHover}
              >
                <Card className="text-center p-6 md:p-8 h-full bg-card border-border shadow-md">
                  <div className="flex justify-center mb-5">{value.icon}</div>
                  <CardTitle className="text-xl mb-3 text-card-foreground">{t(value.titleKey)}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t(value.descriptionKey)}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        custom={4}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-16 md:py-24 bg-card border-y border-border"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-section-title text-center mb-4 text-primary">{t('about.teamTitle')}</h2>
          <p className="text-body-emphasis text-center mb-12 md:mb-16 max-w-xl mx-auto text-muted-foreground">{t('about.teamText', { appName: "Veeo Strasbourg" })}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index} 
                variants={sectionVariants} 
                custom={index * 0.5} 
                whileHover={cardHover}
              >
                <Card className="text-center p-6 bg-background border-border shadow-lg h-full">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-5 border-2 border-primary bg-secondary">
                    <img src={member.imgUrl} alt={member.altText} className="w-full h-full object-cover" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        custom={5}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="py-20 md:py-32 text-center"
      >
        <div className="container mx-auto px-4">
          <Users className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-section-title mb-4 text-primary">{t('about.ctaTitle', { appName: "Veeo" })}</h2>
          <p className="text-body-emphasis mb-10 max-w-xl mx-auto text-muted-foreground">{t('about.ctaSubtitle')}</p>
          <Link to="/book">
            <Button size="lg" variant="default">
              {t('about.ctaButton')}
            </Button>
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AboutPage;