import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// Mock data for site locations
const siteLocations = [
  { id: "1", name: "Milano Nord", position: [45.4642, 9.1900] },
  { id: "2", name: "Roma Est", position: [41.9028, 12.4964] },
  { id: "3", name: "Torino Sud", position: [45.0703, 7.6869] },
];

const SiteMap = () => {
  const { t } = useLanguage();
  const defaultCenter: [number, number] = [42.8333, 12.8333]; // Center of Italy

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-primary">
          {t('dashboard.siteLocations')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: "400px", width: "100%" }}>
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={defaultCenter}
            zoom={6}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
      </CardContent>
    </Card>
  );
};

export default SiteMap;