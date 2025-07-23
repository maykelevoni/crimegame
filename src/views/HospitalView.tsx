import React, { useState } from "react";
import {
  Ambulance,
  HeartPulse,
  Pill,
  History,
  Siren,
  Scissors,
  Clock,
  Zap,
  BriefcaseMedical,
  DollarSign,
  Timer,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import BaseView from "./BaseView";
import { useGameStore } from "@/stores/gameStore";
import { useTreatments, useExecuteTreatment } from "@/hooks/useTreatments";
import { toast } from "sonner";

interface HospitalViewProps {
  isPlayerHospitalized: boolean;
  playerStatus: { health: number; addiction: number };
  onStartTreatment: (type: "health" | "detox") => void;
}

const HospitalView = ({
  isPlayerHospitalized,
  playerStatus,
  onStartTreatment,
}: HospitalViewProps) => {
  const { player, updatePlayerStats } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("health");
  const [lastTreatmentTime, setLastTreatmentTime] = useState<Record<string, number>>({});
  
  // Database hooks
  const { data: treatments, isLoading: treatmentsLoading, error: treatmentsError } = useTreatments();
  const executeTreatment = useExecuteTreatment();

  // Filter treatments by category
  const getFilteredTreatments = (category: string) => {
    return treatments?.filter(treatment => treatment.type === category) || [];
  };

  // Check if treatment is needed and not on cooldown
  const isTreatmentNeeded = (treatment: any) => {
    if (!player) return false;
    
    // Check cooldown
    const now = Date.now();
    const lastUsed = lastTreatmentTime[treatment.id] || 0;
    const cooldownMs = treatment.cooldown_minutes * 60 * 1000;
    if (now - lastUsed < cooldownMs) {
      return false;
    }
    
    // Health treatments - check if player needs health
    if (treatment.type === 'health' && treatment.health_restore > 0) {
      return player.stats.health < player.stats.maxHealth;
    }
    
    // Addiction treatments - check if player has addiction
    if (treatment.type === 'addiction' && treatment.addiction_reduction > 0) {
      return (player.stats.addiction || 0) > 0;
    }
    
    // Wanted level treatments - check if player has wanted level
    if (treatment.type === 'wanted_level' && treatment.wanted_level_reduction > 0) {
      return player.stats.wantedLevel > 0;
    }
    
    // Plastic surgery - always available (cosmetic choice)
    if (treatment.type === 'plastic_surgery') {
      return true;
    }
    
    return true;
  };

  // Handle treatment execution
  const handleTreatment = async (treatmentId: string) => {
    if (!player?.id) {
      toast.error("Player not found");
      return;
    }

    const treatment = treatments?.find(t => t.id === treatmentId);
    if (!treatment) return;

    // Check if treatment is needed
    if (!isTreatmentNeeded(treatment)) {
      if (treatment.type === 'health') {
        toast.error("Your health is already full");
      } else if (treatment.type === 'addiction') {
        toast.error("You don't have any addiction to treat");
      } else if (treatment.type === 'wanted_level') {
        toast.error("You don't have any wanted level to clear");
      }
      return;
    }

    // Check if player has enough money
    if (player.stats.money < treatment.cost) {
      toast.error("Not enough money for this treatment");
      return;
    }

    try {
      const result = await executeTreatment.mutateAsync({
        playerId: player.id,
        treatmentId: treatmentId,
      });

      // Update local player stats
      updatePlayerStats({
        health: result.newStats.health,
        energy: result.newStats.energy,
        addiction: result.newStats.addiction,
        wantedLevel: result.newStats.wanted_level,
        money: player.stats.money - treatment.cost,
      });

      // Record treatment time for cooldown
      setLastTreatmentTime(prev => ({
        ...prev,
        [treatmentId]: Date.now()
      }));

      toast.success(`Treatment completed successfully!`);
    } catch (error: any) {
      toast.error(error.message || "Treatment failed");
    }
  };

  // Get icon for treatment type
  const getTreatmentIcon = (type: string) => {
    switch (type) {
      case "health":
        return <HeartPulse className="w-5 h-5" />;
      case "energy":
        return <Zap className="w-5 h-5" />;
      case "addiction":
        return <Pill className="w-5 h-5" />;
      case "wanted_level":
        return <Siren className="w-5 h-5" />;
      case "plastic_surgery":
        return <Scissors className="w-5 h-5" />;
      default:
        return <BriefcaseMedical className="w-5 h-5" />;
    }
  };

  // Get color for treatment type
  const getTreatmentColor = (type: string) => {
    switch (type) {
      case "health":
        return "text-red-400 border-red-400/30 bg-red-400/10";
      case "energy":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "addiction":
        return "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";
      case "wanted_level":
        return "text-orange-400 border-orange-400/30 bg-orange-400/10";
      case "plastic_surgery":
        return "text-purple-400 border-purple-400/30 bg-purple-400/10";
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/10";
    }
  };

  const categories = [
    { id: "health", name: "Health", icon: HeartPulse },
    { id: "addiction", name: "Detox", icon: Pill },
    { id: "plastic_surgery", name: "Surgery", icon: Scissors },
  ];

  if (treatmentsLoading) {
    return (
      <BaseView 
        title="Hospital" 
        icon={<Ambulance className="w-6 h-6" />}
        description="Loading treatments..."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyber-blue" />
        </div>
      </BaseView>
    );
  }

  if (treatmentsError) {
    return (
      <BaseView 
        title="Hospital" 
        icon={<Ambulance className="w-6 h-6" />}
        description="Error loading treatments"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400">Failed to load hospital treatments</p>
            <p className="text-gray-400 text-sm mt-2">Please try again later</p>
          </div>
        </div>
      </BaseView>
    );
  }

  return (
    <BaseView 
      title="Central Hospital" 
      icon={<Ambulance className="w-6 h-6" />}
      description="Professional medical care and rehabilitation services"
    >
      <div className="space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? "bg-cyber-blue text-white"
                    : "bg-cyber-dark-light/50 text-gray-400 hover:text-white hover:bg-cyber-blue/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Treatments */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">
            Available {categories.find(c => c.id === selectedCategory)?.name} Treatments
          </h3>
          
          {getFilteredTreatments(selectedCategory).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No treatments available in this category
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFilteredTreatments(selectedCategory).map(treatment => (
                <div
                  key={treatment.id}
                  className={`border rounded-lg p-4 ${getTreatmentColor(treatment.type)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTreatmentIcon(treatment.type)}
                      <h4 className="font-bold text-white">{treatment.name}</h4>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-bold">{treatment.cost.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{treatment.description}</p>
                  
                  {/* Treatment Effects */}
                  <div className="space-y-2 mb-4">
                    {treatment.health_restore > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <HeartPulse className="w-4 h-4 text-red-400" />
                        <span className="text-gray-300">+{treatment.health_restore} Health</span>
                      </div>
                    )}
                    {treatment.energy_restore > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">+{treatment.energy_restore} Energy</span>
                      </div>
                    )}
                    {treatment.addiction_reduction > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Pill className="w-4 h-4 text-cyan-400" />
                        <span className="text-gray-300">-{treatment.addiction_reduction} Addiction</span>
                      </div>
                    )}
                    {treatment.wanted_level_reduction > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Siren className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300">-{treatment.wanted_level_reduction} Wanted Level</span>
                      </div>
                    )}
                    {treatment.duration_minutes > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{treatment.duration_minutes} min duration</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleTreatment(treatment.id)}
                    disabled={
                      executeTreatment.isPending ||
                      !player ||
                      player.stats.money < treatment.cost ||
                      (player.stats.level || 1) < treatment.min_level ||
                      !isTreatmentNeeded(treatment)
                    }
                    className={`w-full py-2 px-4 rounded-lg font-bold transition-all ${
                      player && 
                      player.stats.money >= treatment.cost && 
                      (player.stats.level || 1) >= treatment.min_level &&
                      isTreatmentNeeded(treatment)
                        ? "bg-cyber-blue text-white hover:bg-cyber-purple"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {executeTreatment.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      `Get Treatment`
                    )}
                  </button>

                  {(player?.stats.level || 1) < treatment.min_level && (
                    <p className="text-red-400 text-xs mt-2">
                      Requires level {treatment.min_level}
                    </p>
                  )}
                  
                  {player && !isTreatmentNeeded(treatment) && (
                    <p className="text-orange-400 text-xs mt-2">
                      {(() => {
                        const now = Date.now();
                        const lastUsed = lastTreatmentTime[treatment.id] || 0;
                        const cooldownMs = treatment.cooldown_minutes * 60 * 1000;
                        const timeLeft = cooldownMs - (now - lastUsed);
                        
                        if (timeLeft > 0) {
                          const minutesLeft = Math.ceil(timeLeft / (1000 * 60));
                          return `Cooldown: ${minutesLeft} minutes remaining`;
                        }
                        
                        if (treatment.type === 'health') return "Health is already full";
                        if (treatment.type === 'addiction') return "No addiction to treat";
                        if (treatment.type === 'wanted_level') return "No wanted level to clear";
                        return "";
                      })()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </BaseView>
  );
};

export default HospitalView;