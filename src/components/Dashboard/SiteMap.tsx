import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from 'react-dynamic-import';

const MapComponent = React.lazy(() => import("./MapComponent"));

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
        <React.Suspense fallback={<div>Loading map...</div>}>
          <MapComponent />
        </React.Suspense>
      </CardContent>
    </Card>
  );
};

export default SiteMap;