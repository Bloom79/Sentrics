export interface AssetType {
  id: string;
  name: string;
  description: string;
  attributes: Record<string, any>;
  normalizedName: string;
}

export interface AssetInstance {
  id: string;
  name: string;
  typeId: string;
  plantId?: string;
  model?: string;
  manufacturer?: string;
  installationDate?: string;
  location?: string;
  status?: string;
  ratedPower?: number;
  efficiency?: number;
  notes?: string;
  dynamicAttributes?: Record<string, any>;
  parentId?: string;
  componentType?: string;
} 