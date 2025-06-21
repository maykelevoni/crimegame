import { supabase } from "@/lib/supabase";
import type {
  Player,
  PlayerStats,
  Item,
  Inventory,
  Business,
  TreatmentHistory,
  GameSession,
} from "@/lib/supabase";
import type { EquippedItems } from "@/types/game";

export class SupabaseService {
  // Player Services
  static async createPlayer(
    player: Omit<Player, "id" | "created_at" | "updated_at">
  ): Promise<Player> {
    const { data, error } = await supabase
      .from("players")
      .insert(player)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPlayer(userId: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  static async updatePlayer(
    id: string,
    updates: Partial<Player>
  ): Promise<Player> {
    const { data, error } = await supabase
      .from("players")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Player Stats Services
  static async createPlayerStats(
    stats: Omit<PlayerStats, "id" | "created_at" | "updated_at">
  ): Promise<PlayerStats> {
    const { data, error } = await supabase
      .from("player_stats")
      .insert(stats)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPlayerStats(playerId: string): Promise<PlayerStats | null> {
    const { data, error } = await supabase
      .from("player_stats")
      .select("*")
      .eq("player_id", playerId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  static async updatePlayerStats(
    playerId: string,
    updates: Partial<PlayerStats>
  ): Promise<PlayerStats> {
    const { data, error } = await supabase
      .from("player_stats")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("player_id", playerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Inventory Services
  static async getPlayerInventory(playerId: string): Promise<Inventory[]> {
    const { data, error } = await supabase
      .from("inventory")
      .select(
        `
        *,
        items (*)
      `
      )
      .eq("player_id", playerId);

    if (error) throw error;
    return data || [];
  }

  static async addItemToInventory(
    inventory: Omit<Inventory, "id" | "created_at" | "updated_at">
  ): Promise<Inventory> {
    const { data, error } = await supabase
      .from("inventory")
      .insert(inventory)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateInventoryItem(
    id: string,
    updates: Partial<Inventory>
  ): Promise<Inventory> {
    const { data, error } = await supabase
      .from("inventory")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeInventoryItem(id: string): Promise<void> {
    const { error } = await supabase.from("inventory").delete().eq("id", id);

    if (error) throw error;
  }

  // Business Services
  static async getPlayerBusinesses(playerId: string): Promise<Business[]> {
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("player_id", playerId);

    if (error) throw error;
    return data || [];
  }

  static async buyBusiness(
    business: Omit<Business, "id" | "created_at" | "updated_at">
  ): Promise<Business> {
    const { data, error } = await supabase
      .from("businesses")
      .insert(business)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async upgradeBusiness(
    id: string,
    updates: Partial<Business>
  ): Promise<Business> {
    const { data, error } = await supabase
      .from("businesses")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Treatment History Services
  static async getTreatmentHistory(
    playerId: string
  ): Promise<TreatmentHistory[]> {
    const { data, error } = await supabase
      .from("treatment_history")
      .select("*")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  static async addTreatmentHistory(
    treatment: Omit<TreatmentHistory, "id" | "created_at">
  ): Promise<TreatmentHistory> {
    const { data, error } = await supabase
      .from("treatment_history")
      .insert(treatment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Game Session Services
  static async saveGameSession(
    session: Omit<GameSession, "id" | "created_at" | "updated_at">
  ): Promise<GameSession> {
    const { data, error } = await supabase
      .from("game_sessions")
      .upsert({ ...session, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getGameSession(playerId: string): Promise<GameSession | null> {
    const { data, error } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("player_id", playerId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  // Shop Items Services
  static async getShopItems(): Promise<Item[]> {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("available", true)
      .order("category", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Realtime Subscriptions
  static subscribeToPlayerStats(
    playerId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`player_stats_${playerId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_stats",
          filter: `player_id=eq.${playerId}`,
        },
        callback
      )
      .subscribe();
  }

  static subscribeToInventory(
    playerId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`inventory_${playerId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inventory",
          filter: `player_id=eq.${playerId}`,
        },
        callback
      )
      .subscribe();
  }

  // Utility Functions
  static async syncGameState(
    playerId: string,
    gameState: {
      player: any;
      equipped: EquippedItems;
      inventory: any[];
      businesses: any[];
      treatmentHistory: any[];
      dismissedAlerts: string[];
      activeView: string;
      activeSection: string;
    }
  ) {
    try {
      // Update player stats
      await this.updatePlayerStats(playerId, gameState.player.stats);

      // Save game session
      await this.saveGameSession({
        player_id: playerId,
        session_data: gameState,
        active_view: gameState.activeView,
        active_section: gameState.activeSection,
        dismissed_alerts: gameState.dismissedAlerts,
      });

      return true;
    } catch (error) {
      console.error("Error syncing game state:", error);
      return false;
    }
  }
}
