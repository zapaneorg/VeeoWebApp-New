import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen as BookOpenIcon, ShieldCheck, HelpCircle, MessageSquare, FileText, Video, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DriverResourcesPage = () => {
  const { t } = useLocale();
  const { toast } = useToast();

  const resources = [
    {
      id: 'driver-guide',
      icon: <BookOpenIcon className="h-10 w-10 text-primary" />,
      titleKey: 'driverResources.guideTitle',
      descriptionKey: 'driverResources.guideDesc',
      linkTextKey: 'driverResources.guideLinkText',
      contentKey: 'driverResources.guideContent',
    },
    {
      id: 'safety-protocols',
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      titleKey: 'driverResources.safetyTitle',
      descriptionKey: 'driverResources.safetyDesc',
      linkTextKey: 'driverResources.safetyLinkText',
      contentKey: 'driverResources.safetyContent',
    },
    {
      id: 'faq-drivers',
      icon: <HelpCircle className="h-10 w-10 text-primary" />,
      titleKey: 'driverResources.faqTitle',
      descriptionKey: 'driverResources.faqDesc',
      link: '/help?category=drivers',
      linkTextKey: 'driverResources.faqLinkText',
      externalLink: true,
    },
    {
      id: 'driver-support',
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      titleKey: 'driverResources.supportTitle',
      descriptionKey: 'driverResources.supportDesc',
      link: '/contact?reason=driver_support',
      linkTextKey: 'driverResources.supportLinkText',
      externalLink: true,
    },
    {
      id: 'document-center',
      icon: <FileText className="h-10 w-10 text-primary" />,
      titleKey: 'driverResources.docsTitle',
      descriptionKey: 'driverResources.docsDesc',
      linkTextKey: 'driverResources.docsLinkText',
      contentKey: 'driverResources.docsContent',
    },
    {
      id: 'video-tutorials',
      icon: <Video className="h-10 w-10 text-primary" />,
      titleKey: 'driverResources.tutorialsTitle',
      descriptionKey: 'driverResources.tutorialsDesc',
      linkTextKey: 'driverResources.tutorialsLinkText',
      contentKey: 'driverResources.tutorialsContent',
    },
     {
      id: 'community-forum',
      icon: <Users className="h-10 w-10 text-primary" />,
      titleKey: 'driverResources.communityTitle',
      descriptionKey: 'driverResources.communityDesc',
      linkTextKey: 'driverResources.communityLinkText',
      contentKey: 'driverResources.communityContent',
    },
    {
      id: 'earnings-tips',
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      titleKey: 'driverResources.earningsTitle',
      descriptionKey: 'driverResources.earningsDesc',
      linkTextKey: 'driverResources.earningsLinkText',
      contentKey: 'driverResources.earningsContent',
    },
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95, y: 30 },
    animate: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };
  
  const renderVideoTutorials = (content) => {
    return (
      <div className="space-y-6 text-left">
        {content.introduction && <p className="text-muted-foreground whitespace-pre-line mb-4">{content.introduction}</p>}
        {content.sections && content.sections.map((section, idx) => (
          <div key={idx} className="pt-2">
            <h4 className="font-semibold text-card-foreground mb-2 text-lg">{section.title}</h4>
            <p className="text-muted-foreground whitespace-pre-line mb-4">{section.text}</p>
            {section.videos && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.videos.map((video, vIdx) => (
                  <motion.div 
                    key={vIdx} 
                    className="aspect-video rounded-lg overflow-hidden shadow-md border border-border"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </motion.div>
                ))}
              </div>
            )}
             {section.points && (
              <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-muted-foreground">
                {section.points.map((point, pIdx) => <li key={pIdx}>{point}</li>)}
              </ul>
            )}
          </div>
        ))}
        {content.conclusion && <p className="mt-4 text-muted-foreground whitespace-pre-line">{content.conclusion}</p>}
      </div>
    );
  };


  const renderContent = (contentKey, resourceId) => {
    const content = t(contentKey, { returnObjects: true, defaultValue: {} });

    if (resourceId === 'video-tutorials') {
      return renderVideoTutorials(content);
    }

    if (typeof content === 'string') {
      return <p className="text-muted-foreground whitespace-pre-line">{content}</p>;
    }
    return (
      <div className="space-y-3 text-left">
        {content.introduction && <p className="text-muted-foreground whitespace-pre-line">{content.introduction}</p>}
        {content.sections && content.sections.map((section, idx) => (
          <div key={idx} className="pt-2">
            <h4 className="font-semibold text-card-foreground mb-1">{section.title}</h4>
            <p className="text-muted-foreground whitespace-pre-line">{section.text}</p>
            {section.points && (
              <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-muted-foreground">
                {section.points.map((point, pIdx) => <li key={pIdx}>{point}</li>)}
              </ul>
            )}
          </div>
        ))}
        {content.conclusion && <p className="mt-3 text-muted-foreground whitespace-pre-line">{content.conclusion}</p>}
      </div>
    );
  };


  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="bg-background text-foreground"
    >
      <div className="container mx-auto py-12 md:py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 md:mb-24"
        >
          <BookOpenIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-hero-title mb-4 text-primary">
            {t('driverResources.pageTitle')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('driverResources.pageSubtitle')}
          </p>
        </motion.div>

        <Accordion type="multiple" className="w-full space-y-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              custom={index}
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col overflow-hidden group">
                <AccordionItem value={resource.id} className="border-b-0">
                  <AccordionTrigger className="hover:no-underline p-0 text-left w-full">
                    <CardHeader className="flex flex-row items-center justify-between pt-6 pb-4 px-6 w-full">
                      <div className="flex items-center">
                        <div className="mr-4 p-2 bg-primary/10 rounded-lg">
                          {React.cloneElement(resource.icon, {className: "h-8 w-8 text-primary"})}
                        </div>
                        <CardTitle className="text-xl text-card-foreground group-hover:text-primary transition-colors">{t(resource.titleKey)}</CardTitle>
                      </div>
                    </CardHeader>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="px-6 pb-6">
                      <CardDescription className="text-muted-foreground mb-6 text-base text-left">
                        {t(resource.descriptionKey)}
                      </CardDescription>
                      {resource.contentKey && (
                        <div className="my-6 p-4 bg-background rounded-md border border-border">
                          {renderContent(resource.contentKey, resource.id)}
                        </div>
                      )}
                      {resource.externalLink ? (
                        <Link to={resource.link}>
                          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                            {t(resource.linkTextKey)}
                          </Button>
                        </Link>
                      ) : (
                        !resource.contentKey && (
                           <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => {
                            toast({ title: "Contenu à venir", description: "Cette section sera bientôt disponible."})
                           }}>
                            {t(resource.linkTextKey)}
                          </Button>
                        )
                      )}
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            </motion.div>
          ))}
        </Accordion>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 md:mt-32 text-center p-8 md:p-12 bg-primary/5 rounded-xl border border-primary/20"
        >
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">{t('driverResources.needHelpTitle')}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{t('driverResources.needHelpDesc')}</p>
          <Link to="/contact?reason=driver_urgent_support">
            <Button size="lg" className="bg-amber-500 text-white hover:bg-amber-600">
              {t('driverResources.contactSupportButton')}
            </Button>
          </Link>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default DriverResourcesPage;