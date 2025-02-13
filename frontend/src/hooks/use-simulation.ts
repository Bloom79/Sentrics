import { useState, useEffect, useCallback } from 'react';
import { SimulationConfig, SimulationMetrics, simulationApi } from '@/lib/api/cer';

interface UseSimulationProps {
  configurationId: string;
  config: Omit<SimulationConfig, 'configuration_id'>;
  onMetricsUpdate?: (metrics: SimulationMetrics, type: 'quick' | 'real') => void;
  onError?: (error: any) => void;
  onProgress?: (progress: number, timeRemaining: string) => void;
}

export function useSimulation({
  configurationId,
  config,
  onMetricsUpdate,
  onError,
  onProgress
}: UseSimulationProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [simulationType, setSimulationType] = useState<'quick' | 'real'>(config.simulation_type || 'real');

  const startSimulation = useCallback((type: 'quick' | 'real' = 'real') => {
    try {
      console.log(`Starting ${type} simulation for configuration ${configurationId}`);
      const ws = simulationApi.createWebSocket(configurationId);

      ws.onopen = () => {
        console.log('WebSocket connected, sending configuration');
        // Send configuration when connection is established
        const simulationConfig = {
          ...config,
          configuration_id: configurationId,
          simulation_type: type
        };
        console.log('Sending configuration:', simulationConfig);
        ws.send(JSON.stringify(simulationConfig));
        setIsRunning(true);
        setError(null);
        setSimulationType(type);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data.type, data);
          
          switch (data.type) {
            case 'status':
              // Initial status update
              console.log('Received initial status:', data.data);
              onProgress?.(data.data.progress, data.data.estimated_time_remaining);
              break;
              
            case 'batch_update':
              // Process batch updates
              console.log(`Processing batch update with ${data.data.length} metrics`);
              // Take the last metrics from the batch for current display
              if (data.data.length > 0) {
                const lastMetrics = data.data[data.data.length - 1].metrics;
                console.log('Latest metrics:', lastMetrics);
                onMetricsUpdate?.(lastMetrics, data.simulation_type);
              }
              break;
              
            case 'progress':
              // Handle progress updates
              console.log('Progress update:', data.data);
              onProgress?.(data.data.progress, data.data.estimated_time_remaining);
              break;
              
            case 'complete':
              console.log('Simulation completed:', data.data.duration);
              setIsRunning(false);
              break;
              
            case 'stopped':
              console.log('Simulation stopped:', data.data.reason);
              setIsRunning(false);
              break;
              
            case 'error':
              console.error('Simulation error:', data.data.message);
              const error = new Error(data.data.message);
              setError(error);
              onError?.(error);
              setIsRunning(false);
              break;
              
            default:
              console.warn('Unknown message type:', data.type);
          }
        } catch (e) {
          console.error('Error processing message:', e, 'Raw message:', event.data);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        const error = new Error('WebSocket error');
        setError(error);
        onError?.(error);
        setIsRunning(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsRunning(false);
        setSocket(null);
      };

      setSocket(ws);
    } catch (e) {
      console.error('Error starting simulation:', e);
      setError(e as Error);
      onError?.(e);
      setIsRunning(false);
    }
  }, [configurationId, config, onMetricsUpdate, onError, onProgress]);

  const stopSimulation = useCallback(async () => {
    if (socket) {
      console.log('Stopping simulation');
      // Send stop command
      socket.send(JSON.stringify({ command: 'stop' }));
      // Also call the API to ensure it's stopped server-side
      try {
        await simulationApi.stop(configurationId);
      } catch (e) {
        console.error('Error stopping simulation:', e);
      }
      // Close socket
      socket.close();
      setSocket(null);
      setIsRunning(false);
    }
  }, [socket, configurationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        console.log('Cleaning up WebSocket connection');
        socket.close();
      }
    };
  }, [socket]);

  return {
    isRunning,
    error,
    simulationType,
    startSimulation,
    stopSimulation
  };
} 