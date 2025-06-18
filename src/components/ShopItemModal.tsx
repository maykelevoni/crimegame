import React from "react";
import { DollarSign, X } from "lucide-react";

interface ShopItemModalProps {
  item: any;
  onClose: () => void;
  onBuy: () => void;
  isBuying: boolean;
}

export default function ShopItemModal({
  item,
  onClose,
  onBuy,
  isBuying,
}: ShopItemModalProps) {
  if (!item) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
    >
      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-cyber-blue">{item.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-cyber-blue/20 hover:bg-cyber-blue/30 transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-blue"
            aria-label="Fechar"
          >
            <X size={20} className="text-cyber-blue" />
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-contain drop-shadow"
            loading="lazy"
            draggable={false}
          />
        </div>
        <div className="space-y-4">
          <p className="text-white/80">{item.description}</p>
          <div className="space-y-2">
            <h3 className="font-semibold text-cyber-blue">Estatísticas:</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(item.stats).map(([stat, value]) => (
                <div
                  key={stat}
                  className="flex items-center justify-between p-2 bg-cyber-blue/10 rounded"
                >
                  <span className="text-sm capitalize">{stat}:</span>
                  <span className="font-bold text-green-400">+{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-cyber-blue/20">
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-yellow-400" />
              <span
                className={`text-xl font-bold ${
                  item.discount
                    ? "line-through text-white/50"
                    : "text-yellow-400"
                }`}
              >
                ${item.price.toLocaleString()}
              </span>
              {item.discount && (
                <span className="text-xl font-bold text-green-400">
                  $
                  {Math.round(
                    item.price * (1 - item.discount / 100)
                  ).toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={onBuy}
              disabled={isBuying}
              className="px-6 py-2 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyber-blue"
            >
              {isBuying ? "Comprando..." : "Comprar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
