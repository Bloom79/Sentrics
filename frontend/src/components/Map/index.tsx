import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import Leaflet.draw after Leaflet
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Debug logging for Leaflet availability
console.log('Leaflet loaded:', !!L);
console.log('Leaflet.draw loaded:', !!(L.Control && L.Control.Draw));
console.log('Available Leaflet controls:', Object.keys(L.Control || {}));

// Initialize default icon once
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Set default icon globally
L.Marker.prototype.options.icon = DefaultIcon;

export interface Location {
  lat: number;
  lng: number;
}

export interface MapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Partial<Location>;
  onLocationChange: (location: Location) => void;
  height?: string;
  zoom?: number;
  showMarker?: boolean;
  enableDraw?: boolean;
}

const DEFAULT_LOCATION: Location = {
  lat: 41.9028,
  lng: 12.4964
};

export default function Map({
  value,
  onLocationChange,
  height = '400px',
  zoom = 13,
  showMarker = true,
  enableDraw = false,
  ...props
}: MapProps) {
  console.log('Map component rendering with props:', { value, showMarker, enableDraw });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  const location: Location = {
    lat: value?.lat ?? DEFAULT_LOCATION.lat,
    lng: value?.lng ?? DEFAULT_LOCATION.lng
  };

  // Initialize map
  useEffect(() => {
    console.log('Map initialization effect running');
    
    if (!mapContainerRef.current) {
      console.warn('Map container ref not available');
      return;
    }

    try {
      // Create map instance
      console.log('Creating map instance');
      const map = L.map(mapContainerRef.current).setView([location.lat, location.lng], zoom);
      mapRef.current = map;
      console.log('Map instance created successfully');

      // Add tile layer
      console.log('Adding tile layer');
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Add marker if enabled
      if (showMarker) {
        console.log('Adding marker to map');
        const marker = L.marker([location.lat, location.lng], {
          draggable: true
        }).addTo(map);
        
        markerRef.current = marker;

        // Handle marker drag
        marker.on('dragend', () => {
          const position = marker.getLatLng();
          console.log('Marker dragged to:', position);
          onLocationChange({ lat: position.lat, lng: position.lng });
        });
      }

      // Initialize draw controls if enabled
      if (enableDraw) {
        console.log('Initializing draw controls');
        console.log('Leaflet.Draw availability check:', {
          L: !!L,
          Control: !!(L.Control),
          Draw: !!(L.Control && L.Control.Draw)
        });

        try {
          // Initialize the FeatureGroup to store editable layers
          console.log('Creating FeatureGroup');
          const drawnItems = new L.FeatureGroup();
          map.addLayer(drawnItems);
          drawnItemsRef.current = drawnItems;

          // Dynamically import Leaflet.draw if needed
          if (!L.Control.Draw) {
            console.warn('L.Control.Draw not found, attempting dynamic import');
            require('leaflet-draw');
          }

          // Double-check Leaflet.draw availability
          if (L.Control.Draw) {
            console.log('Creating draw control');
            const drawControl = new L.Control.Draw({
              draw: {
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: {
                  allowIntersection: false,
                  drawError: {
                    color: '#e1e4e8',
                    message: '<strong>Polygon edges cannot cross!</strong>'
                  },
                  shapeOptions: {
                    color: '#0969da'
                  }
                }
              },
              edit: {
                featureGroup: drawnItems,
                remove: true
              }
            });

            console.log('Adding draw control to map');
            map.addControl(drawControl);

            // Handle draw events
            map.on(L.Draw.Event.CREATED, (e: any) => {
              console.log('Draw created event:', e);
              const layer = e.layer;
              drawnItems.addLayer(layer);
            });

            map.on(L.Draw.Event.EDITED, (e: any) => {
              console.log('Draw edited event:', e);
              const layers = e.layers;
              layers.eachLayer((layer: any) => {
                console.log('Edited layer:', layer);
              });
            });

            map.on(L.Draw.Event.DELETED, () => {
              console.log('Draw deleted event');
            });
          } else {
            console.error('Leaflet.Draw still not available after dynamic import');
          }
        } catch (error) {
          console.error('Error initializing Leaflet.draw:', error);
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }
      }

      // Handle map click
      map.on('click', (e: L.LeafletMouseEvent) => {
        console.log('Map clicked at:', e.latlng);
        const { lat, lng } = e.latlng;
        onLocationChange({ lat, lng });
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
      });

      // Cleanup
      return () => {
        console.log('Cleaning up map instance');
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          markerRef.current = null;
          drawnItemsRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error in map initialization:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  }, []);

  // Update map when props change
  useEffect(() => {
    if (!mapRef.current) {
      console.log('Map ref not available for update');
      return;
    }

    console.log('Updating map view:', { lat: location.lat, lng: location.lng, zoom });
    mapRef.current.setView([location.lat, location.lng], zoom);
    
    if (markerRef.current) {
      console.log('Updating marker position');
      markerRef.current.setLatLng([location.lat, location.lng]);
    }
  }, [location.lat, location.lng, zoom]);

  return (
    <Card>
      <div 
        ref={mapContainerRef} 
        style={{ height, width: '100%' }} 
        className="leaflet-container"
        {...props}
      />
    </Card>
  );
} 