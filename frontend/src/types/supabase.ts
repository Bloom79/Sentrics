export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]; 

export type Database = {
  public: {
    Tables: {
      sites: {
        Row: {
          id: string
          name: string
          description: string | null
          location: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed...
    }
  }
} 