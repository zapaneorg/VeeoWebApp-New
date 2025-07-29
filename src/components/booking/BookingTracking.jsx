import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from 'lucide-react';

const BookingTracking = ({ bookingData, estimatedPrice, onCancel }) => {
  return (
    <Card className="bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-xl">
      <CardHeader className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <CardTitle className="text-3xl text-green-400">Réservation Confirmée !</CardTitle>
        <CardDescription className="text-gray-300 text-lg">Votre chauffeur est en route.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-200">
        <div className="p-4 bg-slate-700/50 rounded-lg">
          <p className="font-semibold text-sky-300">Chauffeur:</p>
          <p>Alexandre Dubois (Simulation)</p>
          <p>Peugeot 508 - AB-123-CD (Simulation)</p>
        </div>
        <p><strong className="text-sky-300">Départ:</strong> {bookingData.pickupLocation}</p>
        <p><strong className="text-sky-300">Arrivée:</strong> {bookingData.dropoffLocation}</p>
        <p><strong className="text-sky-300">Prix estimé:</strong> <span className="text-emerald-400">{estimatedPrice}</span></p>
        <div className="text-center mt-6">
          <p className="text-gray-400">Temps d'attente estimé: <span className="text-sky-300 font-bold">7 minutes</span> (Simulation)</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
         <Button variant="destructive" onClick={onCancel} className="w-full sm:w-auto">
          <AlertTriangle className="mr-2 h-4 w-4" /> Annuler la course
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingTracking;