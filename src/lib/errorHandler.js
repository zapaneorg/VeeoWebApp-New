import { toast } from '@/components/ui/use-toast';

export class AppError extends Error {
  constructor(message, code, statusCode = 500, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  BOOKING_ERROR: 'BOOKING_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  LOCATION_ERROR: 'LOCATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);

  let title = 'Une erreur est survenue';
  let description = 'Veuillez réessayer plus tard.';
  let variant = 'destructive';

  if (error instanceof AppError) {
    title = error.message;
    description = getErrorDescription(error.code);
  } else if (error?.message) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      title = 'Problème de connexion';
      description = 'Vérifiez votre connexion internet et réessayez.';
    } else if (error.message.includes('unauthorized') || error.message.includes('permission')) {
      title = 'Accès non autorisé';
      description = 'Vous n\'avez pas les permissions nécessaires.';
    } else {
      description = error.message;
    }
  }

  toast({ title, description, variant });
  
  // In production, send to error tracking service
  if (import.meta.env.PROD) {
    // sendToErrorTracking(error, context);
  }
};

const getErrorDescription = (code) => {
  const descriptions = {
    [ErrorCodes.VALIDATION_ERROR]: 'Les données saisies ne sont pas valides.',
    [ErrorCodes.AUTHENTICATION_ERROR]: 'Problème d\'authentification. Veuillez vous reconnecter.',
    [ErrorCodes.AUTHORIZATION_ERROR]: 'Vous n\'avez pas les permissions nécessaires.',
    [ErrorCodes.NETWORK_ERROR]: 'Problème de connexion réseau.',
    [ErrorCodes.BOOKING_ERROR]: 'Impossible de traiter la réservation.',
    [ErrorCodes.PAYMENT_ERROR]: 'Problème lors du paiement.',
    [ErrorCodes.LOCATION_ERROR]: 'Impossible de déterminer la localisation.',
    [ErrorCodes.UNKNOWN_ERROR]: 'Une erreur inattendue s\'est produite.',
  };
  return descriptions[code] || descriptions[ErrorCodes.UNKNOWN_ERROR];
};

export const withErrorHandling = (asyncFn, context = '') => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  };
};