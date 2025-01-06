import { Site } from "./site";

export type FlowNodeType = 'cell' | 'string' | 'array' | 'inverter' | 'transformer' | 'storage' | 'grid' | 'consumer';

export type ConsumerType = 'residential' | 'industrial' | 'commercial';

export type FlowNodeData = {
  id: string;
  type: FlowNodeType | ConsumerType;
  label: string;
  specs?: {
    capacity?: number;
    voltage?: number;
    efficiency?: number;
    current?: number;
    power?: number;
    charge?: number;
  };
  consumption?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  onNodeClick: (id: string, type: string) => void;
};

export type EnergyFlow = {
  currentValue: number;
  maxValue: number;
  minValue: number;
  avgValue: number;
  timestamp: Date;
};

export type TimeRange = 'realtime' | '15min' | '1hour' | '24hours' | 'custom';

export type EnergyFlowEdge = {
  id: string;
  source: string;
  target: string;
  data: {
    energyFlow: EnergyFlow;
    efficiency: number;
    status: 'active' | 'inactive' | 'error';
    type: 'solar' | 'storage' | 'grid' | 'consumption' | 'power';
  };
};