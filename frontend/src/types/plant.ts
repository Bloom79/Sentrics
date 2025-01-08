import { Location } from './location';

export interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: string;
  location: Location;
  lastUpdate?: string;
}