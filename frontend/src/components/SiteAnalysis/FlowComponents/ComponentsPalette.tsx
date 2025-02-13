import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sun,
  Wind,
  Battery,
  Factory,
  Grid,
  Zap,
  Activity,
  Radio,
  Home,
  Boxes,
  CircuitBoard
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FlowNodeType } from '@/types/flowComponents';
import { assetService } from '@/services/assetService';
import { useToast } from '@/components/ui/use-toast';
import { AssetType } from '@/types/assets';

// Icon mapping for different asset types
export const getAssetIcon = (assetType: AssetType | string): React.ReactNode => {
  const type = typeof assetType === 'string' ? assetType : assetType.name;
  
  switch (type.toLowerCase()) {
    case 'solar panel':
      return <Sun className="w-4 h-4 text-yellow-500" />;
    case 'solar array':
      return <Sun className="w-4 h-4 text-yellow-500" />;
    case 'wind turbine':
      return <Wind className="w-4 h-4 text-blue-500" />;
    case 'wind turbine cluster':
      return <Boxes className="w-4 h-4 text-blue-500" />;
    case 'transformer':
      return <Zap className="w-4 h-4 text-purple-500" />;
    case 'collector substation':
      return <CircuitBoard className="w-4 h-4 text-purple-500" />;
    case 'inverter':
      return <Activity className="w-4 h-4 text-orange-500" />;
    case 'battery':
      return <Battery className="w-4 h-4 text-green-500" />;
    case 'bess':
      return <Battery className="w-4 h-4 text-green-500" />;
    case 'consumer':
      return <Home className="w-4 h-4 text-indigo-500" />;
    case 'scada system':
      return <Radio className="w-4 h-4 text-gray-500" />;
    case 'sensor':
      return <Activity className="w-4 h-4 text-gray-500" />;
    default:
      return <Factory className="w-4 h-4" />;
  }
};

// Category mapping for different asset types
const getAssetCategory = (asset: AssetType | string): string => {
  const normalizedName = typeof asset === 'string' ? asset : asset.normalizedName;
  
  switch (normalizedName.toLowerCase()) {
    case 'solar panel':
    case 'solar array':
    case 'wind turbine':
    case 'wind turbine cluster':
      return 'Generation';
    case 'battery':
    case 'bess':
      return 'Storage';
    case 'consumer':
      return 'Consumption';
    case 'grid':
      return 'Grid';
    case 'inverter':
    case 'transformer':
    case 'collector substation':
      return 'Power Conversion';
    default:
      return 'Other';
  }
};

interface ComponentsPaletteProps {
  onDragStart: (event: React.DragEvent, assetType: AssetType) => void;
  isEditMode: boolean;
}

export const ComponentsPalette: React.FC<ComponentsPaletteProps> = ({ onDragStart, isEditMode }) => {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssetTypes = async () => {
      try {
        const types = await assetService.getAssetTypes();
        // Add consumer and grid if they don't exist
        const hasConsumer = types.some(t => t.normalizedName === 'consumer');
        const hasGrid = types.some(t => t.normalizedName === 'grid');
        
        const additionalTypes = [];
        if (!hasConsumer) {
          additionalTypes.push({
            id: 'consumer',
            name: 'Consumer',
            normalizedName: 'consumer',
            description: 'Energy consumer component'
          });
        }
        if (!hasGrid) {
          additionalTypes.push({
            id: 'grid',
            name: 'Power Grid',
            normalizedName: 'grid',
            description: 'Power grid connection'
          });
        }
        
        setAssetTypes([...types, ...additionalTypes]);
      } catch (error) {
        console.error('Error fetching asset types:', error);
        toast({
          title: "Error",
          description: "Failed to load asset types. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetTypes();
  }, [toast]);

  const groupedAssets = assetTypes.reduce((acc, asset) => {
    const category = getAssetCategory(asset);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(asset);
    return acc;
  }, {} as Record<string, AssetType[]>);

  // Sort categories to ensure a consistent order
  const sortedCategories = [
    'Generation',
    'Power Conversion',
    'Storage',
    'Consumption',
    'Grid',
    'Other'
  ].filter(category => groupedAssets[category]?.length > 0);

  if (isLoading) {
    return (
      <Card className="w-64 p-4">
        <h3 className="font-medium mb-4">Loading components...</h3>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-full border rounded-md">
      <div className="p-2">
        <Accordion type="multiple" defaultValue={sortedCategories}>
          {sortedCategories.map((category) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="py-2 text-sm hover:no-underline">
                {category}
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                {assetTypes
                  .filter((type) => getAssetCategory(type) === category)
                  .map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center gap-2 p-1.5 rounded-md hover:bg-accent cursor-pointer"
                      onDragStart={(e) => onDragStart(e, type)}
                      draggable={isEditMode}
                    >
                      {getAssetIcon(type)}
                      <span className="text-sm">{type.name}</span>
                    </div>
                  ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  );
};