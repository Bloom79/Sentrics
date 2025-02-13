import { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

export type MapMarker = {
  lat: number;
  lng: number;
  popup?: React.ReactNode;
  markerType?: 'consumer' | 'producer' | 'prosumer';
};

export interface MapProps {
  height?: string;
  showMarker?: boolean;
  defaultLocation?: { lat: number; lng: number };
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: MapMarker[];
  fitMarkers?: boolean;
  defaultZoom?: number;
}

const DEFAULT_LOCATION: Location = {
  lat: 41.9028,
  lng: 12.4964
};

export interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  id?: string;
}

export async function getAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  if (query.length < 3) return [];
  
  try {
    const encodedAddress = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=5`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting address suggestions:', error);
    return [];
  }
}

export async function getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      }
    );
    const data = await response.json();
    return data.display_name || '';
  } catch (error) {
    console.error('Error getting address:', error);
    return '';
  }
}

export async function getCoordinatesFromAddress(address: string): Promise<Location | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      }
    );
    const data = await response.json();
    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

// Initialize marker icons
const MarkerIcons = {
  consumer: L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'marker-consumer'
  }),
  producer: L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'marker-producer'
  }),
  prosumer: L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'marker-prosumer'
  }),
  default: DefaultIcon
};

// Add CSS styles for marker colors and popup
const markerStyles = document.createElement('style');
markerStyles.textContent = `
  .marker-consumer img { filter: hue-rotate(200deg); }  /* Blue */
  .marker-producer img { filter: hue-rotate(100deg); }  /* Green */
  .marker-prosumer img { filter: hue-rotate(280deg); }  /* Purple */
  
  .user-popup .leaflet-popup-content-wrapper {
    padding: 0;
    overflow: visible;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .user-popup .leaflet-popup-content {
    margin: 0;
    width: auto !important;
    min-width: 300px;
  }
  .user-popup .leaflet-popup-close-button {
    color: #666;
    margin: 8px;
    z-index: 1000;
  }
  .user-popup .leaflet-popup-tip-container {
    width: 40px;
    height: 20px;
    position: absolute;
    left: 50%;
    margin-left: -20px;
    overflow: hidden;
    pointer-events: none;
  }
  .user-popup .leaflet-popup-tip {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .user-popup a {
    color: inherit;
    text-decoration: none;
  }
`;
document.head.appendChild(markerStyles);

export default function Map({
  height = '400px',
  showMarker = true,
  defaultLocation = { lat: 41.9028, lng: 12.4964 },
  onLocationSelect,
  markers = [],
  fitMarkers = false,
  defaultZoom = 13
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const popupRefs = useRef<Record<string, Root>>({});

  useEffect(() => {
    // Create map container if it doesn't exist
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    // Initialize map if not already initialized
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainer, {
        center: [defaultLocation.lat, defaultLocation.lng],
        zoom: defaultZoom,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          })
        ]
      });

      // Create markers layer group
      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

      // Add click handler if onLocationSelect is provided
      if (onLocationSelect) {
        mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          
          if (showMarker) {
            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lng]);
            } else {
              markerRef.current = L.marker([lat, lng]).addTo(mapRef.current!);
            }
          }
          
          onLocationSelect(lat, lng);
        });
      }

      // Add initial marker if showMarker is true
      if (showMarker) {
        markerRef.current = L.marker([defaultLocation.lat, defaultLocation.lng])
          .addTo(mapRef.current);
      }
    }

    // Clean up old popup roots
    Object.values(popupRefs.current).forEach(root => {
      try {
        root.unmount();
      } catch (e) {
        console.error('Error unmounting popup root:', e);
      }
    });
    popupRefs.current = {};

    // Update markers whenever they change
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
      
      markers.forEach((marker, index) => {
        const icon = marker.markerType ? MarkerIcons[marker.markerType] : MarkerIcons.default;
        const leafletMarker = L.marker([marker.lat, marker.lng], { icon });
        
        if (marker.popup) {
          try {
            const popupContainer = document.createElement('div');
            popupContainer.style.minWidth = '300px';
            popupContainer.style.maxWidth = '500px';
            popupContainer.style.position = 'relative';
            popupContainer.style.zIndex = '1000';
            
            // Create a wrapper for the popup content
            const contentWrapper = document.createElement('div');
            contentWrapper.style.position = 'relative';
            contentWrapper.style.zIndex = '1000';
            popupContainer.appendChild(contentWrapper);

            const root = createRoot(contentWrapper);
            root.render(marker.popup);
            popupRefs.current[`marker-${index}`] = root;
            
            const popup = L.popup({
              maxWidth: 500,
              minWidth: 300,
              className: 'user-popup',
              autoPan: true,
              autoPanPadding: [50, 50],
              closeButton: true,
              closeOnClick: false,
              offset: [1, -34]
            }).setContent(popupContainer);

            // Bind popup to marker
            leafletMarker.bindPopup(popup);

            // Open popup on marker click
            leafletMarker.on('click', () => {
              leafletMarker.openPopup();
            });

            // Handle popup open event
            popup.on('add', () => {
              // Force popup content update
              setTimeout(() => {
                mapRef.current?.invalidateSize();
                popup.update();
              }, 0);
            });
          } catch (e) {
            console.error('Error creating popup:', e);
          }
        }
        
        leafletMarker.addTo(markersLayerRef.current!);
      });

      // Fit bounds if there are markers and fitMarkers is true
      if (fitMarkers && markers.length > 0 && mapRef.current) {
        const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
        mapRef.current.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 13 // Prevent zooming in too much when fitting bounds
        });
      }
    }

    return () => {
      // Clean up popup roots
      Object.values(popupRefs.current).forEach(root => {
        try {
          root.unmount();
        } catch (e) {
          console.error('Error unmounting popup root:', e);
        }
      });
      popupRefs.current = {};

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [defaultLocation, showMarker, onLocationSelect, markers, fitMarkers, defaultZoom]);

  return (
    <div id="map" style={{ height, width: '100%', position: 'relative', zIndex: 1 }} />
  );
} 