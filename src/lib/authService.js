
import { supabase } from './supabaseClient';

export const performLogin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const performRegistration = async (firstName, lastName, email, password, phone = '') => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        role: 'client'
      }
    }
  });

  if (authError) return { data: null, error: authError };
  
  return { data: authData, error: null };
};

export const performDriverRegistration = async (formData) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${window.location.origin}/driver-login`,
      data: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        city: formData.city,
        role: 'driver',
        streetAddress: formData.streetAddress,
        postalCode: formData.postalCode,
        vehicle_model: `${formData.vehicleBrand} ${formData.vehicleModel}`,
        license_plate: formData.licensePlate,
      }
    }
  });

  if (authError) return { data: null, error: authError };
  
  if (!authData.session) {
     return { data: authData, error: null };
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: authData.session.access_token,
    refresh_token: authData.session.refresh_token,
  });

  if (sessionError) {
    return { data: null, error: sessionError };
  }

  return { data: authData, error: null };
};


export const performSocialLogin = async (provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
  });
  return { data, error };
};

export const performLogout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateAuthUser = async (updates) => {
  const { error } = await supabase.auth.updateUser(updates);
  return { error };
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const uploadProfilePicture = async (userId, file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) return { url: null, error };

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  const publicUrlWithCacheBust = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;

  return { url: publicUrlWithCacheBust, error: null };
};

export const sendPasswordResetLink = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
};

export const performPasswordReset = async (newPassword) => {
 const { data, error } = await supabase.auth.updateUser({ password: newPassword });
 return { data, error };
};

export const onAuthStateChange = (callback) => {
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    callback(event, session);
  });
  return authListener;
};

export const addFavoriteAddress = async (userId, addressData) => {
  const { data, error } = await supabase
    .from('favorite_addresses')
    .insert([{ ...addressData, user_id: userId }])
    .select()
    .single();
  return { data, error };
};

export const fetchFavoriteAddresses = async (userId) => {
  const { data, error } = await supabase
    .from('favorite_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateFavoriteAddress = async (addressId, updates) => {
  const { data, error } = await supabase
    .from('favorite_addresses')
    .update(updates)
    .eq('id', addressId)
    .select()
    .single();
  return { data, error };
};

export const deleteFavoriteAddress = async (addressId) => {
  const { error } = await supabase
    .from('favorite_addresses')
    .delete()
    .eq('id', addressId);
  return { error };
};

export const createBooking = async (bookingDetails) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingDetails])
      .select()
      .single();

    if (error) {
      console.error('Supabase booking creation error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in createBooking:', err);
    return { data: null, error: err };
  }
};

export const getBookingById = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, client:user_id(*), driver:driver_id(*)')
    .eq('id', bookingId)
    .single();
  return { data, error };
};

export const fetchUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('booking_time', { ascending: false });
  return { data, error };
};

export const fetchUserActiveBooking = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, client:user_id(*), driver:driver_id(*)')
    .eq('user_id', userId)
    .in('status', ['pending_confirmation', 'confirmed', 'en_route_pickup', 'at_pickup', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return { data, error };
};

export const fetchDriverActiveBooking = async (driverId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, client:user_id(*), driver:driver_id(*)')
    .eq('driver_id', driverId)
    .in('status', ['confirmed', 'en_route_pickup', 'at_pickup', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return { data, error };
};

export const fetchAvailableBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'pending_confirmation')
    .order('booking_time', { ascending: true });
  return { data, error };
};

export const acceptBooking = async (bookingId, driverId) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed', driver_id: driverId })
    .eq('id', bookingId)
    .select('*, client:user_id(*)')
    .single();
  return { data, error };
};


export const updateExistingBooking = async (bookingId, updates) => {
    const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select('*, client:user_id(*)')
    .single();
  return { data, error };
};

export const fetchPendingDrivers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'driver')
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: true });
  return { data, error };
};

export const fetchDriverProfile = async (driverId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', driverId)
    .eq('role', 'driver')
    .single();
  return { data, error };
};

export const approveDriver = async (driverId) => {
  const { data, error } = await supabase.functions.invoke('approve-driver', {
    body: { driverId },
  });
  return { data, error };
};

export const deleteDriver = async (driverId) => {
  const { data, error } = await supabase.auth.admin.deleteUser(driverId);
  return { data, error };
};

export const fetchDriverDocuments = async (driverId) => {
  const { data, error } = await supabase
    .from('driver_documents')
    .select('*')
    .eq('driver_id', driverId);
  return { data, error };
};

export const uploadDriverDocument = async (driverId, documentType, file) => {
  if (!file) {
    return { data: null, error: new Error('No file provided for upload.') };
  }
  
  const BUCKET_NAME = 'driver-documents';
  const fileExt = file.name.split('.').pop();
  const fileName = `${documentType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${driverId}/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error(`Storage upload error for ${documentType}:`, uploadError);
    return { data: null, error: uploadError };
  }

  const { data, error: dbError } = await supabase
    .from('driver_documents')
    .upsert({
      driver_id: driverId,
      document_type: documentType,
      file_path: uploadData.path,
      status: 'pending_review',
    }, { onConflict: 'driver_id, document_type' })
    .select()
    .single();

  if (dbError) {
    console.error(`Database insert/update error for ${documentType}:`, dbError);
  }

  return { data, error: dbError };
};

export const updateDriverStatus = async (driverId, status) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ status: status })
    .eq('id', driverId)
    .select()
    .single();
  return { data, error };
};

export const updateDriverDocumentStatus = async (documentId, status) => {
  const { data, error } = await supabase
    .from('driver_documents')
    .update({ status })
    .eq('id', documentId)
    .select()
    .single();
  return { data, error };
};
