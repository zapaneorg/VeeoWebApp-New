import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { fadeIn, cardHover } from './animations';

const fleetItems = [
    { 
      name: "Standard", 
      imgUrl: "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/08b6aca01e1e180fd48927bdcd15ba0f.jpg", 
      altText: "Véhicule Standard Veeo pour VTC à Strasbourg" 
    },
    { 
      name: "SUV", 
      imgUrl: "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/0890ea5626091e38d019510d8afb5554.jpg", 
      altText: "SUV Veeo pour transport confortable dans le Bas-Rhin" 
    },
    { 
      name: "Van", 
      imgUrl: "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/42bf6a622782ebc24c3e1642b03a5d6b.jpg", 
      altText: "Van Veeo pour groupes à Strasbourg" 
    },
    { 
      name: "Berline", 
      imgUrl: "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/cc29eb4033e5be7343916e3acb4ae22b.jpg", 
      altText: "Berline Veeo pour VTC premium à Strasbourg" 
    },
];

const FleetSection = ({ t }) => (
  <motion.section
    variants={fadeIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="py-16 md:py-24"
  >
    <div className="container mx-auto px-4">
      <motion.h2 variants={fadeIn} className="text-section-title text-center mb-4 text-primary">
        {t('home.ourFleetTitle')}
      </motion.h2>
      <motion.p variants={fadeIn} className="text-body-emphasis text-center mb-12 md:mb-16 max-w-xl mx-auto text-muted-foreground">
        {t('home.ourFleetDesc')}
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {fleetItems.map((item, index) => (
          <motion.div key={index} variants={fadeIn} custom={index} whileHover={cardHover}>
            <Card className="overflow-hidden bg-card border-border shadow-md h-full">
              <img src={item.imgUrl} alt={item.altText} className="w-full h-48 object-cover" />
              <CardContent className="p-6">
                <CardTitle className="text-xl text-card-foreground">{item.name}</CardTitle>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default FleetSection;