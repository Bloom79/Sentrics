import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface BoundaryInfoProps {
  boundary: GeoJSON.Polygon;
  maxRadius?: number;
}

export function BoundaryInfo({ boundary, maxRadius = 1000 }: BoundaryInfoProps) {
  // Calculate center point from boundary coordinates
  const coordinates = boundary.coordinates[0];
  const center = coordinates.reduce(
    (acc, coord) => {
      acc[0] += coord[0];
      acc[1] += coord[1];
      return acc;
    },
    [0, 0]
  ).map(sum => sum / coordinates.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Boundary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] rounded-md overflow-hidden">
          <MapContainer
            center={[center[1], center[0]]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON
              data={{
                type: 'Feature',
                properties: {},
                geometry: boundary
              }}
            />
            {maxRadius && (
              <circle
                center={[center[1], center[0]]}
                radius={maxRadius}
                pathOptions={{ color: 'red', dashArray: '5, 10' }}
              />
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
} 