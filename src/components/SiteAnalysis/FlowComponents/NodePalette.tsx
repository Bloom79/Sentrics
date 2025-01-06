import React, { DragEvent } from 'react';
import { Sun, Wind, Battery, Factory, Grid, Zap, Cable, Building2, Users, CircuitBoard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const paletteCategories = [
  {
    title: "Generation",
    items: [
      { 
        type: 'source', 
        label: 'Solar Array', 
        icon: Sun, 
        sourceType: 'solar',
        specs: {
          power: 500,
          capacity: 750,
          temperature: 45,
          efficiency: 98,
          age: 2,
          irradiance: 850
        }
      },
      { 
        type: 'source', 
        label: 'Wind Farm', 
        icon: Wind, 
        sourceType: 'wind',
        specs: {
          power: 400,
          capacity: 600,
          windSpeed: 12,
          turbineStatus: 'operational',
          rpm: 15,
          efficiency: 95
        }
      },
    ]
  },
  {
    title: "Power Conversion",
    items: [
      { 
        type: 'inverter', 
        label: 'Inverter', 
        icon: Zap,
        specs: {
          inputPower: 600,
          outputPower: 580,
          efficiency: 96.7,
          temperature: 40,
          mode: 'MPPT'
        }
      },
      { 
        type: 'transformer', 
        label: 'Transformer', 
        icon: Cable,
        specs: {
          inputVoltage: 720,
          outputVoltage: 230,
          efficiency: 98,
          temperature: 55,
          tapPosition: 3
        }
      },
    ]
  },
  {
    title: "Storage",
    items: [
      { 
        type: 'storage', 
        label: 'Battery Storage', 
        icon: Battery,
        specs: {
          capacity: 1000,
          stateOfCharge: 85,
          power: 250,
          stateOfHealth: 97,
          temperature: 25,
          cycleCount: 450
        }
      }
    ]
  },
  {
    title: "Consumption",
    items: [
      { 
        type: 'consumer', 
        label: 'Residential Area', 
        icon: Users,
        consumerType: 'residential',
        specs: {
          consumption: 150,
          connectedLoad: 200,
          powerFactor: 0.95,
          peakDemand: 180
        }
      },
      { 
        type: 'consumer', 
        label: 'Industrial Zone', 
        icon: Factory,
        consumerType: 'industrial',
        specs: {
          consumption: 450,
          connectedLoad: 600,
          powerFactor: 0.92,
          peakDemand: 550
        }
      },
      { 
        type: 'consumer', 
        label: 'Commercial Center', 
        icon: Building2,
        consumerType: 'commercial',
        specs: {
          consumption: 300,
          connectedLoad: 400,
          powerFactor: 0.93,
          peakDemand: 350
        }
      }
    ]
  },
  {
    title: "Grid",
    items: [
      { 
        type: 'grid', 
        label: 'Power Grid', 
        icon: Grid,
        specs: {
          importPower: 200,
          exportPower: 150,
          voltage: 230,
          frequency: 50,
          reliability: 99.9
        }
      }
    ]
  }
];

interface NodePaletteProps {
  onDragStart: (event: DragEvent, nodeType: string, sourceType?: string, specs?: any) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onDragStart }) => {
  return (
    <Card className="absolute left-4 top-20 z-10 p-4 w-64 max-h-[80vh] overflow-y-auto">
      <h3 className="text-sm font-medium mb-4">Components</h3>
      <div className="flex flex-col gap-4">
        {paletteCategories.map((category, index) => (
          <div key={category.title}>
            {index > 0 && <Separator className="my-2" />}
            <h4 className="text-xs font-medium text-muted-foreground mb-2">{category.title}</h4>
            <div className="flex flex-col gap-2">
              {category.items.map((item) => (
                <div
                  key={`${item.type}-${item.label}`}
                  className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-accent"
                  draggable
                  onDragStart={(event) => onDragStart(event, item.type, item.sourceType, item.specs)}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NodePalette;