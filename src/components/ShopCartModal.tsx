import React from "react";
import { ShoppingCart, X } from "lucide-react";
import { ShopItem } from "../hooks/useShop";

interface ShopCartModalProps {
  cart: (ShopItem & { qty?: number })[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onChangeQty: (id: string, qty: number) => void;
  onBuy: () => void;
  isBuying: boolean;
  total: number;
}

export default function ShopCartModal({
  cart,
  onClose,
  onRemove,
  onChangeQty,
  onBuy,
  isBuying,
  total,
}: ShopCartModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
    >
      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-cyber-blue">Carrinho</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-cyber-blue/20 hover:bg-cyber-blue/30 transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-blue"
            aria-label="Fechar"
          >
            <X size={20} className="text-cyber-blue" />
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <ShoppingCart
              size={48}
              className="mx-auto mb-4 text-cyber-blue/40"
            />
            <p>Carrinho vazio</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center justify-between p-3 bg-cyber-blue/10 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-contain drop-shadow"
                    loading="lazy"
                    draggable={false}
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-xs text-white/60">
                      $
                      {item.discount
                        ? Math.round(item.price * (1 - item.discount / 100))
                        : item.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onChangeQty(item.id, Math.max(1, (item.qty || 1) - 1))
                    }
                    className="px-2 py-1 bg-cyber-blue/20 rounded text-cyber-blue font-bold"
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.qty || 1}</span>
                  <button
                    onClick={() => onChangeQty(item.id, (item.qty || 1) + 1)}
                    className="px-2 py-1 bg-cyber-blue/20 rounded text-cyber-blue font-bold"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Remover do carrinho"
                  >
                    <X size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
            <div className="border-t border-cyber-blue/20 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-yellow-400">
                  ${total.toLocaleString()}
                </span>
              </div>
              <button
                onClick={onBuy}
                disabled={isBuying}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyber-blue"
              >
                {isBuying ? "Comprando..." : "Comprar Tudo"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
