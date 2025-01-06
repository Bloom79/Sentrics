import { Node } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

export const GENERATION_X = 0;

export const getGenerationNodes = (): Node<FlowNodeData>[] => [
  {
    id: 'source-solar',
    type: 'source',
    position: { x: GENERATION_X, y: 0 },
    data: {
      id: 'source-solar',
      type: 'source',
      label: 'Solar Array',
      specs: {
        capacity: 500,
        power: 350,
        efficiency: 98,
        temperature: 45,
        irradiance: 850,
        age: 2
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'source-wind',
    type: 'source',
    position: { x: GENERATION_X, y: 150 },
    data: {
      id: 'source-wind',
      type: 'source',
      label: 'Wind Farm',
      specs: {
        capacity: 300,
        power: 250,
        efficiency: 95,
        windSpeed: 12,
        turbineStatus: 'operational',
        rpm: 15
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
];