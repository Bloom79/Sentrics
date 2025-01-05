import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data structure updated to include siteId
const mockData = {
  "1": [
    { 
      month: "Gen", 
      solarProduction: 2500,
      windProduction: 1500,
      consumption: 2400,
      efficiency: 92
    },
    { 
      month: "Feb", 
      solarProduction: 2000,
      windProduction: 1000,
      consumption: 1398,
      efficiency: 94
    },
    { 
      month: "Mar", 
      solarProduction: 1200,
      windProduction: 800,
      consumption: 1800,
      efficiency: 88
    },
  ],
  "2": [
    { 
      month: "Gen", 
      solarProduction: 1800,
      windProduction: 1200,
      consumption: 2000,
      efficiency: 90
    },
    { 
      month: "Feb", 
      solarProduction: 1600,
      windProduction: 900,
      consumption: 1500,
      efficiency: 93
    },
    { 
      month: "Mar", 
      solarProduction: 1400,
      windProduction: 700,
      consumption: 1600,
      efficiency: 89
    },
  ]
};

interface DetailedMetricsProps {
  selectedSiteId: string | null;
}

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ selectedSiteId }) => {
  const { t } = useLanguage();
  
  // If no site is selected, aggregate data from all sites
  const data = selectedSiteId 
    ? mockData[selectedSiteId] || []
    : Object.values(mockData).reduce((acc, siteData) => {
        return siteData.map((monthData, index) => {
          const existingMonth = acc[index] || {
            month: monthData.month,
            solarProduction: 0,
            windProduction: 0,
            consumption: 0,
            efficiency: 0
          };
          
          return {
            month: monthData.month,
            solarProduction: existingMonth.solarProduction + monthData.solarProduction,
            windProduction: existingMonth.windProduction + monthData.windProduction,
            consumption: existingMonth.consumption + monthData.consumption,
            efficiency: Math.round((existingMonth.efficiency + monthData.efficiency) / 2) // Average efficiency
          };
        });
      }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>
          {selectedSiteId 
            ? `${t('dashboard.productionVsConsumption')} - ${t('dashboard.site')} ${selectedSiteId}`
            : t('dashboard.productionVsConsumption')} - ${t('dashboard.allSites')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer
            className="h-[300px]"
            config={{
              solarProduction: {
                theme: {
                  light: "#F97316",
                  dark: "#F97316",
                },
              },
              windProduction: {
                theme: {
                  light: "#0EA5E9",
                  dark: "#0EA5E9",
                },
              },
              consumption: {
                theme: {
                  light: "#8B5CF6",
                  dark: "#8B5CF6",
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip 
                  formatter={(value: number, name: string) => {
                    const formattedName = {
                      solarProduction: t('dashboard.solarProduction'),
                      windProduction: t('dashboard.windProduction'),
                      consumption: t('dashboard.consumption')
                    }[name] || name;
                    return [`${value} kW`, formattedName];
                  }}
                />
                <Legend 
                  formatter={(value: string) => {
                    const labels = {
                      solarProduction: t('dashboard.solarProduction'),
                      windProduction: t('dashboard.windProduction'),
                      consumption: t('dashboard.consumption')
                    };
                    return labels[value as keyof typeof labels] || value;
                  }}
                />
                <Bar 
                  dataKey="solarProduction" 
                  name="solarProduction" 
                  fill="#F97316"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="windProduction" 
                  name="windProduction" 
                  fill="#0EA5E9"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="consumption" 
                  name="consumption" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {t('dashboard.noDataAvailable')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailedMetrics;