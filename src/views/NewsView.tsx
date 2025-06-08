import React from "react";
import {
  Newspaper,
  Trophy,
  AlertTriangle,
  User,
  ArrowLeft,
} from "lucide-react";

interface NewsViewProps {
  onBack?: () => void;
}

const news = [
  {
    icon: <User size={18} className="text-cyber-blue" />,
    title: "Cobras gang takes over industrial district",
    time: "5 min ago",
  },
  {
    icon: <Trophy size={18} className="text-cyber-gold" />,
    title: "Player X wins $100k at the casino",
    time: "12 min ago",
  },
  {
    icon: <AlertTriangle size={18} className="text-cyber-pink" />,
    title: "Police increase patrols downtown",
    time: "30 min ago",
  },
  {
    icon: <Trophy size={18} className="text-cyber-blue" />,
    title: "New tournament announced for next week",
    time: "1 hour ago",
  },
];

const NewsView: React.FC<NewsViewProps> = ({ onBack }) => (
  <div className="max-w-xl mx-auto bg-[#0a0e17] rounded-xl border border-cyber-blue/40 p-6 mt-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-cyber-blue font-bold text-xl">
        <Newspaper size={24} className="text-cyber-blue" />
        News Feed
      </div>
      {onBack && (
        <button
          className="flex items-center gap-1 text-cyber-blue/70 hover:text-cyber-blue font-semibold text-sm"
          onClick={onBack}
        >
          <ArrowLeft size={18} /> Back
        </button>
      )}
    </div>
    <div className="text-cyber-blue/80 mb-4 text-sm">
      Stay up to date with the latest events in the city!
    </div>
    <div className="space-y-2">
      {news.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between bg-cyber-dark-lighter rounded px-4 py-3 mb-1 border border-cyber-blue/10"
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="text-white text-sm font-medium">{item.title}</span>
          </div>
          <span className="text-xs text-cyber-blue/80">{item.time}</span>
        </div>
      ))}
    </div>
  </div>
);

export default NewsView;
