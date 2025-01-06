import { Site } from "./site";

export type FlowNodeType = 'cell' | 'string' | 'array' | 'inverter' | 'transformer' | 'storage' | 'grid' | 'consumer';

export type FlowNodeData = {
  id: string;
  type: FlowNodeType;
  label: string;
  specs?: {
    capacity?: number;
    voltage?: number;
    efficiency?: number;
    current?: number;
    power?: number;
  };
  status: 'active' | 'inactive' | 'maintenance';
  onNodeClick: (id: string, type: string) => void;
};

export type EnergyFlowEdge = {
  id: string;
  source: string;
  target: string;
  data: {
    energyFlow: number;
    efficiency: number;
    status: 'active' | 'inactive' | 'error';
    type: 'grid' | 'storage' | 'consumption';
  };
};

export type SolarComponentData = {
  cells: Array<{
    id: string;
    voltage: number;
    current: number;
    status: 'active' | 'inactive' | 'maintenance';
  }>;
  strings: Array<{
    id: string;
    cells: string[];
    voltage: number;
    current: number;
    status: 'active' | 'inactive' | 'maintenance';
  }>;
  inverters: Array<{
    id: string;
    efficiency: number;
    inputVoltage: number;
    outputVoltage: number;
    status: 'active' | 'inactive' | 'maintenance';
  }>;
  transformers: Array<{
    id: string;
    primaryVoltage: number;
    secondaryVoltage: number;
    efficiency: number;
    status: 'active' | 'inactive' | 'maintenance';
  }>;
};