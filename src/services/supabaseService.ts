import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type {
  Player,
  Item,
  Business,
  TreatmentHistory,
  PlayerStats,
} from "@/types/game";
import type { EquippedItems } from "@/types/game";
import {
  mapSupabasePlayerToGamePlayer,
  mapSupabaseWeaponToGameItem,
  mapSupabaseBusinessToGameBusiness,
  mapSupabaseCrimeHistoryToGameTreatmentHistory,
  mapGamePlayerToSupabasePlayer,
  createNewPlayerData,
} from "@/lib/typeMappers";

export class SupabaseService {
  // Security helper function
  private static async verifyPlayerOwnership(playerId: string, userId: string): Promise<void> {
    const { data: player, error } = await supabase
      .from("players")
      .select("user_id")
      .eq("id", playerId)
      .single();

    if (error) throw new Error("Player not found");
    
    if (player?.user_id !== userId) {
      throw new Error("Unauthorized: You can only access your own player data");
    }
  }

  // Player Services
  static async createPlayer(name: string, userId: string): Promise<Player> {
    const playerData = createNewPlayerData(name, userId);

    const { data, error } = await supabase
      .from("players")
      .insert(playerData as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select()
      .single();

    if (error) {
      console.error("Error creating player:", error);
      throw error;
    }

    return mapSupabasePlayerToGamePlayer(data);
  }

  static async getPlayerByUserId(userId: string): Promise<Player | null> {
    console.log("🔍 Buscando player para user_id:", userId);

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("❌ Erro na query do Supabase:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      if (error.code !== "PGRST116") {
        throw error;
      }
    }

    console.log("📋 Dados brutos do Supabase:", data);
    console.log(
      "📋 Resultado da query:",
      data ? "Player encontrado" : "Nenhum player encontrado"
    );

    if (data) {
      const mappedPlayer = mapSupabasePlayerToGamePlayer(data);
      console.log("📋 Player mapeado:", mappedPlayer);
      return mappedPlayer;
    }

    return null;
  }

  static async getPlayer(playerId: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? mapSupabasePlayerToGamePlayer(data) : null;
  }

  static async updatePlayer(
    id: string,
    updates: Partial<Player>,
    userId: string
  ): Promise<Player> {
    // SECURITY: First verify that the user owns this player record
    const { data: existingPlayer, error: checkError } = await supabase
      .from("players")
      .select("user_id")
      .eq("id", id)
      .single();

    if (checkError) throw new Error("Player not found");
    
    if (existingPlayer?.user_id !== userId) {
      throw new Error("Unauthorized: You can only update your own player data");
    }

    const supabaseUpdates = mapGamePlayerToSupabasePlayer(
      updates as Player,
      userId
    );

    const { data, error } = await supabase
      .from("players")
      .update({
        ...supabaseUpdates,
        updated_at: new Date().toISOString(),
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .eq("id", id)
      .eq("user_id", userId) // Double-check with user_id as well
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Update failed - unauthorized or player not found");
    
    return mapSupabasePlayerToGamePlayer(data);
  }

  // Inventory Services
  static async getPlayerInventory(playerId: string, userId: string): Promise<Item[]> {
    // SECURITY: Verify user owns this player
    await this.verifyPlayerOwnership(playerId, userId);

    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("player_id", playerId);

    if (error) throw error;

    // Por enquanto, retornar array vazio até implementar a lógica correta
    // TODO: Implementar join com tabela items quando os tipos estiverem atualizados
    return [];
  }

  static async addItemToInventory(
    playerId: string,
    itemId: string,
    quantity: number = 1,
    userId: string
  ): Promise<void> {
    // SECURITY: Verify user owns this player
    await this.verifyPlayerOwnership(playerId, userId);

    // Verificar se o item já existe no inventário
    const { data: existingItem } = await supabase
      .from("inventory")
      .select("*")
      .eq("player_id", playerId)
      .eq("item_id", itemId)
      .single();

    if (existingItem) {
      // Atualizar quantidade se o item já existe
      const { error } = await supabase
        .from("inventory")
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (error) throw error;
    } else {
      // Inserir novo item no inventário
      const { error } = await supabase.from("inventory").insert({
        player_id: playerId,
        item_id: itemId,
        quantity,
      });

      if (error) throw error;
    }
  }

  // Business Services
  static async getPlayerBusinesses(playerId: string, userId: string): Promise<Business[]> {
    // SECURITY: Verify user owns this player
    await this.verifyPlayerOwnership(playerId, userId);

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("player_id", playerId); // Only get businesses owned by this player

    if (error) throw error;
    return (
      data?.map((business) => mapSupabaseBusinessToGameBusiness(business)) || []
    );
  }

  static async buyBusiness(
    business: Omit<Business, "id" | "created_at" | "updated_at">,
    playerId: string,
    userId: string
  ): Promise<Business> {
    // SECURITY: Verify user owns this player
    await this.verifyPlayerOwnership(playerId, userId);

    const { data, error } = await supabase
      .from("businesses")
      .insert({
        name: business.name,
        type: business.type,
        income: business.income,
        price: business.price,
        description: `Owned by player`,
        player_id: playerId, // Associate business with the player
      })
      .select()
      .single();

    if (error) throw error;
    return mapSupabaseBusinessToGameBusiness(data);
  }

  // Crime History Services
  static async getCrimeHistory(playerId: string, userId: string): Promise<TreatmentHistory[]> {
    // SECURITY: Verify user owns this player
    await this.verifyPlayerOwnership(playerId, userId);
    const { data, error } = await supabase
      .from("crime_history")
      .select("*")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    return (
      data?.map((crime) =>
        mapSupabaseCrimeHistoryToGameTreatmentHistory(crime)
      ) || []
    );
  }

  static async addCrimeHistory(
    playerId: string,
    crimeId: string,
    reward: number,
    success: boolean,
    userId: string
  ): Promise<void> {
    // SECURITY: Verify user owns this player
    await this.verifyPlayerOwnership(playerId, userId);
    const { error } = await supabase.from("crime_history").insert({
      player_id: playerId,
      crime_id: crimeId,
      reward,
      success,
    });

    if (error) throw error;
  }

  // Secure Game Logic Services (server-side calculations)
  static async executeRobbery(
    playerId: string,
    robberyId: string,
    userId: string
  ): Promise<{
    success: boolean;
    reward: number;
    newStats: {
      energy: number;
      health: number;
      reputation: number;
      wantedLevel: number;
      money: number;
    };
  }> {
    const { data, error } = await supabase.rpc('execute_robbery', {
      player_id_param: playerId,
      robbery_id_param: robberyId,
      user_id_param: userId,
    });

    if (error) throw error;
    return data;
  }

  // Player Stats Services (agora unificado com player)
  static async getPlayerStats(playerId: string, userId: string): Promise<PlayerStats | null> {
    // SECURITY: Verify user owns this player
    await this.verifyPlayerOwnership(playerId, userId);
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Usar apenas os campos que existem no schema atual
    return {
      health: 100, // Default até adicionar ao schema
      maxHealth: 100, // Default até adicionar ao schema
      energy: data.energy || 100,
      maxEnergy: data.max_energy || 100,
      addiction: 0, // Default até adicionar ao schema
      reputation: 0, // Default até adicionar ao schema
      money: data.money || 1000,
      wantedLevel: 0, // Default até adicionar ao schema
      isImprisoned: false, // Default até adicionar ao schema
      isHospitalized: false, // Default até adicionar ao schema
    };
  }

  // Treatment History Services - usando crime_history como fallback
  static async getTreatmentHistory(
    playerId: string,
    userId: string
  ): Promise<TreatmentHistory[]> {
    // SECURITY: Verify user owns this player
    await this.verifyPlayerOwnership(playerId, userId);
    try {
      const { data, error } = await supabase
        .from("crime_history")
        .select("*")
        .eq("player_id", playerId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.log(
          "⚠️ Tabela crime_history não existe, retornando array vazio"
        );
        return [];
      }

      return (
        data?.map((crime) => ({
          id: crime.id,
          type: "crime",
          value: `Crime reward: $${crime.reward}`,
          date: crime.created_at,
          cost: 0,
        })) || []
      );
    } catch (error) {
      console.log(
        "⚠️ Erro ao buscar crime_history, retornando array vazio:",
        error
      );
      return [];
    }
  }

  // Game Session Services
  static async getGameSession(playerId: string): Promise<{
    active_view: string;
    active_section: string;
    dismissed_alerts: string[];
  } | null> {
    // Por enquanto, retornar valores padrão até a tabela game_sessions ser criada
    console.log(
      "⚠️ Tabela game_sessions não existe, retornando valores padrão"
    );
    return {
      active_view: "home",
      active_section: "home",
      dismissed_alerts: [],
    };
  }

  // Shop Services - Temporariamente desabilitado até atualizar os tipos
  static async getShopItems(): Promise<Item[]> {
    // TODO: Implementar quando os tipos do Supabase forem atualizados
    return [];
  }

  // Realtime Subscriptions
  static subscribeToPlayer(
    playerId: string,
    callback: (payload: unknown) => void
  ) {
    return supabase
      .channel(`player:${playerId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `id=eq.${playerId}`,
        },
        callback
      )
      .subscribe();
  }

  static subscribeToInventory(
    playerId: string,
    callback: (payload: unknown) => void
  ) {
    return supabase
      .channel(`inventory:${playerId}`)
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

  static async syncGameState(
    userId: string,
    gameState: {
      player: Player;
      equipped: EquippedItems;
      inventory: Item[];
      businesses: Business[];
      treatmentHistory: TreatmentHistory[];
      dismissedAlerts: string[];
      activeView: string;
      activeSection: string;
    }
  ) {
    // Sync player data
    await this.updatePlayer(gameState.player.id, gameState.player, userId);

    // TODO: Implementar sync de game_sessions quando os tipos forem atualizados
  }
}
