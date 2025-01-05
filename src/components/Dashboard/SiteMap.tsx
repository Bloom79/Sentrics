import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";

// Dynamically import MapComponent with no SSR
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-gray-100">
      <p>Loading map...</p>
    </div>
  ),
});

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
        <MapComponent />
      </CardContent>
    </Card>
  );
};

export default SiteMap;