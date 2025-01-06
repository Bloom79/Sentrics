import { useState, useCallback, useEffect } from 'react';
import { Edge } from '@xyflow/react';
import { useToast } from '@/components/ui/use-toast';
import { EnergyFlow } from '@/types/flowComponents';
import { FaultType, EfficiencyMetric } from '@/types/flowTypes';

export const useFlowData = (timeRange: string, isPaused: boolean, edges: Edge[]) => {
  const { toast } = useToast();
  const [flowData, setFlowData] = useState<{ [key: string]: EnergyFlow[] }>({});
  const [faults, setFaults] = useState<{ [key: string]: FaultType[] }>({});
  const [efficiencyMetrics, setEfficiencyMetrics] = useState<{ [key: string]: EfficiencyMetric }>({});

  const generateFlowData = useCallback((edgeId: string): EnergyFlow => {
    const now = new Date();
    const currentValue = Math.random() * 1000;
    
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

  const generateEfficiencyMetrics = useCallback((edgeId: string) => {
    const baseEfficiency = 85 + Math.random() * 10;
    const transmissionLoss = Math.random() * 2;
    const conversionLoss = Math.random() * 3;
    const resistiveLoss = Math.random() * 1.5;

    return {
      efficiency: baseEfficiency,
      losses: [
        { type: 'Transmission', value: transmissionLoss },
        { type: 'Conversion', value: conversionLoss },
        { type: 'Resistive', value: resistiveLoss },
      ]
    };
  }, []);

  useEffect(() => {
    if (timeRange === 'realtime' && !isPaused) {
      const interval = setInterval(() => {
        setFlowData(prev => {
          const newData = { ...prev };
          edges.forEach(edge => {
            const newFlow = generateFlowData(edge.id);
            newData[edge.id] = [...(newData[edge.id] || []).slice(-50), newFlow];
            
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

  return { flowData, faults, efficiencyMetrics };
};