import { MarkerType, Edge } from '@xyflow/react';

const edgeStyle = {
  stroke: '#22c55e',
  strokeWidth: 2,
};

const edgeLabelStyle = {
  fill: '#1e293b',
  fontWeight: 600,
  fontSize: '14px',
};

const edgeLabelBgStyle = {
  fill: 'white',
  fillOpacity: 0.9,
  rx: 4,
  stroke: '#e2e8f0',
  strokeWidth: 1,
};

export const getInitialEdges = (): Edge[] => [
  // Generation to Conversion
  {
    id: 'solar-to-inverter',
    source: 'source-solar',
    target: 'inverter-1',
    animated: true,
    style: edgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: '580 kW',
    labelStyle: edgeLabelStyle,
    labelBgStyle: edgeLabelBgStyle,
  },
  {
    id: 'wind-to-inverter',
    source: 'source-wind',
    target: 'inverter-1',
    animated: true,
    style: edgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: '250 kW',
    labelStyle: edgeLabelStyle,
    labelBgStyle: edgeLabelBgStyle,
  },

  // Conversion Chain
  {
    id: 'inverter-to-transformer',
    source: 'inverter-1',
    target: 'transformer-1',
    animated: true,
    style: edgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: '778.8 kW',
    labelStyle: edgeLabelStyle,
    labelBgStyle: edgeLabelBgStyle,
  },

  // BESS to Grid connections
  {
    id: 'bess-1-to-grid',
    source: 'bess-1',
    target: 'grid-1',
    animated: true,
    style: edgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: '495.7 kW',
    labelStyle: edgeLabelStyle,
    labelBgStyle: edgeLabelBgStyle,
  },
  {
    id: 'bess-2-to-grid',
    source: 'bess-2',
    target: 'grid-1',
    animated: true,
    style: edgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: '141.3 kW',
    labelStyle: edgeLabelStyle,
    labelBgStyle: edgeLabelBgStyle,
  },

  // Transformer to BESS connections
  {
    id: 'transformer-to-bess-1',
    source: 'transformer-1',
    target: 'bess-1',
    animated: true,
    style: edgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: '584.9 kW',
    labelStyle: edgeLabelStyle,
    labelBgStyle: edgeLabelBgStyle,
  },
  {
    id: 'transformer-to-bess-2',
    source: 'transformer-1',
    target: 'bess-2',
    animated: true,
    style: edgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: '649.3 kW',
    labelStyle: edgeLabelStyle,
    labelBgStyle: edgeLabelBgStyle,
  },

  // BESS to Consumers
  {
    id: 'bess-1-to-residential',
    source: 'bess-1',
    target: 'consumer-residential',
    animated: true,
    style: edgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: '150 kW',
    labelStyle: edgeLabelStyle,
    labelBgStyle: edgeLabelBgStyle,
  },
  {
    id: 'bess-2-to-industrial',
    source: 'bess-2',
    target: 'consumer-industrial',
    animated: true,
    style: edgeStyle,
    markerEnd: { type: MarkerType.ArrowClosed },
    label: '450 kW',
    labelStyle: edgeLabelStyle,
    labelBgStyle: edgeLabelBgStyle,
  },
];