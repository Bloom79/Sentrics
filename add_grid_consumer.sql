INSERT INTO 
public.asset_types (id, name, description, attributes, created_at, updated_at, normalized_name) VALUES ('d1e89c62-f79a-4e66-9c3f-c1f0d0b59b7d', 'Grid', 'Power grid connection point', '{voltage: {type: number, unit: V, label: Voltage}, frequency: {type: number, unit: Hz, label: Grid
Frequency}, congestion_level: {type: select, label: Congestion
Level, options: [low, medium, high]}, power_quality: {type: number, unit: %, label: Power
Quality}, grid_load: {type: number, unit: %, label: Grid
Load}}', '2025-01-09 17:19:31.570042+00', '2025-01-09 17:19:31.570042+00', 'grid'), ('e2f9ad73-g8ab-5f77-ad16-d2e1c1a60c8e', 'Consumer', 'Power consumption endpoint', '{power_consumption: {type: number, unit: kW, label: Power
Consumption}, peak_demand: {type: number, unit: kW, label: Peak
Demand}, load_factor: {type: number, unit: %, label: Load
Factor}, power_factor: {type: number, unit: %, label: Power
Factor}}', '2025-01-09 17:19:31.570042+00', '2025-01-09 17:19:31.570042+00', 'consumer');
