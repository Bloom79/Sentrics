import React, { useState, useCallback, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import { TimeRange } from "@/types/flowComponents";
import { Edge, Node } from "@xyflow/react";
import TimeRangeSelector from "./TimeRangeSelector";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";
import { useFlowData } from "@/hooks/useFlowData";
import FlowControls from "./FlowComponents/FlowControls";
import FlowCanvas from "./FlowComponents/FlowCanvas";
import { getInitialNodes, getInitialEdges } from "@/utils/initialFlowTemplate";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface EnergyFlowVisualizationProps {
  site: Site;
}

const Flow: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const [nodes, setNodes] = useState<Node[]>(getInitialNodes());
  const [edges, setEdges] = useState<Edge[]>(getInitialEdges());
  const [timeRange, setTimeRange] = useState<TimeRange>("realtime");
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();
  const plantId = site.plants[0]?.id;

  const { flowData, faults, efficiencyMetrics } = useFlowData(timeRange, isPaused, edges);

  // Load the saved flow state when component mounts
  useEffect(() => {
    const loadFlowState = async () => {
      const { data: flowState, error } = await supabase
        .from("energy_flows")
        .select("*")
        .eq("site_id", site.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error loading flow state:", error);
        return;
      }

      if (flowState) {
        setNodes(flowState.nodes);
        setEdges(flowState.edges);
      }
    };

    loadFlowState();
  }, [site.id]);

  const handleSaveFlow = async () => {
    setIsSaving(true);
    try {
      const { data: existingFlow, error: fetchError } = await supabase
        .from("energy_flows")
        .select("id")
        .eq("site_id", site.id)
        .eq("is_active", true)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingFlow) {
        // Update existing flow
        const { error: updateError } = await supabase
          .from("energy_flows")
          .update({
            nodes,
            edges,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingFlow.id);

        if (updateError) throw updateError;
      } else {
        // Create new flow
        const { error: insertError } = await supabase
          .from("energy_flows")
          .insert({
            site_id: site.id,
            nodes,
            edges
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Energy flow saved successfully",
      });
    } catch (error) {
      console.error("Error saving flow state:", error);
      toast({
        title: "Error",
        description: "Failed to save energy flow",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (!isEditMode) return;
    
    event.stopPropagation();
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
  }, [isEditMode, flowData, faults, efficiencyMetrics]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (!isEditMode) return;
    
    event.stopPropagation();
    setSelectedNode({
      id: node.id,
      type: node.type as string
    });
  }, [isEditMode]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * 1.2, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  }, []);

  const handleFitView = useCallback(() => {
    setZoomLevel(1);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] bg-background/50 rounded-lg border">
      {/* Top Controls Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-background/50">
        <div className="w-32"> {/* Spacer */}</div>
        
        <div className="flex-1 flex justify-center">
          <TimeRangeSelector
            value={timeRange}
            onChange={setTimeRange}
            isPaused={isPaused}
            onPauseChange={setIsPaused}
          />
        </div>

        <div className="flex items-center gap-2 w-32 justify-end">
          {isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveFlow}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Flow"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                View Mode
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Mode
              </>
            )}
          </Button>
        </div>
      </div>

      <ReactFlowProvider>
        <div className="w-full h-full pt-16">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            flowData={flowData}
            faults={faults}
            efficiencyMetrics={efficiencyMetrics}
            onEdgeClick={handleEdgeClick}
            onNodeClick={handleNodeClick}
            isEditMode={isEditMode}
            plantId={plantId}
            siteId={site.id}
            site={site}
          />

          <FlowControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitView={handleFitView}
          />

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
              nodeId={selectedNode.id}
              nodeType={selectedNode.type}
            />
          )}
        </div>
      </ReactFlowProvider>
    </div>
  );
};

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Flow {...props} />
    </div>
  );
};

export default EnergyFlowVisualization;