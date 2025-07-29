import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DriverRoute = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user && user.role !== 'driver') {
      toast({
        title: "Accès non autorisé",
        description: "Cette section est réservée aux chauffeurs.",
        variant: "destructive",
      });
      logout().then(() => navigate('/', { replace: true }));
    }
  }, [user, loading, toast, navigate, logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/driver-login" state={{ from: location }} replace />;
  }

  if (user.role !== 'driver') {
    // This case is handled by the useEffect for a clean logout,
    // but as a fallback, we can show a loader while redirecting.
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (user.status === 'pending_approval') {
    return <Navigate to="/driver-pending-approval" replace />;
  }

  if (user.status !== 'active') {
    toast({
      title: "Compte inactif",
      description: "Votre compte n'est pas actif. Veuillez contacter le support.",
      variant: "destructive",
    });
    return <Navigate to="/driver-login" replace />;
  }

  return children;
};

export default DriverRoute;