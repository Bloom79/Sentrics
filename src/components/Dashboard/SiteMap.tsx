import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from 'next/dynamic';

// We need to dynamically import the MapComponent because Leaflet requires window object
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

const SiteMap = () => {
  const { t } = useLanguage();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-primary">{t('dashboard.siteLocations')}</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <MapComponent />
      </CardContent>
    </Card>
  );
};

export default SiteMap;