import { ReactNode } from 'react';

export interface Location {
  lat: number;
  lng: number;
}

export interface UserMapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  email: string;
  type: 'consumer' | 'producer' | 'prosumer';
  status: string;
  address?: string;
  pod_id?: string;
  total_production?: number;
  total_consumption?: number;
  markerType: 'consumer' | 'producer' | 'prosumer';
  popup?: ReactNode;
}

export interface MapProps {
  height?: string;
  showMarker?: boolean;
  defaultLocation?: Location;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: UserMapMarker[];
  fitMarkers?: boolean;
  defaultZoom?: number;
} 