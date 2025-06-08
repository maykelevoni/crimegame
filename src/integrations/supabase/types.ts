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
      business_history: {
        Row: {
          business_id: string
          created_at: string
          id: string
          income: number
          player_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          income: number
          player_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          income?: number
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_history_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_history_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string
          description: string
          id: string
          income: number
          name: string
          price: number
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          income: number
          name: string
          price: number
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          income?: number
          name?: string
          price?: number
          type?: string
        }
        Relationships: []
      }
      crime_history: {
        Row: {
          created_at: string
          crime_id: string
          id: string
          player_id: string
          reward: number
          success: boolean
        }
        Insert: {
          created_at?: string
          crime_id: string
          id?: string
          player_id: string
          reward: number
          success: boolean
        }
        Update: {
          created_at?: string
          crime_id?: string
          id?: string
          player_id?: string
          reward?: number
          success?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "crime_history_crime_id_fkey"
            columns: ["crime_id"]
            isOneToOne: false
            referencedRelation: "crimes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crime_history_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      crimes: {
        Row: {
          created_at: string
          description: string
          energy_cost: number
          id: string
          min_level: number
          name: string
          reward: number
          risk: number
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          energy_cost: number
          id?: string
          min_level: number
          name: string
          reward: number
          risk: number
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          energy_cost?: number
          id?: string
          min_level?: number
          name?: string
          reward?: number
          risk?: number
          type?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          id: string
          player_id: string
          quantity: number
          updated_at: string
          weapon_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          player_id: string
          quantity?: number
          updated_at?: string
          weapon_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          player_id?: string
          quantity?: number
          updated_at?: string
          weapon_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_weapon_id_fkey"
            columns: ["weapon_id"]
            isOneToOne: false
            referencedRelation: "weapons"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string
          description: string
          energy_cost: number
          id: string
          name: string
          salary: number
        }
        Insert: {
          created_at?: string
          description: string
          energy_cost: number
          id?: string
          name: string
          salary: number
        }
        Update: {
          created_at?: string
          description?: string
          energy_cost?: number
          id?: string
          name?: string
          salary?: number
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string
          energy: number
          experience: number
          id: string
          level: number
          max_energy: number
          money: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          energy?: number
          experience?: number
          id?: string
          level?: number
          max_energy?: number
          money?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          energy?: number
          experience?: number
          id?: string
          level?: number
          max_energy?: number
          money?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      prostitutes: {
        Row: {
          created_at: string
          description: string
          energy_cost: number
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description: string
          energy_cost: number
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string
          energy_cost?: number
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      relationships: {
        Row: {
          created_at: string
          id: string
          level: number
          npc_name: string
          player_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          npc_name: string
          player_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          npc_name?: string
          player_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationships_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      weapons: {
        Row: {
          created_at: string
          damage: number
          description: string
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          damage: number
          description: string
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          damage?: number
          description?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
