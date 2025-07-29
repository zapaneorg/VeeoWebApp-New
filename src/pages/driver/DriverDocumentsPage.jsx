import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, AlertCircle, XCircle, Clock, Upload, Loader2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { fetchDriverDocuments, uploadDriverDocument } from '@/lib/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const DocumentStatusIcon = ({ status }) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'pending_review':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
  }
};

const DocumentStatusText = ({ status }) => {
  const { t } = useLocale();
  const statusClasses = {
    verified: 'text-green-600',
    pending_review: 'text-yellow-600',
    rejected: 'text-red-600',
    missing: 'text-gray-500',
  };
  return <span className={statusClasses[status] || 'text-gray-500'}>{t(`driver.documents.status.${status || 'missing'}`)}</span>;
};

const DocumentItem = ({ doc, onUpload }) => {
  const { t } = useLocale();
  const [isUploading, setIsUploading] = useState(false);
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const fileInputRef = React.useRef(null);
  const { toast } = useToast();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await onUpload(doc.type, file);
    setIsUploading(false);
  };
  
  const handleViewDocument = async () => {
    if (!doc.file_path) {
      toast({ title: "Erreur", description: "Ce document n'a pas de chemin de fichier valide.", variant: "destructive" });
      return;
    }
    setIsUrlLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('driver-documents')
        .createSignedUrl(doc.file_path, 60);

      if (error) {
        throw error;
      }
      
      window.open(data.signedUrl, '_blank');
    } catch (error) {
       toast({ title: "Erreur de visualisation", description: `Impossible de générer le lien : ${error.message}`, variant: "destructive" });
    } finally {
      setIsUrlLoading(false);
    }
  };


  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors gap-4"
    >
      <div className="flex items-center gap-4">
        <FileText className="h-7 w-7 text-primary flex-shrink-0" />
        <div>
          <p className="font-semibold text-card-foreground">{doc.label}</p>
          <div className="flex items-center text-sm gap-1.5">
            <DocumentStatusIcon status={doc.status} />
            <DocumentStatusText status={doc.status} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg,image/png,application/pdf"
          disabled={isUploading}
        />
        {doc.file_path && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDocument}
            disabled={isUrlLoading}
          >
            {isUrlLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4 sm:mr-2" />}
            <span className="hidden sm:inline">{t('driver.documents.viewButton')}</span>
          </Button>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">
                {doc.status === 'missing' ? t('driver.documents.uploadButton') : t('driver.documents.replaceButton')}
              </span>
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const DriverDocumentsPage = () => {
  const { t } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const documentTypes = useMemo(() => [
    { type: 'drivingLicenseFront', label: t('driver.documents.labels.driving_license_front') },
    { type: 'drivingLicenseBack', label: t('driver.documents.labels.driving_license_back') },
    { type: 'vtcCardFront', label: t('driver.documents.labels.vtc_card_front') },
    { type: 'vtcCardBack', label: t('driver.documents.labels.vtc_card_back') },
    { type: 'rcExploitation', label: t('driver.documents.labels.rc_exploitation') },
    { type: 'idCardFront', label: t('driver.documents.labels.id_card_front') },
    { type: 'idCardBack', label: t('driver.documents.labels.id_card_back') },
    { type: 'revtcAttestation', label: t('driver.documents.labels.revtc_attestation') },
    { type: 'kbisExtract', label: t('driver.documents.labels.kbis_extract') },
    { type: 'vehicleRegistrationFront', label: t('driver.documents.labels.vehicle_registration_front') },
    { type: 'vehicleRegistrationBack', label: t('driver.documents.labels.vehicle_registration_back') },
    { type: 'idPhoto', label: t('driver.documents.labels.id_photo') },
  ], [t]);

  const loadDocuments = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await fetchDriverDocuments(user.id);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de charger les documents.", variant: "destructive" });
    } else {
      const docsMap = new Map(data.map(d => [d.document_type, d]));
      const allDocs = documentTypes.map(dt => ({
        ...dt,
        status: docsMap.get(dt.type)?.status || 'missing',
        file_path: docsMap.get(dt.type)?.file_path,
        id: docsMap.get(dt.type)?.id
      }));
      setDocuments(allDocs);
    }
    setIsLoading(false);
  }, [user, toast, documentTypes]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUpload = async (documentType, file) => {
    if (!user) return;
    const { data, error } = await uploadDriverDocument(user.id, documentType, file);
    if (error) {
      toast({ title: "Erreur d'upload", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Document téléversé avec succès.", variant: "success" });
      setDocuments(prevDocs =>
        prevDocs.map(doc =>
          doc.type === documentType ? { ...doc, status: data.status, file_path: data.file_path, id: data.id } : doc
        )
      );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('driver.documents.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('driver.documents.manageTitle')}</CardTitle>
          <CardDescription>{t('driver.documents.manageSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {documents.map((doc) => (
                  <DocumentItem key={doc.type} doc={doc} onUpload={handleUpload} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDocumentsPage;