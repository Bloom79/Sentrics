import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

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
        <div className="h-[400px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Map loading temporarily disabled</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteMap;