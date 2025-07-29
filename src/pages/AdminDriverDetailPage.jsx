import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchDriverProfile, fetchDriverDocuments, updateDriverStatus, updateDriverDocumentStatus } from '@/lib/authService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, User, Mail, Phone, MapPin, Home, Building, FileText, UserCheck, CheckCircle, XCircle, Eye, ThumbsUp, ThumbsDown, Clock, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/lib/supabaseClient';

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start py-3">
    <div className="flex-shrink-0 w-8 text-primary/80">{icon}</div>
    <div className="flex-grow">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold text-card-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);

const DocumentStatusIcon = ({ status }) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'pending_review':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const DocumentRow = ({ doc, onStatusChange }) => {
  const { t } = useLocale();
  const [isUpdating, setIsUpdating] = useState(null);
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async (newStatus) => {
    setIsUpdating(newStatus);
    await onStatusChange(doc.id, newStatus);
    setIsUpdating(null);
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-muted/30 rounded-lg gap-3 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <DocumentStatusIcon status={doc.status} />
        <span className="font-medium text-card-foreground">{t(`driver.documents.labels.${doc.document_type.replace(/([A-Z])/g, '_$1').toLowerCase()}`, { defaultValue: doc.document_type })}</span>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center">
        <Button variant="outline" size="sm" onClick={handleViewDocument} disabled={isUrlLoading || !doc.file_path} className="transition-transform hover:scale-105">
          {isUrlLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Eye className="h-4 w-4 mr-2" /> {t('admin.driverCard.viewDoc')}</>}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-green-500 hover:bg-green-100 hover:text-green-600 rounded-full transition-transform hover:scale-110"
          onClick={() => handleUpdate('verified')}
          disabled={isUpdating === 'verified'}
        >
          {isUpdating === 'verified' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-transform hover:scale-110"
          onClick={() => handleUpdate('rejected')}
          disabled={isUpdating === 'rejected'}
        >
          {isUpdating === 'rejected' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsDown className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

const AdminDriverDetailPage = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

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

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, documentsRes] = await Promise.all([
        fetchDriverProfile(driverId),
        fetchDriverDocuments(driverId)
      ]);

      if (profileRes.error) throw profileRes.error;
      setDriver(profileRes.data);

      if (documentsRes.error) throw documentsRes.error;
      
      const submittedDocs = documentsRes.data;
      const allDocs = documentTypes.map(dt => {
        const submitted = submittedDocs.find(d => d.document_type === dt.type);
        return submitted ? { ...dt, ...submitted } : { ...dt, status: 'missing', file_path: null, id: null };
      });

      setDocuments(allDocs.filter(doc => doc.status !== 'missing'));

    } catch (error) {
      toast({ title: t('admin.error.loadDriverTitle'), description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [driverId, toast, t, documentTypes]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDocumentStatusChange = async (documentId, newStatus) => {
    if (!documentId) return;
    const { data, error } = await updateDriverDocumentStatus(documentId, newStatus);
    if (error) {
      toast({ title: t('admin.error.docUpdateFailed'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('admin.success.docUpdateSuccess'), variant: 'success' });
      setDocuments(docs => docs.map(d => d.id === documentId ? {...d, ...data} : d));
    }
  };

  const handleActivateDriver = async () => {
    setIsActivating(true);
    const { error } = await updateDriverStatus(driverId, 'active');
    if (error) {
      toast({ title: t('admin.error.approveTitle'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('admin.success.approveTitle'), description: t('admin.success.approveDesc'), variant: 'success' });
      setDriver(prev => ({ ...prev, status: 'active' }));
    }
    setIsActivating(false);
  };

  const allDocumentsVerified = useMemo(() => {
    if (documents.length < documentTypes.length) return false;
    const verifiedDocs = new Set(documents.filter(d => d.status === 'verified').map(d => d.document_type));
    return documentTypes.every(type => verifiedDocs.has(type.type));
  }, [documents, documentTypes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-muted-foreground">{t('common.notFound', { item: 'Chauffeur' })}</p>
      </div>
    );
  }

  const statusInfo = {
    pending_approval: { text: t('admin.pendingStatus'), color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    active: { text: 'Actif', color: 'text-green-500', bgColor: 'bg-green-500/10' },
  }[driver.status] || { text: driver.status, color: 'text-muted-foreground', bgColor: 'bg-muted' };

  return (
    <div className="bg-muted/40 min-h-screen">
      <header className="bg-card/80 border-b border-border p-4 shadow-sm sticky top-0 z-10 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between">
          <Button asChild variant="ghost">
            <Link to="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('admin.driverCard.backToList')}
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-full max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-xl mb-6">
              <CardHeader className="bg-gradient-to-br from-primary/5 via-background to-background p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.05))]"></div>
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg z-10">
                  <AvatarImage src={driver.profile_pic_url} alt={`${driver.first_name} ${driver.last_name}`} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {driver.first_name?.charAt(0)}{driver.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 z-10">
                  <h1 className="text-3xl font-bold text-card-foreground">{driver.first_name} {driver.last_name}</h1>
                  <p className="text-muted-foreground">{driver.email}</p>
                  <div className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusInfo.color} ${statusInfo.bgColor}`}>
                    {statusInfo.text}
                  </div>
                </div>
                {driver.status === 'pending_approval' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="lg" disabled={!allDocumentsVerified} className="z-10 shadow-lg">
                        <UserCheck className="mr-2 h-5 w-5" />
                        {t('admin.activateButton')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('admin.confirmActivationTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('admin.confirmActivationDesc', { driverName: `${driver.first_name} ${driver.last_name}` })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleActivateDriver} disabled={isActivating}>
                          {isActivating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          {t('admin.confirmActivationButton')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2"><User />{t('admin.driverCard.contactInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border">
                  <InfoRow icon={<Mail />} label="Email" value={driver.email} />
                  <InfoRow icon={<Phone />} label="Téléphone" value={driver.phone} />
                  <InfoRow icon={<Home />} label="Adresse" value={driver.street_address} />
                  <InfoRow icon={<Building />} label="Ville" value={driver.city} />
                  <InfoRow icon={<MapPin />} label="Code Postal" value={driver.postal_code} />
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2"><Car />{t('driver.profile.vehicleInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border">
                  <InfoRow icon={<Car />} label={t('driver.profile.vehicleModel')} value={driver.vehicle_model} />
                  <InfoRow icon={<FileText />} label={t('driver.profile.licensePlate')} value={driver.license_plate} />
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2"><FileText />{t('admin.driverCard.documents')}</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map(doc => (
                      <DocumentRow key={doc.id} doc={doc} onStatusChange={handleDocumentStatusChange} />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-muted/30 rounded-lg border border-dashed border-border">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t('admin.driverCard.noDocuments')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDriverDetailPage;