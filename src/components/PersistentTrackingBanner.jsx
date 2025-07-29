import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, ChevronRight, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PersistentTrackingBanner = () => {
  const { activeRide } = useAuth();
  const navigate = useNavigate();

  if (!activeRide) {
    return null;
  }

  const { id, status, driver } = activeRide;

  const statusMessages = {
    'pending_confirmation': "Recherche d'un chauffeur...",
    'confirmed': "Chauffeur confirmé",
    'en_route_pickup': "Le chauffeur est en route",
    'at_pickup': "Le chauffeur est arrivé",
    'in_progress': "Course en cours",
  };

  const handleClick = () => {
    navigate(`/track/${id}`);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      onClick={handleClick}
      className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 cursor-pointer"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl p-3 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
          <div className="flex items-center gap-4">
            {driver ? (
              <Avatar className="h-10 w-10 border-2 border-green-400">
                <AvatarImage src={driver.profile_pic_url} alt={driver.first_name} />
                <AvatarFallback className="bg-gray-700 text-sm">{driver.first_name?.[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
            <div>
              <p className="font-bold text-sm sm:text-base">
                {statusMessages[status] || "Course en cours..."}
              </p>
              {driver && (
                <p className="text-xs sm:text-sm text-gray-300">
                  {driver.first_name} - {driver.vehicle_model}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-sm font-medium hidden sm:inline">Voir détails</span>
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersistentTrackingBanner;