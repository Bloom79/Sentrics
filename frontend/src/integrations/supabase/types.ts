export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asset_maintenance: {
        Row: {
          asset_id: string
          created_at: string | null
          description: string | null
          id: string
          maintenance_date: string
          maintenance_type: Database["public"]["Enums"]["maintenance_type"]
          next_maintenance_date: string | null
          performed_by: string
          updated_at: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          maintenance_date: string
          maintenance_type: Database["public"]["Enums"]["maintenance_type"]
          next_maintenance_date?: string | null
          performed_by: string
          updated_at?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          maintenance_date?: string
          maintenance_type?: Database["public"]["Enums"]["maintenance_type"]
          next_maintenance_date?: string | null
          performed_by?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_maintenance_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_monitoring: {
        Row: {
          asset_id: string
          created_at: string | null
          id: string
          parameter: string
          timestamp: string
          unit: string
          value: number
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          id?: string
          parameter: string
          timestamp: string
          unit: string
          value: number
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          id?: string
          parameter?: string
          timestamp?: string
          unit?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "asset_monitoring_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_types: {
        Row: {
          attributes: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          normalized_name: string | null
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          normalized_name?: string | null
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          normalized_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          component_type: string | null
          created_at: string | null
          dynamic_attributes: Json | null
          efficiency: number | null
          id: string
          installation_date: string
          location: string
          manufacturer: string
          model: string
          name: string
          notes: string | null
          parent_id: string | null
          plant_id: string
          rated_power: number | null
          status: Database["public"]["Enums"]["asset_status"] | null
          type_id: string
          updated_at: string | null
        }
        Insert: {
          component_type?: string | null
          created_at?: string | null
          dynamic_attributes?: Json | null
          efficiency?: number | null
          id?: string
          installation_date: string
          location: string
          manufacturer: string
          model: string
          name: string
          notes?: string | null
          parent_id?: string | null
          plant_id: string
          rated_power?: number | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          type_id: string
          updated_at?: string | null
        }
        Update: {
          component_type?: string | null
          created_at?: string | null
          dynamic_attributes?: Json | null
          efficiency?: number | null
          id?: string
          installation_date?: string
          location?: string
          manufacturer?: string
          model?: string
          name?: string
          notes?: string | null
          parent_id?: string | null
          plant_id?: string
          rated_power?: number | null
          status?: Database["public"]["Enums"]["asset_status"] | null
          type_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["id"]
          },
        ]
      }
      consumption_data: {
        Row: {
          consumer_id: string
          created_at: string | null
          granularity: string
          id: string
          pod_id: string | null
          timestamp: string
          value: number
        }
        Insert: {
          consumer_id: string
          created_at?: string | null
          granularity: string
          id?: string
          pod_id?: string | null
          timestamp: string
          value: number
        }
        Update: {
          consumer_id?: string
          created_at?: string | null
          granularity?: string
          id?: string
          pod_id?: string | null
          timestamp?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "consumption_data_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consumption_data_pod_id_fkey"
            columns: ["pod_id"]
            isOneToOne: false
            referencedRelation: "pods"
            referencedColumns: ["id"]
          },
        ]
      }
      consumption_files: {
        Row: {
          consumer_id: string
          content_type: string | null
          file_path: string
          file_size: number | null
          file_type: string
          filename: string
          id: string
          upload_date: string | null
        }
        Insert: {
          consumer_id: string
          content_type?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string
          filename: string
          id?: string
          upload_date?: string | null
        }
        Update: {
          consumer_id?: string
          content_type?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          filename?: string
          id?: string
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consumption_files_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          auto_renewal: boolean
          billing_cycle: string
          consumer_id: string
          created_at: string
          end_date: string
          id: string
          minimum_purchase: number
          off_peak_rate: number | null
          payment_terms: number
          peak_rate: number | null
          penalties_for_breach: string | null
          rate: number
          start_date: string
          status: Database["public"]["Enums"]["contract_status"] | null
          termination_notice_days: number
          type: string
          updated_at: string
          variable_rate_adjustment_formula: string | null
          variable_rate_base: number | null
        }
        Insert: {
          auto_renewal?: boolean
          billing_cycle?: string
          consumer_id: string
          created_at?: string
          end_date: string
          id?: string
          minimum_purchase: number
          off_peak_rate?: number | null
          payment_terms?: number
          peak_rate?: number | null
          penalties_for_breach?: string | null
          rate: number
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          termination_notice_days?: number
          type?: string
          updated_at?: string
          variable_rate_adjustment_formula?: string | null
          variable_rate_base?: number | null
        }
        Update: {
          auto_renewal?: boolean
          billing_cycle?: string
          consumer_id?: string
          created_at?: string
          end_date?: string
          id?: string
          minimum_purchase?: number
          off_peak_rate?: number | null
          payment_terms?: number
          peak_rate?: number | null
          penalties_for_breach?: string | null
          rate?: number
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          termination_notice_days?: number
          type?: string
          updated_at?: string
          variable_rate_adjustment_formula?: string | null
          variable_rate_base?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_consumer"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["user_role"] | null
          status: string | null
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          token: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          token?: string
        }
        Relationships: []
      }
      plants: {
        Row: {
          capacity: number
          created_at: string | null
          current_output: number
          efficiency: number
          id: string
          location: string
          name: string
          site_id: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string | null
          current_output?: number
          efficiency?: number
          id?: string
          location: string
          name: string
          site_id: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          current_output?: number
          efficiency?: number
          id?: string
          location?: string
          name?: string
          site_id?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plants_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      pods: {
        Row: {
          activation_date: string | null
          annual_usage: number | null
          billing_cycle: string | null
          billing_status: string | null
          city: string | null
          connection_type: string
          consumer_id: string
          country: string | null
          created_at: string | null
          current_consumption: number | null
          daily_usage: number | null
          deactivation_date: string | null
          energy_source: string | null
          energy_type: string | null
          frequency_deviation: number | null
          id: string
          installed_capacity: number
          last_maintenance: string | null
          last_meter_reading: number | null
          last_meter_reading_date: string | null
          latitude: number | null
          location: string
          longitude: number | null
          maintenance_notes: string | null
          maintenance_status: string | null
          meter_id: string | null
          metering_type: string | null
          monthly_usage: number | null
          name: string
          outstanding_charges: number | null
          peak_demand: number | null
          postal_code: string | null
          power_factor: number | null
          renewable_percentage: number | null
          smart_meter_id: string | null
          state: string | null
          status: string
          street_address: string | null
          tariff_plan: string | null
          updated_at: string | null
          voltage_stability: number | null
        }
        Insert: {
          activation_date?: string | null
          annual_usage?: number | null
          billing_cycle?: string | null
          billing_status?: string | null
          city?: string | null
          connection_type: string
          consumer_id: string
          country?: string | null
          created_at?: string | null
          current_consumption?: number | null
          daily_usage?: number | null
          deactivation_date?: string | null
          energy_source?: string | null
          energy_type?: string | null
          frequency_deviation?: number | null
          id?: string
          installed_capacity: number
          last_maintenance?: string | null
          last_meter_reading?: number | null
          last_meter_reading_date?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          maintenance_notes?: string | null
          maintenance_status?: string | null
          meter_id?: string | null
          metering_type?: string | null
          monthly_usage?: number | null
          name: string
          outstanding_charges?: number | null
          peak_demand?: number | null
          postal_code?: string | null
          power_factor?: number | null
          renewable_percentage?: number | null
          smart_meter_id?: string | null
          state?: string | null
          status?: string
          street_address?: string | null
          tariff_plan?: string | null
          updated_at?: string | null
          voltage_stability?: number | null
        }
        Update: {
          activation_date?: string | null
          annual_usage?: number | null
          billing_cycle?: string | null
          billing_status?: string | null
          city?: string | null
          connection_type?: string
          consumer_id?: string
          country?: string | null
          created_at?: string | null
          current_consumption?: number | null
          daily_usage?: number | null
          deactivation_date?: string | null
          energy_source?: string | null
          energy_type?: string | null
          frequency_deviation?: number | null
          id?: string
          installed_capacity?: number
          last_maintenance?: string | null
          last_meter_reading?: number | null
          last_meter_reading_date?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          maintenance_notes?: string | null
          maintenance_status?: string | null
          meter_id?: string | null
          metering_type?: string | null
          monthly_usage?: number | null
          name?: string
          outstanding_charges?: number | null
          peak_demand?: number | null
          postal_code?: string | null
          power_factor?: number | null
          renewable_percentage?: number | null
          smart_meter_id?: string | null
          state?: string | null
          status?: string
          street_address?: string | null
          tariff_plan?: string | null
          updated_at?: string | null
          voltage_stability?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pods_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          consumption: number | null
          contact_person: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          invitation_sent_at: string | null
          invitation_token: string | null
          invited_by: string | null
          notes: string | null
          phone: string | null
          postal_code: string | null
          role: string | null
          specs: Json | null
          status: string | null
          type: string | null
          updated_at: string
          username: string | null
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          consumption?: number | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          invitation_sent_at?: string | null
          invitation_token?: string | null
          invited_by?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          specs?: Json | null
          status?: string | null
          type?: string | null
          updated_at?: string
          username?: string | null
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          consumption?: number | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          invitation_sent_at?: string | null
          invitation_token?: string | null
          invited_by?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          specs?: Json | null
          status?: string | null
          type?: string | null
          updated_at?: string
          username?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      sites: {
        Row: {
          address: string | null
          available_area: number | null
          capacity: number | null
          city: string | null
          code: string | null
          commissioning_date: string | null
          compliance_certificates: Json | null
          country: string | null
          created_at: string | null
          created_by: string | null
          decommissioning_date: string | null
          description: string | null
          efficiency: number | null
          environmental_impact_rating: string | null
          id: string
          last_maintenance_date: string | null
          last_updated_by: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          maintenance_interval: unknown | null
          maintenance_provider: string | null
          name: string
          notes: string | null
          operational_status: string | null
          operator: string | null
          owner: string | null
          postal_code: string | null
          region: string | null
          reserved_area: number | null
          site_type: string | null
          status: string | null
          street_address: string | null
          tags: Json | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          available_area?: number | null
          capacity?: number | null
          city?: string | null
          code?: string | null
          commissioning_date?: string | null
          compliance_certificates?: Json | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          decommissioning_date?: string | null
          description?: string | null
          efficiency?: number | null
          environmental_impact_rating?: string | null
          id?: string
          last_maintenance_date?: string | null
          last_updated_by?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          maintenance_interval?: unknown | null
          maintenance_provider?: string | null
          name: string
          notes?: string | null
          operational_status?: string | null
          operator?: string | null
          owner?: string | null
          postal_code?: string | null
          region?: string | null
          reserved_area?: number | null
          site_type?: string | null
          status?: string | null
          street_address?: string | null
          tags?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          available_area?: number | null
          capacity?: number | null
          city?: string | null
          code?: string | null
          commissioning_date?: string | null
          compliance_certificates?: Json | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          decommissioning_date?: string | null
          description?: string | null
          efficiency?: number | null
          environmental_impact_rating?: string | null
          id?: string
          last_maintenance_date?: string | null
          last_updated_by?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          maintenance_interval?: unknown | null
          maintenance_provider?: string | null
          name?: string
          notes?: string | null
          operational_status?: string | null
          operator?: string | null
          owner?: string | null
          postal_code?: string | null
          region?: string | null
          reserved_area?: number | null
          site_type?: string | null
          status?: string | null
          street_address?: string | null
          tags?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      storage_units: {
        Row: {
          capacity: number
          charge_level: number
          created_at: string | null
          current_charge: number
          efficiency: number
          health: number | null
          id: string
          name: string
          power_rating: number
          site_id: string
          status: string
          technology: string
          temperature: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number
          charge_level?: number
          created_at?: string | null
          current_charge?: number
          efficiency?: number
          health?: number | null
          id?: string
          name: string
          power_rating?: number
          site_id: string
          status?: string
          technology: string
          temperature?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          charge_level?: number
          created_at?: string | null
          current_charge?: number
          efficiency?: number
          health?: number | null
          id?: string
          name?: string
          power_rating?: number
          site_id?: string
          status?: string
          technology?: string
          temperature?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storage_units_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_plant_cascade: {
        Args: {
          p_plant_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      asset_status: "operational" | "offline" | "maintenance"
      contract_status: "active" | "pending" | "expired"
      maintenance_type: "routine" | "emergency" | "repair" | "inspection"
      sensor_type:
        | "pyranometer"
        | "reference_cell"
        | "ambient_temperature"
        | "panel_temperature"
        | "voltage"
        | "current"
      user_role: "admin" | "user" | "manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
