import React, { useState, useCallback, useEffect } from "react";
import { ReactFlow, Controls, Edge, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import { TimeRange, EnergyFlow } from "@/types/flowComponents";
import TimeRangeSelector from "./TimeRangeSelector";
import FlowChartDialog from "./FlowChartDialog";
import { getInitialLayout, generateEdges } from "@/utils/flowLayout";
import { getEdgeStyle } from "@/utils/edgeUtils";
import { useToast } from "@/components/ui/use-toast";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";

// Import your node components
import SourceNode from "./FlowNodes/SourceNode";
import StorageNode from "./FlowNodes/StorageNode";
import ConsumerNode from "./FlowNodes/ConsumerNode";
import GridNode from "./FlowNodes/GridNode";
import CellNode from "./FlowNodes/CellNode";
import StringNode from "./FlowNodes/StringNode";
import InverterNode from "./FlowNodes/InverterNode";
import TransformerNode from "./FlowNodes/TransformerNode";

const nodeTypes = {
  source: SourceNode,
  storage: StorageNode,
  consumer: ConsumerNode,
  grid: GridNode,
  cell: CellNode,
  string: StringNode,
  inverter: InverterNode,
  transformer: TransformerNode,
};

interface EnergyFlowVisualizationProps {
  site: Site;
}

type FaultType = {
  type: 'warning' | 'error';
  message: string;
};

type EfficiencyMetric = {
  efficiency: number;
  losses: { type: string; value: number; }[];
};

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("realtime");
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [flowData, setFlowData] = useState<{ [key: string]: EnergyFlow[] }>({});
  const [isPaused, setIsPaused] = useState(false);
  const [faults, setFaults] = useState<{ [key: string]: FaultType[] }>({});
  const [efficiencyMetrics, setEfficiencyMetrics] = useState<{ [key: string]: EfficiencyMetric }>({});

  const generateFlowData = useCallback((edgeId: string): EnergyFlow => {
    const now = new Date();
    const currentValue = Math.random() * 1000;
    
    // Randomly generate faults for demonstration
    if (Math.random() < 0.1) {
      const newFaults = [...(faults[edgeId] || [])];
      if (currentValue > 800) {
        newFaults.push({
          type: 'warning',
          message: 'High energy flow detected'
        });
      }
      if (currentValue < 200) {
        newFaults.push({
          type: 'error',
          message: 'Critical: Low energy flow'
        });
      }
      setFaults(prev => ({
        ...prev,
        [edgeId]: newFaults
      }));

      // Show toast for critical faults
      if (newFaults.some(f => f.type === 'error')) {
        toast({
          variant: "destructive",
          title: "Critical Fault Detected",
          description: `Edge ${edgeId} has reported critical faults`,
        });
      }
    }

    return {
      currentValue,
      maxValue: currentValue * 1.2,
      minValue: currentValue * 0.8,
      avgValue: currentValue,
      timestamp: now,
    };
  }, [faults, toast]);

  // Mock function to generate efficiency metrics
  const generateEfficiencyMetrics = useCallback((edgeId: string) => {
    const baseEfficiency = 85 + Math.random() * 10; // 85-95% efficiency
    const transmissionLoss = Math.random() * 2; // 0-2% transmission loss
    const conversionLoss = Math.random() * 3; // 0-3% conversion loss
    const resistiveLoss = Math.random() * 1.5; // 0-1.5% resistive loss

    return {
      efficiency: baseEfficiency,
      losses: [
        { type: 'Transmission', value: transmissionLoss },
        { type: 'Conversion', value: conversionLoss },
        { type: 'Resistive', value: resistiveLoss },
      ]
    };
  }, []);

  const { nodes, edges } = React.useMemo(() => {
    const layout = getInitialLayout(site.energySources.length);
    const edges = generateEdges(layout.nodes);
    return { nodes: layout.nodes, edges };
  }, [site.energySources.length]);

  useEffect(() => {
    if (timeRange === 'realtime' && !isPaused) {
      const interval = setInterval(() => {
        setFlowData(prev => {
          const newData = { ...prev };
          edges.forEach(edge => {
            const newFlow = generateFlowData(edge.id);
            newData[edge.id] = [...(newData[edge.id] || []).slice(-50), newFlow];
            
            // Update efficiency metrics
            setEfficiencyMetrics(prev => ({
              ...prev,
              [edge.id]: generateEfficiencyMetrics(edge.id)
            }));
          });
          return newData;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [timeRange, isPaused, generateFlowData, edges, generateEfficiencyMetrics]);

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    const currentFlow = flowData[edge.id]?.[flowData[edge.id].length - 1]?.currentValue || 0;
    const metrics = efficiencyMetrics[edge.id] || {
      efficiency: 95,
      losses: []
    };

    setSelectedEdge({
      ...edge,
      data: {
        ...edge.data,
        faults: faults[edge.id] || [],
        energyFlow: currentFlow,
        efficiency: metrics.efficiency,
        losses: metrics.losses,
      }
    });
    setSelectedNode(null);
  }, [faults, flowData, efficiencyMetrics]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode({ id: node.id, type: node.type });
    setSelectedEdge(null);
  }, []);

  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
    toast({
      title: "Time Range Updated",
      description: `Showing data for: ${newRange}`,
    });
  };

  const edgeOptions = {
    style: { strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#888',
    },
    animated: true,
  };

  return (
    <div className="relative h-[600px] bg-background/50 rounded-lg p-6 border">
      <div className="absolute top-4 left-4 z-10">
        <TimeRangeSelector value={timeRange} onChange={handleTimeRangeChange} />
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges.map(edge => ({
          ...edge,
          ...edgeOptions,
          style: {
            ...edgeOptions.style,
            ...getEdgeStyle(flowData[edge.id]?.[flowData[edge.id].length - 1]?.currentValue || 0),
            stroke: faults[edge.id]?.some(f => f.type === 'error') ? '#ef4444' : 
                   faults[edge.id]?.some(f => f.type === 'warning') ? '#f59e0b' : 
                   undefined,
            opacity: efficiencyMetrics[edge.id]?.efficiency 
              ? (efficiencyMetrics[edge.id].efficiency / 100) 
              : 1,
          },
          label: `${flowData[edge.id]?.[flowData[edge.id].length - 1]?.currentValue.toFixed(1) || '0'} kW (${
            efficiencyMetrics[edge.id]?.efficiency.toFixed(1) || '95'
          }%)`,
          labelStyle: { fill: 'black', fontWeight: 500 },
          labelBgStyle: { fill: 'white', opacity: 0.8 },
        }))}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        onEdgeClick={handleEdgeClick}
        onNodeClick={handleNodeClick}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
      </ReactFlow>

      {selectedEdge && (
        <EdgeDialog
          open={true}
          onClose={() => setSelectedEdge(null)}
          edgeData={{
            id: selectedEdge.id,
            source: selectedEdge.source,
            target: selectedEdge.target,
            energyFlow: flowData[selectedEdge.id]?.[flowData[selectedEdge.id].length - 1]?.currentValue || 0,
            efficiency: efficiencyMetrics[selectedEdge.id]?.efficiency || 95,
            status: faults[selectedEdge.id]?.some(f => f.type === 'error') ? 'error' : 'active',
            faults: faults[selectedEdge.id] || [],
            losses: efficiencyMetrics[selectedEdge.id]?.losses || [],
          }}
        />
      )}

      {selectedNode && (
        <NodeDialog
          open={true}
          onClose={() => setSelectedNode(null)}
          nodeType={selectedNode.type}
          nodeId={selectedNode.id}
        />
      )}
    </div>
  );
};

export default EnergyFlowVisualization;
