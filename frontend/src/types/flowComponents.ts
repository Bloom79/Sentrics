export type FlowNodeType = 
  | 'source'
  | 'storage'
  | 'consumer'
  | 'grid'
  | 'inverter'
  | 'transformer'
  | 'bess'
  | 'solar array'
  | 'solar panel'
  | 'wind turbine'
  | 'wind turbine cluster'
  | 'collector substation'
  | 'scada system'
  | 'sensor';

export type NodeStatus = 'active' | 'inactive' | 'error';

export interface FlowNodeData {
  id: string;
  label: string;
  type: FlowNodeType;
  specs?: {
    power?: number;
    efficiency?: number;
    [key: string]: any;
  };
  status: NodeStatus;
  onNodeClick?: (id: string, type: string) => void;
}

export type EnergyFlow = {
  currentValue: number;
  maxValue: number;
  minValue: number;
  avgValue: number;
  timestamp: Date;
};

export type TimeRange = 'realtime' | '15min' | '1hour' | '24hours' | 'custom';