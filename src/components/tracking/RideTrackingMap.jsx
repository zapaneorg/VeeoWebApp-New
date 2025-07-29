import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import "leaflet-rotatedmarker";

const carIconHtml = `
<div style="
  width: 50px; 
  height: 50px; 
  background-image: url('https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/3be99fda5380a0ecc5147b38fff038a7.png'); 
  background-size: contain;
  background-repeat: no-repeat; 
  background-position: center; 
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
  transform: translateY(-50%); /* Adjust vertical alignment */
">
</div>`;


const driverIcon = new L.DivIcon({
  html: carIconHtml,
  className: '',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

const createLocationIcon = (color) => new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <path fill="${color}" d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      <circle cx="12" cy="9.5" r="2" fill="white"/>
    </svg>`
  )}`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const pickupIcon = createLocationIcon('#10b981'); // green
const dropoffIcon = createLocationIcon('#ef4444'); // red

const MapController = ({ booking, driver, shouldAutoCenter }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!shouldAutoCenter) return;
    
    const points = [];
    if (booking?.pickup_lat && booking?.pickup_lng) {
      points.push([booking.pickup_lat, booking.pickup_lng]);
    }
    if (booking?.dropoff_lat && booking?.dropoff_lng) {
      points.push([booking.dropoff_lat, booking.dropoff_lng]);
    }
    if (driver?.lat && driver?.lng) {
      points.push([driver.lat, driver.lng]);
    }
    
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 });
    }
  }, [map, booking, driver, shouldAutoCenter]);
  
  return null;
};

const AnimatedDriverMarker = ({ position, rotation, driver }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
        markerRef.current.setLatLng(position);
        if (rotation !== undefined && rotation !== null) {
            markerRef.current.setRotationAngle(rotation);
        }
    }
  }, [position, rotation]);

  if (!position || !position[0] || !position[1]) return null;

  return (
    <Marker 
      ref={markerRef} 
      position={position} 
      icon={driverIcon} 
      rotationAngle={rotation || 0} 
      rotationOrigin="center center"
    >
      <Popup>
        <div className="flex flex-col items-center space-y-3 p-2 min-w-[200px]">
          <div className="flex items-center space-x-3 w-full">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary shrink-0">
              {driver.profile_pic_url ? (
                <img 
                  src={driver.profile_pic_url} 
                  alt={`${driver.first_name} ${driver.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {driver.first_name?.[0]}{driver.last_name?.[0]}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <p className="font-bold text-gray-900 text-sm">
                {driver.first_name} {driver.last_name}
              </p>
              <span className="text-xs text-gray-600">Statut: {driver.status}</span>
            </div>
          </div>
          
          <div className="w-full space-y-1.5 text-xs border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Véhicule:</span>
              <span className="font-medium text-gray-900 text-right">{driver.vehicle_model || 'Non spécifié'}</span>
            </div>
              <div className="flex items-center justify-between">
              <span className="text-gray-600">Plaque:</span>
              <span className="font-medium text-gray-900 text-right">{driver.license_plate || 'Non spécifié'}</span>
            </div>
            {driver.phone && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Téléphone:</span>
                <a 
                  href={`tel:${driver.phone}`} 
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  {driver.phone}
                </a>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-xs pt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium">En ligne</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const RideTrackingMap = ({ booking, driver, rotation }) => {
  const mapRef = useRef();
  const [shouldAutoCenter, setShouldAutoCenter] = useState(true);
  
  const centerPosition = booking?.pickup_lat 
    ? [booking.pickup_lat, booking.pickup_lng] 
    : [48.8566, 2.3522];

  const handleMapInteraction = () => {
    if (shouldAutoCenter) {
      setShouldAutoCenter(false);
    }
  };

  return (
    <div className="h-full w-full">
      <MapContainer 
        ref={mapRef} 
        center={centerPosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
        whenReady={() => setShouldAutoCenter(true)}
        onDragStart={handleMapInteraction}
        onZoomStart={handleMapInteraction}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <MapController booking={booking} driver={driver} shouldAutoCenter={shouldAutoCenter} />
        
        {booking?.pickup_lat && booking?.pickup_lng && (
          <Marker position={[booking.pickup_lat, booking.pickup_lng]} icon={pickupIcon}>
            <Popup>Départ: {booking.pickup_location_text}</Popup>
          </Marker>
        )}
        
        {booking?.dropoff_lat && booking?.dropoff_lng && (
          <Marker position={[booking.dropoff_lat, booking.dropoff_lng]} icon={dropoffIcon}>
            <Popup>Arrivée: {booking.dropoff_location_text}</Popup>
          </Marker>
        )}
        
        {driver?.lat && driver?.lng && booking?.status !== 'completed' && booking?.status !== 'cancelled' && (
          <AnimatedDriverMarker 
            position={[driver.lat, driver.lng]} 
            rotation={rotation}
            driver={driver}
          />
        )}
        
        {booking?.pickup_lat && booking?.dropoff_lat && (
          <Polyline 
            positions={[[booking.pickup_lat, booking.pickup_lng], [booking.dropoff_lat, booking.dropoff_lng]]} 
            color="#a8a29e" 
            weight={4}
            dashArray="5, 10"
          />
        )}
        
        {driver?.lat && booking?.pickup_lat && ['confirmed', 'en_route_pickup'].includes(booking.status) && (
            <Polyline 
                positions={[[driver.lat, driver.lng], [booking.pickup_lat, booking.pickup_lng]]}
                color="#0ea5e9"
                weight={5}
            />
        )}

        {driver?.lat && booking?.dropoff_lat && booking.status === 'in_progress' && (
            <Polyline 
                positions={[[driver.lat, driver.lng], [booking.dropoff_lat, booking.dropoff_lng]]}
                color="#8b5cf6"
                weight={5}
            />
        )}
      </MapContainer>
      
      {!shouldAutoCenter && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setShouldAutoCenter(true)}
          className="absolute bottom-40 sm:bottom-24 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Recentrer la carte"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default RideTrackingMap;