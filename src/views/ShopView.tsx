import React, { useState, useMemo } from "react";
import ShopItemCard from "../components/ShopItemCard";
import ShopItemModal from "../components/ShopItemModal";
import ShopCartModal from "../components/ShopCartModal";
import {
  ShoppingBag,
  DollarSign,
  Filter,
  Search,
  Star,
  Shield,
  Zap,
  Heart,
  Target,
  ArrowLeft,
  ShoppingCart,
  X,
  Check,
  AlertTriangle,
  TrendingUp,
  Crown,
  Gem,
  Coins,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import {
  useShopItems,
  useBuyItem,
  useBuyMultipleItems,
  ShopItem,
} from "../hooks/useShop";
import { toast } from "sonner";
import { useGameStore } from "../stores/gameStore";
import { supabase } from "@/integrations/supabase/client";

interface CartItem {
  item: ShopItem;
  quantity: number;
}

interface ShopViewProps {
  onBack: () => void;
}

const ShopView = ({ onBack }: ShopViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const { data: shopItems = [], isLoading } = useShopItems();
  const buyItemMutation = useBuyItem();
  const buyMultipleItemsMutation = useBuyMultipleItems();
  const { player, updatePlayerMoney } = useGameStore();


  // Generate shop ID once
  const shopId = useMemo(
    () => Math.random().toString(36).substr(2, 8).toUpperCase(),
    []
  );

  const categories = [
    { id: "all", name: "All", icon: ShoppingBag },
    { id: "weapon", name: "Weapons", icon: Target },
    { id: "special", name: "Vehicles", icon: TrendingUp },
    { id: "armor", name: "Protection", icon: Shield },
    { id: "consumable", name: "Consumables", icon: Zap },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400 text-gray-400";
      case "rare":
        return "border-blue-400 text-blue-400";
      case "epic":
        return "border-purple-400 text-purple-400";
      case "legendary":
        return "border-yellow-400 text-yellow-400";
      default:
        return "border-gray-400 text-gray-400";
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Star size={12} />;
      case "rare":
        return <Gem size={12} />;
      case "epic":
        return <Crown size={12} />;
      case "legendary":
        return <TrendingUp size={12} />;
      default:
        return <Star size={12} />;
    }
  };

  const filteredItems = shopItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.type === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCartValue = cart.reduce((sum, cartItem) => {
    return sum + cartItem.item.price * cartItem.quantity;
  }, 0);

  const addToCart = (item: ShopItem) => {
    const exists = cart.find((cartItem) => cartItem.item.id === item.id);
    if (exists) {
      setCart(
        cart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((cartItem) => cartItem.item.id !== itemId));
  };

  const changeCartQty = (itemId: string, qty: number) => {
    setCart(
      cart.map((cartItem) =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: Math.max(1, qty) }
          : cartItem
      )
    );
  };

  const buyItem = async (item: ShopItem) => {
    if (!player?.id) {
      toast.error("Player not found");
      return;
    }

    try {
      await buyItemMutation.mutateAsync({
        playerId: player.id,
        itemId: item.id,
        quantity: 1,
      });

      toast.success(`${item.name} purchased successfully!`);

      setSelectedItem(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const buyCart = async () => {
    if (!player?.id) {
      toast.error("Player not found");
      return;
    }

    try {
      const items = cart.map((item) => ({
        itemId: item.item.id,
        quantity: item.quantity,
      }));

      await buyMultipleItemsMutation.mutateAsync({
        playerId: player.id,
        items,
      });


      toast.success(
        `Purchase completed! ${cart.length} items added to inventory`
      );

      setCart([]);
      setShowCart(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-blue mx-auto mb-4"></div>
          <p>Loading shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Fixed balance at top */}
      <div className="sticky top-0 z-50 bg-cyber-dark/95 border-b border-cyber-blue/20 flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyber-blue hover:text-cyber-blue-light transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Back</span>
        </button>
        
        <div className="flex-1 flex justify-center">
          <span className="text-xl font-bold text-cyber-blue">Shop</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 rounded-lg bg-cyber-blue/20 border border-cyber-blue/30 hover:bg-cyber-blue/30 transition-colors"
          >
            <ShoppingCart size={20} className="text-cyber-blue" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex h-full pt-2 lg:pt-16">
        {/* Right Side - Shop Content */}
        <div className="flex-1 lg:w-2/3 xl:w-3/5 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-blue/60"
                />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cyber-dark-light border border-cyber-blue/30 rounded-lg text-white placeholder-cyber-blue/60 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue"
                />
              </div>

              {/* Categories - Vertical tabs */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all ${
                        selectedCategory === category.id
                          ? "bg-cyber-blue/20 border-cyber-blue text-cyber-blue shadow-lg"
                          : "bg-cyber-dark-light border-cyber-blue/20 text-white/70 hover:border-cyber-blue/40 hover:bg-cyber-blue/10"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-xs font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                  onAddToCart={() => addToCart(item)}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <ShoppingBag
                  size={48}
                  className="mx-auto mb-4 text-cyber-blue/40"
                />
                <p>No items found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      {selectedItem && (
        <ShopItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onBuy={() => selectedItem && addToCart(selectedItem)}
          isBuying={false}
        />
      )}
      {showCart && (
        <ShopCartModal
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onChangeQty={changeCartQty}
          onBuy={buyCart}
          isBuying={buyMultipleItemsMutation.isPending}
          total={totalCartValue}
        />
      )}
    </div>
  );
};

export default ShopView;
