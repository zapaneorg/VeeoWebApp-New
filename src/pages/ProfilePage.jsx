import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { UploadCloud, Phone, Loader2, Settings, MapPin as MapPinIcon, Star, CreditCard, FileText, Home, Briefcase, Car, LogOut, Menu as MenuIcon } from 'lucide-react';
import ProfileInfoForm from '@/components/profile/ProfileInfoForm';
import ProfileRidesHistory from '@/components/profile/ProfileRidesHistory';
import ProfilePaymentMethods from '@/components/profile/ProfilePaymentMethods';
import ProfileInvoices from '@/components/profile/ProfileInvoices';
import ProfileRidePreferences from '@/components/profile/ProfileRidePreferences';
import ProfileFavoriteAddresses from '@/components/profile/ProfileFavoriteAddresses';
import ProfileWallet from '@/components/profile/ProfileWallet';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import StarRating from '@/components/ui/StarRating';


const ProfilePage = () => {
  const { user, logout, updateUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();

  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      toast({
        title: t('profile.unauthorizedTitle'),
        description: t('profile.unauthorizedMessage'),
        variant: "destructive",
      });
    } else if (user) {
      setProfilePicPreview(user.profile_pic_url || '');
    }
  }, [user, navigate, toast, authLoading, t]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) { 
        toast({
            title: t('profile.fileTooLargeTitle'),
            description: t('profile.fileTooLargeMessage'),
            variant: "destructive",
        });
        return;
    }

    setIsUploading(true);
    const success = await updateUser({ profile_pic_file: file });
    if (success && user?.profile_pic_url) {
       setProfilePicPreview(user.profile_pic_url); 
       toast({
          title: t('profile.picUpdateSuccessTitle'),
          description: t('profile.picUpdateSuccessMessage'),
          variant: "success"
        });
    }
    setIsUploading(false);
  };
  
  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const userFirstName = user.first_name || user.displayName?.split(' ')[0] || '';
  const userLastName = user.last_name || user.displayName?.split(' ').slice(1).join(' ') || '';

  const profileTabs = [
    { value: "profile", labelKey: 'profile.tabs.info', icon: Home },
    { value: "addresses", labelKey: 'profile.tabs.addresses', icon: MapPinIcon },
    { value: "preferences", labelKey: 'profile.tabs.preferences', icon: Settings },
    { value: "rides", labelKey: 'profile.tabs.rides', icon: Car },
    { value: "payments", labelKey: 'profile.tabs.payments', icon: CreditCard },
    { value: "invoices", labelKey: 'profile.tabs.invoices', icon: FileText },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 bg-background text-foreground"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start mb-12 space-y-6 md:space-y-0 md:space-x-8">
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 300 } }}
        >
          <Avatar className="w-32 h-32 md:w-40 md:h-40 border-2 border-primary/50 shadow-lg group-hover:shadow-xl p-1 bg-card">
            <AvatarImage src={profilePicPreview || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userFirstName)}+${encodeURIComponent(userLastName)}&background=hsl(var(--primary))&color=hsl(var(--primary-foreground))&size=160`} alt={`${userFirstName} ${userLastName}`} className="rounded-full" />
            <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground rounded-full">
              {(userFirstName && userFirstName.charAt(0).toUpperCase())}{(userLastName && userLastName.charAt(0).toUpperCase())}
            </AvatarFallback>
          </Avatar>
          <label htmlFor="profilePicInput" className={`absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full cursor-pointer ${isUploading ? 'cursor-not-allowed' : ''}`}>
            {isUploading ? <Loader2 className="h-10 w-10 text-white animate-spin" /> : <UploadCloud className="h-10 w-10 text-white" />}
            <input type="file" id="profilePicInput" accept="image/png, image/jpeg, image/webp" onChange={handleProfilePicChange} className="hidden" disabled={isUploading} />
          </label>
        </motion.div>
        <div>
          <h1 className="text-4xl font-black text-primary">{userFirstName} {userLastName}</h1>
          <p className="text-primary/80 text-lg">{user.email}</p>
          {user.phone && <p className="text-muted-foreground text-md flex items-center mt-1"><Phone className="h-4 w-4 mr-2 text-muted-foreground"/> {user.phone}</p>}
          <div className="mt-2">
            <StarRating rating={user.average_rating || 0} />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobileView ? (
          <div className="mb-8">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full bg-card border-border text-foreground focus:ring-1 focus:ring-primary/30 py-3 text-base">
                <MenuIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                <SelectValue placeholder={t('profile.tabs.selectPlaceholder', {defaultValue: "Sélectionner une section"})} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                {profileTabs.map(tab => (
                  <SelectItem 
                    key={tab.value} 
                    value={tab.value} 
                    className="focus:bg-accent/50 focus:text-accent-foreground py-2.5 text-base"
                  >
                    <div className="flex items-center">
                      <tab.icon className="mr-3 h-5 w-5 text-muted-foreground" /> {t(tab.labelKey)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 mb-8 bg-card border border-border p-1 rounded-lg">
            {profileTabs.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center py-2.5 text-xs sm:text-sm"
              >
                <tab.icon className="mr-1 sm:mr-2 h-4 w-4" />{t(tab.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {profileTabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="bg-card p-4 sm:p-6 rounded-lg border border-border">
            {tab.value === "profile" && <ProfileInfoForm />}
            {tab.value === "addresses" && <ProfileFavoriteAddresses />}
            {tab.value === "preferences" && <ProfileRidePreferences />}
            {tab.value === "rides" && <ProfileRidesHistory />}
            {tab.value === "payments" && <><ProfilePaymentMethods /><ProfileWallet /></>}
            {tab.value === "invoices" && <ProfileInvoices />}
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-12 text-center">
          <Button onClick={() => { logout(); navigate('/'); }} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
            <LogOut className="mr-2 h-4 w-4" /> {t('profile.logoutButton')}
          </Button>
        </div>
    </motion.div>
  );
};

export default ProfilePage;