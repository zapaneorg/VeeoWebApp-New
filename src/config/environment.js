export const config = {
  googleMaps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    environment: import.meta.env.VITE_APP_ENV || 'development',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
};

// Validation
if (!config.googleMaps.apiKey && config.app.isProduction) {
  console.warn('Google Maps API key is not configured');
}

if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error('Supabase configuration is missing');
}