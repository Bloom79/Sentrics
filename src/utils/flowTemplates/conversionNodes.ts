import { Node } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

export const CONVERSION_X = 300;

export const getConversionNodes = (): Node<FlowNodeData>[] => [
  {
    id: 'inverter-1',
    type: 'inverter',
    position: { x: CONVERSION_X, y: 75 },
    data: {
      id: 'inverter-1',
      type: 'inverter',
      label: 'Inverter',
      specs: {
        inputPower: 600,
        outputPower: 580,
        efficiency: 96.7,
        temperature: 40,
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'transformer-1',
    type: 'transformer',
    position: { x: CONVERSION_X + 150, y: 75 },
    data: {
      id: 'transformer-1',
      type: 'transformer',
      label: 'Transformer',
      specs: {
        inputPower: 720,
        outputPower: 230,
        efficiency: 98,
        temperature: 55,
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
];