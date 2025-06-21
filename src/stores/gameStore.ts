import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { SupabaseService } from "@/services/supabaseService";
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
  // Auth state
  userId: string | null;
  isOnline: boolean;
  syncStatus: "idle" | "syncing" | "error";

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

  // Actions de Supabase
  setUserId: (userId: string | null) => void;
  loadGameData: (userId: string) => Promise<void>;
  syncGameState: () => Promise<void>;
  setupRealtimeSync: (userId: string) => void;
  clearRealtimeSync: () => void;

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

      // Auth state
      userId: null,
      isOnline: navigator.onLine,
      syncStatus: "idle",

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

        // Sync to Supabase if online
        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
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

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
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

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
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

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
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

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
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

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      removeItemFromInventory: (itemId) => {
        set((state) => ({
          inventory: state.inventory.filter((item) => item.id !== itemId),
        }));

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      updateItemQuantity: (itemId, quantity) => {
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      // Actions de Equipamento
      equipItem: (item) => {
        set((state) => ({
          equipped: {
            ...state.equipped,
            [item.type]: item,
          },
        }));

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      unequipItem: (itemType) => {
        set((state) => ({
          equipped: {
            ...state.equipped,
            [itemType]: null,
          },
        }));

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
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

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      upgradeBusiness: (businessId) => {
        set((state) => ({
          businesses: state.businesses.map((business) =>
            business.id === businessId
              ? { ...business, level: business.level + 1 }
              : business
          ),
        }));

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      // Actions de Hospital
      addTreatmentHistory: (treatment) => {
        set((state) => ({
          treatmentHistory: [treatment, ...state.treatmentHistory.slice(0, 9)], // Keep last 10
        }));

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      // Actions de UI
      setActiveView: (view) => {
        set({ activeView: view });

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      setActiveSection: (section) => {
        set({ activeSection: section });

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      dismissAlert: (alertId) => {
        set((state) => ({
          dismissedAlerts: [...state.dismissedAlerts, alertId],
        }));

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      // Actions de Supabase
      setUserId: (userId) => {
        set({ userId });
        if (userId) {
          get().loadGameData(userId);
          get().setupRealtimeSync(userId);
        } else {
          get().clearRealtimeSync();
        }
      },

      loadGameData: async (userId) => {
        try {
          set({ syncStatus: "syncing" });

          // Load player data
          const player = await SupabaseService.getPlayer(userId);
          if (player) {
            const stats = await SupabaseService.getPlayerStats(player.id);
            const inventory = await SupabaseService.getPlayerInventory(
              player.id
            );
            const businesses = await SupabaseService.getPlayerBusinesses(
              player.id
            );
            const treatmentHistory = await SupabaseService.getTreatmentHistory(
              player.id
            );
            const gameSession = await SupabaseService.getGameSession(player.id);

            set((state) => ({
              player: {
                ...state.player,
                ...player,
                stats: stats
                  ? {
                      ...state.player.stats,
                      ...stats,
                    }
                  : state.player.stats,
              },
              inventory: inventory.map((inv) => ({
                ...inv.items,
                quantity: inv.quantity,
              })),
              businesses,
              treatmentHistory,
              activeView: gameSession?.active_view || "home",
              activeSection: gameSession?.active_section || "home",
              dismissedAlerts: gameSession?.dismissed_alerts || [],
              syncStatus: "idle",
            }));
          }
        } catch (error) {
          console.error("Error loading game data:", error);
          set({ syncStatus: "error" });
        }
      },

      syncGameState: async () => {
        const state = get();
        if (!state.userId || !state.isOnline) return;

        try {
          set({ syncStatus: "syncing" });

          await SupabaseService.syncGameState(state.userId, {
            player: state.player,
            equipped: state.equipped,
            inventory: state.inventory,
            businesses: state.businesses,
            treatmentHistory: state.treatmentHistory,
            dismissedAlerts: state.dismissedAlerts,
            activeView: state.activeView,
            activeSection: state.activeSection,
          });

          set({ syncStatus: "idle" });
        } catch (error) {
          console.error("Error syncing game state:", error);
          set({ syncStatus: "error" });
        }
      },

      setupRealtimeSync: (userId) => {
        // Subscribe to player stats changes
        SupabaseService.subscribeToPlayerStats(userId, (payload) => {
          if (payload.eventType === "UPDATE") {
            const newStats = payload.new;
            set((state) => ({
              player: {
                ...state.player,
                stats: {
                  ...state.player.stats,
                  ...newStats,
                },
              },
            }));
          }
        });

        // Subscribe to inventory changes
        SupabaseService.subscribeToInventory(userId, (payload) => {
          if (payload.eventType === "INSERT") {
            // Handle new item
          } else if (payload.eventType === "UPDATE") {
            // Handle item update
          } else if (payload.eventType === "DELETE") {
            // Handle item removal
          }
        });
      },

      clearRealtimeSync: () => {
        supabase.removeAllChannels();
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
        activeView: state.activeView,
        activeSection: state.activeSection,
        userId: state.userId,
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
export const useSyncStatus = () => useGameStore((state) => state.syncStatus);
export const useIsOnline = () => useGameStore((state) => state.isOnline);
