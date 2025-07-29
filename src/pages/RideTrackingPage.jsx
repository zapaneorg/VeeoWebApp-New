import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Wifi, WifiOff, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import RideTrackingMap from '@/components/tracking/RideTrackingMap';
import RideStatusPanel from '@/components/tracking/RideStatusPanel';
import ChatDialog from '@/components/tracking/ChatDialog';
import { useRideTracking } from '@/hooks/useRideTracking';
import { useNotifications } from '@/hooks/useNotifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RideCompletionDialog from '@/components/tracking/RideCompletionDialog';
import { useToast } from '@/components/ui/use-toast';

const RideTrackingPage = () => {
  const { bookingId } = useParams();
  const { user, loading: authLoading, logout, activeRide, setActiveRide } = useAuth();
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const { toast } = useToast();

  const {
    booking,
    driver,
    client,
    loading: rideLoading,
    error,
    rotation,
    connectionStatus,
    lastUpdate,
    estimatedPickupTime,
  } = useRideTracking(bookingId, !authLoading && !!user);

  const { requestPermission } = useNotifications();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (booking?.status === 'completed' && user?.role === 'client') {
      setShowCompletionDialog(true);
      setActiveRide(null);
    } else if (booking?.status === 'cancelled') {
      toast({
        title: "Course Annulée",
        description: "Cette course a été annulée. Vous allez être redirigé.",
        variant: "destructive"
      });
      setActiveRide(null);
      setTimeout(() => {
        if (user?.role === 'client') {
          navigate('/book');
        } else {
          navigate('/driver/dashboard');
        }
      }, 3000);
    }
  }, [booking?.status, user?.role, navigate, toast, setActiveRide]);

  if (authLoading || rideLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre course...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/book')} 
              className="bg-blue-500 text-white hover:bg-blue-600 w-full"
            >
              Nouvelle réservation
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Vérification des détails de la course...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gray-200">
      <div className="absolute inset-0 z-0">
        <RideTrackingMap 
          booking={booking} 
          driver={driver} 
          rotation={rotation} 
        />
      </div>
      
      <AnimatePresence>
        {booking && !showCompletionDialog && (
          <RideStatusPanel
            booking={booking}
            driver={driver}
            user={user.role === 'driver' ? driver : client}
            isDetailsOpen={isDetailsOpen}
            setIsDetailsOpen={setIsDetailsOpen}
            connectionStatus={connectionStatus}
            lastUpdate={lastUpdate}
            estimatedPickupTime={estimatedPickupTime}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-28 right-4 z-10">
        <ChatDialog bookingId={booking.id} />
      </div>

      <AnimatePresence>
        {booking && user?.role === 'client' && (
          <RideCompletionDialog
            open={showCompletionDialog}
            onOpenChange={setShowCompletionDialog}
            booking={booking}
            driver={driver}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 z-10 flex items-center gap-2"
      >
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium shadow-lg transition-colors duration-300 ${
          connectionStatus === 'connected' 
            ? 'bg-green-100/90 text-green-800 border border-green-200 backdrop-blur-sm' 
            : connectionStatus === 'reconnecting'
            ? 'bg-yellow-100/90 text-yellow-800 border border-yellow-200 backdrop-blur-sm'
            : 'bg-red-100/90 text-red-800 border border-red-200 backdrop-blur-sm'
        }`}>
          {connectionStatus === 'connected' ? (
            <>
              <Wifi className="h-4 w-4" />
              <span>En ligne</span>
            </>
          ) : connectionStatus === 'reconnecting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Reconnexion...</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>Hors ligne</span>
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-10"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 p-1 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full h-12 w-auto px-3 flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.profile_pic_url} />
                  <AvatarFallback>
                    {user.first_name?.[0] || <User size={16} />}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold hidden sm:inline">{user.first_name}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/">Accueil</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/profile">Mon Profil</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/book">Nouvelle Course</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    </div>
  );
};

export default RideTrackingPage;