import React from "react";
import { DollarSign, ShoppingCart } from "lucide-react";
import { ShopItem } from "../hooks/useShop";

interface ShopItemCardProps {
  item: ShopItem;
  onClick: () => void;
  onAddToCart: () => void;
}

const raritySvgs: Record<string, React.ReactNode> = {
  common: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <polygon
        points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8"
        fill="#facc15"
        stroke="#fbbf24"
        strokeWidth="1.5"
      />
    </svg>
  ),
  rare: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="4"
        y="4"
        width="12"
        height="12"
        rx="3"
        fill="#38bdf8"
        stroke="#0ea5e9"
        strokeWidth="1.5"
      />
      <polygon points="10,6 13,10 10,14 7,10" fill="#bae6fd" />
    </svg>
  ),
  epic: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2 L13 8 L19 8 L14 12 L16 18 L10 15 L4 18 L6 12 L1 8 L7 8 Z"
        fill="#a21caf"
        stroke="#c026d3"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="10" r="3" fill="#f3e8ff" />
    </svg>
  ),
  legendary: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2"
        y="8"
        width="16"
        height="8"
        rx="4"
        fill="#fbbf24"
        stroke="#f59e42"
        strokeWidth="1.5"
      />
      <polygon points="10,2 12,8 8,8" fill="#fbbf24" />
    </svg>
  ),
};

export default function ShopItemCard({
  item,
  onClick,
  onAddToCart,
}: ShopItemCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${item.name}`}
      onClick={onClick}
      onKeyPress={(e) => {
        if (e.key === "Enter") onClick();
      }}
      className="group relative bg-gradient-to-br from-cyber-dark-light to-cyber-dark-medium border border-cyber-blue/20 rounded-xl p-4 hover:border-cyber-blue/50 hover:scale-[1.02] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-blue flex flex-row items-center gap-4 md:gap-6"
    >
      {item.discount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          -{item.discount}%
        </div>
      )}
      <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow"
          loading="lazy"
          draggable={false}
        />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm truncate flex items-center gap-1">
            {item.name}
            <span className="ml-1 align-middle">{raritySvgs[item.rarity]}</span>
          </h3>
        </div>
        <p className="text-xs text-white/60 line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap gap-1">
          {Object.entries(item.effects || {}).map(([stat, value]) => {
            if (!value) return null;
            return (
              <span
                key={stat}
                className="text-xs px-2 py-1 bg-cyber-blue/10 border border-cyber-blue/20 rounded"
              >
                {stat === 'success_boost' ? 'Success' : 
                 stat === 'escape_boost' ? 'Escape' : 
                 stat === 'health_protection' ? 'Protection' : 
                 stat.charAt(0).toUpperCase() + stat.slice(1)}: +{value}{stat.includes('boost') || stat.includes('protection') ? '%' : ''}
              </span>
            );
          })}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-yellow-400" />
            <span
              className={`font-bold ${
                item.discount ? "line-through text-white/50" : "text-yellow-400"
              }`}
            >
              ${item.price.toLocaleString()}
            </span>
            {item.discount && (
              <span className="font-bold text-green-400">
                $
                {Math.round(
                  item.price * (1 - item.discount / 100)
                ).toLocaleString()}
              </span>
            )}
          </div>
          <button
            aria-label={`Adicionar ${item.name} ao carrinho`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="p-2 rounded-lg bg-cyber-blue/20 border border-cyber-blue/30 hover:bg-cyber-blue/30 transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-blue"
          >
            <ShoppingCart size={16} className="text-cyber-blue" />
          </button>
        </div>
      </div>
    </div>
  );
}
