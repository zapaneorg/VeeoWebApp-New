import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import { MessageSquare } from 'lucide-react';

const TestimonialsSection = () => {
  const { t } = useLocale();
  const exampleImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/899b637d65f18cdded4d470f70515c72.webp";

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
  };

  const testimonials = [
    { name: "Karim B.", quoteKey: "drivers.testimonial1Quote", city: "Strasbourg", imgUrl: exampleImageUrl, altText: "Portrait de Karim B., chauffeur VTC Veeo à Strasbourg" },
    { name: "Sophie L.", quoteKey: "drivers.testimonial2Quote", city: "Bas-Rhin", imgUrl: exampleImageUrl, altText: "Portrait de Sophie L., chauffeuse Veeo dans le Bas-Rhin" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-section-title text-center mb-12 md:mb-16 text-primary"
        >
          {t('drivers.testimonialsTitle')}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="initial"
              whileInView="animate"
              custom={index}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="p-6 bg-card border-border shadow-lg h-full flex flex-col rounded-lg">
                <MessageSquare className="h-8 w-8 text-primary mb-4" />
                <p className="text-muted-foreground italic flex-grow mb-4">"{t(testimonial.quoteKey)}"</p>
                <div className="flex items-center mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-secondary">
                    <img src={testimonial.imgUrl} alt={testimonial.altText} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-semibold text-card-foreground">{testimonial.name}</span>
                    <p className="text-sm text-primary">{testimonial.city}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;