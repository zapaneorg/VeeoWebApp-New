import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext.jsx';
import {
  performLogin,
  performRegistration,
  performSocialLogin,
  performLogout,
  fetchUserProfile,
  sendPasswordResetLink,
  performPasswordReset,
  updateUserProfile,
  uploadProfilePicture,
  updateAuthUser,
  onAuthStateChange,
  addFavoriteAddress as apiAddFavoriteAddress,
  fetchFavoriteAddresses as apiFetchFavoriteAddresses,
  updateFavoriteAddress as apiUpdateFavoriteAddress,
  deleteFavoriteAddress as apiDeleteFavoriteAddress,
  fetchUserActiveBooking,
  fetchDriverActiveBooking
} from '@/lib/authService';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRide, setActiveRide] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLocale();

  const handleUserAndProfile = useCallback(async (supabaseUser) => {
    if (supabaseUser) {
      const { data: profile, error: profileError } = await fetchUserProfile(supabaseUser.id);
      if (profileError) {
        toast({ title: "Erreur de profil", description: "Impossible de charger les informations du profil.", variant: "destructive" });
        setUser(supabaseUser);
        setActiveRide(null);
      } else {
        const fullUser = profile ? { ...supabaseUser, ...profile } : supabaseUser;
        setUser(fullUser);
        let rideResponse;
        if (fullUser.role === 'client') {
          rideResponse = await fetchUserActiveBooking(fullUser.id);
        } else if (fullUser.role === 'driver') {
          rideResponse = await fetchDriverActiveBooking(fullUser.id);
        }
        if (rideResponse?.data) {
          setActiveRide(rideResponse.data);
        } else {
          setActiveRide(null);
        }
      }
    } else {
      setUser(null);
      setActiveRide(null);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      await handleUserAndProfile(data.session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    handleUserAndProfile(session?.user ?? null);
  }, [session, handleUserAndProfile]);

  useEffect(() => {
    if (!user || !activeRide) return;

    const channel = supabase
      .channel(`active-ride-update:${activeRide.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${activeRide.id}`
      }, (payload) => {
        const newStatus = payload.new.status;
        if (['completed', 'cancelled'].includes(newStatus)) {
          setActiveRide(null);
        } else {
          setActiveRide(prev => ({ ...prev, ...payload.new }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeRide]);

  const login = useCallback(async (email, password, isDriverLogin = false, isAdminLogin = false) => {
    setLoading(true);
    const { data: loginData, error } = await performLogin(email, password);
    
    if (error) {
      setLoading(false);
      const description = error.message === 'Invalid login credentials' ? t('login.loginErrorGeneric') : error.message;
      toast({ title: t('login.loginErrorTitle'), description: description, variant: "destructive" });
      return { success: false, user: null };
    }

    if (loginData.user) {
      const { data: profile, error: profileError } = await fetchUserProfile(loginData.user.id);

      if (profileError) {
        setLoading(false);
        toast({ title: "Erreur de profil", description: "Impossible de vérifier le profil.", variant: "destructive" });
        await performLogout();
        return { success: false, user: null };
      }
      
      const fullUser = { ...loginData.user, ...profile };

      if (isAdminLogin && fullUser.role !== 'admin') {
          toast({ title: "Accès refusé", description: "Vous n'êtes pas un administrateur.", variant: 'destructive' });
          await performLogout();
          setLoading(false);
          return { success: false, user: null };
      }
      
      if (isDriverLogin && fullUser.role !== 'driver') {
          toast({ title: t('auth.driverLogin.accessDeniedTitle'), description: t('auth.driverLogin.accessDeniedMessage'), variant: 'destructive' });
          await performLogout();
          setLoading(false);
          return { success: false, user: null };
      }

      if (!isDriverLogin && !isAdminLogin && (fullUser.role === 'driver' || fullUser.role === 'admin')) {
        toast({ title: "Accès restreint", description: "Veuillez utiliser le portail de connexion approprié.", variant: 'destructive' });
        await performLogout();
        setLoading(false);
        return { success: false, user: null };
      }
      
      setLoading(false);
      return { success: true, user: fullUser };
    }
    
    setLoading(false);
    return { success: false, user: null };
  }, [setLoading, t, toast]);

  const logout = useCallback(async () => {
    const userRole = user?.role;
    await performLogout();
    
    toast({ title: "Déconnexion", description: "Vous avez été déconnecté." });
    
    if (userRole === 'driver') {
      navigate('/driver-login', { replace: true });
    } else if (userRole === 'admin') {
      navigate('/admin-login', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [user, toast, navigate]);

  const updateUser = useCallback(async (updatedData) => {
    if (!user) return false;
    setLoading(true);
    try {
      const { profile_pic_file, email: newEmail, password, ...profileUpdates } = updatedData;

      if (profile_pic_file) {
        const { url, error: uploadError } = await uploadProfilePicture(user.id, profile_pic_file);
        if (uploadError) throw new Error(uploadError.message);
        profileUpdates.profile_pic_url = url;
      }

      if (newEmail && newEmail !== user.email || password) {
        const authUpdates = {};
        if (newEmail && newEmail !== user.email) authUpdates.email = newEmail;
        if (password) authUpdates.password = password;
        const { error: authError } = await updateAuthUser(authUpdates);
        if (authError) throw new Error(authError.message);
      }

      if (Object.keys(profileUpdates).length > 0) {
        const { data: updatedProfile, error: profileError } = await updateUserProfile(user.id, profileUpdates);
        if (profileError) throw new Error(profileError.message);
        setUser(prev => ({...prev, ...updatedProfile}));
      }

      toast({ title: "Succès", description: "Profil mis à jour.", variant: "success" });
      return true;
    } catch (e) {
      toast({ title: "Erreur de mise à jour", description: e.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, toast, setUser]);

  const sendPasswordResetEmail = useCallback(async (email) => {
    setLoading(true);
    const { error } = await sendPasswordResetLink(email);
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "E-mail envoyé", description: "Si un compte existe, un e-mail de réinitialisation a été envoyé.", variant: "success" });
    return true;
  }, [setLoading, toast]);

  const resetPassword = useCallback(async (newPassword) => {
    setLoading(true);
    const { error } = await performPasswordReset(newPassword);
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Mot de passe mis à jour", description: "Vous pouvez maintenant vous connecter." });
    navigate('/login', { replace: true });
    return true;
  }, [setLoading, toast, navigate]);
  
  const register = useCallback(async (firstName, lastName, email, password, phone) => {
    setLoading(true);
    const { error } = await performRegistration(firstName, lastName, email, password, phone);
    setLoading(false);
    if (error) {
      toast({ title: "Échec de l'inscription", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Inscription réussie", description: "Veuillez vérifier vos emails pour confirmer votre compte.", variant: "success" });
    return true;
  }, [setLoading, toast]);

  const socialLogin = useCallback(async (provider) => {
    setLoading(true);
    const { error } = await performSocialLogin(provider);
    if (error) {
      toast({ title: "Échec de la connexion sociale", description: error.message || "Impossible de se connecter avec ce fournisseur.", variant: "destructive" });
    }
    setLoading(false);
    return !error;
  }, [setLoading, toast]);

  const addFavoriteAddress = useCallback(async (addressData) => {
    if (!user) return null;
    const { data, error } = await apiAddFavoriteAddress(user.id, addressData);
    if (error) {
      toast({ title: "Erreur", description: "Impossible d'ajouter l'adresse.", variant: "destructive" });
      return null;
    }
    return data;
  }, [user, toast]);

  const fetchFavoriteAddresses = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await apiFetchFavoriteAddresses(user.id);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de charger les adresses.", variant: "destructive" });
      return [];
    }
    return data;
  }, [user, toast]);

  const updateFavoriteAddress = useCallback(async (addressId, updates) => {
    const { data, error } = await apiUpdateFavoriteAddress(addressId, updates);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'adresse.", variant: "destructive" });
      return false;
    }
    return true;
  }, [toast]);

  const deleteFavoriteAddress = useCallback(async (addressId) => {
    const { error } = await apiDeleteFavoriteAddress(addressId);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer l'adresse.", variant: "destructive" });
      return false;
    }
    return true;
  }, [toast]);

  const value = {
    user,
    session,
    loading,
    activeRide,
    setActiveRide,
    login,
    logout,
    updateUser,
    sendPasswordResetEmail,
    resetPassword,
    register,
    socialLogin,
    addFavoriteAddress,
    fetchFavoriteAddresses,
    updateFavoriteAddress,
    deleteFavoriteAddress,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;