import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, KeyRound, UserPlus, Database, Search, Edit3, Save, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StepCard = ({ icon, title, description, delay }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { delay } }
    }}
    className="flex items-start space-x-4"
  >
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

const AdminGuidePage = () => {
  const { t } = useLocale();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-background text-foreground"
    >
      <div className="container mx-auto max-w-4xl py-16 md:py-24 px-4">
        <header className="text-center mb-12 md:mb-16">
          <motion.div variants={{ hidden: { scale: 0.5 }, visible: { scale: 1 } }}>
            <KeyRound className="h-20 w-20 text-primary mx-auto mb-6" />
          </motion.div>
          <motion.h1 variants={{ hidden: { y: 20 }, visible: { y: 0 } }} className="text-4xl md:text-5xl font-black text-primary mb-4">
            {t('adminGuide.title')}
          </motion.h1>
          <motion.p variants={{ hidden: { y: 20 }, visible: { y: 0 } }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('adminGuide.intro')}
          </motion.p>
        </header>

        <Card className="bg-card border-border shadow-lg">
          <CardContent className="p-6 md:p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-8"
            >
              <StepCard
                icon={<UserPlus className="h-8 w-8 text-primary" />}
                title={t('adminGuide.step1_title')}
                description={t('adminGuide.step1_desc')}
                delay={0.1}
              />
              <div>
                <StepCard
                  icon={<Database className="h-8 w-8 text-primary" />}
                  title={t('adminGuide.step2_title')}
                  description={t('adminGuide.step2_desc')}
                  delay={0.2}
                />
                <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.25 } } }} className="pl-12 mt-3">
                  <Button asChild>
                    <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                      {t('adminGuide.step2_button')} <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </motion.div>
              </div>
              <StepCard
                icon={<Search className="h-8 w-8 text-primary" />}
                title={t('adminGuide.step3_title')}
                description={t('adminGuide.step3_desc')}
                delay={0.3}
              />
              <StepCard
                icon={<Edit3 className="h-8 w-8 text-primary" />}
                title={t('adminGuide.step4_title')}
                description={t('adminGuide.step4_desc')}
                delay={0.4}
              />
              <StepCard
                icon={<KeyRound className="h-8 w-8 text-primary" />}
                title={t('adminGuide.step5_title')}
                description={t('adminGuide.step5_desc')}
                delay={0.5}
              />
              <StepCard
                icon={<Save className="h-8 w-8 text-primary" />}
                title={t('adminGuide.step6_title')}
                description={t('adminGuide.step6_desc')}
                delay={0.6}
              />
            </motion.div>
          </CardContent>
        </Card>

        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.8 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12"
        >
          <Card className="bg-primary/5 border-primary/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <CardTitle className="text-primary text-2xl">{t('adminGuide.whats_next_title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">{t('adminGuide.whats_next_desc')}</p>
              <div className="bg-background/50 p-3 rounded-lg flex items-center justify-between font-mono text-sm">
                <span className="text-primary">{t('adminGuide.admin_dashboard_path')}</span>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin-login">
                    Y aller maintenant <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                <strong>Note :</strong> {t('adminGuide.important_note')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminGuidePage;