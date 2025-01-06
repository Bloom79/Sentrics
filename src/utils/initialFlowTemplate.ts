import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

const GENERATION_X = 0;
const CONVERSION_X = 300;
const STORAGE_X = 600;
const CONSUMPTION_X = 900;

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

  // Storage Section
  {
    id: 'storage-1',
    type: 'bess',
    position: { x: STORAGE_X, y: 75 },
    data: {
      id: 'storage-1',
      type: 'bess',
      label: 'Battery Storage (BESS)',
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

  // To Storage
  {
    id: 'transformer-to-storage',
    source: 'transformer-1',
    target: 'storage-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // Storage to Consumers
  {
    id: 'storage-to-residential',
    source: 'storage-1',
    target: 'consumer-residential',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'storage-to-industrial',
    source: 'storage-1',
    target: 'consumer-industrial',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },

  // Grid Connection
  {
    id: 'grid-to-storage',
    source: 'grid-1',
    target: 'storage-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];