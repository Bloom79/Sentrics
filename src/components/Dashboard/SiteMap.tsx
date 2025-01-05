import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data for site locations with properly typed coordinates
const siteLocations: Array<{
  id: string;
  name: string;
  coordinates: [number, number];
  status: "operational" | "warning";
}> = [
  { id: "1", name: "Milano Nord", coordinates: [9.1900, 45.4642], status: "operational" },
  { id: "2", name: "Roma Est", coordinates: [12.4964, 41.9028], status: "warning" },
  { id: "3", name: "Torino Sud", coordinates: [7.6869, 45.0703], status: "operational" },
];

const SiteMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your Mapbox token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [12.4964, 41.9028] as [number, number], // Explicitly type as tuple
      zoom: 5
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each site
    siteLocations.forEach(site => {
      const markerElement = document.createElement('div');
      markerElement.className = 'w-4 h-4 rounded-full';
      markerElement.style.backgroundColor = site.status === 'operational' ? '#10B981' : '#F59E0B';
      markerElement.style.border = '2px solid white';
      markerElement.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${site.name}</h3>
            <p class="text-sm capitalize">${site.status}</p>
          </div>
        `);

      // Add marker with properly typed coordinates
      new mapboxgl.Marker(markerElement)
        .setLngLat(site.coordinates)
        .setPopup(popup)
        .addTo(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Site Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full rounded-md overflow-hidden">
          <div ref={mapContainer} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteMap;