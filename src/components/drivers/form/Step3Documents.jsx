import React from 'react';
import { motion } from 'framer-motion';
import { FileUp } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';

const Step3Documents = ({ files, setFiles }) => {
  const handleFileChange = (id, file) => {
    setFiles(prev => ({ ...prev, [id]: file }));
  };

  const docFields = [
    { id: "drivingLicenseFront", label: "Permis de conduire (recto)" },
    { id: "drivingLicenseBack", label: "Permis de conduire (verso)" },
    { id: "vtcCardFront", label: "Carte professionnelle VTC (recto)" },
    { id: "vtcCardBack", label: "Carte professionnelle VTC (verso)" },
    { id: "rcExploitation", label: "Attestation RC exploitation" },
    { id: "idCardFront", label: "Pièce d'identité (recto)" },
    { id: "idCardBack", label: "Pièce d'identité (verso)" },
    { id: "revtcAttestation", label: "Attestation REVTC" },
    { id: "kbisExtract", label: "Extrait KBIS ou Relevé SIRENE" },
    { id: "vehicleRegistrationFront", label: "Carte grise véhicule (recto)" },
    { id: "vehicleRegistrationBack", label: "Carte grise véhicule (verso)" },
    { id: "idPhoto", label: "Photo d'identité" },
  ];

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <motion.div key="step3" variants={itemVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <h3 className="text-xl font-bold text-center text-foreground flex items-center justify-center gap-2">
        <FileUp className="h-6 w-6 text-primary"/>Téléchargement des Documents
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {docFields.map(field => (
          <FileUpload
            key={field.id}
            id={field.id}
            label={field.label}
            onFileChange={handleFileChange}
            file={files[field.id]}
            required
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Step3Documents;