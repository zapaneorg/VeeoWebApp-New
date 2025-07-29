import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { fadeIn } from './animations';

const TestimonialsSection = ({ t, items, exampleImageUrl }) => (
  <motion.section
    variants={fadeIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="py-16 md:py-24 bg-card border-y border-border"
  >
    <div className="container mx-auto px-4">
      <motion.h2 variants={fadeIn} className="text-section-title text-center mb-12 md:mb-16 text-primary">
        {t('home.testimonialsTitle')}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((testimonial, index) => (
          <motion.div key={index} variants={fadeIn} custom={index}>
            <Card className="p-6 bg-background border-border shadow-lg h-full flex flex-col">
              <div className="flex-grow mb-4">
                <p className="text-muted-foreground italic">"{t(testimonial.quoteKey)}"</p>
              </div>
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-secondary">
                    <img src={testimonial.imgUrl || exampleImageUrl} alt={testimonial.altText} className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold text-foreground">{testimonial.name}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default TestimonialsSection;