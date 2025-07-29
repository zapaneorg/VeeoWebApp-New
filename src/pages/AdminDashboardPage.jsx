import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPendingDrivers, approveDriver, deleteDriver, performLogout } from '@/lib/authService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, UserCheck, ShieldCheck, Users, Mail, Phone, MapPin, Eye, LogOut, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const DriverCard = ({ driver, onApprove, onDelete, approvingId, deletingId }) => {
  const { t } = useLocale();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{ y: -5, scale: 1.03, boxShadow: '0px 15px 30px -5px rgba(0,0,0,0.15)' }}
      className="rounded-xl overflow-hidden"
    >
      <Card className="flex flex-col h-full bg-card border-border shadow-lg transition-all duration-300 hover:border-primary/50">
        <CardHeader className="bg-muted/20 p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarImage src={driver.profile_pic_url} alt={`${driver.first_name} ${driver.last_name}`} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {driver.first_name?.charAt(0)}{driver.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-bold text-card-foreground">{driver.first_name} {driver.last_name}</CardTitle>
              <CardDescription className="text-yellow-500 font-semibold text-xs uppercase tracking-wider">{t('admin.pendingStatus')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 space-y-3 text-sm">
          <div className="flex items-center text-muted-foreground gap-3">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{driver.email}</span>
          </div>
          <div className="flex items-center text-muted-foreground gap-3">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{driver.phone || t('common.notProvided')}</span>
          </div>
          <div className="flex items-center text-muted-foreground gap-3">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{driver.city || t('common.notProvided')}</span>
          </div>
        </CardContent>
        <div className="p-4 pt-0 mt-auto flex flex-col gap-2">
           <Button asChild variant="outline" className="w-full">
            <Link to={`/admin/driver/${driver.id}`}>
              <Eye className="mr-2 h-4 w-4" /> {t('admin.viewDetailsButton')}
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              className="w-full flex-1"
              onClick={() => onApprove(driver.id)}
              disabled={approvingId === driver.id || deletingId === driver.id}
            >
              {approvingId === driver.id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserCheck className="mr-2 h-4 w-4" />
              )}
              {t('admin.approveButton')}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full flex-1"
                  disabled={approvingId === driver.id || deletingId === driver.id}
                >
                  {deletingId === driver.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('admin.confirmDeleteTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('admin.confirmDeleteDesc', { driverName: `${driver.first_name} ${driver.last_name}` })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => onDelete(driver.id)}
                  >
                    {t('admin.confirmDeleteButton')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const AdminDashboardPage = () => {
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { toast } = useToast();
  const { t } = useLocale();
  const navigate = useNavigate();

  const loadPendingDrivers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchPendingDrivers();
    if (error) {
      toast({ title: t('admin.error.loadTitle'), description: error.message, variant: 'destructive' });
    } else {
      setPendingDrivers(data);
    }
    setLoading(false);
  }, [toast, t]);

  useEffect(() => {
    loadPendingDrivers();
  }, [loadPendingDrivers]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await performLogout();
    toast({ title: "Déconnexion", description: "Vous avez été déconnecté." });
    navigate('/admin-login', { replace: true });
    setIsLoggingOut(false);
  };

  const handleApproveDriver = async (driverId) => {
    setApprovingId(driverId);
    const { error } = await approveDriver(driverId);
    if (error) {
      toast({ title: t('admin.error.approveTitle'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('admin.success.approveTitle'), description: t('admin.success.approveDesc'), variant: 'success' });
      setPendingDrivers(prev => prev.filter(driver => driver.id !== driverId));
    }
    setApprovingId(null);
  };
  
  const handleDeleteDriver = async (driverId) => {
    setDeletingId(driverId);
    const { error } = await deleteDriver(driverId);
    if (error) {
        toast({ title: t('admin.error.deleteTitle'), description: error.message, variant: 'destructive' });
    } else {
        toast({ title: t('admin.success.deleteTitle'), description: t('admin.success.deleteDesc'), variant: 'success' });
        setPendingDrivers(prev => prev.filter(driver => driver.id !== driverId));
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-muted/40 min-h-screen">
      <header className="bg-card/80 border-b border-border p-4 shadow-sm sticky top-0 z-10 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-card-foreground">{t('admin.title')}</h1>
            </div>
            <Button variant="ghost" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                Déconnexion
            </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">{t('admin.pendingDriversTitle')}</h2>
          {pendingDrivers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pendingDrivers.map(driver => (
                <DriverCard 
                  key={driver.id} 
                  driver={driver} 
                  onApprove={handleApproveDriver}
                  onDelete={handleDeleteDriver} 
                  approvingId={approvingId} 
                  deletingId={deletingId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6 bg-card rounded-lg border border-dashed border-border">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold text-card-foreground mb-2">{t('admin.noPendingTitle')}</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">{t('admin.noPendingDesc')}</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;