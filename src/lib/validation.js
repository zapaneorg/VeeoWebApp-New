import { AppError, ErrorCodes } from './errorHandler';

export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Adresse email invalide',
  },
  phone: {
    pattern: /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
    message: 'Numéro de téléphone français invalide',
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    message: 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets',
  },
  licensePlate: {
    pattern: /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/,
    message: 'Format de plaque d\'immatriculation invalide (ex: AB-123-CD)',
  },
};

export const validateField = (value, rules) => {
  if (!value && rules.required) {
    throw new AppError('Ce champ est requis', ErrorCodes.VALIDATION_ERROR);
  }

  if (!value) return true; // Optional field

  if (rules.minLength && value.length < rules.minLength) {
    throw new AppError(`Minimum ${rules.minLength} caractères requis`, ErrorCodes.VALIDATION_ERROR);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    throw new AppError(`Maximum ${rules.maxLength} caractères autorisés`, ErrorCodes.VALIDATION_ERROR);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    throw new AppError(rules.message, ErrorCodes.VALIDATION_ERROR);
  }

  return true;
};

export const validateBookingData = (bookingData) => {
  const errors = [];

  if (!bookingData.pickupLocation) {
    errors.push('Lieu de départ requis');
  }

  if (!bookingData.dropoffLocation) {
    errors.push('Lieu d\'arrivée requis');
  }

  if (bookingData.passengers < 1 || bookingData.passengers > 8) {
    errors.push('Nombre de passagers invalide (1-8)');
  }

  if (bookingData.luggage < 0 || bookingData.luggage > 10) {
    errors.push('Nombre de bagages invalide (0-10)');
  }

  if (bookingData.bookingType === 'later') {
    if (!bookingData.bookingDate || !bookingData.bookingTime) {
      errors.push('Date et heure requises pour une réservation à l\'avance');
    }

    const bookingDateTime = new Date(`${bookingData.bookingDate}T${bookingData.bookingTime}`);
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now

    if (bookingDateTime < minBookingTime) {
      errors.push('La réservation doit être au moins 30 minutes à l\'avance');
    }

    const maxBookingTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    if (bookingDateTime > maxBookingTime) {
      errors.push('La réservation ne peut pas être plus de 30 jours à l\'avance');
    }
  }

  if (errors.length > 0) {
    throw new AppError(errors.join(', '), ErrorCodes.VALIDATION_ERROR);
  }

  return true;
};

export const validateDriverRegistration = (formData) => {
  validateField(formData.firstName, { ...ValidationRules.name, required: true });
  validateField(formData.lastName, { ...ValidationRules.name, required: true });
  validateField(formData.email, { ...ValidationRules.email, required: true });
  validateField(formData.phone, { ...ValidationRules.phone, required: true });
  validateField(formData.password, { ...ValidationRules.password, required: true });
  validateField(formData.licensePlate, { ...ValidationRules.licensePlate, required: true });

  if (formData.password !== formData.confirmPassword) {
    throw new AppError('Les mots de passe ne correspondent pas', ErrorCodes.VALIDATION_ERROR);
  }

  return true;
};