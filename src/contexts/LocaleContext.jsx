import React, { createContext, useState, useContext, useEffect } from 'react';

import commonFr from '@/locales/fr/common.fr.json';
import headerFr from '@/locales/fr/header.fr.json';
import footerFr from '@/locales/fr/footer.fr.json';
import homeFr from '@/locales/fr/home.fr.json';
import authFr from '@/locales/fr/auth.fr.json';
import aboutFr from '@/locales/fr/about.fr.json';
import servicesFr from '@/locales/fr/services.fr.json';
import contactFr from '@/locales/fr/contact.fr.json';
import legalFr from '@/locales/fr/legal.fr.json';
import bookingFr from '@/locales/fr/booking.fr.json';
import helpFr from '@/locales/fr/help.fr.json';
import driversFr from '@/locales/fr/drivers.fr.json';
import profileFr from '@/locales/fr/profile.fr.json';
import driverResourcesFr from '@/locales/fr/driverResources.fr.json';
import driverDashboardFr from '@/locales/fr/driverDashboard.fr.json';
import adminFr from '@/locales/fr/admin.fr.json';
import driverFr from '@/locales/fr/driver.fr.json';
import adminGuideFr from '@/locales/fr/admin-guide.fr.json';


const LocaleContext = createContext(undefined);

const frTranslations = {
  common: commonFr,
  header: headerFr,
  footer: footerFr,
  home: homeFr,
  auth: authFr,
  about: aboutFr,
  services: servicesFr,
  contact: contactFr,
  legal: legalFr,
  booking: bookingFr,
  help: helpFr,
  drivers: driversFr,
  profile: profileFr,
  driverResources: driverResourcesFr,
  driverDashboard: driverDashboardFr,
  admin: adminFr,
  driver: driverFr,
  adminGuide: adminGuideFr,
  
  login: authFr.login,
  register: authFr.register,
  forgotPassword: authFr.forgotPassword,
  resetPassword: authFr.resetPassword,
  terms: legalFr.terms,
  privacy: legalFr.privacy,
  cookieConsent: legalFr.cookieConsent,
  bookingForm: bookingFr.bookingForm,
  vehicleTypes: bookingFr.vehicleTypes,
  bookingConfirmation: bookingFr.bookingConfirmation,
  bookingEstimate: bookingFr.bookingEstimate,
  bookingConfirmed: bookingFr.bookingConfirmed,
};

const translations = { 
  fr: frTranslations 
};

export const LocaleProvider = ({ children }) => {
  const [locale] = useState('fr'); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('veeo-locale', 'fr');
    }
  }, []);

  const t = (key, params = {}) => {
    if (typeof key !== 'string') {
      console.warn(`Translation key must be a string, but received:`, key);
      return params.defaultValue !== undefined ? params.defaultValue : String(key);
    }

    const keys = key.split('.');
    let translationNode = translations[locale];
    for (const k of keys) {
        translationNode = translationNode?.[k];
        if (translationNode === undefined) {
            break; 
        }
    }

    let translationValue = translationNode;

    if (params.count !== undefined) {
      if (params.count === 0) {
        const zeroKey = `${key}_zero`;
        const zeroKeys = zeroKey.split('.');
        let zeroNode = translations[locale];
        for (const k of zeroKeys) {
          zeroNode = zeroNode?.[k];
        }
        if (zeroNode !== undefined) {
          translationValue = zeroNode;
        }
      } else if (params.count === 1) {
        const oneKey = `${key}_one`;
        const oneKeys = oneKey.split('.');
        let oneNode = translations[locale];
        for (const k of oneKeys) {
            oneNode = oneNode?.[k];
        }
        if (oneNode !== undefined) {
            translationValue = oneNode;
        }
      } else {
        const otherKey = `${key}_other`;
        const otherKeys = otherKey.split('.');
        let otherNode = translations[locale];
        for (const k of otherKeys) {
            otherNode = otherNode?.[k];
        }
        if (otherNode !== undefined) {
            translationValue = otherNode;
        }
      }
    }

    if (translationValue === undefined) {
      if (params.defaultValue !== undefined) {
        return params.defaultValue;
      }
      console.warn(`Translation key "${key}" not found for locale "${locale}".`);
      return key;
    }
    
    if (params.returnObjects && typeof translationValue === 'object' && !React.isValidElement(translationValue)) {
        return translationValue;
    }
    
    let processedResult = translationValue;

    if (typeof processedResult === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(paramKey => {
        if (paramKey === 'defaultValue' || paramKey === 'returnObjects') return; 
        
        const paramValue = params[paramKey];
        
        if (React.isValidElement(paramValue)) {
          const regex = new RegExp(`{{${paramKey}}}`, 'g');
          if (typeof processedResult === 'string') {
            const parts = processedResult.split(regex);
            processedResult = parts.reduce((acc, part, index) => {
              if (index === parts.length - 1) return [...acc, part];
              return [...acc, part, React.cloneElement(paramValue, { key: `param-${paramKey}-${index}`})];
            }, []);
          } else if (Array.isArray(processedResult)) {
            processedResult = processedResult.flatMap(segment => {
              if (typeof segment === 'string') {
                const parts = segment.split(regex);
                return parts.reduce((acc, part, index) => {
                  if (index === parts.length - 1) return [...acc, part];
                  return [...acc, part, React.cloneElement(paramValue, { key: `param-${paramKey}-${index}-${Math.random()}`})];
                }, []);
              }
              return segment;
            });
          }
        } else {
          if (typeof processedResult === 'string') {
            processedResult = processedResult.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
          } else if (Array.isArray(processedResult)) {
             processedResult = processedResult.map(segment => 
                typeof segment === 'string' ? segment.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue)) : segment
            );
          }
        }
      });
    }
    
    return processedResult;
  };

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};