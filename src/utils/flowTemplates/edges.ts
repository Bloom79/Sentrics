import { Edge, MarkerType } from '@xyflow/react';

export const getInitialEdges = (): Edge[] => [
  // Solar to Inverter
  {
    id: 'solar-to-inverter',
    source: 'source-solar',
    target: 'inverter-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  // Wind to Inverter
  {
    id: 'wind-to-inverter',
    source: 'source-wind',
    target: 'inverter-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  // Inverter to Transformer
  {
    id: 'inverter-to-transformer',
    source: 'inverter-1',
    target: 'transformer-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  // Transformer to BESS 1
  {
    id: 'transformer-to-bess1',
    source: 'transformer-1',
    target: 'bess-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  // BESS 1 to Residential
  {
    id: 'bess1-to-residential',
    source: 'bess-1',
    target: 'consumer-residential',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  // BESS 2 to Industrial
  {
    id: 'bess2-to-industrial',
    source: 'bess-2',
    target: 'consumer-industrial',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  // Grid to BESS units
  {
    id: 'grid-to-bess1',
    source: 'grid-1',
    target: 'bess-1',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'grid-to-bess2',
    source: 'grid-1',
    target: 'bess-2',
    animated: true,
    style: { stroke: '#22c55e' },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];