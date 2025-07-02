import React, { useState } from "react";
import BaseView from "./BaseView";
import {
  Flame,
  Music,
  Star,
  Heart,
  KeyRound,
  Users,
  AlertTriangle,
  GlassWater,
  Gem,
  BadgeDollarSign,
  Wine,
  Beer,
  X,
  User,
  DollarSign,
  Zap,
  Pill,
  Sparkles,
  Brain,
  Eye,
  ArrowLeft,
} from "lucide-react";
import {
  useNightlifeConsumables,
  useConsumeItem,
  NightlifeConsumable,
  useNightlifeVenues,
  useNightlifeCharacters,
  useVisitVenue,
  NightlifeVenue,
  NightlifeCharacter,
} from "../hooks/useNightlife";
import { useGameStore } from "../stores/gameStore";
import { toast } from "sonner";

const NightlifeView = () => {
  const [activeTab, setActiveTab] = useState("bar");
  const [selectedVenue, setSelectedVenue] = useState<NightlifeVenue | null>(
    null
  );
  const [selectedConsumable, setSelectedConsumable] =
    useState<NightlifeConsumable | null>(null);
  const [notifications, setNotifications] = useState<
    Array<{ id: number; message: string; type: string }>
  >([]);

  const { data: consumables = [], isLoading: consumablesLoading } =
    useNightlifeConsumables();
  const { data: venues = [], isLoading: venuesLoading } = useNightlifeVenues();
  const { data: characters = [], isLoading: charactersLoading } =
    useNightlifeCharacters();

  const consumeItemMutation = useConsumeItem();
  const visitVenueMutation = useVisitVenue();
  const { player } = useGameStore();

  const addNotification = (message: string, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleConsumeItem = async (consumable: NightlifeConsumable) => {
    if (!player?.id) {
      toast.error("Player not found");
      return;
    }

    // Check if energy is full and item gives positive energy
    if (
      consumable.effects.energy &&
      consumable.effects.energy > 0 &&
      player.stats.energy >= player.stats.maxEnergy
    ) {
      toast.error(
        `Energy is already full! You have ${player.stats.energy}/${player.stats.maxEnergy} energy`
      );
      return;
    }

    try {
      await consumeItemMutation.mutateAsync({
        playerId: player.id,
        consumableId: consumable.id,
      });

      setSelectedConsumable(null);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleVisitVenue = async (venue: NightlifeVenue) => {
    if (!player?.id) {
      toast.error("Player not found");
      return;
    }

    try {
      await visitVenueMutation.mutateAsync({
        playerId: player.id,
        venueId: venue.id,
      });
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleHireCompanion = async (character: NightlifeCharacter) => {
    if (!player?.id) {
      toast.error("Player not found");
      return;
    }

    console.log("💋 DEBUG: Hiring companion:", character.name);

    // Check if player has enough money
    if (player.stats.money < character.price) {
      toast.error(`Not enough money! You need $${character.price} but have $${player.stats.money}`);
      return;
    }

    // Check if player has enough energy (companions require some energy)
    const energyCost = character.energy_cost || 10;
    if (player.stats.energy < energyCost) {
      toast.error(`Not enough energy! You need ${energyCost} energy but have ${player.stats.energy}`);
      return;
    }

    try {
      // Use the visit venue mutation with the character's venue
      await visitVenueMutation.mutateAsync({
        playerId: player.id,
        venueId: character.venue_id,
      });

      // Show success message for hiring specific companion
      const fixedEffects = {
        energy: character.name === "Carmen" ? 10 : 
               character.name === "Maria" ? 15 :
               character.name === "Sophia" ? 25 :
               character.name === "Isabella" ? 40 : 15,
        addiction: character.name === "Carmen" ? 3 : 
                  character.name === "Maria" ? 5 :
                  character.name === "Sophia" ? 8 :
                  character.name === "Isabella" ? 12 : 5,
      };

      toast.dismiss(); // Clear previous notifications
      
      const dirtyMessages = [
        `🔥 You fucked ${character.name}! Wild and dirty!`,
        `💦 ${character.name} gave you the ride of your life!`,
        `🍑 You banged ${character.name} hard and rough!`,
        `💋 ${character.name} satisfied all your dirty desires!`,
        `🔞 You had wild sex with ${character.name}!`
      ];
      
      const randomMessage = dirtyMessages[Math.floor(Math.random() * dirtyMessages.length)];
      
      toast.success(
        `${randomMessage} +${fixedEffects.energy} Energy, +${fixedEffects.addiction}% Addiction`,
        { duration: 5000 }
      );
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleEnterVenue = (venue: NightlifeVenue) => {
    console.log("🏢 DEBUG: Setting selected venue:", venue);
    setSelectedVenue(venue);
  };

  const handleBackToVenues = () => {
    setSelectedVenue(null);
  };

  // Filter consumables by type
  const drinks = consumables.filter((item) => item.type === "drink");
  const drugs = consumables.filter((item) => item.type === "drug");

  // Filter venues by type
  const barVenues = venues.filter((venue) => venue.type === "bar");
  const companionVenues = venues.filter((venue) => venue.type === "companion");
  const raveVenues = venues.filter((venue) => venue.type === "rave");

  // Debug companion venues
  console.log("🔍 DEBUG: All venues:", venues);
  console.log("🔍 DEBUG: Companion venues:", companionVenues);
  console.log("🔍 DEBUG: Active tab:", activeTab);
  console.log("🔍 DEBUG: Selected venue:", selectedVenue);

  // If a venue is selected, show its content
  if (selectedVenue) {
    return (
      <BaseView title="Nightlife">
        <div className="space-y-6">
          {/* Header com botão voltar */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBackToVenues}
              className="flex items-center gap-2 text-cyber-blue hover:text-cyber-blue-light transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-semibold">
                Back to{" "}
                {activeTab === "bar"
                  ? "Bars"
                  : activeTab === "rave"
                  ? "Raves"
                  : "Prostitutes"}
              </span>
            </button>
          </div>

          {/* Venue Header */}
          <div className="cyber-border p-6 bg-cyber-dark-medium">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-cyber-dark">
                <img
                  src={selectedVenue.image_url}
                  alt={selectedVenue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-cyber-blue">
                  {selectedVenue.name}
                </h2>
                <p className="text-white/60">{selectedVenue.description}</p>
              </div>
            </div>
          </div>

          {/* Conteúdo específico do venue */}
          {activeTab === "bar" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-cyber-blue">
                🍺 Bebidas Disponíveis
              </h3>
              {consumablesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
                  <p className="mt-2">Carregando bebidas...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {drinks.map((drink) => {
                    const isEnergyFull =
                      drink.effects.energy &&
                      drink.effects.energy > 0 &&
                      player?.stats.energy >= player?.stats.maxEnergy;
                    const overdoseRisk =
                      player?.stats.addiction >= 80
                        ? "ALTO"
                        : player?.stats.addiction >= 60
                        ? "MÉDIO"
                        : player?.stats.addiction >= 40
                        ? "BAIXO"
                        : "NENHUM";

                    return (
                      <div
                        key={drink.id}
                        className={`cyber-border p-4 hover:scale-105 transition-transform cursor-pointer ${
                          isEnergyFull
                            ? "opacity-50 bg-gray-800"
                            : "bg-cyber-dark"
                        } ${
                          player?.stats.addiction >= 80
                            ? "border-red-500"
                            : player?.stats.addiction >= 60
                            ? "border-orange-500"
                            : player?.stats.addiction >= 40
                            ? "border-yellow-500"
                            : ""
                        }`}
                        onClick={() =>
                          !isEnergyFull && handleConsumeItem(drink)
                        }
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={drink.image_url}
                            alt={drink.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-bold text-white">
                              {drink.name}
                            </h4>
                            <p className="text-sm text-white/60">
                              ${drink.price}
                            </p>
                            {isEnergyFull && (
                              <p className="text-xs text-red-400">
                                Energy full
                              </p>
                            )}
                            {overdoseRisk !== "NENHUM" && (
                              <p
                                className={`text-xs ${
                                  player?.stats.addiction >= 80
                                    ? "text-red-400"
                                    : player?.stats.addiction >= 60
                                    ? "text-orange-400"
                                    : "text-yellow-400"
                                }`}
                              >
                                ⚠️ Risco de overdose: {overdoseRisk}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-white/80 mb-3">
                          {drink.description}
                        </p>
                        <div className="flex gap-2 text-xs">
                          {drink.effects.energy && (
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                              {drink.effects.energy >= 0 ? "+" : ""}
                              {drink.effects.energy} Energia
                            </span>
                          )}
                          {drink.effects.addiction && (
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">
                              +{drink.effects.addiction}% Vício
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "rave" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">
                🎵 Drogas Disponíveis
              </h3>
              {consumablesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
                  <p className="mt-2">Carregando drogas...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drugs.map((drug) => {
                    const isEnergyFull =
                      drug.effects.energy &&
                      drug.effects.energy > 0 &&
                      player?.stats.energy >= player?.stats.maxEnergy;
                    const overdoseRisk =
                      player?.stats.addiction >= 80
                        ? "ALTO"
                        : player?.stats.addiction >= 60
                        ? "MÉDIO"
                        : player?.stats.addiction >= 40
                        ? "BAIXO"
                        : "NENHUM";

                    return (
                      <div
                        key={drug.id}
                        className={`cyber-border p-4 hover:scale-105 transition-transform cursor-pointer ${
                          drug.risk_level === "High" ||
                          drug.risk_level === "Very High" ||
                          drug.risk_level === "Extreme"
                            ? "bg-red-500/10 border-red-500"
                            : "bg-purple-500/10 border-purple-500"
                        } ${isEnergyFull ? "opacity-50" : ""} ${
                          player?.stats.addiction >= 80
                            ? "border-red-500"
                            : player?.stats.addiction >= 60
                            ? "border-orange-500"
                            : player?.stats.addiction >= 40
                            ? "border-yellow-500"
                            : ""
                        }`}
                        onClick={() => !isEnergyFull && handleConsumeItem(drug)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={drug.image_url}
                            alt={drug.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-bold text-white">
                              {drug.name}
                            </h4>
                            <p className="text-sm text-white/60">
                              ${drug.price}
                            </p>
                            {drug.risk_level && (
                              <p className="text-xs text-red-400">
                                Risk: {drug.risk_level}
                              </p>
                            )}
                            {isEnergyFull && (
                              <p className="text-xs text-red-400">
                                Energy full
                              </p>
                            )}
                            {overdoseRisk !== "NENHUM" && (
                              <p
                                className={`text-xs ${
                                  player?.stats.addiction >= 80
                                    ? "text-red-400"
                                    : player?.stats.addiction >= 60
                                    ? "text-orange-400"
                                    : "text-yellow-400"
                                }`}
                              >
                                ⚠️ Risco de overdose: {overdoseRisk}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-white/80 mb-3">
                          {drug.description}
                        </p>
                        <div className="flex gap-2 text-xs">
                          {drug.effects.energy && (
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                              {drug.effects.energy >= 0 ? "+" : ""}
                              {drug.effects.energy} Energia
                            </span>
                          )}
                          {drug.effects.addiction && (
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">
                              +{drug.effects.addiction}% Vício
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "companion" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-cyber-pink">
                💋 Available Prostitutes
              </h3>
              {charactersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
                  <p className="mt-2">Loading prostitutes...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {characters
                    .filter((char) => char.venue_id === selectedVenue.id)
                    .map((character) => (
                      <div
                        key={character.id}
                        className="cyber-border p-4 bg-cyber-dark hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => handleHireCompanion(character)}
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={character.image_url}
                            alt={character.name}
                            className="w-20 h-20 rounded-lg object-cover border border-cyber-pink/50"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-lg text-cyber-pink">
                                {character.name}
                              </h4>
                              <span className="text-cyber-gold font-bold">
                                ${character.price}
                              </span>
                            </div>
                            <p className="text-sm text-white/60 mb-2">
                              {character.description}
                            </p>
                            <div className="flex gap-2 text-xs">
                              {(() => {
                                // Fix companion effects - they should give positive energy and addiction
                                const fixedEffects = {
                                  energy: character.name === "Carmen" ? 10 : 
                                         character.name === "Maria" ? 15 :
                                         character.name === "Sophia" ? 25 :
                                         character.name === "Isabella" ? 40 : 
                                         Math.abs(character.effects.energy || 0),
                                  addiction: character.name === "Carmen" ? 3 : 
                                            character.name === "Maria" ? 5 :
                                            character.name === "Sophia" ? 8 :
                                            character.name === "Isabella" ? 12 : 
                                            (character.effects.addiction || 0),
                                  reputation: character.effects.reputation || 0
                                };
                                
                                return (
                                  <>
                                    {fixedEffects.energy > 0 && (
                                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                        +{fixedEffects.energy} Energy
                                      </span>
                                    )}
                                    {fixedEffects.addiction > 0 && (
                                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                        +{fixedEffects.addiction}% Addiction
                                      </span>
                                    )}
                                    {fixedEffects.reputation > 0 && (
                                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                        +{fixedEffects.reputation} Reputation
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </BaseView>
    );
  } else {
    return (
      <BaseView title="Nightlife">
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-cyber-blue/30">
            <button
              onClick={() => setActiveTab("bar")}
              className={`px-4 py-2 font-bold transition-colors ${
                activeTab === "bar"
                  ? "text-cyber-blue border-b-2 border-cyber-blue"
                  : "text-white/60 hover:text-white"
              }`}
            >
              🍺 Bar
            </button>
            <button
              onClick={() => setActiveTab("rave")}
              className={`px-4 py-2 font-bold transition-colors ${
                activeTab === "rave"
                  ? "text-cyber-blue border-b-2 border-cyber-blue"
                  : "text-white/60 hover:text-white"
              }`}
            >
              🎵 Rave
            </button>
            <button
              onClick={() => setActiveTab("companion")}
              className={`px-4 py-2 font-bold transition-colors ${
                activeTab === "companion"
                  ? "text-cyber-blue border-b-2 border-cyber-blue"
                  : "text-white/60 hover:text-white"
              }`}
            >
              💋 Prostitutes
            </button>
          </div>

          {/* Content */}
          {activeTab === "bar" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-cyber-blue">
                🍺 Bares
              </h3>
              {venuesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
                  <p className="mt-2">Carregando bares...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {barVenues.map((venue) => (
                    <div
                      key={venue.id}
                      className="cyber-border p-6 bg-cyber-dark-medium hover:bg-cyber-dark transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-cyber-dark flex-shrink-0">
                          <img
                            src={venue.image_url}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-cyber-blue mb-2">
                            {venue.name}
                          </h4>
                          <p className="text-sm text-white/60 mb-4">
                            {venue.description}
                          </p>
                          <button
                            onClick={() => handleEnterVenue(venue)}
                            className="px-6 py-2 bg-cyber-blue text-white font-bold rounded hover:bg-cyber-blue/80 transition-colors"
                          >
                            Entrar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "rave" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-cyber-blue">
                🎵 Raves
              </h3>
              {venuesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
                  <p className="mt-2">Carregando raves...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {raveVenues.map((venue) => (
                    <div
                      key={venue.id}
                      className="cyber-border p-6 bg-cyber-dark-medium hover:bg-cyber-dark transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-cyber-dark flex-shrink-0">
                          <img
                            src={venue.image_url}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-purple-400 mb-2">
                            {venue.name}
                          </h4>
                          <p className="text-sm text-white/60 mb-4">
                            {venue.description}
                          </p>
                          <button
                            onClick={() => handleEnterVenue(venue)}
                            className="px-6 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition-colors"
                          >
                            Entrar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "companion" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-cyber-blue">
                💋 Prostitutes
              </h3>
              {venuesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue mx-auto"></div>
                  <p className="mt-2">Loading prostitution venues...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {companionVenues.length === 0 ? (
                    <div className="text-center py-8 text-white/60">
                      No companion venues found
                    </div>
                  ) : (
                    companionVenues.map((venue) => {
                      console.log("🏢 DEBUG: Rendering venue:", venue.name, venue);
                      return (
                        <div
                          key={venue.id}
                          className="cyber-border p-6 bg-cyber-dark-medium hover:bg-cyber-dark transition-colors"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-cyber-dark flex-shrink-0">
                              <img
                                src={venue.image_url || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=150&h=150&fit=crop'}
                                alt={venue.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-cyber-pink mb-2">
                                {venue.name}
                              </h4>
                              <p className="text-sm text-white/60 mb-4">
                                {venue.description}
                              </p>
                              <div className="text-xs text-white/40 mb-2">
                                Cost: ${venue.money_cost} | Energy: {venue.energy_cost}
                              </div>
                              <button
                                onClick={() => {
                                  console.log("🎯 DEBUG: Entering venue:", venue.name);
                                  handleEnterVenue(venue);
                                }}
                                className="px-6 py-2 bg-cyber-pink text-white font-bold rounded hover:bg-cyber-pink/80 transition-colors"
                              >
                                Enter
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg shadow-lg max-w-sm ${
                  notification.type === "success"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{notification.message}</span>
                  <button
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== notification.id)
                      )
                    }
                    className="ml-2 text-white/80 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BaseView>
    );
  }
};

export default NightlifeView;
