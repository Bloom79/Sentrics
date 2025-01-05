import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import MapComponent from "./MapComponent";

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