import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const InstallPrompt = () => {
  const { isInstallable, promptInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if dismissed or not installable
  if (!isInstallable || isDismissed || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Installer l'app Veeo
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Accès rapide depuis votre écran d'accueil
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 flex space-x-2">
            <Button onClick={handleInstall} size="sm" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Installer
            </Button>
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Plus tard
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;