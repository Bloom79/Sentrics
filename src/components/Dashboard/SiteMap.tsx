import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import 'leaflet/dist/leaflet.css';

// Mock data for site locations
const siteLocations = [
  { id: "1", name: "Milano Nord", position: [45.4642, 9.1900] },
  { id: "2", name: "Roma Est", position: [41.9028, 12.4964] },
  { id: "3", name: "Torino Sud", position: [45.0703, 7.6869] },
];

const SiteMap = () => {
  const { t } = useLanguage();
  const [Map, setMap] = useState<any>(null);

  useEffect(() => {
    // Only import the map components on the client side
    if (typeof window !== 'undefined') {
      Promise.all([
        import('leaflet'),
        import('react-leaflet')
      ]).then(([L, { MapContainer, TileLayer, Marker, Popup }]) => {
        // Fix Leaflet's icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create the map component
        const MapComponent = () => (
          <div className="h-[400px] w-full relative">
            <MapContainer
              center={[42.8333, 12.8333]} // Center of Italy
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

        setMap(() => MapComponent);
      }).catch(error => {
        console.error('Error loading map:', error);
      });
    }
  }, []);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-primary">
          {t('dashboard.siteLocations')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Map ? (
          <Map />
        ) : (
          <div className="h-[400px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SiteMap;