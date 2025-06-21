export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          name: string;
          avatar_url: string;
          level: number;
          experience: number;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar_url: string;
          level?: number;
          experience?: number;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string;
          level?: number;
          experience?: number;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      player_stats: {
        Row: {
          id: string;
          player_id: string;
          health: number;
          max_health: number;
          energy: number;
          max_energy: number;
          addiction: number;
          reputation: number;
          money: number;
          wanted_level: number;
          is_imprisoned: boolean;
          is_hospitalized: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          health?: number;
          max_health?: number;
          energy?: number;
          max_energy?: number;
          addiction?: number;
          reputation?: number;
          money?: number;
          wanted_level?: number;
          is_imprisoned?: boolean;
          is_hospitalized?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          health?: number;
          max_health?: number;
          energy?: number;
          max_energy?: number;
          addiction?: number;
          reputation?: number;
          money?: number;
          wanted_level?: number;
          is_imprisoned?: boolean;
          is_hospitalized?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          name: string;
          image: string;
          type:
            | "weapon"
            | "armor"
            | "style"
            | "accessory"
            | "consumable"
            | "special";
          description: string;
          bonus: Json;
          rarity: "comum" | "raro" | "lendario";
          price: number;
          stackable: boolean;
          category: string;
          available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image: string;
          type:
            | "weapon"
            | "armor"
            | "style"
            | "accessory"
            | "consumable"
            | "special";
          description: string;
          bonus: Json;
          rarity?: "comum" | "raro" | "lendario";
          price: number;
          stackable?: boolean;
          category: string;
          available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image?: string;
          type?:
            | "weapon"
            | "armor"
            | "style"
            | "accessory"
            | "consumable"
            | "special";
          description?: string;
          bonus?: Json;
          rarity?: "comum" | "raro" | "lendario";
          price?: number;
          stackable?: boolean;
          category?: string;
          available?: boolean;
          created_at?: string;
        };
      };
      inventory: {
        Row: {
          id: string;
          player_id: string;
          item_id: string;
          quantity: number;
          equipped: boolean;
          slot_type: "weapon" | "armor" | "style" | "accessory" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          item_id: string;
          quantity?: number;
          equipped?: boolean;
          slot_type?: "weapon" | "armor" | "style" | "accessory" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          item_id?: string;
          quantity?: number;
          equipped?: boolean;
          slot_type?: "weapon" | "armor" | "style" | "accessory" | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          player_id: string;
          name: string;
          type:
            | "restaurant"
            | "nightclub"
            | "convenience"
            | "weapon_factory"
            | "casino";
          level: number;
          income: number;
          employees: number;
          security: number;
          price: number;
          upgrade_cost: number;
          owned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          name: string;
          type:
            | "restaurant"
            | "nightclub"
            | "convenience"
            | "weapon_factory"
            | "casino";
          level?: number;
          income?: number;
          employees?: number;
          security?: number;
          price: number;
          upgrade_cost?: number;
          owned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          name?: string;
          type?:
            | "restaurant"
            | "nightclub"
            | "convenience"
            | "weapon_factory"
            | "casino";
          level?: number;
          income?: number;
          employees?: number;
          security?: number;
          price?: number;
          upgrade_cost?: number;
          owned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      treatment_history: {
        Row: {
          id: string;
          player_id: string;
          type: string;
          value: string;
          cost: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          type: string;
          value: string;
          cost: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          type?: string;
          value?: string;
          cost?: number;
          created_at?: string;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          player_id: string;
          session_data: Json;
          active_view: string;
          active_section: string;
          dismissed_alerts: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          session_data: Json;
          active_view?: string;
          active_section?: string;
          dismissed_alerts?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          session_data?: Json;
          active_view?: string;
          active_section?: string;
          dismissed_alerts?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
