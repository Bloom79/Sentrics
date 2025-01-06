export type FaultType = {
  type: 'warning' | 'error';
  message: string;
};

export type EfficiencyMetric = {
  efficiency: number;
  losses: { type: string; value: number; }[];
};