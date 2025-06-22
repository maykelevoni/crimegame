import type { Tables } from "@/integrations/supabase/types";
import type {
  Player,
  PlayerStats,
  Item,
  Business,
  TreatmentHistory,
} from "@/types/game";

// Mapeamento de Player
export const mapSupabasePlayerToGamePlayer = (
  supabasePlayer: Tables<"players">
): Player => {
  return {
    id: supabasePlayer.id,
    name: supabasePlayer.name,
    avatarUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", // Default avatar
    level: supabasePlayer.level,
    experience: supabasePlayer.experience,
    stats: {
      health: 100, // Default values - should be loaded from player_stats
      maxHealth: 100,
      energy: supabasePlayer.energy,
      maxEnergy: supabasePlayer.max_energy,
      addiction: 0,
      reputation: 0,
      money: supabasePlayer.money,
      wantedLevel: 0,
      isImprisoned: false,
      isHospitalized: false,
    },
    createdAt: new Date(supabasePlayer.created_at),
    updatedAt: new Date(supabasePlayer.updated_at),
  };
};

// Mapeamento de PlayerStats
export const mapSupabasePlayerStatsToGamePlayerStats = (
  supabaseStats: Tables<"player_stats">
): PlayerStats => {
  return {
    health: supabaseStats.health,
    maxHealth: supabaseStats.max_health,
    energy: supabaseStats.energy,
    maxEnergy: supabaseStats.max_energy,
    addiction: supabaseStats.addiction,
    reputation: supabaseStats.reputation,
    money: supabaseStats.money,
    wantedLevel: supabaseStats.wanted_level,
    isImprisoned: supabaseStats.is_imprisoned,
    isHospitalized: supabaseStats.is_hospitalized,
  };
};

// Mapeamento de Weapon para Item
export const mapSupabaseWeaponToGameItem = (
  supabaseWeapon: Tables<"weapons">
): Item => {
  return {
    id: supabaseWeapon.id,
    name: supabaseWeapon.name,
    image: "/placeholder.svg", // Default image
    type: "weapon",
    description: supabaseWeapon.description,
    bonus: { damage: supabaseWeapon.damage },
    rarity: "comum",
    price: supabaseWeapon.price,
    stackable: false,
  };
};

// Mapeamento de Business
export const mapSupabaseBusinessToGameBusiness = (
  supabaseBusiness: Tables<"businesses">
): Business => {
  return {
    id: supabaseBusiness.id,
    name: supabaseBusiness.name,
    type: supabaseBusiness.type as Business["type"],
    level: 1, // Default level
    income: supabaseBusiness.income,
    employees: 0, // Default value
    security: 0, // Default value
    price: supabaseBusiness.price,
    upgradeCost: supabaseBusiness.price * 0.5, // Default upgrade cost
    owned: false, // Default value
  };
};

// Mapeamento de TreatmentHistory (usando crime_history como base)
export const mapSupabaseCrimeHistoryToGameTreatmentHistory = (
  supabaseCrime: Tables<"crime_history">
): TreatmentHistory => {
  return {
    id: supabaseCrime.id,
    type: "crime",
    value: `Crime reward: $${supabaseCrime.reward}`,
    date: supabaseCrime.created_at,
    cost: 0,
  };
};

// Mapeamentos reversos (Game -> Supabase)
export const mapGamePlayerToSupabasePlayer = (
  gamePlayer: Player
): Omit<Tables<"players">, "id" | "created_at" | "updated_at"> => {
  return {
    name: gamePlayer.name,
    level: gamePlayer.level,
    experience: gamePlayer.experience,
    energy: gamePlayer.stats.energy,
    max_energy: gamePlayer.stats.maxEnergy,
    money: gamePlayer.stats.money,
  };
};

export const mapGamePlayerStatsToSupabasePlayerStats = (
  gameStats: PlayerStats,
  playerId: string
): Omit<Tables<"player_stats">, "id" | "created_at" | "updated_at"> => {
  return {
    player_id: playerId,
    health: gameStats.health,
    max_health: gameStats.maxHealth,
    energy: gameStats.energy,
    max_energy: gameStats.maxEnergy,
    addiction: gameStats.addiction,
    reputation: gameStats.reputation,
    money: gameStats.money,
    wanted_level: gameStats.wantedLevel,
    is_imprisoned: gameStats.isImprisoned,
    is_hospitalized: gameStats.isHospitalized,
  };
};

// Helper para criar um novo player no Supabase
export const createNewPlayerData = (
  name: string
): Omit<Tables<"players">, "id" | "created_at" | "updated_at"> => {
  return {
    name,
    level: 1, // Começar com level 1
    experience: 0,
    energy: 100,
    max_energy: 100,
    money: 0, // Começar com dinheiro 0
  };
};
