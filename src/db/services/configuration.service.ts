import { Pool } from 'pg';
import { CERConfiguration, NewConfiguration, UpdatedConfiguration, PlantMapping } from '../../types/cer/configuration';

export class ConfigurationDBService {
  constructor(private pool: Pool) {}

  async getConfigurations(cerId: string): Promise<CERConfiguration[]> {
    const query = `
      SELECT * FROM configurations
      WHERE cer_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await this.pool.query(query, [cerId]);
    return result.rows.map(this.mapRowToConfiguration);
  }

  async getConfiguration(id: string): Promise<CERConfiguration | null> {
    const query = `
      SELECT * FROM configurations
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    
    return this.mapRowToConfiguration(result.rows[0]);
  }

  async createConfiguration(cerId: string, config: NewConfiguration): Promise<string> {
    const query = `
      INSERT INTO configurations (
        cer_id, name, type, version, status,
        features, restrictions, community, technical,
        economic, compliance
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      RETURNING id
    `;
    
    const values = [
      cerId,
      config.name,
      config.type,
      config.version,
      config.status,
      JSON.stringify(config.features),
      JSON.stringify(config.restrictions),
      JSON.stringify(config.community),
      JSON.stringify(config.technical),
      JSON.stringify(config.economic),
      JSON.stringify(config.compliance),
    ];
    
    const result = await this.pool.query(query, values);
    return result.rows[0].id;
  }

  async updateConfiguration(config: UpdatedConfiguration): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [config.id];
    let paramCount = 1;

    if (config.name) {
      updates.push(`name = $${++paramCount}`);
      values.push(config.name);
    }
    if (config.type) {
      updates.push(`type = $${++paramCount}`);
      values.push(config.type);
    }
    if (config.version) {
      updates.push(`version = $${++paramCount}`);
      values.push(config.version);
    }
    if (config.status) {
      updates.push(`status = $${++paramCount}`);
      values.push(config.status);
    }
    if (config.features) {
      updates.push(`features = $${++paramCount}`);
      values.push(JSON.stringify(config.features));
    }
    if (config.restrictions) {
      updates.push(`restrictions = $${++paramCount}`);
      values.push(JSON.stringify(config.restrictions));
    }
    if (config.community) {
      updates.push(`community = $${++paramCount}`);
      values.push(JSON.stringify(config.community));
    }
    if (config.technical) {
      updates.push(`technical = $${++paramCount}`);
      values.push(JSON.stringify(config.technical));
    }
    if (config.economic) {
      updates.push(`economic = $${++paramCount}`);
      values.push(JSON.stringify(config.economic));
    }
    if (config.compliance) {
      updates.push(`compliance = $${++paramCount}`);
      values.push(JSON.stringify(config.compliance));
    }

    if (updates.length === 0) return;

    const query = `
      UPDATE configurations
      SET ${updates.join(', ')}
      WHERE id = $1
    `;

    await this.pool.query(query, values);
  }

  async deleteConfiguration(id: string): Promise<void> {
    // First delete all plant mappings
    await this.pool.query(
      'DELETE FROM configuration_plant_mappings WHERE configuration_id = $1',
      [id]
    );

    // Then delete the configuration
    await this.pool.query(
      'DELETE FROM configurations WHERE id = $1',
      [id]
    );
  }

  // Plant Mapping Methods
  async mapPlants(configId: string, plantIds: string[]): Promise<void> {
    const query = `
      INSERT INTO configuration_plant_mappings (
        configuration_id, plant_id, status
      )
      VALUES ($1, $2, 'active')
      ON CONFLICT (configuration_id, plant_id) 
      DO UPDATE SET status = 'active', updated_at = CURRENT_TIMESTAMP
    `;

    await Promise.all(
      plantIds.map(plantId =>
        this.pool.query(query, [configId, plantId])
      )
    );
  }

  async unmapPlants(configId: string, plantIds: string[]): Promise<void> {
    const query = `
      DELETE FROM configuration_plant_mappings
      WHERE configuration_id = $1 AND plant_id = ANY($2)
    `;

    await this.pool.query(query, [configId, plantIds]);
  }

  async getPlantMappings(configId: string): Promise<PlantMapping[]> {
    const query = `
      SELECT * FROM configuration_plant_mappings
      WHERE configuration_id = $1
    `;

    const result = await this.pool.query(query, [configId]);
    return result.rows.map(this.mapRowToPlantMapping);
  }

  // Helper Methods
  private mapRowToConfiguration(row: any): CERConfiguration {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      version: row.version,
      status: row.status,
      features: row.features,
      restrictions: row.restrictions,
      community: row.community,
      technical: row.technical,
      economic: row.economic,
      compliance: row.compliance,
    };
  }

  private mapRowToPlantMapping(row: any): PlantMapping {
    return {
      plantId: row.plant_id,
      configurationId: row.configuration_id,
      status: row.status,
      validations: row.validations,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
} 