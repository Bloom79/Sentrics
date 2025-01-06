export type EnergySource = {
  id: string;
  type: 'solar' | 'eolic';
  capacity: number; // in kW
  currentOutput: number; // in kW
  status: 'active' | 'inactive' | 'maintenance';
};

export type StorageUnit = {
  id: string;
  capacity: number; // in kWh
  currentCharge: number; // in kWh
  status: 'charging' | 'discharging' | 'idle';
  health: number; // percentage
  temperature: number; // in Celsius
  powerRating: number; // in kW
};

export type Site = {
  id: string;
  name: string;
  location: string;
  energySources: EnergySource[];
  storageUnits: StorageUnit[];
  totalCapacity: number; // in kW
  currentOutput: number; // in kW
  gridConnection: {
    status: 'connected' | 'disconnected';
    frequency: number; // in Hz
    voltage: number; // in V
    congestionLevel: 'Low' | 'Medium' | 'High';
  };
};

export type NavigationItem = {
  title: string;
  path: string;
  icon: string;
  children?: NavigationItem[];
};