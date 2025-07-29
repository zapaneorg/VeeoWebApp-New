import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import { fadeIn, cardHover } from './animations';

const NewsSection = ({ t, items, exampleNewsImageUrl, toast }) => {
  if (!items || items.length === 0) return null;
  return (
    <motion.section
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <motion.h2 variants={fadeIn} className="text-section-title text-center mb-4 text-primary flex items-center justify-center">
         <Newspaper className="mr-3 h-10 w-10" /> {t('home.newsSectionTitle')}
        </motion.h2>
        <motion.p variants={fadeIn} className="text-body-emphasis text-center mb-12 md:mb-16 max-w-xl mx-auto text-muted-foreground">
          {t('home.newsSectionSubtitle', {defaultValue: "Restez informé des dernières actualités et offres de Veeo."})}
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div key={index} variants={fadeIn} custom={index} whileHover={cardHover}>
              <Card className="overflow-hidden bg-card border-border shadow-md h-full flex flex-col">
                <img  
                  src={item.imageUrl || exampleNewsImageUrl} 
                  alt={item.imageAlt || "Image d'actualité Veeo"} 
                  className="w-full h-48 object-cover"
                 />
                <CardContent className="p-6 flex flex-col flex-grow">
                  <CardTitle className="text-xl text-card-foreground mb-2">{item.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mb-3">{item.date}</p>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{item.summary}</p>
                  <Button 
                    variant="link" 
                    className="p-0 self-start text-primary hover:text-primary/80"
                    onClick={() => toast({ title: "Bientôt disponible", description: "L'article complet sera bientôt disponible."})}
                  >
                    {t('home.newsReadMore')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default NewsSection;