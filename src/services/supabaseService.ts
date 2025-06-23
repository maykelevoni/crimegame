import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Player, Item, Business, TreatmentHistory } from "@/types/game";
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

    console.log(
      "📋 Resultado da query:",
      data ? "Player encontrado" : "Nenhum player encontrado"
    );
    return data ? mapSupabasePlayerToGamePlayer(data) : null;
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
      .select()
      .single();

    if (error) throw error;
    return mapSupabasePlayerToGamePlayer(data);
  }

  // Inventory Services
  static async getPlayerInventory(playerId: string): Promise<Item[]> {
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
    quantity: number = 1
  ): Promise<void> {
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
  static async getPlayerBusinesses(): Promise<Business[]> {
    const { data, error } = await supabase.from("businesses").select("*");

    if (error) throw error;
    return (
      data?.map((business) => mapSupabaseBusinessToGameBusiness(business)) || []
    );
  }

  static async buyBusiness(
    business: Omit<Business, "id" | "created_at" | "updated_at">
  ): Promise<Business> {
    const { data, error } = await supabase
      .from("businesses")
      .insert({
        name: business.name,
        type: business.type,
        income: business.income,
        price: business.price,
        description: `Owned by player`,
      })
      .select()
      .single();

    if (error) throw error;
    return mapSupabaseBusinessToGameBusiness(data);
  }

  // Crime History Services
  static async getCrimeHistory(playerId: string): Promise<TreatmentHistory[]> {
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
    success: boolean
  ): Promise<void> {
    const { error } = await supabase.from("crime_history").insert({
      player_id: playerId,
      crime_id: crimeId,
      reward,
      success,
    });

    if (error) throw error;
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
    playerId: string,
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
    await this.updatePlayer(playerId, gameState.player, ""); // TODO: Passar userId correto

    // TODO: Implementar sync de game_sessions quando os tipos forem atualizados
  }
}
