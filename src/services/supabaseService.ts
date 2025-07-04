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

  // Authentication Helper - Get user email by player name
  static async getUserEmailByPlayerName(playerName: string): Promise<string | null> {
    try {
      // First try the RPC function if it exists
      const { data, error } = await supabase.rpc('get_user_email_by_player_name', {
        player_name_param: playerName
      });

      if (error) {
        console.warn("RPC function not available, using fallback method:", error);
        // Fallback: Direct query approach (less secure but works without RPC)
        return await this.getUserEmailByPlayerNameFallback(playerName);
      }

      return data;
    } catch (error) {
      console.warn("RPC function failed, using fallback method:", error);
      return await this.getUserEmailByPlayerNameFallback(playerName);
    }
  }

  // Fallback method when RPC is not available
  private static async getUserEmailByPlayerNameFallback(playerName: string): Promise<string | null> {
    try {
      // This approach only works if RLS allows it, but is our fallback
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("user_id")
        .eq("username", playerName)
        .maybeSingle();

      if (playerError || !player) {
        console.log("Player not found:", playerName);
        return null;
      }

      // We can't directly query auth.users from the client, so we'll return a special indicator
      // The auth hook will need to handle this differently
      return `__LOOKUP_USER_ID__${player.user_id}`;
    } catch (error) {
      console.error("Error in fallback player lookup:", error);
      return null;
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
    console.log("🔍 Searching for player with user_id:", userId);

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("❌ Error in Supabase query:", {
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

    // For now, return empty array until implementing correct logic
    // TODO: Implement join with items table when types are updated
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
    userId: string,
    equipmentBonuses?: {
      success_boost: number;
      escape_boost: number;
      health_protection: number;
      damage: number;
    }
  ): Promise<{
    success: boolean;
    reward: number;
    energy_spent: number;
    health_spent: number;
    reputation_gained: number;
    wanted_increase: number;
    newStats: {
      energy: number;
      health: number;
      reputation: number;
      wantedLevel: number;
      money: number;
    };
  }> {
    // SECURITY: Verify user owns this player
    await this.verifyPlayerOwnership(playerId, userId);

    // Get current player stats
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    if (playerError) throw playerError;
    if (!player) throw new Error("Player not found");

    // Mock robbery data with power requirements (matching useRobberies.ts)
    const mockRobberies = [
      {
        id: "1", name: "Convenience Store", power_required: 10, base_reward: 25, max_reward: 75,
        energy_cost: 5, health_cost: 10, risk_level: 1
      },
      {
        id: "2", name: "Gas Station", power_required: 25, base_reward: 40, max_reward: 100,
        energy_cost: 8, health_cost: 12, risk_level: 1
      },
      {
        id: "3", name: "Jewelry Store", power_required: 50, base_reward: 75, max_reward: 200,
        energy_cost: 10, health_cost: 15, risk_level: 3
      },
      {
        id: "4", name: "ATM Heist", power_required: 80, base_reward: 120, max_reward: 300,
        energy_cost: 12, health_cost: 18, risk_level: 2
      },
      {
        id: "5", name: "Warehouse", power_required: 120, base_reward: 100, max_reward: 300,
        energy_cost: 15, health_cost: 20, risk_level: 2
      },
      {
        id: "6", name: "Armored Truck", power_required: 200, base_reward: 250, max_reward: 600,
        energy_cost: 20, health_cost: 25, risk_level: 4
      },
      {
        id: "7", name: "Bank Branch", power_required: 350, base_reward: 400, max_reward: 1000,
        energy_cost: 25, health_cost: 30, risk_level: 5
      },
      {
        id: "8", name: "Mansion", power_required: 500, base_reward: 300, max_reward: 800,
        energy_cost: 25, health_cost: 30, risk_level: 4
      },
      {
        id: "9", name: "Casino Vault", power_required: 750, base_reward: 600, max_reward: 2000,
        energy_cost: 35, health_cost: 40, risk_level: 6
      },
      {
        id: "10", name: "Federal Reserve", power_required: 1200, base_reward: 1000, max_reward: 5000,
        energy_cost: 50, health_cost: 50, risk_level: 8
      }
    ];

    const robbery = mockRobberies.find(r => r.id === robberyId);
    if (!robbery) throw new Error("Robbery not found");

    // Check requirements - use direct properties from database schema
    const currentEnergy = player.energy || 0;
    const currentMoney = player.money || 0;
    const currentReputation = player.reputation || 0;
    
    console.log("🎯 DEBUG: Player stats check:", {
      player,
      currentEnergy,
      currentMoney,
      currentReputation,
      energyRequired: robbery.energy_cost
    });
    
    if (currentEnergy < robbery.energy_cost) {
      throw new Error("Not enough energy");
    }

    // Get robbery power requirement from mock data
    const robberyData = mockRobberies.find(r => r.id === robberyId);
    if (!robberyData) throw new Error("Robbery data not found");
    
    const crimeRequiredPower = robberyData.power_required;
    
    // Calculate player's total power using correct field names
    const playerReputation = player.reputation || 0;
    const playerLevel = player.level || 1;
    const playerWantedLevel = player.wanted_level || 0;
    const equipmentPower = equipmentBonuses?.success_boost || 0;
    
    // Player Power = Reputation + Level*10 + Equipment - Wanted*5
    const playerTotalPower = playerReputation + (playerLevel * 10) + equipmentPower - (playerWantedLevel * 5);
    
    // Success percentage based on power comparison
    let successChance;
    if (playerTotalPower >= crimeRequiredPower) {
      // Player is stronger than crime - high success chance (50-90%)
      const powerRatio = playerTotalPower / crimeRequiredPower;
      successChance = Math.min(90, 50 + (powerRatio - 1) * 40);
    } else {
      // Player is weaker than crime - low success chance (5-45%)
      const powerRatio = playerTotalPower / crimeRequiredPower;
      successChance = Math.max(5, powerRatio * 45);
    }
    
    // Add random luck factor (±10%)
    const luckFactor = (Math.random() - 0.5) * 20; // ±10% random
    const finalSuccessRate = Math.min(95, Math.max(5, successChance + luckFactor));
    
    console.log("🎯 POWER FORMULA:", {
      crimeRequiredPower,
      playerPower: playerTotalPower,
      breakdown: {
        reputation: playerReputation,
        level: playerLevel * 10,
        equipment: equipmentPower,
        wanted: -(playerWantedLevel * 5)
      },
      baseSuccess: successChance.toFixed(1),
      luck: luckFactor.toFixed(1),
      finalSuccess: finalSuccessRate.toFixed(1)
    });

    // Calculate if robbery succeeds
    const success = Math.random() * 100 < finalSuccessRate;

    // Calculate energy costs and rewards
    const energy_spent = robbery.energy_cost;
    
    // Calculate rewards and reputation gained
    let reward = 0;
    let reputation_gained = 0;

    if (success) {
      reward = Math.floor(Math.random() * (robbery.max_reward - robbery.base_reward) + robbery.base_reward);
      reputation_gained = Math.floor(robbery.risk_level * 5); // 5 rep per risk level
    }

    // Calculate new stats (only update fields that exist in database)
    const newStats = {
      energy: Math.max(0, currentEnergy - energy_spent),
      money: currentMoney + reward,
      reputation: currentReputation + reputation_gained
    };

    console.log("🎯 DEBUG: New stats calculated:", newStats);

    // Update only the fields that exist in the database
    const updateData = {
      money: newStats.money,
      energy: newStats.energy,
      reputation: newStats.reputation
    };

    console.log("🎯 DEBUG: Update data:", updateData);

    const { error: updateError } = await supabase
      .from("players")
      .update(updateData)
      .eq("id", playerId);

    if (updateError) throw updateError;

    return {
      success,
      reward,
      energy_spent,
      health_spent: 0, // No health system in current database
      reputation_gained,
      wanted_increase: 0, // No wanted system in current database
      newStats: {
        energy: newStats.energy,
        health: 100, // Fixed value since no health in DB
        reputation: newStats.reputation,
        wantedLevel: 0, // Fixed value since no wanted in DB
        money: newStats.money
      },
    };
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
      reputation: data.reputation || 0,
      level: data.level || 1,
      money: data.money || 1000,
      bankBalance: data.bank_balance || 0,
      lastInterestClaim: data.last_interest_claim,
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
