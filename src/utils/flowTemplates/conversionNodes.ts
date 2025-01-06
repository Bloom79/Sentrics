import { Node } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

export const CONVERSION_X = 250;

export const getConversionNodes = (): Node<FlowNodeData>[] => [
  {
    id: 'inverter-1',
    type: 'inverter',
    position: { x: CONVERSION_X, y: 100 },
    style: {
      width: 160,
      height: 100,
      padding: '16px'
    },
    data: {
      id: 'inverter-1',
      type: 'inverter',
      label: 'Inverter',
      specs: {
        inputVoltage: 600,
        outputVoltage: 400,
        inputPower: 580,
        outputPower: 570,
        efficiency: 96.7,
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'transformer-1',
    type: 'transformer',
    position: { x: CONVERSION_X + 200, y: 100 },
    style: {
      width: 160,
      height: 100,
      padding: '16px'
    },
    data: {
      id: 'transformer-1',
      type: 'transformer',
      label: 'Transformer',
      specs: {
        inputVoltage: 400,
        outputVoltage: 230,
        power: 570,
        efficiency: 98,
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
];