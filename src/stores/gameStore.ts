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
import { 
  calculateLevelFromReputation, 
  getLevelInfo, 
  getReputationToNextLevel 
} from "@/utils/levelSystem";
import { toast } from "sonner";

// Estado inicial do player (valores padrão até carregar do banco)
const initialPlayerStats: PlayerStats = {
  health: 100,
  maxHealth: 100,
  energy: 100,
  maxEnergy: 100,
  addiction: 0,
  reputation: 0,
  level: 1,
  money: 1000,
  bankBalance: 0,
  lastInterestClaim: undefined,
  wantedLevel: 0,
  isImprisoned: false,
  isHospitalized: false,
  prisonSentence: 0,
  crimeType: undefined,
  imprisonedAt: undefined,
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
  setPlayerImprisoned: (imprisoned: boolean, crimeType?: string, sentenceMinutes?: number) => void;
  setPlayerHospitalized: (hospitalized: boolean) => void;
  
  // Prison Actions
  doPrisonActivity: (activity: "exercise" | "work" | "sleep") => void;
  reducePrisonSentence: (minutes: number) => void;

  // Bank Actions
  depositMoney: (amount: number) => void;
  withdrawMoney: (amount: number) => void;
  addInterest: () => void;

  // Level Actions
  addReputation: (amount: number) => void;
  checkLevelUp: () => void;

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
        set((state) => {
          let newStats = {
            ...state.player.stats,
            ...updates,
          };

          // Check critical status conditions
          let statusChecks = {
            isHospitalized: false,
            isImprisoned: false,
            hospitalizationType: null as string | null,
          };

          // Health = 0 -> Hospitalization  
          if (newStats.health <= 0) {
            newStats.health = 0;
            statusChecks.isHospitalized = true;
            statusChecks.hospitalizationType = "health";
          }

          // Addiction >= 100 -> Hospitalization (overdose/illness)
          if (newStats.addiction >= 100) {
            newStats.addiction = 100;
            statusChecks.isHospitalized = true;
            statusChecks.hospitalizationType = "overdose";
          }

          // Wanted >= 100 -> Prison (chance based)
          if (newStats.wantedLevel >= 100 && !statusChecks.isHospitalized) {
            const prisonChance = Math.random();
            if (prisonChance <= 0.8) { // 80% chance of going to prison
              statusChecks.isImprisoned = true;
              newStats.wantedLevel = 0; // Reset wanted level after arrest
            }
          }

          // Apply status changes
          newStats.isHospitalized = statusChecks.isHospitalized;
          newStats.isImprisoned = statusChecks.isImprisoned;

          const newPlayer = {
            ...state.player,
            stats: newStats,
            updatedAt: new Date(),
          };


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

      setPlayerImprisoned: (imprisoned, crimeType, sentenceMinutes) => {
        set((state) => ({
          player: {
            ...state.player,
            stats: {
              ...state.player.stats,
              isImprisoned: imprisoned,
              prisonSentence: imprisoned ? (sentenceMinutes || 10) : 0,
              crimeType: imprisoned ? crimeType : undefined,
              imprisonedAt: imprisoned ? new Date().toISOString() : undefined,
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

      // Prison Actions
      doPrisonActivity: (activity) => {
        set((state) => {
          if (!state.player.stats.isImprisoned) return state;

          let updates: Partial<PlayerStats> = {};
          let timeReduction = 0;

          switch (activity) {
            case "exercise":
              updates.health = Math.min(state.player.stats.maxHealth, state.player.stats.health + 5);
              toast.success("💪 You exercise and feel healthier! (+5 Health)");
              break;
            case "work":
              updates.money = state.player.stats.money + Math.floor(Math.random() * 100) + 50;
              toast.success("💼 You work in the prison kitchen! (+$50-150)");
              break;
            case "sleep":
              updates.energy = Math.min(state.player.stats.maxEnergy, state.player.stats.energy + 10);
              toast.success("😴 You rest and feel refreshed! (+10 Energy)");
              break;
          }

          // No additional sentence reduction - time passes naturally while doing activity

          return {
            player: {
              ...state.player,
              stats: {
                ...state.player.stats,
                ...updates,
              },
              updatedAt: new Date(),
            },
          };
        });

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      reducePrisonSentence: (minutes) => {
        set((state) => {
          if (!state.player.stats.isImprisoned) return state;

          const currentSentence = state.player.stats.prisonSentence || 0;
          const newSentence = Math.max(0, currentSentence - minutes);
          const isReleased = newSentence <= 0 || currentSentence <= 0;

          let updates: Partial<PlayerStats> = {
            prisonSentence: 0, // Always set to 0 when releasing
          };

          if (isReleased) {
            updates.isImprisoned = false;
            updates.crimeType = undefined;
            updates.imprisonedAt = undefined;
            toast.success("🎉 You are now free!");
          } else {
            updates.prisonSentence = newSentence;
          }

          return {
            player: {
              ...state.player,
              stats: {
                ...state.player.stats,
                ...updates,
              },
              updatedAt: new Date(),
            },
          };
        });

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      // Bank Actions
      depositMoney: (amount) => {
        set((state) => {
          const cashMoney = state.player.stats.money;
          const actualDeposit = Math.min(amount, cashMoney);
          
          if (actualDeposit <= 0) return state;
          
          const currentBankBalance = state.player.stats.bankBalance || 0;
          const isFirstDeposit = currentBankBalance === 0;
          
          return {
            player: {
              ...state.player,
              stats: {
                ...state.player.stats,
                money: cashMoney - actualDeposit,
                bankBalance: currentBankBalance + actualDeposit,
                // Set deposit timestamp on first deposit to start 24h timer
                lastInterestClaim: isFirstDeposit ? new Date().toISOString() : state.player.stats.lastInterestClaim,
              },
              updatedAt: new Date(),
            },
          };
        });

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      withdrawMoney: (amount) => {
        set((state) => {
          const bankBalance = state.player.stats.bankBalance || 0;
          const actualWithdraw = Math.min(amount, bankBalance);
          
          if (actualWithdraw <= 0) return state;
          
          return {
            player: {
              ...state.player,
              stats: {
                ...state.player.stats,
                money: state.player.stats.money + actualWithdraw,
                bankBalance: bankBalance - actualWithdraw,
              },
              updatedAt: new Date(),
            },
          };
        });

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      addInterest: () => {
        set((state) => {
          const bankBalance = state.player.stats.bankBalance || 0;
          const interestRate = 0.05; // 5% daily interest
          const interest = Math.floor(bankBalance * interestRate);
          
          if (interest <= 0) return state;
          
          // Check if 24 hours have passed since last claim or deposit
          const lastClaim = state.player.stats.lastInterestClaim;
          const now = new Date();
          
          if (lastClaim) {
            const lastClaimTime = new Date(lastClaim);
            const timeDiff = now.getTime() - lastClaimTime.getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
              // Not enough time has passed (less than 24 hours)
              return state;
            }
          }
          
          return {
            player: {
              ...state.player,
              stats: {
                ...state.player.stats,
                bankBalance: bankBalance + interest,
                lastInterestClaim: now.toISOString(),
              },
              updatedAt: new Date(),
            },
          };
        });

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      // Level Actions
      addReputation: (amount) => {
        set((state) => {
          const currentRep = state.player.stats.reputation;
          const newTotalRep = currentRep + amount;
          const newLevel = calculateLevelFromReputation(newTotalRep);
          const oldLevel = state.player.stats.level;

          let updatedStats = {
            ...state.player.stats,
            reputation: newTotalRep,
            level: newLevel,
          };

          // Check for level up and apply rewards
          if (newLevel > oldLevel) {
            for (let level = oldLevel + 1; level <= newLevel; level++) {
              const levelInfo = getLevelInfo(level);
              if (levelInfo) {
                // Show level up notification
                const rewardText = levelInfo.rewards.map(r => r.description).join(", ");
                toast.success(
                  `🎉 Level Up! Level ${level}: ${levelInfo.title}${rewardText ? `\n💰 ${rewardText}` : ''}`,
                  { duration: 4000 }
                );

                // Apply level rewards
                levelInfo.rewards.forEach(reward => {
                  switch (reward.type) {
                    case "money":
                      updatedStats.money += reward.amount || 0;
                      break;
                    case "health":
                      updatedStats.maxHealth += reward.amount || 0;
                      updatedStats.health = Math.min(updatedStats.health + (reward.amount || 0), updatedStats.maxHealth);
                      break;
                    case "energy":
                      updatedStats.maxEnergy += reward.amount || 0;
                      updatedStats.energy = Math.min(updatedStats.energy + (reward.amount || 0), updatedStats.maxEnergy);
                      break;
                  }
                });
              }
            }
          }

          return {
            player: {
              ...state.player,
              stats: updatedStats,
              updatedAt: new Date(),
            },
          };
        });

        if (get().userId && get().isOnline) {
          get().syncGameState();
        }
      },

      checkLevelUp: () => {
        const state = get();
        const currentRep = state.player.stats.reputation;
        const currentLevel = state.player.stats.level;
        const calculatedLevel = calculateLevelFromReputation(currentRep);
        
        if (calculatedLevel > currentLevel) {
          // Trigger level up logic
          set((prevState) => ({
            player: {
              ...prevState.player,
              stats: {
                ...prevState.player.stats,
                level: calculatedLevel,
              },
              updatedAt: new Date(),
            },
          }));
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


          // Load player data by user_id
          const player = await SupabaseService.getPlayerByUserId(userId);
          if (player) {

            // Load inventory
            const inventory = await SupabaseService.getPlayerInventory(
              player.id,
              userId
            );

            // Load businesses
            const businesses = await SupabaseService.getPlayerBusinesses(
              player.id,
              userId
            );

            // Load treatment history
            const treatmentHistory = await SupabaseService.getTreatmentHistory(
              player.id,
              userId
            );

            // Load game session
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
                  level: calculateLevelFromReputation(player.stats.reputation || 0),
                  money: player.stats.money,
                  bankBalance: player.stats.bankBalance || 0,
                  lastInterestClaim: player.stats.lastInterestClaim,
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

            // Setup realtime sync after successfully loading data
            get().setupRealtimeSync(userId);
          } else {
            try {
              const newPlayer = await SupabaseService.createPlayer(
                "Player",
                userId
              );

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
            } catch (playerError: any) {
              // If player already exists (duplicate key), try to load it
              if (playerError.code === '23505') {
                // Wait a bit and try to load the player again
                setTimeout(async () => {
                  try {
                    const existingPlayer = await SupabaseService.getPlayerByUserId(userId);
                    if (existingPlayer) {
                      set((state) => ({
                        player: {
                          ...state.player,
                          id: existingPlayer.id,
                          name: existingPlayer.name,
                          avatarUrl: existingPlayer.avatarUrl,
                          stats: existingPlayer.stats,
                        },
                        syncStatus: "idle",
                      }));
                      get().setupRealtimeSync(userId);
                    }
                  } catch (retryError) {
                    set({ syncStatus: "error" });
                  }
                }, 500);
              } else {
                set({ syncStatus: "error" });
              }
            }
          }
        } catch (error) {
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
          set({ syncStatus: "error" });
        }
      },

      setupRealtimeSync: (userId) => {
        // Clear previous subscriptions first
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
                  level: calculateLevelFromReputation(player.stats.reputation || 0),
                  money: player.stats.money,
                  bankBalance: player.stats.bankBalance || 0,
                  lastInterestClaim: player.stats.lastInterestClaim,
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
        // Don't persist player data - always load from database
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
