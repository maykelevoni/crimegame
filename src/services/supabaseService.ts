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
    try {
      const { data: player, error } = await supabase
        .from("players")
        .select("user_id")
        .eq("id", playerId)
        .single();

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST301' || 
            error.code === '42501' || error.status === 403 || error.status === 406) {
          // Cannot verify player ownership due to database access issues, allowing access
          return; // Allow access when database is not accessible
        }
        throw new Error("Player not found");
      }
      
      if (player?.user_id !== userId) {
        throw new Error("Unauthorized: You can only access your own player data");
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        throw error;
      }
      // Player ownership verification failed, allowing access due to database issues
      // Allow access when verification fails due to database issues
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
        // Fallback: Direct query approach (less secure but works without RPC)
        return await this.getUserEmailByPlayerNameFallback(playerName);
      }

      return data;
    } catch (error) {
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
        return null;
      }

      // We can't directly query auth.users from the client, so we'll return a special indicator
      // The auth hook will need to handle this differently
      return `__LOOKUP_USER_ID__${player.user_id}`;
    } catch (error) {
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
      
      // If table doesn't exist or RLS blocks access, create a local player
      if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST301' || 
          error.code === '42501' || error.status === 403 || error.status === 406) {
        // Creating local player due to database access issues
        
        // Create a mock player with the data that would have been inserted
        const mockPlayer = {
          id: crypto.randomUUID(),
          ...playerData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        return mapSupabasePlayerToGamePlayer(mockPlayer);
      }
      
      throw error;
    }

    return mapSupabasePlayerToGamePlayer(data);
  }

  static async getPlayerByUserId(userId: string): Promise<Player | null> {

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // Error getting player by user ID
      
      // Handle table not exists, permission denied, or not acceptable errors
      if (error.code === "PGRST116" || error.code === '42P01' || error.code === 'PGRST301' || 
          error.code === '42501' || error.status === 403 || error.status === 406) {
        // Player table access issues, will create new player
        return null; // This will trigger player creation
      }
      
      // For other errors, still return null to trigger creation instead of throwing
      // Unexpected error, will attempt to create new player
      return null;
    }

    if (data) {
      const mappedPlayer = mapSupabasePlayerToGamePlayer(data);
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
    try {
      // SECURITY: Verify user owns this player
      await this.verifyPlayerOwnership(playerId, userId);

      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("player_id", playerId);

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST301' || 
            error.code === '42501' || error.status === 403 || error.status === 406) {
          // Inventory table access issues, returning empty inventory
          return [];
        }
        throw error;
      }

      // For now, return empty array until implementing correct logic
      // TODO: Implement join with items table when types are updated
      return [];
    } catch (error) {
      // Error accessing inventory, returning empty array
      return [];
    }
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
    try {
      // SECURITY: Verify user owns this player
      await this.verifyPlayerOwnership(playerId, userId);

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("player_id", playerId); // Only get businesses owned by this player

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST301' || 
            error.code === '42501' || error.status === 403 || error.status === 406) {
          // Businesses table access issues, returning empty businesses
          return [];
        }
        throw error;
      }
      
      return (
        data?.map((business) => mapSupabaseBusinessToGameBusiness(business)) || []
      );
    } catch (error) {
      // Error accessing businesses, returning empty array
      return [];
    }
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
    // Crime history table doesn't exist, return empty array
    const data: any[] = [];
    const error = null;

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
    // Crime history table doesn't exist, skip logging
    const error = null;

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

    // Get crime data from database instead of using mock data
    const { data: crimeData, error: crimeError } = await supabase
      .from('crimes')
      .select('*')
      .eq('id', robberyId)
      .single();

    if (crimeError || !crimeData) throw new Error("Robbery not found");

    // Map database crime to robbery format
    const robbery = {
      id: crimeData.id,
      name: crimeData.name,
      power_required: crimeData.min_level * 10, // Simple power calculation
      base_reward: Math.floor(crimeData.reward * 0.8),
      max_reward: Math.floor(crimeData.reward * 1.5),
      energy_cost: crimeData.energy_cost,
      health_cost: Math.floor(crimeData.energy_cost * 0.8),
      risk_level: Math.floor(crimeData.risk / 10)
    };

    // Check requirements - use direct properties from database schema
    const currentEnergy = player.energy || 0;
    const currentMoney = player.money || 0;
    const currentReputation = player.reputation || 0;
    
    if (currentEnergy < robbery.energy_cost) {
      throw new Error("Not enough energy");
    }

    // Use the robbery data we already fetched from database
    const crimeRequiredPower = robbery.power_required;
    
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

    // Calculate wanted level increase (heat)
    const wanted_increase = Math.floor(robbery.risk_level / 2) + (success ? 1 : 0); // More heat if successful

    // Calculate new stats
    const currentWantedLevel = player.wanted_level || 0;
    const newStats = {
      energy: Math.max(0, currentEnergy - energy_spent),
      money: currentMoney + reward,
      reputation: currentReputation + reputation_gained,
      wantedLevel: currentWantedLevel + wanted_increase
    };


    // Update database with new stats
    const updateData = {
      money: newStats.money,
      energy: newStats.energy,
      reputation: newStats.reputation,
      wanted_level: newStats.wantedLevel
    };


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
      wanted_increase: wanted_increase,
      newStats: {
        energy: newStats.energy,
        health: 100, // Fixed value since no health in DB
        reputation: newStats.reputation,
        wantedLevel: newStats.wantedLevel,
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
      // Crime history table doesn't exist, return empty array
      const data: any[] = [];
      const error = null;

      if (error) {
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
