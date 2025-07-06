import React, { useState, useEffect } from "react";
import BaseView from "./BaseView";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Star,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Minus,
  Factory,
  Truck,
  Package,
  Timer,
} from "lucide-react";
import { useGameStore } from "../stores/gameStore";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  baseIncome: number;
  level: number;
  maxLevel: number;
  employees: number;
  maxEmployees: number;
  security: number;
  supplies: number;
  maxSupplies: number;
  supplyCost: number;
  upgradeCost: number;
  type: "counterfeit" | "weapons" | "drugs" | "garage" | "casino";
  owned: boolean;
  lastCollection?: number;
  productionRate: number; // products per hour
}

const businesses: Business[] = [
  {
    id: "counterfeit",
    name: "Counterfeit Cash Factory",
    description: "Print fake money with high-tech equipment",
    image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&h=600&fit=crop&crop=center",
    price: 75000,
    baseIncome: 8000,
    level: 1,
    maxLevel: 5,
    employees: 3,
    maxEmployees: 15,
    security: 40,
    supplies: 0,
    maxSupplies: 100,
    supplyCost: 15000,
    upgradeCost: 15000,
    type: "counterfeit",
    owned: false,
    productionRate: 2,
  },
  {
    id: "weapons",
    name: "Weapon Manufacturing",
    description: "Produce illegal weapons for the black market",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop",
    price: 250000,
    baseIncome: 25000,
    level: 1,
    maxLevel: 5,
    employees: 8,
    maxEmployees: 30,
    security: 70,
    supplies: 0,
    maxSupplies: 100,
    supplyCost: 40000,
    upgradeCost: 50000,
    type: "weapons",
    owned: false,
    productionRate: 1.5,
  },
  {
    id: "drugs",
    name: "Drug Lab",
    description: "Cook and distribute illegal drugs",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=150&fit=crop",
    price: 150000,
    baseIncome: 18000,
    level: 1,
    maxLevel: 5,
    employees: 5,
    maxEmployees: 20,
    security: 60,
    supplies: 0,
    maxSupplies: 100,
    supplyCost: 25000,
    upgradeCost: 30000,
    type: "drugs",
    owned: false,
    productionRate: 2.5,
  },
  {
    id: "garage",
    name: "Chop Shop Garage",
    description: "Steal and modify vehicles for resale",
    image: "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=150&h=150&fit=crop",
    price: 120000,
    baseIncome: 12000,
    level: 1,
    maxLevel: 5,
    employees: 6,
    maxEmployees: 25,
    security: 50,
    supplies: 0,
    maxSupplies: 100,
    supplyCost: 20000,
    upgradeCost: 25000,
    type: "garage",
    owned: false,
    productionRate: 1.8,
  },
  {
    id: "casino",
    name: "Underground Casino",
    description: "Run illegal gambling operations",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
    price: 500000,
    baseIncome: 50000,
    level: 1,
    maxLevel: 5,
    employees: 15,
    maxEmployees: 50,
    security: 80,
    supplies: 0,
    maxSupplies: 100,
    supplyCost: 75000,
    upgradeCost: 100000,
    type: "casino",
    owned: false,
    productionRate: 1,
  },
];

const BusinessView = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>([]);
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState<{
    businessId: string;
    upgradeType: "level" | "employees" | "security";
    cost: number;
    businessName: string;
  } | null>(null);
  const [showSupplyConfirm, setShowSupplyConfirm] = useState<{
    businessId: string;
    cost: number;
    businessName: string;
  } | null>(null);
  const { player, updatePlayerMoney } = useGameStore();

  // Load owned businesses from localStorage when component mounts
  useEffect(() => {
    if (player?.id) {
      const businessKey = `owned_businesses_${player.id}`;
      const savedBusinesses = localStorage.getItem(businessKey);
      if (savedBusinesses) {
        try {
          const parsed = JSON.parse(savedBusinesses);
          setOwnedBusinesses(parsed);
        } catch (error) {
        }
      }
    }
  }, [player?.id]);

  // Save owned businesses to localStorage whenever they change
  const saveBusinessesToStorage = (businesses: Business[]) => {
    if (player?.id) {
      const businessKey = `owned_businesses_${player.id}`;
      localStorage.setItem(businessKey, JSON.stringify(businesses));
    }
  };

  const handleBuyBusiness = (business: Business) => {
    const currentMoney = player?.money || player?.stats?.money || 0;
    if (currentMoney < business.price) {
      toast.error(`Not enough money! You need $${business.price.toLocaleString()} but have $${currentMoney.toLocaleString()}`);
      return;
    }

    toast.dismiss();
    updatePlayerMoney(-business.price);
    const ownedBusiness = { 
      ...business, 
      owned: true,
      lastCollection: Date.now(),
    };
    const newBusinesses = [...ownedBusinesses, ownedBusiness];
    setOwnedBusinesses(newBusinesses);
    saveBusinessesToStorage(newBusinesses);
    setSelectedBusiness(null);
    
    toast.success(`🏢 You bought ${business.name}! Start making that dirty money!`);
  };

  const requestUpgrade = (
    businessId: string,
    upgradeType: "level" | "employees" | "security"
  ) => {
    const business = ownedBusinesses.find(b => b.id === businessId);
    if (!business) return;

    // Check if upgrade is possible
    if (upgradeType === "level" && business.level >= business.maxLevel) {
      toast.error("Business is already at maximum level!");
      return;
    }
    if (upgradeType === "employees" && business.employees >= business.maxEmployees) {
      toast.error("Maximum employees reached!");
      return;
    }
    if (upgradeType === "security" && business.security >= 100) {
      toast.error("Security is already at maximum!");
      return;
    }

    const upgradeCost = business.upgradeCost;
    setShowUpgradeConfirm({
      businessId,
      upgradeType,
      cost: upgradeCost,
      businessName: business.name
    });
  };

  const confirmUpgrade = () => {
    if (!showUpgradeConfirm) return;

    const { businessId, upgradeType, cost } = showUpgradeConfirm;
    const currentMoney = player?.money || player?.stats?.money || 0;
    
    if (currentMoney < cost) {
      toast.error(`Not enough money for upgrade! Need $${cost.toLocaleString()}`);
      setShowUpgradeConfirm(null);
      return;
    }

    const newBusinesses = ownedBusinesses.map((business) => {
      if (business.id === businessId) {
        toast.dismiss();
        updatePlayerMoney(-cost);
        
        const updated = { ...business };
        if (upgradeType === "level") {
          updated.level = Math.min(business.level + 1, business.maxLevel);
          toast.success(`🔧 ${business.name} upgraded to level ${updated.level}!`);
        } else if (upgradeType === "employees") {
          updated.employees = Math.min(business.employees + 5, business.maxEmployees);
          toast.success(`👥 Hired 5 more employees for ${business.name}!`);
        } else if (upgradeType === "security") {
          updated.security = Math.min(business.security + 10, 100);
          toast.success(`🛡️ Security upgraded for ${business.name}!`);
        }
        
        return updated;
      }
      return business;
    });
    
    setOwnedBusinesses(newBusinesses);
    saveBusinessesToStorage(newBusinesses);
    setShowUpgradeConfirm(null);
  };

  const requestSupplies = (businessId: string) => {
    const business = ownedBusinesses.find(b => b.id === businessId);
    if (!business) return;

    if (business.supplies >= business.maxSupplies) {
      toast.error("Supply storage is full!");
      return;
    }

    setShowSupplyConfirm({
      businessId,
      cost: business.supplyCost,
      businessName: business.name
    });
  };

  const confirmSupplies = () => {
    if (!showSupplyConfirm) return;

    const { businessId, cost } = showSupplyConfirm;
    const currentMoney = player?.money || player?.stats?.money || 0;
    
    if (currentMoney < cost) {
      toast.error(`Not enough money for supplies! Need $${cost.toLocaleString()}`);
      setShowSupplyConfirm(null);
      return;
    }

    const newBusinesses = ownedBusinesses.map((business) => {
      if (business.id === businessId) {
        toast.dismiss();
        updatePlayerMoney(-cost);
        toast.success(`📦 Supplies purchased for ${business.name}!`);
        
        return {
          ...business,
          supplies: business.maxSupplies,
        };
      }
      return business;
    });
    
    setOwnedBusinesses(newBusinesses);
    saveBusinessesToStorage(newBusinesses);
    setShowSupplyConfirm(null);
  };

  const calculateCurrentIncome = (business: Business): number => {
    const levelMultiplier = 1 + (business.level - 1) * 0.3;
    const employeeMultiplier = 1 + (business.employees / business.maxEmployees) * 0.5;
    const supplyMultiplier = business.supplies > 0 ? 1 : 0.1; // Very low income without supplies
    
    return Math.floor(business.baseIncome * levelMultiplier * employeeMultiplier * supplyMultiplier);
  };

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case "counterfeit":
        return <DollarSign size={20} className="text-green-500" />;
      case "weapons":
        return <Shield size={20} className="text-red-500" />;
      case "drugs":
        return <Zap size={20} className="text-purple-500" />;
      case "garage":
        return <Truck size={20} className="text-blue-500" />;
      case "casino":
        return <Star size={20} className="text-yellow-500" />;
      default:
        return <Factory size={20} className="text-gray-500" />;
    }
  };

  const getBusinessTypeColor = (type: string) => {
    switch (type) {
      case "counterfeit":
        return "border-green-500/30 bg-green-500/10";
      case "weapons":
        return "border-red-500/30 bg-red-500/10";
      case "drugs":
        return "border-purple-500/30 bg-purple-500/10";
      case "garage":
        return "border-blue-500/30 bg-blue-500/10";
      case "casino":
        return "border-yellow-500/30 bg-yellow-500/10";
      default:
        return "border-gray-500/30 bg-gray-500/10";
    }
  };

  return (
    <BaseView title="Business Empire">
      {/* Player Money */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={24} className="text-green-400" />
            <span className="text-xl font-bold text-green-400">
              ${(player?.money || player?.stats?.money || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-green-400" />
            <span className="text-sm text-green-400">
              +$
              {ownedBusinesses
                .reduce((total, b) => total + calculateCurrentIncome(b), 0)
                .toLocaleString()}
              /hour
            </span>
          </div>
        </div>
      </div>

      {/* Owned Businesses */}
      {ownedBusinesses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-400" />
            Your Businesses
          </h2>
          <div className="grid gap-4">
            {ownedBusinesses.map((business) => (
              <div
                key={business.id}
                className={`p-4 rounded-xl border ${getBusinessTypeColor(
                  business.type
                )}`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getBusinessTypeIcon(business.type)}
                      <h3 className="font-bold text-white">{business.name}</h3>
                    </div>
                    <p className="text-sm text-white/70 mb-3">
                      {business.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Level:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">
                            {business.level}/{business.maxLevel}
                          </span>
                          <button
                            onClick={() =>
                              requestUpgrade(business.id, "level")
                            }
                            className="p-1 bg-blue-500/20 rounded hover:bg-blue-500/30"
                          >
                            <Plus size={12} className="text-blue-400" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60">Employees:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">
                            {business.employees}/{business.maxEmployees}
                          </span>
                          <button
                            onClick={() =>
                              requestUpgrade(business.id, "employees")
                            }
                            className="p-1 bg-green-500/20 rounded hover:bg-green-500/30"
                          >
                            <Plus size={12} className="text-green-400" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60">Security:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">
                            {business.security}%
                          </span>
                          <button
                            onClick={() =>
                              requestUpgrade(business.id, "security")
                            }
                            className="p-1 bg-red-500/20 rounded hover:bg-red-500/30"
                          >
                            <Plus size={12} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded">
                      <span className="text-green-400 font-bold">
                        +${calculateCurrentIncome(business).toLocaleString()}/hour
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Businesses */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Building2 size={24} className="text-blue-400" />
          Available Businesses
        </h2>
        <div className="grid gap-4">
          {businesses
            .filter(
              (business) => !ownedBusinesses.find((b) => b.id === business.id)
            )
            .map((business) => (
              <div
                key={business.id}
                className={`p-4 rounded-xl border ${getBusinessTypeColor(
                  business.type
                )} cursor-pointer hover:scale-[1.02] transition-transform`}
                onClick={() => setSelectedBusiness(business)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getBusinessTypeIcon(business.type)}
                      <h3 className="font-bold text-white">{business.name}</h3>
                    </div>
                    <p className="text-sm text-white/70 mb-3">
                      {business.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-white/60">Price:</span>
                        <span className="text-white font-bold ml-2">
                          ${business.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-white/60">Income:</span>
                        <span className="text-green-400 font-bold ml-2">
                          +${(business.baseIncome || 0).toLocaleString()}/hour
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Business Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-cyber-dark border border-cyber-blue/30 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {selectedBusiness.name}
              </h3>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="p-2 hover:bg-white/10 rounded"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <img
              src={selectedBusiness.image}
              alt={selectedBusiness.name}
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <p className="text-white/70 mb-4">{selectedBusiness.description}</p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-white/60">Price:</span>
                <span className="text-white font-bold">
                  ${selectedBusiness.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Income per hour:</span>
                <span className="text-green-400 font-bold">
                  +${(selectedBusiness.baseIncome || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Employees:</span>
                <span className="text-white">
                  {selectedBusiness.employees}/{selectedBusiness.maxEmployees}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Security:</span>
                <span className="text-white">{selectedBusiness.security}%</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleBuyBusiness(selectedBusiness)}
                disabled={(player?.money || player?.stats?.money || 0) < selectedBusiness.price}
                className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors ${
                  (player?.money || player?.stats?.money || 0) >= selectedBusiness.price
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
              >
                {(player?.money || player?.stats?.money || 0) >= selectedBusiness.price
                  ? "Buy Business"
                  : "Insufficient Money"}
              </button>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="py-3 px-4 border border-white/30 rounded-lg text-white hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Confirmation Modal */}
      {showUpgradeConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-cyan-500/30 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Confirm Upgrade</h3>
            <p className="text-white mb-4">
              Upgrade {showUpgradeConfirm.businessName} ({showUpgradeConfirm.upgradeType}) for{" "}
              <span className="text-green-400 font-bold">
                ${showUpgradeConfirm.cost.toLocaleString()}
              </span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmUpgrade}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-bold"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowUpgradeConfirm(null)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supply Purchase Confirmation Modal */}
      {showSupplyConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-cyan-500/30 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Confirm Purchase</h3>
            <p className="text-white mb-4">
              Buy supplies for {showSupplyConfirm.businessName} for{" "}
              <span className="text-green-400 font-bold">
                ${showSupplyConfirm.cost.toLocaleString()}
              </span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmSupplies}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-bold"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowSupplyConfirm(null)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseView>
  );
};

export default BusinessView;
