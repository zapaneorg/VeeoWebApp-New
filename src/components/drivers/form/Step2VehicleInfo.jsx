import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car } from 'lucide-react';

const Step2VehicleInfo = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <motion.div key="step2" variants={itemVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <h3 className="text-xl font-bold text-center text-foreground flex items-center justify-center gap-2">
        <Car className="h-6 w-6 text-primary"/>Informations du Véhicule
      </h3>
      <div>
        <Label htmlFor="vehicleBrand">Marque du véhicule</Label>
        <Input id="vehicleBrand" value={formData.vehicleBrand} onChange={handleInputChange} className="mt-1" required />
      </div>
      <div>
        <Label htmlFor="vehicleModel">Modèle du véhicule</Label>
        <Input id="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} className="mt-1" required />
      </div>
      <div>
        <Label htmlFor="licensePlate">Immatriculation du véhicule</Label>
        <Input id="licensePlate" value={formData.licensePlate} onChange={handleInputChange} className="mt-1" required />
      </div>
    </motion.div>
  );
};

export default Step2VehicleInfo;