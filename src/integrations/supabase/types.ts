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
      businesses: {
        Row: {
          created_at: string
          description: string
          id: string
          income: number
          name: string
          price: number
          type: string
          player_id: string | null
          business_type_id: string | null
          level: number | null
          last_collected: string | null
          income_per_hour: number | null
          employees: number | null
          security: number | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          income: number
          name: string
          price: number
          type: string
          player_id?: string | null
          business_type_id?: string | null
          level?: number | null
          last_collected?: string | null
          income_per_hour?: number | null
          employees?: number | null
          security?: number | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          income?: number
          name?: string
          price?: number
          type?: string
          player_id?: string | null
          business_type_id?: string | null
          level?: number | null
          last_collected?: string | null
          income_per_hour?: number | null
          employees?: number | null
          security?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_business_type_id_fkey"
            columns: ["business_type_id"]
            isOneToOne: false
            referencedRelation: "business_types"
            referencedColumns: ["id"]
          }
        ]
      }
      business_types: {
        Row: {
          id: string
          name: string
          description: string
          type: string
          base_price: number
          base_income: number
          max_level: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: string
          base_price: number
          base_income: number
          max_level: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: string
          base_price?: number
          base_income?: number
          max_level?: number
          created_at?: string
        }
        Relationships: []
      }
      avatar_options: {
        Row: {
          id: string
          name: string
          image_url: string
          category: string
          description: string | null
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          category: string
          description?: string | null
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          category?: string
          description?: string | null
          available?: boolean
          created_at?: string
        }
        Relationships: []
      }
      daily_rewards: {
        Row: {
          id: string
          name: string
          description: string | null
          reward_type: string
          reward_value: number
          reward_item_id: string | null
          rarity: string
          probability: number
          day_number: number
          is_active: boolean
          min_level: number
          max_level: number | null
          special_conditions: any
          bonus_multiplier: number
          streak_bonus: boolean
          vip_only: boolean
          image_url: string | null
          effects: any
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          reward_type: string
          reward_value?: number
          reward_item_id?: string | null
          rarity?: string
          probability?: number
          day_number?: number
          is_active?: boolean
          min_level?: number
          max_level?: number | null
          special_conditions?: any
          bonus_multiplier?: number
          streak_bonus?: boolean
          vip_only?: boolean
          image_url?: string | null
          effects?: any
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          reward_type?: string
          reward_value?: number
          reward_item_id?: string | null
          rarity?: string
          probability?: number
          day_number?: number
          is_active?: boolean
          min_level?: number
          max_level?: number | null
          special_conditions?: any
          bonus_multiplier?: number
          streak_bonus?: boolean
          vip_only?: boolean
          image_url?: string | null
          effects?: any
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
