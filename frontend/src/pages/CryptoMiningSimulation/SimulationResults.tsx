import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlantEnergyUsage {
  plant: string;
  consumption: number;
  capacity: number;
  surplusDeficit: number;
}

interface PlantRevenue {
  plant: string;
  daily: number;
}

interface PlantCosts {
  plant: string;
  setup: number;
  maintenance: number;
}

interface SimulationResultsData {
  energyUsage: {
    totalDaily: number;
    byPlant: PlantEnergyUsage[];
  };
  revenue: {
    daily: number;
    total: number;
    byPlant: PlantRevenue[];
  };
  costs: {
    total: number;
    byPlant: PlantCosts[];
  };
  roi: {
    totalRevenue: number;
    totalCosts: number;
    breakevenDays: number;
    profitabilityIndex: number;
  };
}

interface SimulationResultsProps {
  results: SimulationResultsData;
}

// Helper functions for formatting
const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return '$0';
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatEnergy = (value: number | undefined): string => {
  if (value === undefined || value === null) return '0 kWh';
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kWh`;
};

const formatDays = (value: number | undefined): string => {
  if (value === undefined || value === null) return '0 days';
  if (!isFinite(value)) return 'Never';
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} days`;
};

const formatPercentage = (value: number | undefined): string => {
  if (value === undefined || value === null) return '0%';
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
};

export function SimulationResults({ results }: SimulationResultsProps) {
  const calculateAnnualCosts = (dailyMaintenance: number) => {
    return dailyMaintenance * 365;
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Energy Usage Card */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Daily Consumption:</span>
              <span>{formatEnergy(results.energyUsage.totalDaily)}</span>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">By Plant:</h4>
              {results.energyUsage.byPlant.map((plant, index) => (
                <div key={index} className="pl-4 space-y-1 text-sm">
                  <div className="font-medium">{plant.plant}:</div>
                  <div className="flex justify-between">
                    <span>Usage:</span>
                    <span>{formatEnergy(plant.consumption)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span>{formatEnergy(plant.capacity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surplus/Deficit:</span>
                    <span>{formatEnergy(plant.surplusDeficit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Daily Revenue:</span>
              <span>{formatCurrency(results.revenue.daily)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Revenue:</span>
              <span>{formatCurrency(results.revenue.total)}</span>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">By Plant:</h4>
              {results.revenue.byPlant.map((plant, index) => (
                <div key={index} className="pl-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{plant.plant}:</span>
                    <span>{formatCurrency(plant.daily)}/day</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Costs Card */}
      <Card>
        <CardHeader>
          <CardTitle>Costs Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Initial Investment:</span>
              <span>{formatCurrency(results.costs.total)}</span>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">By Plant:</h4>
              {results.costs.byPlant.map((plant, index) => (
                <div key={index} className="pl-4 space-y-3 text-sm">
                  <div className="font-medium border-b pb-1">{plant.plant}</div>
                  
                  {/* One-time Costs */}
                  <div>
                    <div className="font-medium text-muted-foreground mb-1">One-time Costs:</div>
                    <div className="pl-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Hardware:</span>
                        <span>{formatCurrency(plant.setup)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Infrastructure Setup:</span>
                        <span>{formatCurrency(plant.setup)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Daily Operating Costs */}
                  <div>
                    <div className="font-medium text-muted-foreground mb-1">Daily Operating Costs:</div>
                    <div className="pl-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Maintenance:</span>
                        <span>{formatCurrency(plant.maintenance)}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Energy (incl. cooling):</span>
                        <span>{formatCurrency(plant.maintenance * 0.4)}/day</span>
                      </div>
                    </div>
                  </div>

                  {/* Annual Projections */}
                  <div>
                    <div className="font-medium text-muted-foreground mb-1">Annual Projections:</div>
                    <div className="pl-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Annual Maintenance:</span>
                        <span>{formatCurrency(calculateAnnualCosts(plant.maintenance))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Energy Costs:</span>
                        <span>{formatCurrency(calculateAnnualCosts(plant.maintenance * 0.4))}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Annual Operating Cost:</span>
                        <span>{formatCurrency(calculateAnnualCosts(plant.maintenance * 1.4))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle>ROI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Revenue:</span>
              <span>{formatCurrency(results.roi.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Costs:</span>
              <span>{formatCurrency(results.roi.totalCosts)}</span>
            </div>
            <div className="flex justify-between">
              <span>Break-even Point:</span>
              <span>{formatDays(results.roi.breakevenDays)}</span>
            </div>
            <div className="flex justify-between">
              <span>Profitability Index:</span>
              <span>{formatPercentage(results.roi.profitabilityIndex)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 