import { Node, Edge } from '@xyflow/react';
import { FlowNodeData } from '@/types/flowComponents';
import { getGenerationNodes } from './flowTemplates/generationNodes';
import { getConversionNodes } from './flowTemplates/conversionNodes';
import { getStorageNodes } from './flowTemplates/storageNodes';
import { getConsumptionNodes } from './flowTemplates/consumptionNodes';
import { getInitialEdges } from './flowTemplates/edges';

export const getInitialNodes = (): Node<FlowNodeData>[] => [
  ...getGenerationNodes(),
  ...getConversionNodes(),
  ...getStorageNodes(),
  ...getConsumptionNodes(),
];

export { getInitialEdges } from './flowTemplates/edges';