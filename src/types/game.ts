// Player Types
export interface PlayerStats {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  addiction: number;
  reputation: number;
  money: number;
  wantedLevel: number;
  isImprisoned: boolean;
  isHospitalized: boolean;
}

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  experience: number;
  stats: PlayerStats;
  createdAt: Date;
  updatedAt: Date;
}

// Item Types
export interface Item {
  id: string;
  name: string;
  image: string;
  type: "weapon" | "armor" | "style" | "accessory" | "consumable" | "special";
  description: string;
  bonus: Record<string, number>;
  rarity: "comum" | "raro" | "lendario";
  price: number;
  stackable?: boolean;
  quantity?: number;
}

export interface EquippedItems {
  weapon: Item | null;
  armor: Item | null;
  style: Item | null;
  accessory: Item | null;
}

// Shop Types
export interface ShopItem extends Item {
  category: string;
  available: boolean;
}

export interface CartItem {
  item: ShopItem;
  quantity: number;
}

// Business Types
export interface Business {
  id: string;
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
  upgradeCost: number;
  owned: boolean;
}

// Hospital Types
export interface Treatment {
  id: string;
  name: string;
  type: "health" | "detox" | "surgery" | "energy";
  cost: number;
  duration: number;
  effect: Record<string, number>;
}

export interface TreatmentHistory {
  id: string;
  type: string;
  value: string;
  date: string;
  cost: number;
}

// Robbery Types
export interface Robbery {
  id: string;
  name: string;
  description: string;
  image: string;
  risk: number;
  rewardMin: number;
  rewardMax: number;
  exp: number;
  energy: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
  difficultyColor: string;
}

// Nightlife Types
export interface Consumable {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  effects: Record<string, number>;
  type: "drink" | "drug" | "food";
}

export interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  effects: Record<string, number>;
  type: "prostitute" | "dancer" | "bartender";
}

// Bank Types
export interface BankService {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  duration: number;
  effect: Record<string, number>;
}

// Casino Types
export interface CasinoGame {
  id: string;
  name: string;
  description: string;
  image: string;
  minBet: number;
  maxBet: number;
  houseEdge: number;
  type: "slot" | "roulette" | "blackjack" | "poker";
}

// Alert Types
export interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  message: string;
  action: string;
  color: string;
  bgColor: string;
  borderColor: string;
  onClick: () => void;
}

// Game State Types
export interface GameState {
  player: Player;
  equipped: EquippedItems;
  inventory: Item[];
  cart: CartItem[];
  businesses: Business[];
  treatmentHistory: TreatmentHistory[];
  dismissedAlerts: string[];
  activeView: string;
  activeSection: string;
}

// Action Types
export interface GameAction {
  type: string;
  payload: unknown;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Form Types
export interface FormData {
  [key: string]: string | number | boolean;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
