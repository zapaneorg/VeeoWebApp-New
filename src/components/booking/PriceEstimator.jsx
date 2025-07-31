import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, Clock, MapPin } from 'lucide-react';

const PriceEstimator = ({ 
  distance, 
  duration, 
  vehicleType, 
  timeOfDay, 
  demand = 'normal',
  isSharedRide = false 
}) => {
  const priceBreakdown = useMemo(() => {
    const basePrice = 5.00;
    const pricePerKm = getVehicleRate(vehicleType);
    const pricePerMinute = 0.25;
    
    let distancePrice = distance * pricePerKm;
    let timePrice = duration * pricePerMinute;
    
    // Time-based surge pricing
    const surgeMultiplier = getSurgeMultiplier(timeOfDay, demand);
    
    // Shared ride discount
    const sharedDiscount = isSharedRide ? 0.8 : 1;
    
    const subtotal = (basePrice + distancePrice + timePrice) * surgeMultiplier * sharedDiscount;
    const total = Math.max(subtotal, 8.00); // Minimum fare
    
    return {
      basePrice,
      distancePrice,
      timePrice,
      surgeMultiplier,
      sharedDiscount,
      subtotal,
      total,
      breakdown: [
        { label: 'Prix de base', amount: basePrice },
        { label: `Distance (${distance.toFixed(1)} km)`, amount: distancePrice },
        { label: `Temps (${duration} min)`, amount: timePrice },
        ...(surgeMultiplier > 1 ? [{ label: 'Majoration demande', amount: (subtotal / surgeMultiplier) * (surgeMultiplier - 1) }] : []),
        ...(isSharedRide ? [{ label: 'Réduction course partagée', amount: -((subtotal / sharedDiscount) - subtotal) }] : []),
      ],
    };
  }, [distance, duration, vehicleType, timeOfDay, demand, isSharedRide]);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <Calculator className="mr-2 h-5 w-5" />
          Estimation détaillée
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {priceBreakdown.breakdown.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.label}</span>
            <span className={`font-medium ${item.amount < 0 ? 'text-green-600' : 'text-gray-800'}`}>
              {item.amount < 0 ? '-' : ''}{Math.abs(item.amount).toFixed(2)}€
            </span>
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span className="text-blue-800">Total</span>
          <span className="text-blue-800">{priceBreakdown.total.toFixed(2)}€</span>
        </div>
        {priceBreakdown.surgeMultiplier > 1 && (
          <div className="flex items-center text-xs text-amber-600 bg-amber-50 p-2 rounded">
            <TrendingUp className="mr-1 h-3 w-3" />
            Forte demande - Majoration x{priceBreakdown.surgeMultiplier}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const getVehicleRate = (vehicleType) => {
  const rates = {
    veooX: 1.50,
    veooXL: 1.80,
    veooPet: 1.60,
    veooGreen: 1.40,
    veooVan: 2.20,
  };
  return rates[vehicleType] || rates.veooX;
};

const getSurgeMultiplier = (timeOfDay, demand) => {
  const hour = new Date().getHours();
  
  // Peak hours: 7-9 AM, 5-7 PM
  const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  
  const demandMultipliers = {
    low: 0.9,
    normal: 1.0,
    high: 1.3,
    very_high: 1.6,
  };
  
  let multiplier = demandMultipliers[demand] || 1.0;
  
  if (isPeakHour) {
    multiplier *= 1.2;
  }
  
  return Math.round(multiplier * 10) / 10; // Round to 1 decimal
};

export default PriceEstimator;