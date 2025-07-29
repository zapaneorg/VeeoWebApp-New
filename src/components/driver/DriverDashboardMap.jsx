
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';

const carIconHtml = `
<div style="
  width: 64px; 
  height: 64px; 
  background-image: url('https://storage.googleapis.com/hostinger-horizons-assets-prod/c25e70e2-4475-4b3f-9d20-1bf18b35125c/3be99fda5380a0ecc5147b38fff038a7.png'); 
  background-size: cover; 
  background-position: center; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  position: relative;
">
</div>`;

const driverIcon = new L.DivIcon({
  html: carIconHtml,
  className: '',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
});

const pickupIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'hue-rotate-120'
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'hue-rotate-330'
});

const rideColors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];

const DriverDashboardMap = ({ drivers = [], rides = [], user, activeRide, isHomePage = false, isNotifying = false }) => {
  const strasbourgCoords = [48.58392, 7.74553];
  const mapCenter = isHomePage ? strasbourgCoords : (user && user.lat && user.lng ? [user.lat, user.lng] : strasbourgCoords);
  const zoomLevel = isHomePage ? 12 : 13;

  return (
    <div className="relative h-full w-full">
      <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {drivers.map(driver => (
          driver.lat && driver.lng && (
            <Marker key={driver.id} position={[driver.lat, driver.lng]} icon={driverIcon}>
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
                      {user && driver.id === user.id ? (
                        <span className="text-xs font-semibold text-primary">(Vous)</span>
                      ) : (
                        <span className="text-xs text-gray-600">Statut: {driver.status}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full space-y-1.5 text-xs border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Véhicule:</span>
                      <span className="font-medium text-gray-900 text-right">{driver.vehicle_model || 'Non spécifié'}</span>
                    </div>
                     <div className="flex items-center justify-between">
                      <span className="text-gray-600">Plaque:</span>
                      <span className="font-medium text-gray-900 text-right">{driver.vehicle_plate || 'Non spécifié'}</span>
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
          )
        ))}
        
        {!activeRide && rides.map((ride, index) => (
          <React.Fragment key={ride.id}>
            <Marker position={[ride.pickup_lat, ride.pickup_lng]} icon={pickupIcon}>
              <Popup>
                <strong>Départ:</strong><br />{ride.pickup_location_text}
              </Popup>
            </Marker>
            <Marker position={[ride.dropoff_lat, ride.dropoff_lng]} icon={dropoffIcon}>
              <Popup>
                <strong>Arrivée:</strong><br />{ride.dropoff_location_text}
              </Popup>
            </Marker>
            <Polyline
              positions={[[ride.pickup_lat, ride.pickup_lng], [ride.dropoff_lat, ride.dropoff_lng]]}
              color={rideColors[index % rideColors.length]}
              weight={4}
              opacity={0.8}
            />
          </React.Fragment>
        ))}

        {activeRide && (
          <React.Fragment>
            <Marker position={[activeRide.pickup_lat, activeRide.pickup_lng]} icon={pickupIcon}>
              <Popup>
                <strong>Départ:</strong><br />{activeRide.pickup_location_text}
              </Popup>
            </Marker>
            <Marker position={[activeRide.dropoff_lat, activeRide.dropoff_lng]} icon={dropoffIcon}>
              <Popup>
                <strong>Arrivée:</strong><br />{activeRide.dropoff_location_text}
              </Popup>
            </Marker>
            <Polyline
              positions={[[activeRide.pickup_lat, activeRide.pickup_lng], [activeRide.dropoff_lat, activeRide.dropoff_lng]]}
              color="#3498db"
              weight={5}
              opacity={1}
            />
          </React.Fragment>
        )}
      </MapContainer>
      {isNotifying && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          animate={{
            backgroundImage: [
              'radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)',
              'radial-gradient(circle at center, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)',
              'radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)',
            ],
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
};

export default DriverDashboardMap;
