import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

export const getInitialNodes = (): Node<FlowNodeData>[] => [
  {
    id: 'source-1',
    type: 'source',
    position: { x: 0, y: 0 },
    data: {
      id: 'source-1',
      type: 'source',
      label: 'Solar Array 1',
      output: 350,
      specs: {
        capacity: 500,
        efficiency: 98,
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'inverter-1',
    type: 'inverter',
    position: { x: 250, y: 0 },
    data: {
      id: 'inverter-1',
      type: 'inverter',
      label: 'Inverter',
      specs: {
        power: 735,
        efficiency: 98,
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'transformer-1',
    type: 'transformer',
    position: { x: 500, y: 0 },
    data: {
      id: 'transformer-1',
      type: 'transformer',
      label: 'Transformer',
      specs: {
        power: 720,
        efficiency: 95,
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'storage-1',
    type: 'storage',
    position: { x: 750, y: 0 },
    data: {
      id: 'storage-1',
      type: 'storage',
      label: 'Battery Storage',
      charge: 750,
      capacity: 1000,
      status: 'charging',
      temperature: 25,
      health: 98,
      onNodeClick: () => {},
    },
  },
  {
    id: 'consumer-residential',
    type: 'consumer',
    position: { x: 1000, y: 0 },
    data: {
      id: 'consumer-residential',
      type: 'residential',
      label: 'Residential Area',
      consumption: 150,
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'consumer-industrial',
    type: 'consumer',
    position: { x: 1000, y: 150 },
    data: {
      id: 'consumer-industrial',
      type: 'industrial',
      label: 'Industrial Zone',
      consumption: 250,
      status: 'active',
      onNodeClick: () => {},
    },
  },
  {
    id: 'grid-1',
    type: 'grid',
    position: { x: 1000, y: 300 },
    data: {
      id: 'grid-1',
      type: 'grid',
      label: 'Power Grid',
      specs: {
        power: 335,
        efficiency: 98,
      },
      status: 'active',
      onNodeClick: () => {},
    },
  },
];

export const getInitialEdges = (): Edge[] => [
  {
    id: 'source-to-inverter',
    source: 'source-1',
    target: 'inverter-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'inverter-to-transformer',
    source: 'inverter-1',
    target: 'transformer-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'transformer-to-storage',
    source: 'transformer-1',
    target: 'storage-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
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
  {
    id: 'grid-to-storage',
    source: 'grid-1',
    target: 'storage-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];