export type FlowNodeType = 'source' | 'storage' | 'grid' | 'consumer' | 'inverter' | 'transformer' | 'bess' | 'cell' | 'string';

export type ConsumerType = 'residential' | 'industrial' | 'commercial';

export type NodeStatus = 'active' | 'inactive' | 'maintenance' | 'charging' | 'discharging' | 'operational' | 'standby' | 'fault';

export interface NodeSpecs {
  // Generation specs
  power?: number;
  capacity?: number;
  temperature?: number;
  efficiency?: number;
  age?: number;
  irradiance?: number;
  windSpeed?: number;
  turbineStatus?: string;
  rpm?: number;

  // Power conversion specs
  inputPower?: number;
  outputPower?: number;
  inputVoltage?: number;
  outputVoltage?: number;
  mode?: string;
  tapPosition?: number;

  // Storage and BESS specs
  stateOfCharge?: number;
  stateOfHealth?: number;
  cycleCount?: number;
  chargingPower?: number;
  dischargingPower?: number;
  currentCharge?: number;
  maxCapacity?: number;
  depthOfDischarge?: number;
  powerRating?: number;
  health?: number;
  cycles?: number;

  // Consumer specs
  consumption?: number;
  connectedLoad?: number;
  powerFactor?: number;
  peakDemand?: number;
  dailyUsage?: number;
  connectionType?: string;
}

export type FlowNodeData = {
  id: string;
  type: FlowNodeType | ConsumerType;
  label: string;
  specs?: NodeSpecs;
  status?: NodeStatus;
  consumption?: number;
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