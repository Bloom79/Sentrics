import React, { Suspense, lazy, useEffect, useState } from "react";
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
  const [MapComponents, setMapComponents] = useState<any>(null);
  const defaultCenter: [number, number] = [42.8333, 12.8333]; // Center of Italy

  useEffect(() => {
    const loadComponents = async () => {
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
      const L = await import('leaflet');

      // Fix the icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      setMapComponents({ MapContainer, TileLayer, Marker, Popup });
    };

    loadComponents();
  }, []);

  if (!MapComponents) {
    return <div className="h-[400px] w-full bg-gray-100 animate-pulse" />;
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

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
          <MapComponent />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default SiteMap;