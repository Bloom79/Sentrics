import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

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
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [12.4964, 41.9028],
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

      setIsMapInitialized(true);
      toast({
        title: "Map initialized successfully",
        description: "The map has been loaded with your Mapbox token.",
      });
    } catch (error) {
      toast({
        title: "Error initializing map",
        description: "Please check if your Mapbox token is valid.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
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
        {!isMapInitialized && (
          <div className="mb-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please enter your Mapbox token to initialize the map. You can find your token in the{' '}
                <a 
                  href="https://account.mapbox.com/access-tokens/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Mapbox account dashboard
                </a>
              </p>
              <Input
                type="text"
                placeholder="Enter your Mapbox token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={initializeMap} disabled={!mapboxToken}>
                Initialize Map
              </Button>
            </div>
          </div>
        )}
        <div className="h-[400px] w-full rounded-md overflow-hidden">
          <div ref={mapContainer} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteMap;