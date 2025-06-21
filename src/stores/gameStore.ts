import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Player,
  PlayerStats,
  Item,
  EquippedItems,
  CartItem,
  Business,
  TreatmentHistory,
  GameState,
} from "@/types/game";

// Estado inicial do player
const initialPlayerStats: PlayerStats = {
  health: 100,
  maxHealth: 100,
  energy: 65,
  maxEnergy: 100,
  addiction: 40,
  reputation: 25,
  money: 2500,
  wantedLevel: 15,
  isImprisoned: false,
  isHospitalized: false,
};

const initialPlayer: Player = {
  id: "1",
  name: "Paidrew",
  avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  level: 15,
  experience: 1250,
  stats: initialPlayerStats,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Estado inicial dos itens equipados
const initialEquipped: EquippedItems = {
  weapon: null,
  armor: null,
  style: null,
  accessory: null,
};

// Interface do store
interface GameStore extends GameState {
  // Actions do Player
  updatePlayerStats: (updates: Partial<PlayerStats>) => void;
  updatePlayerMoney: (amount: number) => void;
  updatePlayerExperience: (exp: number) => void;
  setPlayerImprisoned: (imprisoned: boolean) => void;
  setPlayerHospitalized: (hospitalized: boolean) => void;

  // Actions de Inventário
  addItemToInventory: (item: Item) => void;
  removeItemFromInventory: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;

  // Actions de Equipamento
  equipItem: (item: Item) => void;
  unequipItem: (itemType: keyof EquippedItems) => void;

  // Actions do Shop
  addToCart: (item: CartItem["item"], quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Actions de Business
  buyBusiness: (business: Business) => void;
  upgradeBusiness: (businessId: string) => void;

  // Actions de Hospital
  addTreatmentHistory: (treatment: TreatmentHistory) => void;

  // Actions de UI
  setActiveView: (view: string) => void;
  setActiveSection: (section: string) => void;
  dismissAlert: (alertId: string) => void;

  // Actions de Reset
  resetGame: () => void;
}

// Store principal
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      player: initialPlayer,
      equipped: initialEquipped,
      inventory: [],
      cart: [],
      businesses: [],
      treatmentHistory: [],
      dismissedAlerts: [],
      activeView: "home",
      activeSection: "home",

      // Actions do Player
      updatePlayerStats: (updates) => {
        set((state) => ({
          player: {
            ...state.player,
            stats: {
              ...state.player.stats,
              ...updates,
            },
            updatedAt: new Date(),
          },
        }));
      },

      updatePlayerMoney: (amount) => {
        set((state) => ({
          player: {
            ...state.player,
            stats: {
              ...state.player.stats,
              money: Math.max(0, state.player.stats.money + amount),
            },
            updatedAt: new Date(),
          },
        }));
      },

      updatePlayerExperience: (exp) => {
        set((state) => {
          const newExperience = state.player.experience + exp;
          const newLevel = Math.floor(newExperience / 100) + 1;

          return {
            player: {
              ...state.player,
              experience: newExperience,
              level: newLevel,
              updatedAt: new Date(),
            },
          };
        });
      },

      setPlayerImprisoned: (imprisoned) => {
        set((state) => ({
          player: {
            ...state.player,
            stats: {
              ...state.player.stats,
              isImprisoned: imprisoned,
            },
            updatedAt: new Date(),
          },
        }));
      },

      setPlayerHospitalized: (hospitalized) => {
        set((state) => ({
          player: {
            ...state.player,
            stats: {
              ...state.player.stats,
              isHospitalized: hospitalized,
            },
            updatedAt: new Date(),
          },
        }));
      },

      // Actions de Inventário
      addItemToInventory: (item) => {
        set((state) => {
          const existingItem = state.inventory.find((i) => i.id === item.id);

          if (existingItem && item.stackable) {
            return {
              inventory: state.inventory.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) }
                  : i
              ),
            };
          }

          return {
            inventory: [
              ...state.inventory,
              { ...item, quantity: item.quantity || 1 },
            ],
          };
        });
      },

      removeItemFromInventory: (itemId) => {
        set((state) => ({
          inventory: state.inventory.filter((item) => item.id !== itemId),
        }));
      },

      updateItemQuantity: (itemId, quantity) => {
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      // Actions de Equipamento
      equipItem: (item) => {
        set((state) => ({
          equipped: {
            ...state.equipped,
            [item.type]: item,
          },
        }));
      },

      unequipItem: (itemType) => {
        set((state) => ({
          equipped: {
            ...state.equipped,
            [itemType]: null,
          },
        }));
      },

      // Actions do Shop
      addToCart: (item, quantity = 1) => {
        set((state) => {
          const existingCartItem = state.cart.find(
            (ci) => ci.item.id === item.id
          );

          if (existingCartItem) {
            return {
              cart: state.cart.map((ci) =>
                ci.item.id === item.id
                  ? { ...ci, quantity: ci.quantity + quantity }
                  : ci
              ),
            };
          }

          return {
            cart: [...state.cart, { item, quantity }],
          };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          cart: state.cart.filter((ci) => ci.item.id !== itemId),
        }));
      },

      updateCartQuantity: (itemId, quantity) => {
        set((state) => ({
          cart: state.cart.map((ci) =>
            ci.item.id === itemId ? { ...ci, quantity } : ci
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // Actions de Business
      buyBusiness: (business) => {
        set((state) => {
          const cost = business.price;
          if (state.player.stats.money >= cost) {
            return {
              player: {
                ...state.player,
                stats: {
                  ...state.player.stats,
                  money: state.player.stats.money - cost,
                },
                updatedAt: new Date(),
              },
              businesses: [...state.businesses, { ...business, owned: true }],
            };
          }
          return state;
        });
      },

      upgradeBusiness: (businessId) => {
        set((state) => ({
          businesses: state.businesses.map((business) =>
            business.id === businessId
              ? { ...business, level: business.level + 1 }
              : business
          ),
        }));
      },

      // Actions de Hospital
      addTreatmentHistory: (treatment) => {
        set((state) => ({
          treatmentHistory: [treatment, ...state.treatmentHistory.slice(0, 9)], // Keep last 10
        }));
      },

      // Actions de UI
      setActiveView: (view) => {
        set({ activeView: view });
      },

      setActiveSection: (section) => {
        set({ activeSection: section });
      },

      dismissAlert: (alertId) => {
        set((state) => ({
          dismissedAlerts: [...state.dismissedAlerts, alertId],
        }));
      },

      // Actions de Reset
      resetGame: () => {
        set({
          player: initialPlayer,
          equipped: initialEquipped,
          inventory: [],
          cart: [],
          businesses: [],
          treatmentHistory: [],
          dismissedAlerts: [],
          activeView: "home",
          activeSection: "home",
        });
      },
    }),
    {
      name: "urban-hustle-game",
      partialize: (state) => ({
        player: state.player,
        equipped: state.equipped,
        inventory: state.inventory,
        businesses: state.businesses,
        treatmentHistory: state.treatmentHistory,
        dismissedAlerts: state.dismissedAlerts,
      }),
    }
  )
);

// Selectors úteis
export const usePlayerStats = () => useGameStore((state) => state.player.stats);
export const usePlayerMoney = () =>
  useGameStore((state) => state.player.stats.money);
export const usePlayerHealth = () =>
  useGameStore((state) => state.player.stats.health);
export const usePlayerEnergy = () =>
  useGameStore((state) => state.player.stats.energy);
export const useInventory = () => useGameStore((state) => state.inventory);
export const useCart = () => useGameStore((state) => state.cart);
export const useEquipped = () => useGameStore((state) => state.equipped);
export const useActiveView = () => useGameStore((state) => state.activeView);
