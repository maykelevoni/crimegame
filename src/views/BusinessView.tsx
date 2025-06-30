import React, { useState } from "react";
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
} from "lucide-react";

interface Business {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  income: number;
  level: number;
  maxLevel: number;
  employees: number;
  maxEmployees: number;
  security: number;
  type: "restaurant" | "club" | "shop" | "factory" | "casino";
  owned: boolean;
}

const businesses: Business[] = [
  {
    id: "restaurant",
    name: "Italian Restaurant",
    description: "Elegant restaurant downtown",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop",
    price: 50000,
    income: 5000,
    level: 1,
    maxLevel: 10,
    employees: 5,
    maxEmployees: 20,
    security: 30,
    type: "restaurant",
    owned: false,
  },
  {
    id: "nightclub",
    name: "Nightclub Neon",
    description: "Luxury nightclub with live shows",
    image:
      "https://images.unsplash.com/photo-1566733971017-fc977c5c2f3a?w=150&h=150&fit=crop",
    price: 150000,
    income: 15000,
    level: 1,
    maxLevel: 10,
    employees: 8,
    maxEmployees: 25,
    security: 50,
    type: "club",
    owned: false,
  },
  {
    id: "shop",
    name: "Convenience Store",
    description: "24-hour store in residential neighborhood",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop",
    price: 25000,
    income: 2500,
    level: 1,
    maxLevel: 10,
    employees: 3,
    maxEmployees: 15,
    security: 20,
    type: "shop",
    owned: false,
  },
  {
    id: "factory",
    name: "Weapons Factory",
    description: "Production of high-quality illegal weapons",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop",
    price: 500000,
    income: 50000,
    level: 1,
    maxLevel: 10,
    employees: 15,
    maxEmployees: 50,
    security: 80,
    type: "factory",
    owned: false,
  },
  {
    id: "casino",
    name: "Golden Casino",
    description: "Luxury casino with gambling games",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
    price: 1000000,
    income: 100000,
    level: 1,
    maxLevel: 10,
    employees: 25,
    maxEmployees: 100,
    security: 90,
    type: "casino",
    owned: false,
  },
];

const BusinessView = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>([]);
  const [playerMoney, setPlayerMoney] = useState(1000000);

  const handleBuyBusiness = (business: Business) => {
    if (playerMoney >= business.price) {
      setPlayerMoney(playerMoney - business.price);
      const ownedBusiness = { ...business, owned: true };
      setOwnedBusinesses([...ownedBusinesses, ownedBusiness]);
      setSelectedBusiness(null);
    }
  };

  const handleUpgradeBusiness = (
    businessId: string,
    upgradeType: "level" | "employees" | "security"
  ) => {
    setOwnedBusinesses(
      ownedBusinesses.map((business) => {
        if (business.id === businessId) {
          const upgradeCost = business.price * 0.1;
          if (playerMoney >= upgradeCost) {
            setPlayerMoney(playerMoney - upgradeCost);
            return {
              ...business,
              [upgradeType]: Math.min(
                business[upgradeType] + 1,
                business.maxLevel
              ),
              income: business.income * 1.1,
            };
          }
        }
        return business;
      })
    );
  };

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return <Building2 size={20} className="text-orange-500" />;
      case "club":
        return <Zap size={20} className="text-purple-500" />;
      case "shop":
        return <DollarSign size={20} className="text-green-500" />;
      case "factory":
        return <Shield size={20} className="text-red-500" />;
      case "casino":
        return <Star size={20} className="text-yellow-500" />;
      default:
        return <Building2 size={20} className="text-blue-500" />;
    }
  };

  const getBusinessTypeColor = (type: string) => {
    switch (type) {
      case "restaurant":
        return "border-orange-500/30 bg-orange-500/10";
      case "club":
        return "border-purple-500/30 bg-purple-500/10";
      case "shop":
        return "border-green-500/30 bg-green-500/10";
      case "factory":
        return "border-red-500/30 bg-red-500/10";
      case "casino":
        return "border-yellow-500/30 bg-yellow-500/10";
      default:
        return "border-blue-500/30 bg-blue-500/10";
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
              ${playerMoney.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-green-400" />
            <span className="text-sm text-green-400">
              +$
              {ownedBusinesses
                .reduce((total, b) => total + b.income, 0)
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
                              handleUpgradeBusiness(business.id, "level")
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
                              handleUpgradeBusiness(business.id, "employees")
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
                              handleUpgradeBusiness(business.id, "security")
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
                        +${business.income.toLocaleString()}/hour
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
                          +${business.income.toLocaleString()}/hour
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
                  +${selectedBusiness.income.toLocaleString()}
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
                disabled={playerMoney < selectedBusiness.price}
                className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors ${
                  playerMoney >= selectedBusiness.price
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
              >
                {playerMoney >= selectedBusiness.price
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
    </BaseView>
  );
};

export default BusinessView;
