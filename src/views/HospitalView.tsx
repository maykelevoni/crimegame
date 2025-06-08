import React, { useState } from "react";
import BaseView from "./BaseView";
import CyberCard from "../components/ui/CyberCard";
import NeonButton from "../components/ui/NeonButton";
import {
  HeartPulse,
  Pill,
  Syringe,
  Hospital,
  Clock,
  AlertTriangle,
  Skull,
  Brain,
  Scissors,
  DollarSign,
  Zap,
  Star,
} from "lucide-react";

interface Treatment {
  id: string;
  name: string;
  healing: number;
  cost: number;
  time: string;
  risk: string;
  icon: React.ElementType;
  color: string;
  image: string;
  difficulty: string;
  difficultyColor: string;
  buttonColor: string;
}

interface Medication {
  id: string;
  name: string;
  effect: string;
  sideEffect: string;
  cost: number;
  icon: React.ElementType;
  color: string;
  image: string;
  difficulty: string;
  difficultyColor: string;
  buttonColor: string;
}

function ActionCard({
  difficulty = "Medium",
  difficultyColor = "bg-yellow-500",
  title,
  description,
  cost,
  time,
  risk = null,
  onStart,
  buttonColor = "bg-cyber-blue",
  imageUrl = null,
  icon: Icon,
  iconColor = "#0A0E17",
  stats = [],
}) {
  return (
    <div
      className={`cyber-card flex flex-row items-center p-4 gap-4 border-l-4 ${difficultyColor} bg-cyber-dark-medium`}
    >
      <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 bg-cyber-dark-lighter rounded-lg border border-cyber-blue">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cyber-blue/40">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1 px-2">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold text-white ${difficultyColor}`}
          >
            {difficulty}
          </span>
          <h4 className="font-bold text-lg text-cyber-blue">{title}</h4>
        </div>
        <p className="text-sm text-gray-300 mb-2">{description}</p>
        <div className="flex flex-wrap gap-3 text-xs mb-2">
          <span className="flex items-center gap-1 text-cyber-green">
            <DollarSign size={14} /> Cost: ${cost}
          </span>
          <span className="flex items-center gap-1 text-cyber-pink">
            <Clock size={14} /> {time}
          </span>
          {risk && (
            <span className="flex items-center gap-1 text-red-500">
              <AlertTriangle size={14} /> Risk: {risk}
            </span>
          )}
          {stats.map((stat, index) => (
            <span
              key={index}
              className="flex items-center gap-1 text-cyber-blue"
            >
              {stat.icon && <stat.icon size={14} />} {stat.label}
            </span>
          ))}
        </div>
        <button
          className={`font-bold px-6 py-2 rounded ${buttonColor} text-white hover:opacity-90 transition-all flex items-center gap-2`}
          onClick={onStart}
        >
          <Icon size={18} color={iconColor} />{" "}
          {onStart ? "GET TREATMENT" : "BUY MEDS"}
        </button>
      </div>
    </div>
  );
}

const HospitalView = () => {
  const [healthStatus, setHealthStatus] = useState({
    current: 75,
    status: "Injured",
    cause: "Injured during robbery",
    cooldown: "3h",
  });

  const treatments: Treatment[] = [
    {
      id: "basic",
      name: "Basic Treatment",
      healing: 25,
      cost: 1000,
      time: "Instant",
      risk: "None",
      icon: Syringe,
      color: "#30E3DF",
      image:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-cyber-blue",
    },
    {
      id: "advanced",
      name: "Advanced Surgery",
      healing: 75,
      cost: 5000,
      time: "2h",
      risk: "Low",
      icon: Hospital,
      color: "#FF4D4F",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
      difficulty: "Medium",
      difficultyColor: "bg-yellow-500",
      buttonColor: "bg-yellow-500",
    },
    {
      id: "blackmarket",
      name: "Black Market Doctor",
      healing: 100,
      cost: 2500,
      time: "Instant",
      risk: "High",
      icon: Skull,
      color: "#FFD700",
      image:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=100&q=80",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      buttonColor: "bg-red-500",
    },
  ];

  const medications: Medication[] = [
    {
      id: "painkillers",
      name: "Painkillers",
      effect: "+10% Health over 1h",
      sideEffect: "+5% Addiction",
      cost: 250,
      icon: Pill,
      color: "#00fff7",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-cyber-blue",
    },
    {
      id: "stimulants",
      name: "Stimulants",
      effect: "+20% Energy over 30m",
      sideEffect: "+10% Addiction",
      cost: 500,
      icon: Brain,
      color: "#FF4D4F",
      image:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=100&q=80",
      difficulty: "Medium",
      difficultyColor: "bg-yellow-500",
      buttonColor: "bg-yellow-500",
    },
  ];

  return (
    <BaseView title="Hospital">
      {/* Health Status & Healing Section */}
      <div className="cyber-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <HeartPulse size={24} className="text-red-500 animate-pulse" />
          <h3 className="text-xl font-semibold">Health Status & Healing</h3>
        </div>

        <div className="cyber-card flex flex-row items-center p-4 gap-4 border-l-4 bg-green-500 bg-cyber-dark-medium">
          <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 bg-cyber-dark-lighter rounded-lg border border-cyber-blue">
            <HeartPulse size={40} className="text-red-500" />
          </div>
          <div className="flex-1 px-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-green-500">
                Status
              </span>
              <h4 className="font-bold text-lg text-cyber-blue">
                Health Status
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Status:</span>
                <span className="text-cyber-green font-medium">
                  {healthStatus.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cause:</span>
                <span className="text-cyber-blue">{healthStatus.cause}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Next Treatment Available:</span>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span className="text-cyber-yellow">
                    {healthStatus.cooldown}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-cyber-dark rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${healthStatus.current}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Health: {healthStatus.current}%</span>
                <span>Max: 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medications & Effects Section */}
      <div className="cyber-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Pill size={24} className="text-cyan-400" />
          <h3 className="text-xl font-semibold">Medications & Effects</h3>
        </div>

        <div className="space-y-4">
          {medications.map((med) => (
            <ActionCard
              key={med.id}
              title={med.name}
              description={med.effect}
              cost={med.cost}
              time="1h"
              risk={med.sideEffect}
              onStart={() => {}}
              buttonColor={med.buttonColor}
              imageUrl={med.image}
              icon={med.icon}
              iconColor={med.color}
              difficulty={med.difficulty}
              difficultyColor={med.difficultyColor}
              stats={[{ icon: AlertTriangle, label: med.sideEffect }]}
            />
          ))}
        </div>
      </div>

      {/* Treatments Available Section */}
      <div className="cyber-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Hospital size={24} className="text-cyan-400" />
          <h3 className="text-xl font-semibold">Treatments Available</h3>
        </div>

        <div className="space-y-4">
          {treatments.map((treatment) => (
            <ActionCard
              key={treatment.id}
              title={treatment.name}
              description={`Heals ${treatment.healing}% of your health`}
              cost={treatment.cost}
              time={treatment.time}
              risk={treatment.risk}
              onStart={() => {}}
              buttonColor={treatment.buttonColor}
              imageUrl={treatment.image}
              icon={treatment.icon}
              iconColor={treatment.color}
              difficulty={treatment.difficulty}
              difficultyColor={treatment.difficultyColor}
              stats={[
                { icon: HeartPulse, label: `+${treatment.healing}% Health` },
              ]}
            />
          ))}
        </div>
      </div>
    </BaseView>
  );
};

export default HospitalView;
