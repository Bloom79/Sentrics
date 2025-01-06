import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

const GENERATION_X = 0;
const CONVERSION_X = 400;  // Increased spacing
const STORAGE_X = 800;     // Increased spacing
const CONSUMPTION_X = 1200; // Increased spacing
const GRID_X = 400;        // Aligned with conversion components

export const getInitialNodes = (): Node<FlowNodeData>[] => [
  // Generation Section
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
    style: { width: 180, height: 100 }, // Increased size
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
    style: { width: 180, height: 100 }, // Increased size
  },

  // Power Conversion Section
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
    style: { width: 160, height: 90 }, // Increased size
  },
  {
    id: 'transformer-1',
    type: 'transformer',
    position: { x: CONVERSION_X + 200, y: 75 },
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
    style: { width: 160, height: 90 }, // Increased size
  },

  // Grid Connection
  {
    id: 'grid-1',
    type: 'grid',
    position: { x: GRID_X, y: 300 },
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
    style: { width: 160, height: 90 }, // Increased size
  },

  // BESS Units
  {
    id: 'bess-1',
    type: 'bess',
    position: { x: STORAGE_X, y: 0 },
    data: {
      id: 'bess-1',
      type: 'bess',
      label: 'Battery Storage 1',
      specs: {
        maxCapacity: 1000,
        currentCharge: 750,
        stateOfCharge: 75,
        chargingPower: 250,
        temperature: 25,
      },
      status: 'charging',
      onNodeClick: () => {},
    },
    style: { width: 200, height: 100 }, // Increased size
  },
  {
    id: 'bess-2',
    type: 'bess',
    position: { x: STORAGE_X, y: 150 },
    data: {
      id: 'bess-2',
      type: 'bess',
      label: 'Battery Storage 2',
      specs: {
        maxCapacity: 1000,
        currentCharge: 850,
        stateOfCharge: 85,
        chargingPower: 250,
        temperature: 26,
      },
      status: 'standby',
      onNodeClick: () => {},
    },
    style: { width: 200, height: 100 }, // Increased size
  },

  // Consumption Section
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
    style: { width: 180, height: 100 }, // Increased size
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
    style: { width: 180, height: 100 }, // Increased size
  },
];

export const getInitialEdges = (): Edge[] => [
  // Generation to Conversion
  {
    id: 'solar-to-inverter',
    source: 'source-solar',
    target: 'inverter-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'wind-to-inverter',
    source: 'source-wind',
    target: 'inverter-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // Conversion Chain
  {
    id: 'inverter-to-transformer',
    source: 'inverter-1',
    target: 'transformer-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // Grid to BESS connections
  {
    id: 'grid-to-bess-1',
    source: 'grid-1',
    target: 'bess-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'grid-to-bess-2',
    source: 'grid-1',
    target: 'bess-2',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // Transformer to BESS connections
  {
    id: 'transformer-to-bess-1',
    source: 'transformer-1',
    target: 'bess-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'transformer-to-bess-2',
    source: 'transformer-1',
    target: 'bess-2',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // BESS to Consumers
  {
    id: 'bess-1-to-residential',
    source: 'bess-1',
    target: 'consumer-residential',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'bess-2-to-industrial',
    source: 'bess-2',
    target: 'consumer-industrial',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];
