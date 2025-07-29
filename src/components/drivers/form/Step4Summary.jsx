import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Step4Summary = ({ formData, files }) => {
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
    <motion.div key="step4" variants={itemVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <h3 className="text-xl font-bold text-center text-foreground flex items-center justify-center gap-2">
        <CheckCircle className="h-6 w-6 text-primary"/>Récapitulatif et Soumission
      </h3>
      <div className="space-y-4 text-sm p-4 border rounded-lg bg-card/50">
        <p><strong>Nom:</strong> {formData.firstName} {formData.lastName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Téléphone:</strong> {formData.phone}</p>
        <p><strong>Adresse:</strong> {formData.streetAddress}, {formData.postalCode} {formData.city}</p>
        <p><strong>Véhicule:</strong> {formData.vehicleBrand} {formData.vehicleModel}</p>
        <p><strong>Immatriculation:</strong> {formData.licensePlate}</p>
        <p><strong>Documents:</strong> {Object.values(files).filter(f => f).length} / {docFields.length} téléversés</p>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        En cliquant sur "Envoyer mon dossier", vous confirmez que toutes les informations sont exactes.
      </p>
    </motion.div>
  );
};

export default Step4Summary;