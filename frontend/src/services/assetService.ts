import { supabase } from '@/lib/supabase';
import { AssetInstance, AssetType } from '@/types/assets';

export const assetService = {
  async getAssetTypes(): Promise<AssetType[]> {
    const { data, error } = await supabase
      .from('asset_types')
      .select('*');

    if (error) {
      console.error('Error fetching asset types:', error);
      throw new Error('Failed to fetch asset types');
    }

    return data.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description,
      attributes: type.attributes,
      normalizedName: type.normalized_name
    }));
  },

  async getAssetInstances(plantId?: string, typeId?: string): Promise<AssetInstance[]> {
    let query = supabase
      .from('assets')
      .select(`
        id,
        name,
        type_id,
        plant_id,
        model,
        manufacturer,
        installation_date,
        location,
        status,
        rated_power,
        efficiency,
        notes,
        dynamic_attributes,
        parent_id,
        component_type
      `);

    if (plantId) {
      query = query.eq('plant_id', plantId);
    }

    if (typeId) {
      query = query.eq('type_id', typeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching asset instances:', error);
      throw new Error('Failed to fetch asset instances');
    }

    return data.map(asset => ({
      id: asset.id,
      name: asset.name,
      typeId: asset.type_id,
      plantId: asset.plant_id,
      model: asset.model,
      manufacturer: asset.manufacturer,
      installationDate: asset.installation_date,
      location: asset.location,
      status: asset.status,
      ratedPower: asset.rated_power,
      efficiency: asset.efficiency,
      notes: asset.notes,
      dynamicAttributes: asset.dynamic_attributes,
      parentId: asset.parent_id,
      componentType: asset.component_type
    }));
  },

  async createAssetInstance(data: {
    typeId: string;
    name: string;
    plantId: string;
    model?: string;
    manufacturer?: string;
    location?: string;
    status?: string;
    ratedPower?: number;
    efficiency?: number;
    notes?: string;
    dynamicAttributes?: Record<string, any>;
    parentId?: string;
    componentType?: string;
  }): Promise<AssetInstance> {
    const { data: asset, error } = await supabase
      .from('assets')
      .insert([{
        type_id: data.typeId,
        name: data.name,
        plant_id: data.plantId,
        model: data.model || 'Default Model',
        manufacturer: data.manufacturer || 'Default Manufacturer',
        installation_date: new Date().toISOString().split('T')[0],
        location: data.location || 'Field',
        status: data.status || 'operational',
        rated_power: data.ratedPower,
        efficiency: data.efficiency,
        notes: data.notes,
        dynamic_attributes: data.dynamicAttributes || {},
        parent_id: data.parentId,
        component_type: data.componentType
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating asset instance:', error);
      throw new Error('Failed to create asset instance');
    }

    return {
      id: asset.id,
      name: asset.name,
      typeId: asset.type_id,
      plantId: asset.plant_id,
      model: asset.model,
      manufacturer: asset.manufacturer,
      installationDate: asset.installation_date,
      location: asset.location,
      status: asset.status,
      ratedPower: asset.rated_power,
      efficiency: asset.efficiency,
      notes: asset.notes,
      dynamicAttributes: asset.dynamic_attributes,
      parentId: asset.parent_id,
      componentType: asset.component_type
    };
  },

  async deleteAssetInstance(id: string): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting asset instance:', error);
      throw new Error('Failed to delete asset instance');
    }
  }
}; 