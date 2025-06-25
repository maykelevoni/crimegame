import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";
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

// Estado inicial do player (valores padrão até carregar do banco)
const initialPlayerStats: PlayerStats = {
  health: 100,
  maxHealth: 100,
  energy: 100,
  maxEnergy: 100,
  addiction: 0,
  reputation: 0,
  money: 1000,
  wantedLevel: 0,
  isImprisoned: false,
  isHospitalized: false,
};

const initialPlayer: Player = {
  id: "",
  name: "",
  avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
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

  // Actions de Carregamento de Dados
  loadPlayerData: (playerData: Player) => Promise<void>;
  loadPlayerStats: (stats: PlayerStats) => Promise<void>;
  loadPlayerInventory: (inventory: Item[]) => Promise<void>;
  loadPlayerBusinesses: (businesses: Business[]) => Promise<void>;

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
        console.log("🔍 Debug - updatePlayerStats chamada com:", updates);

        set((state) => {
          const newStats = {
            ...state.player.stats,
            ...updates,
          };

          const newPlayer = {
            ...state.player,
            stats: newStats,
            updatedAt: new Date(),
          };

          console.log("🔍 Debug - Estado anterior:", {
            reputation: state.player.stats.reputation,
            wantedLevel: state.player.stats.wantedLevel,
            energy: state.player.stats.energy,
          });

          console.log("🔍 Debug - Novo estado:", {
            reputation: newStats.reputation,
            wantedLevel: newStats.wantedLevel,
            energy: newStats.energy,
          });

          return {
            ...state,
            player: newPlayer,
          };
        });

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
        const currentUserId = get().userId;

        // Evitar configuração duplicada
        if (currentUserId === userId) {
          return;
        }

        // Limpar configuração anterior
        if (currentUserId) {
          get().clearRealtimeSync();
        }

        set({ userId });

        if (userId) {
          get().loadGameData(userId);
          // setupRealtimeSync será chamado após loadGameData completar
        }
      },

      loadGameData: async (userId) => {
        try {
          set({ syncStatus: "syncing" });

          console.log("🔄 Carregando dados do jogo para usuário:", userId);

          // Load player data by user_id
          const player = await SupabaseService.getPlayerByUserId(userId);
          if (player) {
            console.log("✅ Player encontrado:", player.name);
            console.log("🔍 Debug - Player stats carregados:", {
              health: player.stats.health,
              energy: player.stats.energy,
              reputation: player.stats.reputation,
              wantedLevel: player.stats.wantedLevel,
              money: player.stats.money,
            });

            // Load inventory
            const inventory = await SupabaseService.getPlayerInventory(
              player.id
            );
            console.log("✅ Inventário carregado:", inventory.length, "itens");

            // Load businesses
            const businesses = await SupabaseService.getPlayerBusinesses();
            console.log(
              "✅ Negócios carregados:",
              businesses.length,
              "negócios"
            );

            // Load treatment history
            const treatmentHistory = await SupabaseService.getTreatmentHistory(
              player.id
            );
            console.log(
              "✅ Histórico de tratamento carregado:",
              treatmentHistory.length,
              "registros"
            );

            // Load game session
            const gameSession = await SupabaseService.getGameSession(player.id);
            console.log("✅ Sessão do jogo carregada");

            set((state) => ({
              player: {
                ...state.player,
                id: player.id,
                name: player.name,
                avatarUrl: player.avatarUrl,
                stats: {
                  health: player.stats.health,
                  maxHealth: player.stats.maxHealth,
                  energy: player.stats.energy,
                  maxEnergy: player.stats.maxEnergy,
                  addiction: player.stats.addiction,
                  reputation: player.stats.reputation,
                  money: player.stats.money,
                  wantedLevel: player.stats.wantedLevel,
                  isImprisoned: player.stats.isImprisoned,
                  isHospitalized: player.stats.isHospitalized,
                },
                createdAt: player.createdAt,
                updatedAt: player.updatedAt,
              },
              inventory: inventory,
              businesses: businesses,
              treatmentHistory: treatmentHistory,
              activeView: gameSession?.active_view || "home",
              activeSection: gameSession?.active_section || "home",
              dismissedAlerts: gameSession?.dismissed_alerts || [],
              syncStatus: "idle",
            }));

            // Setup realtime sync após carregar dados com sucesso
            get().setupRealtimeSync(userId);
          } else {
            console.log("📝 Criando novo player...");
            const newPlayer = await SupabaseService.createPlayer(
              "Player",
              userId
            );
            console.log("✅ Novo player criado:", newPlayer.name);

            set((state) => ({
              player: {
                ...state.player,
                id: newPlayer.id,
                name: newPlayer.name,
                avatarUrl: newPlayer.avatarUrl,
                stats: {
                  health: newPlayer.stats.health,
                  maxHealth: newPlayer.stats.maxHealth,
                  energy: newPlayer.stats.energy,
                  maxEnergy: newPlayer.stats.maxEnergy,
                  addiction: newPlayer.stats.addiction,
                  reputation: newPlayer.stats.reputation,
                  money: newPlayer.stats.money,
                  wantedLevel: newPlayer.stats.wantedLevel,
                  isImprisoned: newPlayer.stats.isImprisoned,
                  isHospitalized: newPlayer.stats.isHospitalized,
                },
                createdAt: newPlayer.createdAt,
                updatedAt: newPlayer.updatedAt,
              },
              inventory: [],
              businesses: [],
              treatmentHistory: [],
              activeView: "home",
              activeSection: "home",
              dismissedAlerts: [],
              syncStatus: "idle",
            }));

            // Setup realtime sync após criar player com sucesso
            get().setupRealtimeSync(userId);
          }
        } catch (error) {
          console.error("❌ Erro ao carregar dados do jogo:", error);
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
        // Limpar inscrições anteriores primeiro
        get().clearRealtimeSync();

        // Subscribe to player changes
        SupabaseService.subscribeToPlayer(userId, (payload: unknown) => {
          const typedPayload = payload as {
            eventType: string;
            new: Record<string, unknown>;
          };
          if (typedPayload.eventType === "UPDATE") {
            const newPlayer = typedPayload.new;
            set((state) => ({
              player: {
                ...state.player,
                stats: {
                  ...state.player.stats,
                  health:
                    (newPlayer.health as number) || state.player.stats.health,
                  maxHealth:
                    (newPlayer.max_health as number) ||
                    state.player.stats.maxHealth,
                  energy:
                    (newPlayer.energy as number) || state.player.stats.energy,
                  maxEnergy:
                    (newPlayer.max_energy as number) ||
                    state.player.stats.maxEnergy,
                  addiction:
                    (newPlayer.addiction as number) ||
                    state.player.stats.addiction,
                  reputation:
                    (newPlayer.reputation as number) ||
                    state.player.stats.reputation,
                  money:
                    (newPlayer.money as number) || state.player.stats.money,
                  wantedLevel:
                    (newPlayer.wanted_level as number) ||
                    state.player.stats.wantedLevel,
                  isImprisoned:
                    (newPlayer.is_imprisoned as boolean) ||
                    state.player.stats.isImprisoned,
                  isHospitalized:
                    (newPlayer.is_hospitalized as boolean) ||
                    state.player.stats.isHospitalized,
                },
              },
            }));
          }
        });

        // Subscribe to inventory changes
        SupabaseService.subscribeToInventory(userId, (payload: unknown) => {
          const typedPayload = payload as { eventType: string };
          if (typedPayload.eventType === "INSERT") {
            // Handle new item
          } else if (typedPayload.eventType === "UPDATE") {
            // Handle item update
          } else if (typedPayload.eventType === "DELETE") {
            // Handle item removal
          }
        });
      },

      clearRealtimeSync: () => {
        try {
          supabase.removeAllChannels();
        } catch (error) {
          console.log("⚠️ Erro ao limpar canais:", error);
        }
      },

      // Actions de Carregamento de Dados
      loadPlayerData: async (playerData: Player) => {
        try {
          set({ syncStatus: "syncing" });

          // Load player data
          const player = await SupabaseService.getPlayer(playerData.id);
          if (player) {
            const inventory = await SupabaseService.getPlayerInventory(
              player.id
            );
            const businesses = await SupabaseService.getPlayerBusinesses();
            const treatmentHistory = await SupabaseService.getTreatmentHistory(
              player.id
            );
            const gameSession = await SupabaseService.getGameSession(player.id);

            set((state) => ({
              player: {
                ...state.player,
                id: player.id,
                name: player.name,
                avatarUrl: player.avatarUrl,
                stats: {
                  health: player.stats.health,
                  maxHealth: player.stats.maxHealth,
                  energy: player.stats.energy,
                  maxEnergy: player.stats.maxEnergy,
                  addiction: player.stats.addiction,
                  reputation: player.stats.reputation,
                  money: player.stats.money,
                  wantedLevel: player.stats.wantedLevel,
                  isImprisoned: player.stats.isImprisoned,
                  isHospitalized: player.stats.isHospitalized,
                },
                createdAt: player.createdAt,
                updatedAt: player.updatedAt,
              },
              inventory: inventory,
              businesses: businesses,
              treatmentHistory: treatmentHistory,
              activeView: gameSession?.active_view || "home",
              activeSection: gameSession?.active_section || "home",
              dismissedAlerts: gameSession?.dismissed_alerts || [],
              syncStatus: "idle",
            }));
          }
        } catch (error) {
          console.error("Error loading player data:", error);
          set({ syncStatus: "error" });
        }
      },

      loadPlayerStats: async (stats: PlayerStats) => {
        try {
          set({ syncStatus: "syncing" });

          set((state) => ({
            player: {
              ...state.player,
              stats: {
                ...state.player.stats,
                health: stats.health,
                maxHealth: stats.maxHealth,
                energy: stats.energy,
                maxEnergy: stats.maxEnergy,
                addiction: stats.addiction,
                reputation: stats.reputation,
                money: stats.money,
                wantedLevel: stats.wantedLevel,
                isImprisoned: stats.isImprisoned,
                isHospitalized: stats.isHospitalized,
              },
              updatedAt: new Date(),
            },
          }));

          if (get().userId && get().isOnline) {
            get().syncGameState();
          }
        } catch (error) {
          console.error("Error loading player stats:", error);
          set({ syncStatus: "error" });
        }
      },

      loadPlayerInventory: async (inventory: Item[]) => {
        try {
          set({ syncStatus: "syncing" });

          set((state) => ({
            inventory: inventory.map((item) => ({
              ...item,
              quantity: item.quantity || 1,
            })),
            syncStatus: "idle",
          }));

          if (get().userId && get().isOnline) {
            get().syncGameState();
          }
        } catch (error) {
          console.error("Error loading player inventory:", error);
          set({ syncStatus: "error" });
        }
      },

      loadPlayerBusinesses: async (businesses: Business[]) => {
        try {
          set({ syncStatus: "syncing" });

          set((state) => ({
            businesses: businesses,
            syncStatus: "idle",
          }));

          if (get().userId && get().isOnline) {
            get().syncGameState();
          }
        } catch (error) {
          console.error("Error loading player businesses:", error);
          set({ syncStatus: "error" });
        }
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
        // Não persistir dados do player - sempre carregar do banco
        // player: state.player,
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
