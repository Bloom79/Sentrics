# Database Schema Documentation

## Tables

### assets
Stores information about all energy assets in the system.

```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  type_id UUID NOT NULL REFERENCES asset_types(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255),
  manufacturer VARCHAR(255),
  installation_date DATE,
  location VARCHAR(255),
  status VARCHAR(50),
  rated_power DECIMAL,
  efficiency DECIMAL,
  notes TEXT,
  dynamic_attributes JSONB DEFAULT '{}'::jsonb,
  parent_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  component_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX idx_assets_site_id ON assets(site_id);
CREATE INDEX idx_assets_plant_id ON assets(plant_id);
CREATE INDEX idx_assets_type_id ON assets(type_id);
CREATE INDEX idx_assets_parent_id ON assets(parent_id);
```

### asset_types
Defines the types of assets that can be created in the system.

```sql
CREATE TABLE asset_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  attributes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  normalized_name VARCHAR(255) GENERATED ALWAYS AS (lower(regexp_replace(name, '\s+', '_', 'g'))) STORED
);

-- Predefined Asset Types
INSERT INTO asset_types (name, description, attributes) VALUES
('Wind Turbine', 'Wind power generation unit', '{
  "rated_power": {"type": "number", "unit": "MW", "label": "Rated Power"},
  "rotor_diameter": {"type": "number", "unit": "m", "label": "Rotor Diameter"},
  "hub_height": {"type": "number", "unit": "m", "label": "Hub Height"},
  "generator_type": {"type": "select", "options": ["DFIG", "PMSG", "SCIG", "WRIG"], "label": "Generator Type"},
  "cut_in_speed": {"type": "number", "unit": "m/s", "label": "Cut-in Wind Speed"},
  "cut_out_speed": {"type": "number", "unit": "m/s", "label": "Cut-out Wind Speed"},
  "nominal_wind_speed": {"type": "number", "unit": "m/s", "label": "Nominal Wind Speed"},
  "blade_length": {"type": "number", "unit": "m", "label": "Blade Length"},
  "swept_area": {"type": "number", "unit": "m²", "label": "Swept Area"},
  "yaw_system": {"type": "select", "options": ["active", "passive"], "label": "Yaw System Type"}
}'::jsonb),

('Solar Panel', 'Solar power generation unit', '{
  "rated_power": {"type": "number", "unit": "W", "label": "Rated Power"},
  "panel_type": {"type": "select", "options": ["mono", "poly", "thin"], "label": "Panel Type"},
  "efficiency": {"type": "number", "unit": "%", "label": "Efficiency"}
}'::jsonb),

('Inverter', 'Power conversion unit', '{
  "rated_power": {"type": "number", "unit": "kW", "label": "Rated Power"},
  "efficiency": {"type": "number", "unit": "%", "label": "Efficiency"},
  "mppt_channels": {"type": "number", "label": "MPPT Channels"}
}'::jsonb),

('Battery', 'Energy storage unit', '{
  "capacity": {"type": "number", "unit": "kWh", "label": "Capacity"},
  "chemistry": {"type": "select", "options": ["li-ion", "lfp", "vrfb"], "label": "Battery Chemistry"},
  "cycles": {"type": "number", "label": "Cycle Life"}
}'::jsonb),

('Transformer', 'Power transformation unit', '{
  "rated_power": {"type": "number", "unit": "MVA", "label": "Rated Power"},
  "primary_voltage": {"type": "number", "unit": "kV", "label": "Primary Voltage"},
  "secondary_voltage": {"type": "number", "unit": "kV", "label": "Secondary Voltage"}
}'::jsonb),

('Collector Substation', 'Power collection and transformation unit', '{
  "rated_power": {"type": "number", "unit": "MVA", "label": "Rated Power"},
  "voltage_level": {"type": "number", "unit": "kV", "label": "Voltage Level"},
  "protection_type": {"type": "select", "options": ["differential", "overcurrent", "distance"], "label": "Protection Type"}
}'::jsonb);

-- Indexes
CREATE INDEX idx_asset_types_name ON asset_types(name);
CREATE INDEX idx_asset_types_normalized_name ON asset_types(normalized_name);
```

### asset_maintenance
Tracks maintenance records for assets.

```sql
CREATE TABLE asset_maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(50) NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50),
  technician_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX idx_asset_maintenance_asset_id ON asset_maintenance(asset_id);
CREATE INDEX idx_asset_maintenance_technician_id ON asset_maintenance(technician_id);
```

### asset_monitoring
Stores real-time monitoring data for assets.

```sql
CREATE TABLE asset_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL,
  unit VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX idx_asset_monitoring_asset_id ON asset_monitoring(asset_id);
CREATE INDEX idx_asset_monitoring_timestamp ON asset_monitoring(timestamp);
```

### consumption_data
Tracks energy consumption data.

```sql
CREATE TABLE consumption_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  value DECIMAL NOT NULL,
  interval_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  notes TEXT
);

-- Indexes
CREATE INDEX idx_consumption_data_site_id ON consumption_data(site_id);
CREATE INDEX idx_consumption_data_timestamp ON consumption_data(timestamp);
```

## Row Level Security (RLS) Policies

### assets Table Policies

```sql
-- Select Policy
CREATE POLICY "Users can view assets they have access to"
  ON assets FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM site_members WHERE site_id = assets.site_id
      UNION
      SELECT user_id FROM plant_members WHERE plant_id = assets.plant_id
    )
  );

-- Insert Policy
CREATE POLICY "Users can create assets for sites they manage"
  ON assets FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM site_members 
      WHERE site_id = assets.site_id 
      AND role IN ('admin', 'manager')
    )
  );

-- Update Policy
CREATE POLICY "Users can update assets for sites they manage"
  ON assets FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM site_members 
      WHERE site_id = assets.site_id 
      AND role IN ('admin', 'manager')
    )
  );

-- Delete Policy
CREATE POLICY "Users can delete assets for sites they manage"
  ON assets FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM site_members 
      WHERE site_id = assets.site_id 
      AND role IN ('admin', 'manager')
    )
  );
```

### asset_monitoring Table Policies

```sql
-- Select Policy
CREATE POLICY "Users can view monitoring data for assets they have access to"
  ON asset_monitoring FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM site_members 
      WHERE site_id = (SELECT site_id FROM assets WHERE id = asset_monitoring.asset_id)
    )
  );

-- Insert Policy
CREATE POLICY "Users can add monitoring data for assets they manage"
  ON asset_monitoring FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM site_members 
      WHERE site_id = (SELECT site_id FROM assets WHERE id = asset_monitoring.asset_id)
      AND role IN ('admin', 'manager', 'technician')
    )
  );
```

## Relationships

- `assets.site_id` → `sites.id`
- `assets.plant_id` → `plants.id`
- `assets.type_id` → `asset_types.id`
- `assets.parent_id` → `assets.id` (self-referential)
- `asset_maintenance.asset_id` → `assets.id`
- `asset_maintenance.technician_id` → `users.id`
- `asset_monitoring.asset_id` → `assets.id`
- `consumption_data.site_id` → `sites.id`

## Triggers

```sql
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_types_updated_at
  BEFORE UPDATE ON asset_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_maintenance_updated_at
  BEFORE UPDATE ON asset_maintenance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_monitoring_updated_at
  BEFORE UPDATE ON asset_monitoring
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Notes

1. The `dynamic_attributes` JSONB field in `assets` allows for flexible storage of asset-specific attributes
2. Asset types have predefined attribute schemas stored in their `attributes` JSONB field
3. The hierarchical structure is supported through `parent_id` relationships in the `assets` table
4. Both site-level and plant-level access control is implemented through RLS policies
5. The `asset_monitoring` table supports real-time data collection with timestamp-based metrics
6. The `consumption_data` table tracks energy consumption with support for different interval types
7. Maintenance scheduling and tracking is handled through the `asset_maintenance` table 

## Core Tables

### plants
```sql
CREATE TABLE plants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location JSONB NOT NULL,
    type VARCHAR(50) NOT NULL,
    capacity DECIMAL NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### assets
```sql
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id UUID REFERENCES plants(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    serial_number VARCHAR(255),
    installation_date DATE,
    status VARCHAR(50) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## IoT Data

### devices
```sql
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id),
    device_id VARCHAR(255) UNIQUE NOT NULL,
    protocol VARCHAR(50) NOT NULL,
    connection_string TEXT,
    status VARCHAR(50) NOT NULL,
    last_seen TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### device_telemetry
```sql
CREATE TABLE device_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    timestamp TIMESTAMPTZ NOT NULL,
    data JSONB NOT NULL,
    quality INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### device_commands
```sql
CREATE TABLE device_commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    command VARCHAR(255) NOT NULL,
    parameters JSONB,
    status VARCHAR(50) NOT NULL,
    sent_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Time Series Data

### power_production
```sql
CREATE TABLE power_production (
    time TIMESTAMPTZ NOT NULL,
    plant_id UUID REFERENCES plants(id),
    asset_id UUID REFERENCES assets(id),
    active_power DECIMAL,
    reactive_power DECIMAL,
    voltage DECIMAL,
    current DECIMAL,
    frequency DECIMAL,
    power_factor DECIMAL,
    temperature DECIMAL,
    metadata JSONB
);
```

### power_consumption
```sql
CREATE TABLE power_consumption (
    time TIMESTAMPTZ NOT NULL,
    plant_id UUID REFERENCES plants(id),
    active_power DECIMAL,
    reactive_power DECIMAL,
    power_factor DECIMAL,
    metadata JSONB
);
```

### battery_status
```sql
CREATE TABLE battery_status (
    time TIMESTAMPTZ NOT NULL,
    asset_id UUID REFERENCES assets(id),
    state_of_charge DECIMAL,
    voltage DECIMAL,
    current DECIMAL,
    temperature DECIMAL,
    cycle_count INTEGER,
    metadata JSONB
);
```

## Protocol Data

### mqtt_messages
```sql
CREATE TABLE mqtt_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    qos INTEGER NOT NULL,
    retained BOOLEAN NOT NULL,
    received_at TIMESTAMPTZ NOT NULL,
    device_id UUID REFERENCES devices(id)
);
```

### opcua_nodes
```sql
CREATE TABLE opcua_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    node_id VARCHAR(255) NOT NULL,
    browse_name VARCHAR(255) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    access_level INTEGER NOT NULL,
    metadata JSONB
);
```

### modbus_registers
```sql
CREATE TABLE modbus_registers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    register_type VARCHAR(50) NOT NULL,
    address INTEGER NOT NULL,
    size INTEGER NOT NULL,
    description VARCHAR(255),
    scaling_factor DECIMAL DEFAULT 1,
    metadata JSONB
);
```

### iec61850_nodes
```sql
CREATE TABLE iec61850_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    logical_device VARCHAR(255) NOT NULL,
    logical_node VARCHAR(255) NOT NULL,
    data_object VARCHAR(255) NOT NULL,
    data_attribute VARCHAR(255),
    fc VARCHAR(10) NOT NULL,
    metadata JSONB
);
```

### dnp3_points
```sql
CREATE TABLE dnp3_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    point_type VARCHAR(50) NOT NULL,
    index INTEGER NOT NULL,
    description VARCHAR(255),
    metadata JSONB
);
```

## Maintenance Data

### maintenance_records
```sql
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id),
    type VARCHAR(50) NOT NULL,
    description TEXT,
    scheduled_date DATE,
    completed_date DATE,
    status VARCHAR(50) NOT NULL,
    technician VARCHAR(255),
    cost DECIMAL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### alerts
```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id),
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Indexes

### Time Series Indexes
```sql
CREATE INDEX idx_power_production_time ON power_production (time DESC);
CREATE INDEX idx_power_consumption_time ON power_consumption (time DESC);
CREATE INDEX idx_battery_status_time ON battery_status (time DESC);
```

### Device Indexes
```sql
CREATE INDEX idx_device_telemetry_time ON device_telemetry (timestamp DESC);
CREATE INDEX idx_device_telemetry_device ON device_telemetry (device_id);
CREATE INDEX idx_devices_status ON devices (status);
```

### Protocol Indexes
```sql
CREATE INDEX idx_mqtt_messages_topic ON mqtt_messages (topic);
CREATE INDEX idx_mqtt_messages_time ON mqtt_messages (received_at DESC);
CREATE INDEX idx_modbus_registers_device ON modbus_registers (device_id, register_type, address);
CREATE INDEX idx_opcua_nodes_device ON opcua_nodes (device_id, node_id);
```

## Partitioning

### Time Series Partitioning
```sql
-- Partition power_production by month
CREATE TABLE power_production_y2024m01 PARTITION OF power_production
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition device_telemetry by month
CREATE TABLE device_telemetry_y2024m01 PARTITION OF device_telemetry
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## Views

### asset_status_view
```sql
CREATE VIEW asset_status_view AS
SELECT 
    a.id AS asset_id,
    a.name AS asset_name,
    a.type AS asset_type,
    d.status AS device_status,
    d.last_seen,
    t.data AS latest_telemetry
FROM assets a
LEFT JOIN devices d ON d.asset_id = a.id
LEFT JOIN LATERAL (
    SELECT data 
    FROM device_telemetry 
    WHERE device_id = d.id 
    ORDER BY timestamp DESC 
    LIMIT 1
) t ON true;
```

### plant_performance_view
```sql
CREATE VIEW plant_performance_view AS
SELECT 
    p.id AS plant_id,
    p.name AS plant_name,
    date_trunc('hour', pp.time) AS hour,
    SUM(pp.active_power) AS total_production,
    SUM(pc.active_power) AS total_consumption,
    AVG(bs.state_of_charge) AS avg_battery_charge
FROM plants p
LEFT JOIN power_production pp ON pp.plant_id = p.id
LEFT JOIN power_consumption pc ON pc.plant_id = p.id
LEFT JOIN assets a ON a.plant_id = p.id
LEFT JOIN battery_status bs ON bs.asset_id = a.id
GROUP BY p.id, p.name, date_trunc('hour', pp.time);
```

## Energy Communities Module

### energy_communities
Stores information about energy communities.

```sql
CREATE TABLE energy_communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  legal_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  gse_compliance_status VARCHAR(50),
  primary_substation_id VARCHAR(255) NOT NULL,
  boundary GEOMETRY(POLYGON, 4326),
  total_capacity DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX idx_energy_communities_boundary ON energy_communities USING gist (boundary);
```

### community_members
Stores information about members of energy communities.

```sql
CREATE TABLE community_members (
  id SERIAL PRIMARY KEY,
  community_id INTEGER NOT NULL REFERENCES energy_communities(id) ON DELETE CASCADE,
  member_type VARCHAR(50) NOT NULL,
  pod_id VARCHAR(255) NOT NULL,
  smart_meter_id VARCHAR(255),
  location GEOMETRY(POINT, 4326),
  sharing_preferences JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX idx_community_members_community_id ON community_members(community_id);
CREATE INDEX idx_community_members_location ON community_members USING gist (location);
```

### community_assets
Stores information about assets within energy communities.

```sql
CREATE TABLE community_assets (
  id SERIAL PRIMARY KEY,
  community_id INTEGER NOT NULL REFERENCES energy_communities(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  asset_type VARCHAR(50) NOT NULL,
  capacity DECIMAL NOT NULL,
  installation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  gse_registration_id VARCHAR(255),
  metadata JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX idx_community_assets_community_id ON community_assets(community_id);
CREATE INDEX idx_community_assets_member_id ON community_assets(member_id);
```

### energy_transactions
Stores energy sharing transactions within communities.

```sql
CREATE TABLE energy_transactions (
  id SERIAL PRIMARY KEY,
  community_id INTEGER NOT NULL REFERENCES energy_communities(id) ON DELETE CASCADE,
  producer_id INTEGER NOT NULL REFERENCES community_members(id),
  consumer_id INTEGER NOT NULL REFERENCES community_members(id),
  asset_id INTEGER NOT NULL REFERENCES community_assets(id),
  amount DECIMAL NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  incentive_rate DECIMAL,
  extra_data JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX idx_energy_transactions_community_id ON energy_transactions(community_id);
CREATE INDEX idx_energy_transactions_producer_id ON energy_transactions(producer_id);
CREATE INDEX idx_energy_transactions_consumer_id ON energy_transactions(consumer_id);
CREATE INDEX idx_energy_transactions_asset_id ON energy_transactions(asset_id);
CREATE INDEX idx_energy_transactions_timestamp ON energy_transactions(timestamp);
```

### gse_compliance_records
Stores GSE compliance records for communities.

```sql
CREATE TABLE gse_compliance_records (
  id SERIAL PRIMARY KEY,
  community_id INTEGER NOT NULL REFERENCES energy_communities(id) ON DELETE CASCADE,
  submission_type VARCHAR(50) NOT NULL,
  submission_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL,
  response_date TIMESTAMP WITH TIME ZONE,
  documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX idx_gse_compliance_records_community_id ON gse_compliance_records(community_id);
CREATE INDEX idx_gse_compliance_records_submission_date ON gse_compliance_records(submission_date);
```

## Relationships

### Energy Communities Module
- `community_members.community_id` → `energy_communities.id`
- `community_assets.community_id` → `energy_communities.id`
- `community_assets.member_id` → `community_members.id`
- `energy_transactions.community_id` → `energy_communities.id`
- `energy_transactions.producer_id` → `community_members.id`
- `energy_transactions.consumer_id` → `community_members.id`
- `energy_transactions.asset_id` → `community_assets.id`
- `gse_compliance_records.community_id` → `energy_communities.id` 