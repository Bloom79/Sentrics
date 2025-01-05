import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// Mock data for site locations
const siteLocations = [
  { id: "1", name: "Milano Nord", coordinates: [45.4642, 9.1900], status: "operational" },
  { id: "2", name: "Roma Est", coordinates: [41.9028, 12.4964], status: "warning" },
  { id: "3", name: "Torino Sud", coordinates: [45.0703, 7.6869], status: "operational" },
];

const SiteMap = () => {
  const { t } = useLanguage();
  const defaultCenter: [number, number] = [42.8333, 12.8333]; // Center of Italy

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
            center={defaultCenter}
            zoom={6}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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