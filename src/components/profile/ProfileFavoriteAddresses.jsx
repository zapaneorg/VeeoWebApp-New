import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Home, Briefcase, Edit, Trash2, MapPin, Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';

const ProfileFavoriteAddresses = () => {
  const { user, addFavoriteAddress, fetchFavoriteAddresses, updateFavoriteAddress, deleteFavoriteAddress } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null); 
  const [label, setLabel] = useState('');
  const [address, setAddressValue] = useState('');

  const loadAddresses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const fetchedAddresses = await fetchFavoriteAddresses();
    setAddresses(fetchedAddresses || []);
    setIsLoading(false);
  }, [user, fetchFavoriteAddresses]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleSaveAddress = async () => {
    if (!label || !address) {
      toast({ title: t('profile.favAddress.missingFieldsTitle', {defaultValue: "Champs requis"}), description: t('profile.favAddress.missingFieldsDesc', {defaultValue: "Veuillez entrer un libellé et une adresse."}), variant: "destructive" });
      return;
    }
    setIsDialogLoading(true);
    let success;
    if (currentAddress) { 
      success = await updateFavoriteAddress(currentAddress.id, { label, address });
    } else { 
      const newAddr = await addFavoriteAddress({ label, address });
      success = !!newAddr;
    }
    
    if (success) {
      toast({ title: t('common.success'), description: t(currentAddress ? 'profile.favAddress.updateSuccess' : 'profile.favAddress.addSuccess', {defaultValue: `Adresse ${currentAddress ? 'mise à jour' : 'enregistrée'}.`}), variant: "success" });
      setIsDialogOpen(false);
      loadAddresses();
      resetForm();
    } else {
       toast({ title: t('common.error'), description: t('profile.favAddress.saveError', {defaultValue: "Impossible d'enregistrer l'adresse."}), variant: "destructive" });
    }
    setIsDialogLoading(false);
  };

  const handleDeleteAddress = async (addressId) => {
    setIsLoading(true); 
    const success = await deleteFavoriteAddress(addressId);
    if (success) {
      toast({ title: t('profile.favAddress.deleteSuccessTitle', {defaultValue: "Supprimé"}), description: t('profile.favAddress.deleteSuccessDesc', {defaultValue: "Adresse favorite supprimée."}), variant: "success" });
      loadAddresses();
    } else {
      toast({ title: t('common.error'), description: t('profile.favAddress.deleteError', {defaultValue: "Impossible de supprimer l'adresse."}), variant: "destructive" });
    }
    setIsLoading(false);
  };
  
  const openDialogToAdd = () => {
    setCurrentAddress(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const openDialogToEdit = (addr) => {
    setCurrentAddress(addr);
    setLabel(addr.label);
    setAddressValue(addr.address);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setLabel('');
    setAddressValue('');
  };

  const getIconForLabel = (labelStr) => {
    const lowerLabel = labelStr.toLowerCase();
    if (lowerLabel.includes(t('profile.favAddress.homeLabel', {defaultValue: 'maison'}).toLowerCase()) || lowerLabel.includes('home')) return <Home className="h-5 w-5 text-primary mr-3 flex-shrink-0" />;
    if (lowerLabel.includes(t('profile.favAddress.workLabel', {defaultValue: 'travail'}).toLowerCase()) || lowerLabel.includes('work') || lowerLabel.includes(t('profile.favAddress.officeLabel', {defaultValue: 'bureau'}).toLowerCase())) return <Briefcase className="h-5 w-5 text-primary mr-3 flex-shrink-0" />;
    return <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0" />;
  }

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl text-primary flex items-center"><MapPin className="mr-2 h-6 w-6"/>{t('profile.favAddress.title', {defaultValue: "Adresses Favorites"})}</CardTitle>
          <CardDescription className="text-muted-foreground">{t('profile.favAddress.subtitle', {defaultValue: "Gérez vos lieux fréquemment utilisés."})}</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialogToAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('common.add', {defaultValue: "Ajouter"})}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle className="text-primary">{currentAddress ? t('profile.favAddress.editDialogTitle', {defaultValue: "Modifier l'adresse"}) : t('profile.favAddress.newDialogTitle', {defaultValue: "Nouvelle adresse favorite"})}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {currentAddress ? t('profile.favAddress.editDialogDesc', {defaultValue: "Modifiez les détails de votre adresse."}) : t('profile.favAddress.newDialogDesc', {defaultValue: "Ajoutez un libellé et l'adresse complète."})}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right text-foreground">{t('profile.favAddress.labelField', {defaultValue: "Libellé"})}</Label>
                <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder={t('profile.favAddress.labelPlaceholder', {defaultValue: "Ex: Maison, Travail..."})} className="col-span-3 bg-input border-border focus:ring-primary" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right text-foreground">{t('profile.favAddress.addressField', {defaultValue: "Adresse"})}</Label>
                <Input id="address" value={address} onChange={(e) => setAddressValue(e.target.value)} placeholder={t('profile.favAddress.addressPlaceholder', {defaultValue: "Adresse complète"})} className="col-span-3 bg-input border-border focus:ring-primary" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-muted-foreground hover:text-foreground">{t('common.cancel')}</Button>
              <Button onClick={handleSaveAddress} disabled={isDialogLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isDialogLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && addresses.length === 0 && <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>}
        {!isLoading && addresses.length === 0 && (
          <p className="text-muted-foreground text-center py-8">{t('profile.favAddress.noAddresses', {defaultValue: "Vous n'avez pas encore d'adresses favorites."})}</p>
        )}
        {addresses.map((addr) => (
          <div key={addr.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center">
              {getIconForLabel(addr.label)}
              <div>
                <p className="font-semibold text-foreground">{addr.label}</p>
                <p className="text-sm text-muted-foreground">{addr.address}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openDialogToEdit(addr)} className="text-primary hover:text-primary/80">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} disabled={isLoading} className="text-destructive hover:text-destructive/80">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfileFavoriteAddresses;