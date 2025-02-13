import { useState, useEffect } from 'react';

export interface SensorReading {
  timestamp: Date;
  value: number;
  sensorId: string;
  sensorType: 'pyranometer' | 'reference_cell';
  unit: string;
}

interface SensorConfig {
  id: string;
  type: 'pyranometer' | 'reference_cell';
  baseValue: number;
  variance: number;
  unit: string;
}

export const useSensorData = (sensors: SensorConfig[], interval: number = 5000) => {
  const [readings, setReadings] = useState<Record<string, SensorReading[]>>({});

  const generateReading = (sensor: SensorConfig): SensorReading => {
    const variance = (Math.random() - 0.5) * 2 * sensor.variance;
    const value = sensor.baseValue + variance;
    
    return {
      timestamp: new Date(),
      value: Number(value.toFixed(2)),
      sensorId: sensor.id,
      sensorType: sensor.type,
      unit: sensor.unit
    };
  };

  useEffect(() => {
    // Initialize readings for each sensor
    const initialReadings: Record<string, SensorReading[]> = {};
    sensors.forEach(sensor => {
      initialReadings[sensor.id] = [generateReading(sensor)];
    });
    setReadings(initialReadings);

    // Set up interval for simulated data updates
    const intervalId = setInterval(() => {
      setReadings(prev => {
        const newReadings = { ...prev };
        sensors.forEach(sensor => {
          const sensorReadings = newReadings[sensor.id] || [];
          const newReading = generateReading(sensor);
          
          // Keep last 50 readings for each sensor
          newReadings[sensor.id] = [...sensorReadings, newReading].slice(-50);
        });
        return newReadings;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [sensors, interval]);

  return readings;
};
