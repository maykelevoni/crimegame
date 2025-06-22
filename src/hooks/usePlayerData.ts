import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { SupabaseService } from "@/services/supabaseService";
import type { Player, Item, Business } from "@/types/game";

export const usePlayerData = () => {
  const { user, session, loading: authLoading } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlayerData = async () => {
      // Aguardar até que a autenticação seja carregada
      if (authLoading) {
        return;
      }

      // Se não há usuário ou sessão, limpar dados
      if (!user || !session) {
        setPlayer(null);
        setInventory([]);
        setBusinesses([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Carregando dados do player para usuário:", user.id);

        let playerData = null;
        try {
          playerData = await SupabaseService.getPlayerByUserId(user.id);
          console.log("✅ Player encontrado:", playerData ? "Sim" : "Não");
        } catch (err) {
          console.error("❌ Erro ao buscar player:", err);
          setError(
            "Erro ao buscar player: " +
              (err instanceof Error ? err.message : JSON.stringify(err))
          );
          setLoading(false);
          return;
        }

        if (!playerData) {
          console.log("📝 Criando novo player...");
          try {
            playerData = await SupabaseService.createPlayer(
              user.email || "Player",
              user.id
            );
            console.log("✅ Novo player criado:", playerData);
          } catch (err) {
            console.error("❌ Erro ao criar player:", err);
            setError(
              "Erro ao criar player: " +
                (err instanceof Error ? err.message : JSON.stringify(err))
            );
            setLoading(false);
            return;
          }
        }

        setPlayer(playerData);

        // Load inventory
        try {
          const inventoryData = await SupabaseService.getPlayerInventory(
            playerData.id
          );
          setInventory(inventoryData);
          console.log(
            "✅ Inventário carregado:",
            inventoryData.length,
            "itens"
          );
        } catch (err) {
          console.error("❌ Erro ao carregar inventário:", err);
          setError(
            "Erro ao carregar inventário: " +
              (err instanceof Error ? err.message : JSON.stringify(err))
          );
        }

        // Load businesses
        try {
          const businessesData = await SupabaseService.getPlayerBusinesses();
          setBusinesses(businessesData);
          console.log(
            "✅ Negócios carregados:",
            businessesData.length,
            "negócios"
          );
        } catch (err) {
          console.error("❌ Erro ao carregar negócios:", err);
          setError(
            "Erro ao carregar negócios: " +
              (err instanceof Error ? err.message : JSON.stringify(err))
          );
        }
      } catch (err) {
        console.error("❌ Erro inesperado:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load player data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlayerData();
  }, [user, session, authLoading]);

  const updatePlayer = async (updates: Partial<Player>) => {
    if (!player) return;

    try {
      const updatedPlayer = await SupabaseService.updatePlayer(
        player.id,
        updates
      );
      setPlayer(updatedPlayer);
    } catch (err) {
      console.error("Error updating player:", err);
      setError(err instanceof Error ? err.message : "Failed to update player");
    }
  };

  const addWeaponToInventory = async (
    weaponId: string,
    quantity: number = 1
  ) => {
    if (!player) return;

    try {
      await SupabaseService.addWeaponToInventory(player.id, weaponId, quantity);

      // Reload inventory
      const inventoryData = await SupabaseService.getPlayerInventory(player.id);
      setInventory(inventoryData);
    } catch (err) {
      console.error("Error adding weapon to inventory:", err);
      setError(
        err instanceof Error ? err.message : "Failed to add weapon to inventory"
      );
    }
  };

  const buyBusiness = async (
    business: Omit<Business, "id" | "created_at" | "updated_at">
  ) => {
    if (!player) return;

    try {
      const newBusiness = await SupabaseService.buyBusiness(business);
      setBusinesses((prev) => [...prev, newBusiness]);
    } catch (err) {
      console.error("Error buying business:", err);
      setError(err instanceof Error ? err.message : "Failed to buy business");
    }
  };

  const addCrimeHistory = async (
    crimeId: string,
    reward: number,
    success: boolean
  ) => {
    if (!player) return;

    try {
      await SupabaseService.addCrimeHistory(
        player.id,
        crimeId,
        reward,
        success
      );
    } catch (err) {
      console.error("Error adding crime history:", err);
      setError(
        err instanceof Error ? err.message : "Failed to add crime history"
      );
    }
  };

  const getShopWeapons = async (): Promise<Item[]> => {
    try {
      return await SupabaseService.getShopWeapons();
    } catch (err) {
      console.error("Error getting shop weapons:", err);
      setError(
        err instanceof Error ? err.message : "Failed to get shop weapons"
      );
      return [];
    }
  };

  return {
    player,
    inventory,
    businesses,
    loading,
    error,
    updatePlayer,
    addWeaponToInventory,
    buyBusiness,
    addCrimeHistory,
    getShopWeapons,
  };
};
