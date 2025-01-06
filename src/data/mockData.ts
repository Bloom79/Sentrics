import { Plant } from "@/types/site";

export const mockPlants: Plant[] = [
  {
    id: "1",
    name: "Solar Plant 1",
    type: "solar",
    capacity: 1000,
    currentOutput: 750,
    efficiency: 85,
    status: "online",
    location: "California, USA",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Wind Farm 1",
    type: "wind",
    capacity: 2000,
    currentOutput: 1500,
    efficiency: 75,
    status: "online",
    location: "Texas, USA",
    lastUpdate: new Date().toISOString(),
  },
];