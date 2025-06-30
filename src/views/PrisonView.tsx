import React, { useState } from "react";
import BaseView from "./BaseView";
import { Gavel, Siren, Users, Handshake, Angry } from "lucide-react";

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

  const handleBribe = () => {
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

  if (isPlayerImprisoned) {
    return (
      <BaseView title="Prison">
        <div className="cyber-border p-4 text-center">
          <Siren
            size={48}
            className="mx-auto text-red-500 mb-4 animate-pulse"
          />
          <h3 className="text-2xl font-bold mb-2">You are imprisoned!</h3>
          <p className="text-white/70 mb-6">
            Your actions are blocked. Try to find a way out or serve your sentence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleBribe}
              className="flex flex-col items-center justify-center p-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors"
            >
              <Handshake size={32} className="mb-2 text-yellow-400" />
              <span className="font-semibold">Bribe Guard</span>
              <span className="text-xs text-white/60">(10% chance)</span>
            </button>
            <button
              onClick={handleRiot}
              className="flex flex-col items-center justify-center p-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              <Angry size={32} className="mb-2 text-red-400" />
              <span className="font-semibold">Start a Riot</span>
              <span className="text-xs text-white/60">(30% chance)</span>
            </button>
          </div>
          {feedback && (
            <div className="mt-6 p-3 bg-cyber-dark-medium rounded-lg text-center font-semibold">
              {feedback}
            </div>
          )}
        </div>
      </BaseView>
    );
  }

  return (
    <BaseView title="Prison">
      <div className="cyber-border p-4">
        <h3 className="text-xl font-semibold mb-4">Visit Prisoners</h3>
        <p className="text-white/70 mb-4">
          You are not imprisoned. You can visit other inmates.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-cyber-dark-medium rounded-lg">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-cyan-400" />
              <div>
                <h4 className="font-semibold">Gang X Member</h4>
                <p className="text-xs text-white/60">Sentence: 3 days remaining</p>
              </div>
            </div>
            <button className="px-4 py-1 text-sm bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors">
              Chat
            </button>
          </div>
          {/* Add more prisoners here */}
        </div>
      </div>
    </BaseView>
  );
};

export default PrisonView;
