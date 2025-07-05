import React, { useState, useEffect } from "react";
import BaseView from "./BaseView";
import { Gavel, Siren, Users, Handshake, Angry, Dumbbell, Briefcase, Moon, Clock, DollarSign } from "lucide-react";
import { useGameStore } from "../stores/gameStore";
import { toast } from "sonner";

interface PrisonViewProps {
  isPlayerImprisoned: boolean;
  onAttemptBribe: () => boolean; // Returns true on success
  onAttemptRiot: () => boolean; // Returns true on success
}

const PrisonView = ({
  isPlayerImprisoned,
  onAttemptBribe,
  onAttemptRiot,
}: PrisonViewProps) => {
  const [feedback, setFeedback] = useState("");
  const { player, doPrisonActivity, reducePrisonSentence } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(player?.stats?.prisonSentence || 0);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [activityTimeLeft, setActivityTimeLeft] = useState(0);

  // Format time as MM:SS
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update prison sentence timer every second
  useEffect(() => {
    if (isPlayerImprisoned) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          // Force release if timer at 0 but still imprisoned (fix stuck state)
          if (prev <= 0 && player?.stats?.isImprisoned) {
            reducePrisonSentence(0);
            return 0;
          }
          
          if (prev <= 0) return 0;
          
          const newTime = Math.max(0, prev - 1/60); // Subtract 1 second (1/60 of a minute)
          
          if (newTime <= 0) {
            reducePrisonSentence(prev);
          }
          
          return newTime;
        });
      }, 1000); // 1 second = 1000ms

      return () => clearInterval(interval);
    }
  }, [isPlayerImprisoned, reducePrisonSentence]);

  // Sync with store updates
  useEffect(() => {
    setTimeLeft(player?.stats?.prisonSentence || 0);
  }, [player?.stats?.prisonSentence]);

  // Activity timer (runs every second)
  useEffect(() => {
    if (currentActivity && activityTimeLeft > 0) {
      const interval = setInterval(() => {
        setActivityTimeLeft(prev => {
          const newTime = prev - 1/60; // Subtract 1 second (1/60 of a minute)
          if (newTime <= 0) {
            // Activity completed, apply effects
            doPrisonActivity(currentActivity as "exercise" | "work" | "sleep");
            setCurrentActivity(null);
          }
          return Math.max(0, newTime);
        });
      }, 1000); // 1 second = 1000ms

      return () => clearInterval(interval);
    }
  }, [currentActivity, activityTimeLeft, doPrisonActivity]);

  const handleBribe = () => {
    const cost = Math.floor((timeLeft || 10) * 100); // $100 per minute remaining
    if (player!.stats.money < cost) {
      setFeedback(`Not enough money! Need $${cost.toLocaleString()}`);
      return;
    }
    
    setFeedback("Trying to bribe the guard...");
    setTimeout(() => {
      const success = onAttemptBribe();
      setFeedback(
        success
          ? "Bribe accepted! You are free."
          : "Bribe failed! Your sentence increased."
      );
    }, 1500);
  };

  const handleRiot = () => {
    setFeedback("Starting a riot...");
    setTimeout(() => {
      const success = onAttemptRiot();
      setFeedback(
        success
          ? "Riot successful! You escaped in the chaos."
          : "Riot failed! You were captured and your sentence doubled."
      );
    }, 1500);
  };

  const handleActivity = (activity: "exercise" | "work" | "sleep") => {
    if (currentActivity) return; // Already doing an activity
    
    const activityTimes = {
      exercise: 2, // 2 minutes (same as real time)
      work: 3,     // 3 minutes (same as real time) 
      sleep: 5     // 5 minutes (same as real time)
    };
    
    setCurrentActivity(activity);
    setActivityTimeLeft(activityTimes[activity]);
    
    const activityNames = {
      exercise: "Exercising",
      work: "Working", 
      sleep: "Sleeping"
    };
    
    toast.info(`Started ${activityNames[activity]}...`);
  };

  const getBribeCost = () => {
    return Math.floor((timeLeft || 10) * 100);
  };

  if (isPlayerImprisoned) {
    return (
      <BaseView title="Prison Cell">
        <div className="space-y-4">
          {/* Sentence Info */}
          <div className="cyber-border p-4 bg-red-900/20">
            <div className="flex items-center gap-3 mb-3">
              <Siren size={32} className="text-red-400 animate-pulse" />
              <div>
                <h3 className="text-xl font-bold text-red-400">IMPRISONED</h3>
                <p className="text-sm text-white/70">Crime: {player?.stats?.crimeType || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} className="text-orange-400" />
              <span className="text-orange-400 font-bold">
                {formatTime(timeLeft)} remaining
              </span>
            </div>
            <div className="bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                style={{width: `${Math.max(0, 100 - (timeLeft / (player?.stats?.prisonSentence || 1)) * 100)}%`}}
              />
            </div>
          </div>

          {/* Prison Activities */}
          <div className="cyber-border p-4">
            <h4 className="text-lg font-bold mb-3 text-cyan-400">Prison Activities</h4>
            {currentActivity && (
              <div className="mb-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm">
                    {currentActivity.charAt(0).toUpperCase() + currentActivity.slice(1)}ing in progress...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                      style={{width: `${100 - (activityTimeLeft / (currentActivity === 'exercise' ? 2 : currentActivity === 'work' ? 3 : 5)) * 100}%`}}
                    />
                  </div>
                  <span className="text-yellow-400 text-xs min-w-[60px]">{formatTime(activityTimeLeft)} left</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleActivity("exercise")}
                disabled={currentActivity !== null}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  currentActivity ? 'bg-gray-600/20 opacity-50 cursor-not-allowed' : 'bg-green-500/20 hover:bg-green-500/30'
                }`}
              >
                <Dumbbell size={24} className={`mb-2 ${currentActivity ? 'text-gray-400' : 'text-green-400'}`} />
                <span className={`font-semibold text-sm ${currentActivity ? 'text-gray-400' : 'text-white'}`}>
                  {currentActivity === 'exercise' ? 'Exercising...' : 'Exercise'}
                </span>
                <span className="text-xs text-white/60">+5 Health (2 min)</span>
              </button>
              <button
                onClick={() => handleActivity("work")}
                disabled={currentActivity !== null}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  currentActivity ? 'bg-gray-600/20 opacity-50 cursor-not-allowed' : 'bg-blue-500/20 hover:bg-blue-500/30'
                }`}
              >
                <Briefcase size={24} className={`mb-2 ${currentActivity ? 'text-gray-400' : 'text-blue-400'}`} />
                <span className={`font-semibold text-sm ${currentActivity ? 'text-gray-400' : 'text-white'}`}>
                  {currentActivity === 'work' ? 'Working...' : 'Work'}
                </span>
                <span className="text-xs text-white/60">+$50-150 (3 min)</span>
              </button>
              <button
                onClick={() => handleActivity("sleep")}
                disabled={currentActivity !== null}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  currentActivity ? 'bg-gray-600/20 opacity-50 cursor-not-allowed' : 'bg-purple-500/20 hover:bg-purple-500/30'
                }`}
              >
                <Moon size={24} className={`mb-2 ${currentActivity ? 'text-gray-400' : 'text-purple-400'}`} />
                <span className={`font-semibold text-sm ${currentActivity ? 'text-gray-400' : 'text-white'}`}>
                  {currentActivity === 'sleep' ? 'Sleeping...' : 'Sleep'}
                </span>
                <span className="text-xs text-white/60">+10 Energy (5 min)</span>
              </button>
            </div>
          </div>

          {/* Escape Options */}
          <div className="cyber-border p-4">
            <h4 className="text-lg font-bold mb-3 text-red-400">Escape Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleBribe}
                className="flex flex-col items-center p-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors"
                disabled={player!.stats.money < getBribeCost()}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Handshake size={24} className="text-yellow-400" />
                  <DollarSign size={16} className="text-green-400" />
                </div>
                <span className="font-semibold text-sm">Bribe Guard</span>
                <span className="text-xs text-white/60">${getBribeCost().toLocaleString()}</span>
                <span className="text-xs text-white/40">(10% success)</span>
              </button>
              <button
                onClick={handleRiot}
                className="flex flex-col items-center p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
              >
                <Angry size={24} className="mb-2 text-red-400" />
                <span className="font-semibold text-sm">Prison Break</span>
                <span className="text-xs text-white/60">50% success</span>
                <span className="text-xs text-white/40">(+10 min if fail)</span>
              </button>
            </div>
          </div>

          {feedback && (
            <div className="cyber-border p-3 bg-cyber-dark-medium text-center">
              <span className="font-semibold">{feedback}</span>
            </div>
          )}
        </div>
      </BaseView>
    );
  }

  return (
    <BaseView title="State Penitentiary">
      <div className="space-y-4">
        {/* Prison Info */}
        <div className="cyber-border p-4 bg-gray-900/30">
          <div className="flex items-center gap-3 mb-3">
            <Gavel size={32} className="text-orange-400" />
            <div>
              <h3 className="text-xl font-bold text-orange-400">STATE PENITENTIARY</h3>
              <p className="text-sm text-white/70">Maximum Security Prison</p>
            </div>
          </div>
          <p className="text-white/70">
            You are visiting the prison. You can observe inmates and learn about prison life.
          </p>
        </div>

        {/* Current Inmates */}
        <div className="cyber-border p-4">
          <h4 className="text-lg font-bold mb-3 text-cyan-400">Current Inmates</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-500/30">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-red-400" />
                <div>
                  <h4 className="font-semibold text-red-400">Marcus "Scarface" Rodriguez</h4>
                  <p className="text-xs text-white/60">Crime: Armed Robbery • Sentence: 2 years remaining</p>
                  <p className="text-xs text-red-300">High-profile gang leader</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40">Cell Block A</div>
                <div className="text-xs text-red-400 font-bold">DANGEROUS</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-orange-400" />
                <div>
                  <h4 className="font-semibold text-orange-400">Tony "The Dealer" Milano</h4>
                  <p className="text-xs text-white/60">Crime: Drug Trafficking • Sentence: 8 months remaining</p>
                  <p className="text-xs text-orange-300">Former street dealer</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40">Cell Block B</div>
                <div className="text-xs text-orange-400 font-bold">MEDIUM</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-yellow-400" />
                <div>
                  <h4 className="font-semibold text-yellow-400">Jake "Fingers" Thompson</h4>
                  <p className="text-xs text-white/60">Crime: Theft • Sentence: 3 weeks remaining</p>
                  <p className="text-xs text-yellow-300">Petty thief</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40">Cell Block C</div>
                <div className="text-xs text-yellow-400 font-bold">LOW</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prison Statistics */}
        <div className="cyber-border p-4">
          <h4 className="text-lg font-bold mb-3 text-purple-400">Prison Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-red-400">156</div>
              <div className="text-xs text-white/60">Total Inmates</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">23</div>
              <div className="text-xs text-white/60">High Security</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">89</div>
              <div className="text-xs text-white/60">Medium Security</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">44</div>
              <div className="text-xs text-white/60">Low Security</div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="cyber-border p-3 bg-red-900/20 border-red-500/50">
          <div className="flex items-center gap-2">
            <Siren size={20} className="text-red-400" />
            <span className="text-red-400 font-bold text-sm">
              WARNING: Criminal activity may result in imprisonment here!
            </span>
          </div>
        </div>
      </div>
    </BaseView>
  );
};

export default PrisonView;
