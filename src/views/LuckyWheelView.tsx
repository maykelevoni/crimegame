import React from "react";
import { Gift, ArrowLeft } from "lucide-react";

const prizes = [
  { icon: "💰", label: "Money" },
  { icon: "💊", label: "Cure Addiction" },
  { icon: "⭐", label: "Reputation" },
  { icon: "🔋", label: "Energy" },
  { icon: "❓", label: "Mystery" },
];

export default function LuckyWheelView({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-xl mx-auto bg-gradient-to-br from-cyber-dark-light to-cyber-dark-medium rounded-xl border border-pink-400/30 p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-pink-400 font-bold text-xl">
          <Gift size={24} className="text-pink-400" />
          Lucky Wheel
        </div>
        <button
          className="flex items-center gap-1 text-pink-400/70 hover:text-pink-400 font-semibold text-sm"
          onClick={onBack}
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
      <div className="text-pink-300 mb-4 text-sm">
        Spin the Lucky Wheel every day for a chance to win exclusive prizes!
      </div>
      <div className="flex items-center justify-center gap-3 mb-6 text-2xl">
        {prizes.map((p, i) => (
          <span key={i} title={p.label}>
            {p.icon}
          </span>
        ))}
      </div>
      <div className="flex justify-center">
        <button className="flex items-center gap-2 bg-pink-400 hover:bg-pink-600 text-white font-bold py-2 px-8 rounded-full shadow transition-all duration-300 border-none text-lg">
          <Gift size={20} /> Spin
        </button>
      </div>
    </div>
  );
}
