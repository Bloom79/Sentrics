-- Create configurations table
CREATE TABLE configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cer_id UUID NOT NULL REFERENCES cer(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    features JSONB NOT NULL DEFAULT '{}',
    restrictions JSONB NOT NULL DEFAULT '{}',
    community JSONB NOT NULL DEFAULT '{}',
    technical JSONB NOT NULL DEFAULT '{}',
    economic JSONB NOT NULL DEFAULT '{}',
    compliance JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create configuration_plant_mappings table
CREATE TABLE configuration_plant_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    configuration_id UUID NOT NULL REFERENCES configurations(id),
    plant_id UUID NOT NULL REFERENCES plants(id),
    status VARCHAR(50) NOT NULL,
    validations JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(configuration_id, plant_id)
);

-- Create indexes
CREATE INDEX idx_configurations_cer_id ON configurations(cer_id);
CREATE INDEX idx_configuration_plant_mappings_config_id ON configuration_plant_mappings(configuration_id);
CREATE INDEX idx_configuration_plant_mappings_plant_id ON configuration_plant_mappings(plant_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_configurations_updated_at
    BEFORE UPDATE ON configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuration_plant_mappings_updated_at
    BEFORE UPDATE ON configuration_plant_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 