import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { FileText, Printer, User, MapPin, Euro, Calendar, Clock, Hash, Car, Flag, Route as RouteIcon, CreditCard } from 'lucide-react';

const RideOrderReceipt = ({ booking, driver, client, triggerButton }) => {
  const handlePrint = () => {
    const printContent = document.getElementById(`receipt-content-${booking.id}`);
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=50,top=50,width=800,height=600');

    printWindow.document.write(`
      <html>
        <head>
          <title>Bon de Commande - Course ${booking.id.substring(0, 8).toUpperCase()}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 250);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getPaymentMethodText = (methodId) => {
    if (!methodId) return 'Non spécifié';
    if (methodId.toLowerCase().includes('cash')) return 'Espèces';
    if (methodId.toLowerCase().includes('card')) return 'Carte Bancaire';
    return 'Carte Bancaire';
  };

  const ReceiptContent = () => (
    <div id={`receipt-content-${booking.id}`} className="p-6 bg-white text-gray-800 font-sans">
      <header className="flex justify-between items-center pb-4 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Veeo</h1>
          <p className="text-sm text-gray-500">Service de voiture de transport de personne avec chauffeur</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-700">Bon de Commande</h2>
          <p className="text-sm text-gray-500">
            <Hash className="inline h-3 w-3 mr-1" />
            {booking.id.substring(0, 8).toUpperCase()}
          </p>
        </div>
      </header>
      <p className="text-center text-gray-500 text-sm pt-2">Merci d'avoir utilisé Veeo !</p>

      <section className="grid grid-cols-2 gap-8 my-6">
        <div>
          <h3 className="font-semibold text-gray-600 mb-2 border-b pb-1">Informations Client</h3>
          <div className="space-y-1 text-sm">
            <p><User className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Nom:</strong> {client?.first_name || booking.passenger_first_name} {client?.last_name || booking.passenger_last_name}</p>
            <p><User className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Email:</strong> {client?.email}</p>
            <p><User className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Téléphone:</strong> {client?.phone || booking.passenger_phone}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-600 mb-2 border-b pb-1">Informations Chauffeur</h3>
          <div className="space-y-1 text-sm">
            <p><User className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Nom:</strong> {driver?.first_name} {driver?.last_name}</p>
            <p><Car className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Véhicule:</strong> {driver?.vehicle_model}</p>
            <p><Car className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Plaque:</strong> {driver?.license_plate}</p>
          </div>
        </div>
      </section>

      <section className="my-6">
        <h3 className="font-semibold text-gray-600 mb-2 border-b pb-1">Détails de la Course</h3>
        <div className="space-y-2 text-sm">
          <p><MapPin className="inline h-4 w-4 mr-2 text-green-500" /><strong>Départ:</strong> {booking.pickup_location_text}</p>
          {(booking.stops || []).map((stop, index) => (
            <p key={`stop-receipt-${index}`}><Flag className="inline h-4 w-4 mr-2 text-yellow-500" /><strong>Arrêt {index + 1}:</strong> {stop.address}</p>
          ))}
          <p><MapPin className="inline h-4 w-4 mr-2 text-red-500" /><strong>Arrivée:</strong> {booking.dropoff_location_text}</p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <p><Calendar className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Date:</strong> {new Date(booking.booking_time).toLocaleDateString('fr-FR')}</p>
            <p><Clock className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Heure de départ:</strong> {new Date(booking.booking_time).toLocaleTimeString('fr-FR')}</p>
          </div>
           <div className="grid grid-cols-2 gap-4 pt-2">
            <p><RouteIcon className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Distance:</strong> {booking.distance_km ? `${booking.distance_km.toFixed(1)} km` : 'N/A'}</p>
            <p><Clock className="inline h-4 w-4 mr-2 text-gray-500" /><strong>Durée:</strong> {booking.actual_duration_minutes ? `${booking.actual_duration_minutes} min` : (booking.estimated_duration_minutes ? `~${booking.estimated_duration_minutes} min` : 'N/A')}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 pt-4 border-t-2 border-gray-200">
        <div className="flex justify-between items-start">
            <div className="text-sm">
                <h3 className="font-semibold text-gray-600 mb-1">Paiement</h3>
                <p className="flex items-center"><CreditCard className="inline h-4 w-4 mr-2 text-gray-500" />{getPaymentMethodText(booking.payment_method_id)}</p>
            </div>
            <div className="w-full max-w-xs text-right">
                <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prix de la course:</span>
                <span className="font-medium">{booking.actual_price?.toFixed(2) || booking.estimated_price?.toFixed(2) || 'N/A'} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
                <span className="text-gray-800">Total Payé:</span>
                <span className="text-blue-600">{booking.actual_price?.toFixed(2) || booking.estimated_price?.toFixed(2) || 'N/A'} €</span>
                </div>
            </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 mt-8 pt-4 border-t">
        <p>Pour toute question, contactez notre support.</p>
        <p>Veeo - Votre mobilité, notre priorité.</p>
      </footer>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/90 backdrop-blur-sm">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Bon de commande</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Bon de Commande</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">
          <ReceiptContent />
        </div>
        <DialogFooter className="p-4 border-t bg-gray-50 sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost">Fermer</Button>
          </DialogClose>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RideOrderReceipt;