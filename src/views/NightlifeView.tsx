import React from "react";
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
} from "lucide-react";

const venues = [
  {
    name: "Neon Club",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80",
    icon: <Music size={22} color="#FF00C8" />,
    tags: [
      { label: "Club", color: "bg-cyber-purple/80 text-cyber-purple" },
      { label: "Drugs", color: "bg-cyber-blue/80 text-cyber-blue" },
      { label: "Music", color: "bg-cyber-green/80 text-cyber-green" },
    ],
    statIcon: <Flame size={18} color="#FFD600" />,
    stat: "25 Energy",
    statColor: "text-yellow-300",
    risk: "Medium",
    riskColor: "text-yellow-300",
    riskIcon: <AlertTriangle size={16} color="#FFD600" />,
    button: "PARTY",
    buttonColor: "bg-pink-500 hover:bg-pink-600",
    actionIcon: <Music size={18} color="#fff" />,
    price: "$150",
  },
  {
    name: "City Bar",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    icon: <Star size={22} color="#00FFF0" />,
    tags: [
      { label: "Bar", color: "bg-cyber-purple/80 text-cyber-purple" },
      { label: "Alcohol", color: "bg-cyber-blue/80 text-cyber-blue" },
    ],
    statIcon: <KeyRound size={18} color="#00FFF0" />,
    stat: "10 Addiction",
    statColor: "text-cyber-blue",
    risk: "Low",
    riskColor: "text-cyber-blue",
    riskIcon: <AlertTriangle size={16} color="#00FFF0" />,
    button: "VISIT",
    buttonColor: "bg-cyber-blue hover:bg-cyber-blue/80",
    actionIcon: <Star size={18} color="#fff" />,
    price: "$50",
  },
  {
    name: "Brothel",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
    icon: <Users size={22} color="#FF0055" />,
    tags: [
      { label: "Hookers", color: "bg-cyber-purple/80 text-cyber-purple" },
      { label: "High Risk", color: "bg-yellow-700/80 text-yellow-300" },
    ],
    statIcon: <Heart size={18} color="#FF0055" />,
    stat: "5 Reputation",
    statColor: "text-yellow-300",
    risk: "High",
    riskColor: "text-red-500",
    riskIcon: <AlertTriangle size={16} color="#FF0055" />,
    button: "HOOK UP",
    buttonColor: "bg-red-500 hover:bg-red-600",
    actionIcon: <Users size={18} color="#fff" />,
    price: "$300",
  },
];

function NightlifeCard({ venue }) {
  return (
    <div className="cyber-card flex flex-row items-center p-4 gap-4 border-l-4 border-cyber-blue bg-cyber-dark-medium">
      <div className="flex-shrink-0 flex items-center justify-center w-32 h-32 bg-cyber-dark-lighter rounded-lg border border-cyber-blue">
        <img
          src={venue.image}
          alt={venue.name}
          className="object-cover w-full h-full rounded-lg"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-1 px-2">
        <div className="flex items-center gap-2 mb-1">
          {venue.icon}
          <h4 className="font-bold text-lg text-cyber-pink drop-shadow">
            {venue.name}
          </h4>
        </div>
        <div className="flex flex-wrap gap-2 mb-1">
          {venue.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded text-xs font-semibold ${tag.color}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-1">
          {venue.statIcon}
          <span className={`font-semibold ${venue.statColor}`}>
            {venue.stat}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          {venue.riskIcon}
          <span className={`font-semibold ${venue.riskColor}`}>
            Risk: {venue.risk}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full pl-4">
        <button
          className={`font-bold px-8 py-2 rounded ${venue.buttonColor} text-white uppercase hover:opacity-90 transition-all flex items-center gap-2 mb-2`}
          type="button"
        >
          {venue.actionIcon}
          {venue.button}
        </button>
        <span className="text-cyber-gold text-lg font-bold mt-2">
          {venue.price}
        </span>
      </div>
    </div>
  );
}

const NightlifeView = () => {
  return (
    <BaseView title="Nightlife">
      <div className="cyber-border p-4">
        <div className="space-y-6">
          {venues.map((venue) => (
            <NightlifeCard key={venue.name} venue={venue} />
          ))}
        </div>
      </div>
    </BaseView>
  );
};

export default NightlifeView;
