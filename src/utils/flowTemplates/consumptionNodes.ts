import { Node } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

export const CONSUMPTION_X = 900;

export const getConsumptionNodes = (): Node<FlowNodeData>[] => [
  {
    id: 'consumer-residential',
    type: 'consumer',
    position: { x: CONSUMPTION_X, y: 0 },
    data: {
      id: 'consumer-residential',
      type: 'residential',
      label: 'Residential Area',
      specs: {
        consumption: 150,
        connectedLoad: 200,
        powerFactor: 0.95,
        peakDemand: 180,
        dailyUsage: 3600,
        connectionType: 'LV Distribution'
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'consumer-industrial',
    type: 'consumer',
    position: { x: CONSUMPTION_X, y: 150 },
    data: {
      id: 'consumer-industrial',
      type: 'industrial',
      label: 'Industrial Zone',
      specs: {
        consumption: 450,
        connectedLoad: 600,
        powerFactor: 0.92,
        peakDemand: 550,
        dailyUsage: 10800,
        connectionType: 'MV Distribution'
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'grid-1',
    type: 'grid',
    position: { x: CONSUMPTION_X, y: 300 },
    data: {
      id: 'grid-1',
      type: 'grid',
      label: 'Power Grid',
      specs: {
        inputPower: 200,
        outputPower: 150,
        efficiency: 99.9,
        temperature: 35
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
];