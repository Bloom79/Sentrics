import { Node } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

export const STORAGE_X = 600;

export const getStorageNodes = (): Node<FlowNodeData>[] => [
  {
    id: 'bess-1',
    type: 'bess',
    position: { x: STORAGE_X, y: 0 },
    style: {
      width: 200,
      height: 120,
      padding: '16px'
    },
    data: {
      id: 'bess-1',
      type: 'bess',
      label: 'Battery Storage (BESS) 1',
      specs: {
        maxCapacity: 1000,
        currentCharge: 750,
        stateOfCharge: 75,
        stateOfHealth: 98,
        chargingPower: 250,
        dischargingPower: 250,
        temperature: 25,
        cycleCount: 450,
        depthOfDischarge: 80,
        efficiency: 95,
        powerRating: 500,
        health: 98,
        cycles: 450
      },
      status: 'charging',
      onNodeClick: () => {},
    },
  },
  {
    id: 'bess-2',
    type: 'bess',
    position: { x: STORAGE_X, y: 200 },
    style: {
      width: 200,
      height: 120,
      padding: '16px'
    },
    data: {
      id: 'bess-2',
      type: 'bess',
      label: 'Battery Storage (BESS) 2',
      specs: {
        maxCapacity: 800,
        currentCharge: 600,
        stateOfCharge: 75,
        stateOfHealth: 96,
        chargingPower: 200,
        dischargingPower: 200,
        temperature: 24,
        cycleCount: 320,
        depthOfDischarge: 75,
        efficiency: 94,
        powerRating: 400,
        health: 96,
        cycles: 320
      },
      status: 'discharging',
      onNodeClick: () => {},
    },
  },
];