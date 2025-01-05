import React, { Suspense, lazy } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import 'leaflet/dist/leaflet.css';

// Mock data for site locations
const siteLocations = [
  { id: "1", name: "Milano Nord", position: [45.4642, 9.1900] },
  { id: "2", name: "Roma Est", position: [41.9028, 12.4964] },
  { id: "3", name: "Torino Sud", position: [45.0703, 7.6869] },
];

// Create the map component
const MapComponent = () => {
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
  const L = require('leaflet');
  const defaultCenter: [number, number] = [42.8333, 12.8333]; // Center of Italy

  // Fix the icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  return (
    <div className="h-[400px] w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {siteLocations.map((site) => (
          <Marker 
            key={site.id} 
            position={site.position as [number, number]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{site.name}</h3>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Lazy load the map component
const LazyMap = lazy(() => new Promise((resolve) => {
  // Only load the component on the client side
  if (typeof window !== 'undefined') {
    resolve({ default: MapComponent });
  }
}));

const SiteMap = () => {
  const { t } = useLanguage();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-primary">
          {t('dashboard.siteLocations')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={
          <div className="h-[400px] w-full bg-gray-100 animate-pulse" />
        }>
          <LazyMap />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default SiteMap;