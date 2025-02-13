import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SimulationResults } from './SimulationResults';
import { SimulationGraphs } from './SimulationGraphs';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { getMarketData, MarketData } from "@/lib/market-data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlantData {
  id: string;
  name: string;
  type: string;
  capacity: number;
  site_id: string;
  sites: {
    name: string;
  };
}

interface Plant extends Omit<PlantData, 'sites'> {
  site_name?: string;
  efficiency?: number;
  operational_status?: string;
}

interface PlantAllocation {
  plantId: string;
  minerCount: number;
  energyAllocation: number;
}

interface PlantConfig {
  capacity: number;
  efficiency: number;
  annualProduction: number;  // MWh per year
  hardwareType: string;
  minerCount: number;
  hardwareCost: number;
  setupCosts: {
    infrastructure: number;
    electrical: number;
    cooling: number;
    security: number;
    installation: number;
  };
  operationalCosts: {
    cooling: number;
    maintenance: number;
    security: number;
  };
  useExistingInfrastructure: boolean;
  energyAllocation: number;
  coolingSystem: {
    efficiency: number; // 0.3 to 0.5 (30% to 50%)
    electricityCost: number; // $ per kWh
    technology: 'air' | 'immersion';
  };
}

interface SimulationParams {
  globalMarketParams: {
    cryptoPrice: number;
    miningMarketValue: number;
    networkDifficulty: number;
    simulationPeriod: number;
    includeMarketVolatility: boolean;
    includeDynamicEnergy: boolean;
  };
  plantConfigs: { [key: string]: PlantConfig };
  selectedPlants: string[];
}

// Hardware market prices
const HARDWARE_COSTS = {
  asic: {
    cost: 10000,    // Antminer S19 Pro ~$10,000
    power: 3.25,    // 3.25 kW
    hashrate: 110,  // 110 TH/s
    name: "ASIC Miners (Antminer S19 Pro)"
  },
  gpu: {
    cost: 2000,     // NVIDIA RTX 4090 ~$2,000
    power: 0.32,    // 320W = 0.32 kW
    hashrate: 100,  // 100 MH/s for ETH
    name: "GPU Miners (NVIDIA RTX 4090)"
  }
} as const;

// Add cooling constants
const COOLING_DEFAULTS = {
  air: {
    efficiency: 0.5, // 50% - less efficient
    setupCost: 15000,
  },
  immersion: {
    efficiency: 0.3, // 30% - more efficient
    setupCost: 25000,
  }
} as const;

// Add helper component for info tooltips
const InfoTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className="text-muted-foreground hover:text-foreground ml-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function CryptoMiningSimulation() {
  const [activeTab, setActiveTab] = useState("parameters");
  const [params, setParams] = useState<SimulationParams>({
    globalMarketParams: {
      cryptoPrice: 40000,
      miningMarketValue: 0.15,
      networkDifficulty: 1,
      simulationPeriod: 12,
      includeMarketVolatility: true,
      includeDynamicEnergy: true
    },
    plantConfigs: {},
    selectedPlants: []
  });

  const [results, setResults] = useState<any>(null);

  // Add state for auto-refresh control
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  // Fetch plants data with proper typing
  const { data: plants = [] } = useQuery<Plant[]>({
    queryKey: ['plants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select(`
          id,
          name,
          type,
          capacity,
          site_id,
          sites:sites (
            name
          )
        `) as { data: PlantData[] | null, error: any };
      
      if (error) throw error;
      if (!data) return [];
      
      const processedPlants = data.map(plant => ({
        id: plant.id,
        name: plant.name,
        type: plant.type,
        capacity: plant.capacity,
        site_id: plant.site_id,
        site_name: plant.sites?.name,
        efficiency: 1.0,
        operational_status: 'active'
      }));

      // Initialize plant configs with realistic values
      const initialConfigs: { [key: string]: PlantConfig } = {};
      processedPlants.forEach(plant => {
        // Calculate base values based on plant type and capacity
        const totalCapacity = processedPlants.reduce((sum, p) => sum + p.capacity, 0);
        const capacityShare = plant.capacity / totalCapacity;
        const baseSetup = plant.type === 'solar' ? 1.2 : 1.0; // Solar requires more infrastructure
        const baseCooling = plant.type === 'wind' ? 0.8 : 1.0; // Wind plants have better natural cooling

        // Hardware costs based on current market prices
        const asicCost = 10000; // Antminer S19 Pro ~$10,000
        const gpuCost = 2000;   // NVIDIA RTX 4090 ~$2,000

        // Calculate optimal miner count based on capacity
        const minerPowerConsumption = 3.25; // kW per ASIC miner
        const optimalMinerCount = Math.floor(plant.capacity * 0.8 / minerPowerConsumption); // Using 80% of capacity

        // Calculate initial annual production based on capacity and efficiency
        const initialAnnualProduction = calculateAnnualFromEfficiency(plant.capacity, plant.efficiency * 100);

        initialConfigs[plant.id] = {
          capacity: plant.capacity,
          efficiency: plant.efficiency,
          annualProduction: initialAnnualProduction, // Add annual production
          hardwareType: 'asic', // Default to ASIC miners
          minerCount: optimalMinerCount,
          hardwareCost: asicCost,
          setupCosts: {
            infrastructure: 50000 * baseSetup, // Base infrastructure cost
            electrical: 25000 * (plant.capacity / 1000), // Scales with capacity
            cooling: 15000 * baseCooling * (optimalMinerCount / 100), // Scales with miner count
            security: 10000, // Base security setup
            installation: 5000 * (optimalMinerCount / 100) // Scales with miner count
          },
          operationalCosts: {
            cooling: 50 * baseCooling * optimalMinerCount, // Daily cooling cost per miner
            maintenance: 30 * optimalMinerCount, // Daily maintenance cost per miner
            security: 100 // Daily security cost
          },
          useExistingInfrastructure: true,
          energyAllocation: capacityShare,
          coolingSystem: {
            technology: 'air',
            efficiency: COOLING_DEFAULTS.air.efficiency,
            electricityCost: 0.10 // Default to $0.10 per kWh
          }
        };
      });

      console.log('[Plant Configuration] Initialized configs:', initialConfigs);

      setParams(p => ({
        ...p,
        plantConfigs: initialConfigs
      }));

      return processedPlants;
    }
  });

  // Update the market data query to respect auto-refresh setting
  const { data: marketData, isLoading: isLoadingMarket, refetch: refetchMarketData } = useQuery({
    queryKey: ['marketData'],
    queryFn: getMarketData,
    refetchInterval: autoRefreshEnabled ? 5 * 60 * 1000 : false, // Only auto-refresh if enabled
  });

  // Update useEffect to preserve manual values
  useEffect(() => {
    if (marketData) {
      setParams(p => ({
        ...p,
        globalMarketParams: {
          ...p.globalMarketParams,
          // Only update if values haven't been manually changed
          cryptoPrice: p.globalMarketParams.cryptoPrice === 40000 ? marketData.cryptoPrice : p.globalMarketParams.cryptoPrice,
          miningMarketValue: p.globalMarketParams.miningMarketValue === 0.15 ? marketData.miningMarketValue : p.globalMarketParams.miningMarketValue,
          networkDifficulty: p.globalMarketParams.networkDifficulty === 1 ? marketData.networkDifficulty : p.globalMarketParams.networkDifficulty
        }
      }));
    }
  }, [marketData]);

  // Calculate optimal miner distribution based on plant capacities
  const calculateOptimalMinerDistribution = () => {
    const selectedPlantsData = plants.filter(plant => params.selectedPlants.includes(plant.id));
    const totalCapacity = selectedPlantsData.reduce((sum, plant) => sum + (plant.capacity || 0), 0);
    
    const allocations: { [key: string]: number } = {};
    selectedPlantsData.forEach(plant => {
      const plantShare = (plant.capacity || 0) / totalCapacity;
      allocations[plant.id] = plantShare;
    });

    return allocations;
  };

  // Update allocations when plants selection changes
  useEffect(() => {
    const optimalAllocations = calculateOptimalMinerDistribution();
    setParams(p => ({
      ...p,
      plantAllocations: optimalAllocations
    }));
  }, [params.selectedPlants]);

  const calculateTotalPowerPerMiner = (minerPower: number, coolingEfficiency: number) => {
    // Total power includes both miner and cooling power
    const coolingPower = minerPower * coolingEfficiency;
    return minerPower + coolingPower;
  };

  const calculateMaxMiners = (dailyEnergy: number, minerPower: number, coolingEfficiency: number, energyAllocation: number = 100) => {
    // Convert daily energy from MWh to kWh
    const availableEnergy = dailyEnergy * 1000 * (energyAllocation / 100);
    // Calculate total power consumption per miner including cooling
    const totalPowerPerMiner = calculateTotalPowerPerMiner(minerPower, coolingEfficiency);
    // Calculate daily consumption per miner (kWh/day)
    const dailyMinerConsumption = totalPowerPerMiner * 24;
    // Calculate max miners
    return Math.floor(availableEnergy / dailyMinerConsumption);
  };

  const calculateDailyEnergyConsumption = (plantId: string) => {
    const plantConfig = params.plantConfigs[plantId];
    if (!plantConfig) return 0;
    
    const hardwareType = plantConfig.hardwareType as keyof typeof HARDWARE_COSTS;
    const minerPower = HARDWARE_COSTS[hardwareType].power; // kW
    const totalPowerPerMiner = calculateTotalPowerPerMiner(minerPower, plantConfig.coolingSystem.efficiency);
    const dailyConsumption = plantConfig.minerCount * totalPowerPerMiner * 24; // kWh per day
    return dailyConsumption * plantConfig.efficiency; // Apply plant efficiency
  };

  const calculateDailyRevenue = (plantId: string) => {
    const plantConfig = params.plantConfigs[plantId];
    if (!plantConfig) return 0;
    
    const hardwareType = plantConfig.hardwareType as keyof typeof HARDWARE_COSTS;
    const hashRatePerMiner = HARDWARE_COSTS[hardwareType].hashrate;
    const totalHashRate = plantConfig.minerCount * hashRatePerMiner;
    
    // Calculate daily BTC reward based on hashrate contribution and current BTC price
    const networkHashRate = 500e6; // Current network hashrate in TH/s
    const dailyBTCReward = 144 * 6.25; // Blocks per day * BTC per block
    const hashShareRatio = totalHashRate / networkHashRate;
    const dailyBTCEarned = dailyBTCReward * hashShareRatio;
    
    return dailyBTCEarned * params.globalMarketParams.cryptoPrice;
  };

  // Add maintenance cost calculation constants
  const MAINTENANCE_COSTS = {
    asic: {
      daily: 2.5,      // $2.50 per day per unit
      description: "Includes regular cleaning, thermal paste replacement, and fan maintenance",
      components: {
        cleaning: 0.5,  // Daily cleaning cost
        thermal: 1.0,   // Thermal maintenance
        fans: 1.0      // Fan maintenance
      }
    },
    gpu: {
      daily: 1.5,      // $1.50 per day per unit
      description: "Includes dusting, thermal pad replacement, and general maintenance",
      components: {
        cleaning: 0.3,  // Daily cleaning cost
        thermal: 0.7,  // Thermal maintenance
        general: 0.5   // General maintenance
      }
    }
  } as const;

  const calculatePlantSpecificCosts = (plantId: string) => {
    const plantConfig = params.plantConfigs[plantId];
    if (!plantConfig) return { setup: 0, cooling: 0, maintenance: 0 };

    const hardwareType = plantConfig.hardwareType as keyof typeof HARDWARE_COSTS;
    
    // Calculate maintenance cost per day
    const dailyMaintenanceCost = plantConfig.minerCount * MAINTENANCE_COSTS[hardwareType].daily;
    
    // Calculate setup costs
    const setupCosts = plantConfig.useExistingInfrastructure
      ? (plantConfig.setupCosts.electrical + plantConfig.setupCosts.cooling + plantConfig.setupCosts.installation) * 0.5
      : Object.values(plantConfig.setupCosts).reduce((sum, cost) => sum + cost, 0);

    return {
      setup: setupCosts,
      maintenance: dailyMaintenanceCost,
      maintenanceBreakdown: {
        ...MAINTENANCE_COSTS[hardwareType].components
      }
    };
  };

  const calculateBreakevenDays = (totalCosts: number, dailyRevenue: number) => {
    if (dailyRevenue <= 0) return Infinity;
    return totalCosts / dailyRevenue;
  };

  const runSimulation = async () => {
    console.log('Running simulation with params:', params);
    
    try {
      let totalEnergyConsumption = 0;
      let totalRevenue = 0;
      let totalCosts = 0;
      const plantSpecificResults: any[] = [];

      // Calculate per-plant metrics
      const selectedPlantsData = plants.filter(plant => params.selectedPlants.includes(plant.id));
      
      selectedPlantsData.forEach(plant => {
        const plantConfig = params.plantConfigs[plant.id];
        if (!plantConfig) return;
        
        // Calculate plant-specific energy consumption including cooling
        const plantEnergyConsumption = calculateDailyEnergyConsumption(plant.id);
        const plantCapacity = plantConfig.capacity * 24 * plantConfig.efficiency; // Daily capacity with efficiency
        const energySurplusDeficit = plantCapacity - plantEnergyConsumption;
        
        // Calculate plant-specific revenue
        const plantRevenue = calculateDailyRevenue(plant.id);
        
        // Calculate plant-specific costs
        const hardwareType = plantConfig.hardwareType as keyof typeof HARDWARE_COSTS;
        
        // Hardware costs
        const hardwareCost = plantConfig.minerCount * plantConfig.hardwareCost;
        
        // Setup costs with infrastructure reuse consideration
        const setupCosts = plantConfig.useExistingInfrastructure
          ? (plantConfig.setupCosts.electrical + plantConfig.setupCosts.cooling + plantConfig.setupCosts.installation) * 0.5
          : Object.values(plantConfig.setupCosts).reduce((sum, cost) => sum + cost, 0);

        // Daily maintenance cost
        const dailyMaintenanceCost = plantConfig.minerCount * MAINTENANCE_COSTS[hardwareType].daily;
        const totalMaintenanceCost = dailyMaintenanceCost * params.globalMarketParams.simulationPeriod * 30;

        // Total costs
        const totalPlantCosts = hardwareCost + setupCosts + totalMaintenanceCost;
        
        // Accumulate totals
        totalEnergyConsumption += plantEnergyConsumption;
        totalRevenue += plantRevenue;
        totalCosts += totalPlantCosts;
        
        plantSpecificResults.push({
          plantId: plant.id,
          plantName: plant.name,
          minerCount: plantConfig.minerCount,
          energyConsumption: plantEnergyConsumption,
          energyCapacity: plantCapacity,
          surplusDeficit: energySurplusDeficit,
          revenue: plantRevenue,
          costs: {
            hardware: hardwareCost,
            setup: setupCosts,
            maintenance: dailyMaintenanceCost // This is the daily maintenance cost
          }
        });
      });

      // Calculate ROI metrics
      const breakevenDays = calculateBreakevenDays(totalCosts, totalRevenue);
      const profitabilityIndex = ((totalRevenue * params.globalMarketParams.simulationPeriod * 30) - totalCosts) / totalCosts * 100;

      // Generate time series data
      const timeSeriesData = generateTimeSeriesData({
        dailyEnergyConsumption: totalEnergyConsumption,
        dailyRevenue: totalRevenue,
        totalCosts: totalCosts,
        breakevenDays: breakevenDays
      }, selectedPlantsData);

      const simulationResults = {
        energyUsage: {
          totalDaily: totalEnergyConsumption,
          byPlant: plantSpecificResults.map(r => ({
            plant: r.plantName,
            consumption: r.energyConsumption,
            capacity: r.energyCapacity,
            surplusDeficit: r.surplusDeficit
          }))
        },
        revenue: {
          daily: totalRevenue,
          total: totalRevenue * params.globalMarketParams.simulationPeriod * 30,
          byPlant: plantSpecificResults.map(r => ({
            plant: r.plantName,
            daily: r.revenue
          }))
        },
        costs: {
          total: totalCosts,
          byPlant: plantSpecificResults.map(r => ({
            plant: r.plantName,
            setup: r.costs.setup,
            maintenance: r.costs.maintenance // Daily maintenance cost
          }))
        },
        roi: {
          totalRevenue: totalRevenue * params.globalMarketParams.simulationPeriod * 30,
          totalCosts,
          breakevenDays,
          profitabilityIndex
        },
        timeSeriesData
      };

      console.log('Simulation results:', simulationResults);
      setResults(simulationResults);
      setActiveTab("results");
    } catch (error) {
      console.error('Error running simulation:', error);
    }
  };

  // Cost summary functions
  const getTotalSetupCosts = () => {
    return Object.entries(params.plantConfigs).reduce((total, [plantId, config]) => {
      if (!params.selectedPlants.includes(plantId)) return total;
      const costs = calculatePlantSpecificCosts(plantId);
      return total + costs.setup;
    }, 0);
  };

  const getDailyCoolingCosts = () => {
    return Object.entries(params.plantConfigs).reduce((total, [plantId, config]) => {
      if (!params.selectedPlants.includes(plantId)) return total;
      const costs = calculatePlantSpecificCosts(plantId);
      return total + costs.cooling;
    }, 0);
  };

  // Generate time series data for graphs
  const generateTimeSeriesData = (metrics: any, selectedPlantsData: Plant[]) => {
    const days = params.globalMarketParams.simulationPeriod * 30;
    const timeSeriesData = {
      energyData: [] as any[],
      financialData: [] as any[],
      roiData: [] as any[]
    };

    let cumulativeRevenue = 0;
    for (let day = 0; day < days; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      const timestamp = date.toISOString().split('T')[0];

      // Calculate daily values with volatility
      const volatility = params.globalMarketParams.includeMarketVolatility ? 
        (Math.random() * 0.3 - 0.15) : 0; // ±15% volatility
      const dailyRevenue = metrics.dailyRevenue * (1 + volatility);
      cumulativeRevenue += dailyRevenue;

      // Add financial data
      timeSeriesData.financialData.push({
        timestamp,
        revenue: dailyRevenue,
        costs: metrics.totalCosts / days,
        profit: dailyRevenue - (metrics.totalCosts / days)
      });

      // Add ROI data
      timeSeriesData.roiData.push({
        timestamp,
        investment: metrics.totalCosts,
        returns: cumulativeRevenue,
        breakeven: metrics.totalCosts
      });

      // Add energy data with dynamic pricing
      const energyVariability = params.globalMarketParams.includeDynamicEnergy ? 
        (Math.random() * 0.4 - 0.2) : 0; // ±20% variability
      timeSeriesData.energyData.push({
        timestamp,
        generation: metrics.dailyEnergyConsumption * (1 + energyVariability),
        usage: metrics.dailyEnergyConsumption,
        backup: Math.max(0, metrics.dailyEnergyConsumption * energyVariability)
      });
    }

    return timeSeriesData;
  };

  // Update hardware type handler to include cost updates
  const updateHardwareType = (plantId: string, newType: keyof typeof HARDWARE_COSTS) => {
    setParams(p => ({
      ...p,
      plantConfigs: {
        ...p.plantConfigs,
        [plantId]: {
          ...p.plantConfigs[plantId],
          hardwareType: newType,
          hardwareCost: HARDWARE_COSTS[newType].cost,
          // Update operational costs based on new hardware type
          operationalCosts: {
            ...p.plantConfigs[plantId].operationalCosts,
            cooling: newType === 'asic' ? 50 : 20, // ASICs need more cooling
            maintenance: newType === 'asic' ? 30 : 15 // ASICs need more maintenance
          }
        }
      }
    }));
  };

  // Add real-time cost calculation functions
  const calculateTotalHardwareCost = (plantId: string) => {
    const config = params.plantConfigs[plantId];
    if (!config) return 0;
    // Use the user-set hardware cost, even if it's 0
    return config.minerCount * config.hardwareCost;
  };

  const calculateTotalCostsForPlant = (plantId: string) => {
    const config = params.plantConfigs[plantId];
    if (!config) return { hardware: 0, setup: 0, maintenance: 0 };

    const hardwareCost = calculateTotalHardwareCost(plantId);
    const setupCosts = Object.values(config.setupCosts).reduce((sum, cost) => sum + cost, 0);
    const { maintenance } = calculatePlantSpecificCosts(plantId);

    return {
      hardware: hardwareCost,
      setup: setupCosts,
      maintenance: maintenance
    };
  };

  // Update the miner count handler
  const updateMinerCount = (plantId: string, count: number) => {
    const config = params.plantConfigs[plantId];
    if (!config) return;

    const hardwareType = config.hardwareType as keyof typeof HARDWARE_COSTS;
    const powerPerMiner = HARDWARE_COSTS[hardwareType].power;
    const maxMiners = Math.floor(config.capacity / powerPerMiner);

    // Ensure count doesn't exceed capacity
    const finalCount = Math.min(count, maxMiners);

    setParams(p => ({
      ...p,
      plantConfigs: {
        ...p.plantConfigs,
        [plantId]: {
          ...p.plantConfigs[plantId],
          minerCount: finalCount,
          operationalCosts: {
            ...p.plantConfigs[plantId].operationalCosts,
            cooling: hardwareType === 'asic' ? 50 * finalCount : 20 * finalCount,
            maintenance: hardwareType === 'asic' ? 30 * finalCount : 15 * finalCount
          }
        }
      }
    }));
  };

  // Add energy calculation functions
  const calculateDailyEnergyProduction = (capacity: number, efficiency: number) => {
    // Convert capacity from kW to MWh/day
    const dailyCapacity = capacity * 24 / 1000; // kW to MWh/day
    return dailyCapacity * (efficiency / 100); // Apply efficiency
  };

  const calculateRequiredCapacity = (minerCount: number, minerPowerConsumption: number, efficiency: number) => {
    // Calculate total power needed
    const totalPowerNeeded = minerCount * minerPowerConsumption;
    // Adjust for efficiency
    return Math.ceil(totalPowerNeeded / (efficiency / 100));
  };

  // Add calculation functions
  const calculateEfficiencyFromAnnual = (capacity: number, annualProduction: number) => {
    // Convert capacity from kW to MWh/year potential
    const potentialAnnualProduction = (capacity * 24 * 365) / 1000; // MWh/year
    return (annualProduction / potentialAnnualProduction) * 100; // as percentage
  };

  const calculateAnnualFromEfficiency = (capacity: number, efficiency: number) => {
    // Convert capacity from kW to MWh/year potential
    const potentialAnnualProduction = (capacity * 24 * 365) / 1000; // MWh/year
    return potentialAnnualProduction * (efficiency / 100); // MWh/year
  };

  // Update cooling cost calculation
  const calculateDailyCoolingCost = (
    minerCount: number,
    minerPower: number,
    coolingEfficiency: number,
    electricityCost: number
  ) => {
    // Calculate cooling power needed (kW)
    const coolingPower = minerPower * coolingEfficiency;
    
    // Calculate daily cost per miner
    const dailyCostPerMiner = coolingPower * electricityCost * 24;
    
    return dailyCostPerMiner * minerCount;
  };

  // Update plant configuration section
  const renderPlantConfiguration = (plant: Plant) => {
    const config = params.plantConfigs[plant.id];
    if (!config) return null;

    const hardwareType = config.hardwareType as keyof typeof HARDWARE_COSTS;
    const minerPower = HARDWARE_COSTS[hardwareType].power;
    const dailyEnergy = calculateDailyEnergyProduction(config.capacity, config.efficiency * 100);
    const maxMiners = calculateMaxMiners(dailyEnergy, minerPower, config.coolingSystem.efficiency, config.energyAllocation * 100);

    const handleAnnualProductionChange = (value: string, plantId: string) => {
      const numericValue = parseFloat(value) || 0;
      setParams(prev => ({
        ...prev,
        plantConfigs: {
          ...prev.plantConfigs,
          [plantId]: {
            ...prev.plantConfigs[plantId],
            annualProduction: numericValue,
            // Only update efficiency if annual production is changed manually
            efficiency: calculateEfficiencyFromAnnual(prev.plantConfigs[plantId].capacity, numericValue)
          }
        }
      }));
    };

    const handleEfficiencyChange = (value: number, plantId: string) => {
      setParams(prev => ({
        ...prev,
        plantConfigs: {
          ...prev.plantConfigs,
          [plantId]: {
            ...prev.plantConfigs[plantId],
            efficiency: value,
            // Don't update annual production when efficiency changes
            // annualProduction will only change when explicitly modified
          }
        }
      }));
    };

    return (
      <CardContent className="space-y-6">
        {/* Plant Capacity and Energy Production */}
        <div className="space-y-4">
          <h3 className="font-medium">Plant Capacity and Energy Production</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plant Capacity (kW)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[config.capacity]}
                  onValueChange={([value]) => {
                    const newCapacity = value;
                    // Update annual production based on current efficiency
                    const newAnnual = calculateAnnualFromEfficiency(newCapacity, config.efficiency * 100);
                    setParams(p => ({
                      ...p,
                      plantConfigs: {
                        ...p.plantConfigs,
                        [plant.id]: {
                          ...p.plantConfigs[plant.id],
                          capacity: newCapacity,
                          annualProduction: newAnnual
                        }
                      }
                    }));
                  }}
                  min={0}
                  max={plant.capacity * 2}
                  step={10}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={config.capacity}
                  onChange={e => {
                    const newCapacity = +e.target.value;
                    const newAnnual = calculateAnnualFromEfficiency(newCapacity, config.efficiency * 100);
                    setParams(p => ({
                      ...p,
                      plantConfigs: {
                        ...p.plantConfigs,
                        [plant.id]: {
                          ...p.plantConfigs[plant.id],
                          capacity: newCapacity,
                          annualProduction: newAnnual
                        }
                      }
                    }));
                  }}
                  className="w-24"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Daily Energy Production: {dailyEnergy.toFixed(2)} MWh/day
              </div>
            </div>

            <div className="space-y-2">
              <Label>Annual Energy Production (MWh/year)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  value={config.annualProduction}
                  onChange={(e) => handleAnnualProductionChange(e.target.value, plant.id)}
                  onBlur={(e) => {
                    // Ensure the value persists on blur
                    const value = e.target.value;
                    if (value) {
                      handleAnnualProductionChange(value, plant.id);
                    }
                  }}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Calculated Efficiency: {(config.efficiency * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Plant Efficiency (%)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[config.efficiency * 100]}
                onValueChange={([value]) => {
                  const newEfficiency = value / 100;
                  const newAnnual = calculateAnnualFromEfficiency(config.capacity, value);
                  setParams(p => ({
                    ...p,
                    plantConfigs: {
                      ...p.plantConfigs,
                      [plant.id]: {
                        ...p.plantConfigs[plant.id],
                        efficiency: newEfficiency,
                        annualProduction: newAnnual
                      }
                    }
                  }));
                }}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="w-16 text-right">
                {(config.efficiency * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Based on annual production of {config.annualProduction.toFixed(0)} MWh/year
            </div>
          </div>

          <div className="space-y-2">
            <Label>Energy Allocation for Mining (%)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[config.energyAllocation * 100]}
                onValueChange={([value]) => {
                  setParams(p => ({
                    ...p,
                    plantConfigs: {
                      ...p.plantConfigs,
                      [plant.id]: {
                        ...p.plantConfigs[plant.id],
                        energyAllocation: value / 100
                      }
                    }
                  }));
                }}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="w-16 text-right">
                {(config.energyAllocation * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Available Energy for Mining: {(dailyEnergy * config.energyAllocation).toFixed(2)} MWh/day
            </div>
          </div>
        </div>

        {/* Hardware Configuration */}
        <div className="space-y-4">
          <h3 className="font-medium">Hardware Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hardware Type</Label>
              <Select 
                value={config.hardwareType}
                onValueChange={value => updateHardwareType(plant.id, value as keyof typeof HARDWARE_COSTS)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asic">{HARDWARE_COSTS.asic.name}</SelectItem>
                  <SelectItem value="gpu">{HARDWARE_COSTS.gpu.name}</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Power Consumption: {HARDWARE_COSTS[hardwareType].power} kW/unit
                <br />
                Total Power (with cooling): {calculateTotalPowerPerMiner(HARDWARE_COSTS[hardwareType].power, config.coolingSystem.efficiency).toFixed(2)} kW/unit
                <InfoTooltip content={`Total power includes miner power (${HARDWARE_COSTS[hardwareType].power} kW) plus cooling power (${(HARDWARE_COSTS[hardwareType].power * config.coolingSystem.efficiency).toFixed(2)} kW)`} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Number of Miners</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[config.minerCount]}
                  onValueChange={([value]) => updateMinerCount(plant.id, value)}
                  min={0}
                  max={maxMiners}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={config.minerCount}
                  onChange={e => updateMinerCount(plant.id, +e.target.value)}
                  className="w-24"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Maximum miners based on energy: {maxMiners}
                <br />
                Required capacity: {calculateRequiredCapacity(config.minerCount, minerPower, config.efficiency * 100)} kW
              </div>
            </div>
          </div>
        </div>

        {/* Cost Configuration */}
        <div className="space-y-4">
          <h3 className="font-medium">Cost Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hardware Cost per Unit ($)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={config.hardwareCost}
                  onChange={e => {
                    setParams(p => ({
                      ...p,
                      plantConfigs: {
                        ...p.plantConfigs,
                        [plant.id]: {
                          ...p.plantConfigs[plant.id],
                          hardwareCost: +e.target.value
                        }
                      }
                    }));
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const type = config.hardwareType || 'asic';
                    setParams(p => ({
                      ...p,
                      plantConfigs: {
                        ...p.plantConfigs,
                        [plant.id]: {
                          ...p.plantConfigs[plant.id],
                          hardwareCost: HARDWARE_COSTS[type].cost
                        }
                      }
                    }));
                  }}
                >
                  Reset to Default
                </Button>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                Cost per mining unit
                <InfoTooltip content={`Default costs: ASIC (${HARDWARE_COSTS.asic.name}): $${HARDWARE_COSTS.asic.cost.toLocaleString()}, GPU (${HARDWARE_COSTS.gpu.name}): $${HARDWARE_COSTS.gpu.cost.toLocaleString()}`} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Infrastructure Setup ($)</Label>
              <Input
                type="number"
                value={config.setupCosts.infrastructure}
                onChange={e => {
                  setParams(p => ({
                    ...p,
                    plantConfigs: {
                      ...p.plantConfigs,
                      [plant.id]: {
                        ...p.plantConfigs[plant.id],
                        setupCosts: {
                          ...p.plantConfigs[plant.id].setupCosts,
                          infrastructure: +e.target.value
                        }
                      }
                    }
                  }));
                }}
              />
              <div className="text-sm text-muted-foreground flex items-center">
                One-time setup cost
                <InfoTooltip content="Initial cost for setting up mining infrastructure, including electrical systems, security, and installation." />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={config.useExistingInfrastructure}
              onCheckedChange={checked => {
                setParams(p => ({
                  ...p,
                  plantConfigs: {
                    ...p.plantConfigs,
                    [plant.id]: {
                      ...p.plantConfigs[plant.id],
                      useExistingInfrastructure: checked
                    }
                  }
                }));
              }}
            />
            <Label>Use Existing Infrastructure</Label>
          </div>
        </div>

        {/* Add real-time cost summary under hardware configuration */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Cost Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Hardware Cost:</span>
              <span>${calculateTotalHardwareCost(plant.id).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Setup Costs:</span>
              <span>${calculateTotalCostsForPlant(plant.id).setup.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Maintenance Cost:</span>
              <span className="flex items-center">
                ${calculateTotalCostsForPlant(plant.id).maintenance.toLocaleString()}
                <InfoTooltip content={`Daily maintenance includes:
                  ${Object.entries(MAINTENANCE_COSTS[hardwareType].components)
                    .map(([key, value]) => `${key}: $${value}/miner`)
                    .join(', ')}
                  ${MAINTENANCE_COSTS[hardwareType].description}`} />
              </span>
            </div>
          </div>
        </div>

        {/* Cooling System Configuration */}
        <div className="space-y-4">
          <h3 className="font-medium">Cooling System Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cooling Technology</Label>
              <Select
                value={config.coolingSystem.technology}
                onValueChange={(value: 'air' | 'immersion') => {
                  setParams(p => ({
                    ...p,
                    plantConfigs: {
                      ...p.plantConfigs,
                      [plant.id]: {
                        ...p.plantConfigs[plant.id],
                        coolingSystem: {
                          ...p.plantConfigs[plant.id].coolingSystem,
                          technology: value,
                          efficiency: COOLING_DEFAULTS[value].efficiency
                        }
                      }
                    }
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air">Air Cooling</SelectItem>
                  <SelectItem value="immersion">Immersion Cooling</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground flex items-center">
                System Efficiency: {(config.coolingSystem.efficiency * 100).toFixed(0)}%
                <InfoTooltip content="Cooling power needed as a percentage of miner power. Air cooling typically needs 50% of miner power, while immersion cooling needs only 30%." />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Electricity Cost ($/kWh)</Label>
              <Input
                type="number"
                value={config.coolingSystem.electricityCost}
                onChange={e => {
                  setParams(p => ({
                    ...p,
                    plantConfigs: {
                      ...p.plantConfigs,
                      [plant.id]: {
                        ...p.plantConfigs[plant.id],
                        coolingSystem: {
                          ...p.plantConfigs[plant.id].coolingSystem,
                          electricityCost: +e.target.value
                        }
                      }
                    }
                  }));
                }}
                step="0.01"
              />
              <div className="text-sm text-muted-foreground flex items-center">
                Enter your local electricity cost
                <InfoTooltip content="The cost of electricity used for cooling. This affects the daily cooling costs." />
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center">
              Total Power per Miner: {calculateTotalPowerPerMiner(HARDWARE_COSTS[hardwareType].power, config.coolingSystem.efficiency).toFixed(2)} kW
              <InfoTooltip content={`Includes both miner power (${HARDWARE_COSTS[hardwareType].power} kW) and cooling power (${(HARDWARE_COSTS[hardwareType].power * config.coolingSystem.efficiency).toFixed(2)} kW)`} />
            </div>
            <div className="flex items-center">
              Daily Energy Consumption: {(calculateTotalPowerPerMiner(HARDWARE_COSTS[hardwareType].power, config.coolingSystem.efficiency) * 24).toFixed(2)} kWh per miner
              <InfoTooltip content={`Total daily energy consumption including both mining and cooling operations`} />
            </div>
            <div className="flex items-center">
              Total Daily Energy: {(calculateTotalPowerPerMiner(HARDWARE_COSTS[hardwareType].power, config.coolingSystem.efficiency) * 24 * config.minerCount).toFixed(2)} kWh
              <InfoTooltip content={`Total daily energy consumption for all ${config.minerCount} miners including cooling`} />
            </div>
          </div>
        </div>
      </CardContent>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Crypto Mining Simulation</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          // Only update the active tab, don't reset results
          setActiveTab(value);
        }}
      >
        <TabsList>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-6">
          {/* Plant Configuration Cards */}
          {plants.map(plant => (
            <Card key={plant.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Switch
                      checked={params.selectedPlants.includes(plant.id)}
                      onCheckedChange={(checked) => {
                        setParams(p => ({
                          ...p,
                          selectedPlants: checked 
                            ? [...p.selectedPlants, plant.id]
                            : p.selectedPlants.filter(id => id !== plant.id)
                        }));
                      }}
                    />
                    {plant.name}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {plant.site_name} - {plant.type}
                  </span>
                </div>
              </CardHeader>
              
              {params.selectedPlants.includes(plant.id) && (
                <CardContent className="space-y-6">
                  {renderPlantConfiguration(plant)}
                </CardContent>
              )}
            </Card>
          ))}

          {/* Global Market Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Global Market Parameters</span>
                {marketData && (
                  <span className="text-sm font-normal text-muted-foreground">
                    Last Updated: {new Date(marketData.lastUpdated).toLocaleTimeString()}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={autoRefreshEnabled}
                    onCheckedChange={setAutoRefreshEnabled}
                  />
                  <Label>Auto-refresh Market Data</Label>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetchMarketData()}
                  disabled={isLoadingMarket}
                >
                  {isLoadingMarket ? "Refreshing..." : "Refresh Now"}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Crypto Price ($)</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={params.globalMarketParams.cryptoPrice}
                      onChange={e => setParams(p => ({
                        ...p,
                        globalMarketParams: {
                          ...p.globalMarketParams,
                          cryptoPrice: +e.target.value
                        }
                      }))}
                      className={isLoadingMarket ? "opacity-50" : ""}
                      disabled={isLoadingMarket}
                    />
                    {isLoadingMarket && (
                      <span className="text-sm text-muted-foreground animate-pulse">
                        Updating...
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Mining Market Value</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={params.globalMarketParams.miningMarketValue}
                      onChange={e => setParams(p => ({
                        ...p,
                        globalMarketParams: {
                          ...p.globalMarketParams,
                          miningMarketValue: +e.target.value
                        }
                      }))}
                      className={isLoadingMarket ? "opacity-50" : ""}
                      disabled={isLoadingMarket}
                    />
                    {isLoadingMarket && (
                      <span className="text-sm text-muted-foreground animate-pulse">
                        Updating...
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Network Difficulty</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={params.globalMarketParams.networkDifficulty}
                      onChange={e => setParams(p => ({
                        ...p,
                        globalMarketParams: {
                          ...p.globalMarketParams,
                          networkDifficulty: +e.target.value
                        }
                      }))}
                      className={isLoadingMarket ? "opacity-50" : ""}
                      disabled={isLoadingMarket}
                    />
                    {isLoadingMarket && (
                      <span className="text-sm text-muted-foreground animate-pulse">
                        Updating...
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Simulation Period (months)</Label>
                  <Input 
                    type="number" 
                    value={params.globalMarketParams.simulationPeriod}
                    onChange={e => setParams(p => ({
                      ...p,
                      globalMarketParams: {
                        ...p.globalMarketParams,
                        simulationPeriod: +e.target.value
                      }
                    }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={params.globalMarketParams.includeMarketVolatility}
                  onCheckedChange={checked => setParams(p => ({
                    ...p,
                    globalMarketParams: {
                      ...p.globalMarketParams,
                      includeMarketVolatility: checked
                    }
                  }))}
                />
                <Label>Include Market Volatility</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={params.globalMarketParams.includeDynamicEnergy}
                  onCheckedChange={checked => setParams(p => ({
                    ...p,
                    globalMarketParams: {
                      ...p.globalMarketParams,
                      includeDynamicEnergy: checked
                    }
                  }))}
                />
                <Label>Include Dynamic Energy Pricing</Label>
              </div>
            </CardContent>
          </Card>
          
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Selected Plants</h3>
                  <div className="space-y-1 text-sm">
                    {plants
                      .filter(plant => params.selectedPlants.includes(plant.id))
                      .map(plant => {
                        const config = params.plantConfigs[plant.id];
                        const dailyEnergy = calculateDailyEnergyProduction(config?.capacity || 0, config?.efficiency * 100 || 0);
                        const allocatedEnergy = dailyEnergy * (config?.energyAllocation || 0);
                        return (
                          <div key={plant.id} className="flex justify-between">
                            <span>{plant.name}:</span>
                            <span className="text-muted-foreground">
                              {config?.minerCount} miners, {config?.capacity}kW, {allocatedEnergy.toFixed(2)} MWh/day
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Total Resources</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Miners:</span>
                      <span className="text-muted-foreground">
                        {Object.entries(params.plantConfigs)
                          .filter(([id]) => params.selectedPlants.includes(id))
                          .reduce((sum, [_, config]) => sum + (config?.minerCount || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Capacity:</span>
                      <span className="text-muted-foreground">
                        {Object.entries(params.plantConfigs)
                          .filter(([id]) => params.selectedPlants.includes(id))
                          .reduce((sum, [_, config]) => sum + (config?.capacity || 0), 0)} kW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Energy:</span>
                      <span className="text-muted-foreground">
                        {Object.entries(params.plantConfigs)
                          .filter(([id]) => params.selectedPlants.includes(id))
                          .reduce((sum, [_, config]) => {
                            const dailyEnergy = calculateDailyEnergyProduction(config?.capacity || 0, config?.efficiency * 100 || 0);
                            return sum + (dailyEnergy * (config?.energyAllocation || 0) * 1000); // Convert to kWh
                          }, 0).toFixed(1)} kWh
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Estimated Costs</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Hardware:</span>
                      <span className="text-muted-foreground">
                        ${Object.entries(params.plantConfigs)
                          .filter(([id]) => params.selectedPlants.includes(id))
                          .reduce((sum, [_, config]) => {
                            // Use the user-set hardware cost, even if it's 0
                            return sum + ((config?.minerCount || 0) * config?.hardwareCost);
                          }, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Setup:</span>
                      <span className="text-muted-foreground">
                        ${getTotalSetupCosts().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Cooling:</span>
                      <span className="text-muted-foreground">
                        ${getDailyCoolingCosts().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Market Settings</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Crypto Price:</span>
                      <span className="text-muted-foreground">
                        ${params.globalMarketParams.cryptoPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mining Value:</span>
                      <span className="text-muted-foreground">
                        {params.globalMarketParams.miningMarketValue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Period:</span>
                      <span className="text-muted-foreground">
                        {params.globalMarketParams.simulationPeriod} months
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={runSimulation} 
            className="w-full"
            disabled={params.selectedPlants.length === 0}
          >
            Run Simulation
          </Button>
        </TabsContent>

        <TabsContent value="results">
          {results ? (
            <div className="space-y-6">
              <SimulationResults results={results} />
              <SimulationGraphs data={results} />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Run a simulation to see results
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 