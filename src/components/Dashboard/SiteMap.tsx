import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock data for site locations
const siteLocations = [
  { id: "1", name: "Milano Nord", coordinates: [45.4642, 9.1900], status: "operational" },
  { id: "2", name: "Roma Est", coordinates: [41.9028, 12.4964], status: "warning" },
  { id: "3", name: "Torino Sud", coordinates: [45.0703, 7.6869], status: "operational" },
];

const SiteMap = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Site Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full rounded-md overflow-hidden">
          <MapContainer
            center={[42.8333, 12.8333]} // Center of Italy
            zoom={6}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {siteLocations.map((site) => (
              <Marker 
                key={site.id} 
                position={site.coordinates as [number, number]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{site.name}</h3>
                    <p className="text-sm capitalize">{site.status}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteMap;