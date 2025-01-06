import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock data for site locations
const sites = [
  { id: '1', name: 'Milano Nord', position: [45.4642, 9.1900], status: 'operational' },
  { id: '2', name: 'Roma Est', position: [41.9028, 12.4964], status: 'warning' },
  { id: '3', name: 'Torino Sud', position: [45.0703, 7.6869], status: 'operational' },
];

const MapComponent = () => {
  return (
    <MapContainer
      center={[42.8333, 12.8333]} // Center of Italy
      zoom={6}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sites.map((site) => (
        <Marker 
          key={site.id} 
          position={site.position as [number, number]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{site.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">Status: {site.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;