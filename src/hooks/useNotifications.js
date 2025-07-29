import { useEffect, useRef, useCallback } from 'react';

export const useNotifications = () => {
  const notificationPermissionRef = useRef(Notification.permission);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      if (notificationPermissionRef.current === 'default') {
        try {
          const permission = await Notification.requestPermission();
          notificationPermissionRef.current = permission;
        } catch (error) {
          console.error("Erreur lors de la demande de permission de notification:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const sendPushNotification = useCallback((title, body, options = {}) => {
    if (notificationPermissionRef.current !== 'granted') {
      console.warn("La permission pour les notifications n'a pas été accordée.");
      return;
    }

    if (document.hidden) {
      try {
        const notification = new Notification(title, {
          body,
          icon: '/favicon.ico', 
          badge: '/favicon.ico', 
          tag: 'veeo-notification', 
          renotify: true,
          ...options,
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification push:', error);
      }
    }
  }, []);

  return { sendPushNotification, requestPermission };
};