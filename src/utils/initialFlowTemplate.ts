import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';

export const getInitialNodes = (): Node<FlowNodeData>[] => [
  {
    id: 'solar-1',
    type: 'source',
    position: { x: 0, y: 0 },
    data: {
      type: 'solar',
      label: 'Solar Array 1',
      output: 350,
      capacity: 500,
      onNodeClick: () => {},
    },
  },
  {
    id: 'storage-main',
    type: 'storage',
    position: { x: 250, y: 0 },
    data: {
      id: 'storage-main',
      type: 'storage',
      label: 'Main Storage',
      charge: 750,
      capacity: 1000,
      status: 'charging' as const,
      temperature: 25,
      health: 98,
      onNodeClick: () => {},
    },
  },
  {
    id: 'storage-backup',
    type: 'storage',
    position: { x: 250, y: 150 },
    data: {
      id: 'storage-backup',
      type: 'storage',
      label: 'Backup Storage',
      charge: 500,
      capacity: 1000,
      status: 'idle' as const,
      temperature: 23,
      health: 95,
      onNodeClick: () => {},
    },
  },
  {
    id: 'grid-1',
    type: 'grid',
    position: { x: 0, y: 150 },
    data: {
      delivery: 200,
      onNodeClick: () => {},
    },
  },
  {
    id: 'consumer-residential',
    type: 'consumer',
    position: { x: 500, y: 0 },
    data: {
      id: 'consumer-residential',
      type: 'residential',
      label: 'Residential Area',
      consumption: 150,
      onNodeClick: () => {},
    },
  },
  {
    id: 'consumer-industrial',
    type: 'consumer',
    position: { x: 500, y: 150 },
    data: {
      id: 'consumer-industrial',
      type: 'industrial',
      label: 'Industrial Zone',
      consumption: 250,
      onNodeClick: () => {},
    },
  },
];

export const getInitialEdges = (): Edge[] => [
  {
    id: 'solar-to-storage-main',
    source: 'solar-1',
    target: 'storage-main',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'grid-to-storage-main',
    source: 'grid-1',
    target: 'storage-main',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'grid-to-storage-backup',
    source: 'grid-1',
    target: 'storage-backup',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'storage-main-to-residential',
    source: 'storage-main',
    target: 'consumer-residential',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'storage-backup-to-industrial',
    source: 'storage-backup',
    target: 'consumer-industrial',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];