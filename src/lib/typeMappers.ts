import type { Tables } from "@/integrations/supabase/types";
import type {
  Player,
  PlayerStats,
  Item,
  Business,
  TreatmentHistory,
} from "@/types/game";

// Mapeamento de Player (agora unificado com stats)
export const mapSupabasePlayerToGamePlayer = (
  supabasePlayer: Record<string, unknown> // Usando Record em vez de any
): Player => {
  return {
    id: supabasePlayer.id as string,
    name: supabasePlayer.name as string,
    avatarUrl:
      (supabasePlayer.avatar_url as string) ||
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    level: (supabasePlayer.level as number) || 1,
    experience: (supabasePlayer.experience as number) || 0,
    stats: {
      health: (supabasePlayer.health as number) || 100,
      maxHealth: (supabasePlayer.max_health as number) || 100,
      energy: (supabasePlayer.energy as number) || 100,
      maxEnergy: (supabasePlayer.max_energy as number) || 100,
      addiction: (supabasePlayer.addiction as number) || 0,
      reputation: (supabasePlayer.reputation as number) || 0,
      money: (supabasePlayer.money as number) || 1000,
      wantedLevel: (supabasePlayer.wanted_level as number) || 0,
      isImprisoned: (supabasePlayer.is_imprisoned as boolean) || false,
      isHospitalized: (supabasePlayer.is_hospitalized as boolean) || false,
    },
    createdAt: new Date(supabasePlayer.created_at as string),
    updatedAt: new Date(supabasePlayer.updated_at as string),
  };
};

// Mapeamento de PlayerStats (mantido para compatibilidade)
export const mapSupabasePlayerStatsToGamePlayerStats = (
  supabaseStats: Record<string, unknown> // Usando Record em vez de any
): PlayerStats => {
  return {
    health: supabaseStats.health as number,
    maxHealth: supabaseStats.max_health as number,
    energy: supabaseStats.energy as number,
    maxEnergy: supabaseStats.max_energy as number,
    addiction: supabaseStats.addiction as number,
    reputation: supabaseStats.reputation as number,
    money: supabaseStats.money as number,
    wantedLevel: supabaseStats.wanted_level as number,
    isImprisoned: supabaseStats.is_imprisoned as boolean,
    isHospitalized: supabaseStats.is_hospitalized as boolean,
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
  gamePlayer: Player,
  userId: string
): Record<string, unknown> => {
  // Usando Record em vez de any
  return {
    name: gamePlayer.name,
    avatar_url: gamePlayer.avatarUrl,
    level: gamePlayer.level,
    experience: gamePlayer.experience,
    health: gamePlayer.stats.health,
    max_health: gamePlayer.stats.maxHealth,
    energy: gamePlayer.stats.energy,
    max_energy: gamePlayer.stats.maxEnergy,
    addiction: gamePlayer.stats.addiction,
    reputation: gamePlayer.stats.reputation,
    money: gamePlayer.stats.money,
    wanted_level: gamePlayer.stats.wantedLevel,
    is_imprisoned: gamePlayer.stats.isImprisoned,
    is_hospitalized: gamePlayer.stats.isHospitalized,
    user_id: userId,
  };
};

// Helper para criar um novo player no Supabase (agora com todos os stats)
export const createNewPlayerData = (
  name: string,
  userId: string
): Record<string, unknown> => {
  // Usando Record em vez de any
  return {
    name,
    avatar_url:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    level: 1,
    experience: 0,
    health: 100,
    max_health: 100,
    energy: 100,
    max_energy: 100,
    addiction: 0,
    reputation: 0,
    money: 1000,
    wanted_level: 0,
    is_imprisoned: false,
    is_hospitalized: false,
    user_id: userId,
  };
};
