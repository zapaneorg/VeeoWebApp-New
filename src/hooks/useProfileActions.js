import { useCallback } from 'react';
import {
  updateAuthUser,
  updateUserProfile,
  uploadProfilePicture,
  addFavoriteAddress as addSupabaseFavoriteAddress,
  fetchFavoriteAddresses as fetchSupabaseFavoriteAddresses,
  updateFavoriteAddress as updateSupabaseFavoriteAddress,
  deleteFavoriteAddress as deleteSupabaseFavoriteAddress,
} from '@/lib/authService';

export const useProfileActions = ({ user, setLoading, toast, setUser }) => {

  const updateUser = useCallback(async (updatedData) => {
    if (!user) return false;
    setLoading(true);
    try {
      const { profile_pic_file, email: newEmail, password, ...profileUpdates } = updatedData;

      if (profile_pic_file) {
        const { url, error: uploadError } = await uploadProfilePicture(user.id, profile_pic_file);
        if (uploadError) {
          toast({ title: "Erreur d'upload", description: uploadError.message, variant: "destructive" });
          setLoading(false);
          return false;
        }
        profileUpdates.profile_pic_url = url;
      }

      const authUpdates = {};
      if (newEmail && newEmail !== user.email) authUpdates.email = newEmail;
      if (password) authUpdates.password = password;

      if (Object.keys(authUpdates).length > 0) {
        const { error: updateAuthError } = await updateAuthUser(authUpdates);
        if (updateAuthError) {
          toast({ title: "Erreur Auth", description: updateAuthError.message, variant: "destructive" });
          setLoading(false);
          return false;
        }
      }

      if (Object.keys(profileUpdates).length > 0) {
        const { data: updatedProfileData, error: profileError } = await updateUserProfile(user.id, profileUpdates);
        if (profileError) {
          toast({ title: "Erreur Profil", description: profileError.message, variant: "destructive" });
          setLoading(false);
          return false;
        }
        setUser(prevUser => ({ ...prevUser, ...updatedProfileData }));
      } else if (profile_pic_file && profileUpdates.profile_pic_url) {
        setUser(prevUser => ({ ...prevUser, profile_pic_url: profileUpdates.profile_pic_url }));
      }

      if (!profile_pic_file || Object.keys(updatedData).length > (profile_pic_file ? 1 : 0)) {
        toast({ title: "Succès", description: "Profil mis à jour.", variant: "success" });
      }
      return true;
    } catch (e) {
      toast({ title: "Erreur de mise à jour", description: e.message || "Une erreur inattendue s'est produite.", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, toast, setUser]);

  const addFavoriteAddress = useCallback(async (addressData) => {
    if (!user) return null;
    const { data, error } = await addSupabaseFavoriteAddress(user.id, addressData);
    if (error) {
      toast({ title: "Erreur", description: "Impossible d'ajouter l'adresse favorite.", variant: "destructive" });
      return null;
    }
    return data;
  }, [user, toast]);

  const fetchFavoriteAddresses = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await fetchSupabaseFavoriteAddresses(user.id);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de charger les adresses favorites.", variant: "destructive" });
      return [];
    }
    return data;
  }, [user, toast]);

  const updateFavoriteAddress = useCallback(async (addressId, updates) => {
    if (!user) return false;
    const { data, error } = await updateSupabaseFavoriteAddress(addressId, updates);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'adresse.", variant: "destructive" });
      return false;
    }
    return data;
  }, [user, toast]);

  const deleteFavoriteAddress = useCallback(async (addressId) => {
    if (!user) return false;
    const { error } = await deleteSupabaseFavoriteAddress(addressId);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer l'adresse.", variant: "destructive" });
      return false;
    }
    return true;
  }, [user, toast]);

  return {
    updateUser,
    addFavoriteAddress,
    fetchFavoriteAddresses,
    updateFavoriteAddress,
    deleteFavoriteAddress,
  };
};