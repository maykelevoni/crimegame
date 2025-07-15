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
import { supabase } from "@/integrations/supabase/client";

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
  type: "restaurant" | "nightclub" | "convenience_store" | "laundromat" | "auto_shop" | "pawn_shop" | "strip_club" | "drug_lab" | "cocaine_lab" | "meth_lab" | "counterfeit_money" | "weed_farm" | "black_market_syndicate" | "arms_dealer" | "office";
  owned: boolean;
  lastCollection?: number;
  productionRate: number; // products per hour
}

const BusinessView = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Load businesses from database
  useEffect(() => {
    loadBusinesses();
    loadOwnedBusinesses();
  }, [player?.id]);


  const loadBusinesses = async () => {
    try {
      // Load available business types for purchase
      const { data, error } = await supabase
        .from('business_types')
        .select('*')
        .order('base_price', { ascending: true });
      
      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Transform database data to match Business interface
        const transformedBusinesses: Business[] = data.map(business => ({
          id: business.id,
          name: business.name,
          description: business.description,
          image: business.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center",
          price: business.base_price,
          baseIncome: business.base_income,
          level: 1,
          maxLevel: business.max_level || 5,
          employees: 3,
          maxEmployees: 15,
          security: 40,
          supplies: 0,
          maxSupplies: 100,
          supplyCost: Math.floor(business.base_price * 0.1),
          upgradeCost: Math.floor(business.base_price * 0.2),
          type: business.type as Business['type'],
          owned: false,
          productionRate: 2,
        }));
        setBusinesses(transformedBusinesses);
      } else {
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const loadOwnedBusinesses = async () => {
    try {
      if (!player?.id) {
        setOwnedBusinesses([]);
        return;
      }

      // First, get player's owned businesses
      const { data: businessesData, error: businessesError } = await supabase
        .from('businesses')
        .select('*')
        .eq('player_id', player.id)
        .order('created_at', { ascending: false });
      
      if (businessesError && businessesError.code !== 'PGRST116' && businessesError.code !== '42P01') {
        throw businessesError;
      }
      
      if (businessesData && businessesData.length > 0) {
        // Get business types for the owned businesses
        const businessTypeIds = businessesData.map(b => b.business_type_id).filter(Boolean);
        const { data: businessTypesData, error: businessTypesError } = await supabase
          .from('business_types')
          .select('*')
          .in('id', businessTypeIds);
        
        if (businessTypesError && businessTypesError.code !== 'PGRST116' && businessTypesError.code !== '42P01') {
          throw businessTypesError;
        }
        
        // Transform database data to match Business interface
        const transformedBusinesses: Business[] = businessesData.map(business => {
          const businessType = businessTypesData?.find(bt => bt.id === business.business_type_id);
          return {
            id: business.id,
            name: businessType?.name || 'Unknown Business',
            description: businessType?.description || 'No description',
            image: businessType?.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center",
            price: businessType?.base_price || 0,
            baseIncome: business.income_per_hour || businessType?.base_income || 0,
            level: business.level || 1,
            maxLevel: businessType?.max_level || 5,
            employees: business.employees || 3,
            maxEmployees: 15,
            security: business.security || 40,
            supplies: 0,
            maxSupplies: 100,
            supplyCost: Math.floor((businessType?.base_price || 0) * 0.1),
            upgradeCost: Math.floor((businessType?.base_price || 0) * 0.2),
            type: businessType?.type as Business['type'] || 'convenience',
            owned: true,
            lastCollection: business.last_collected ? new Date(business.last_collected).getTime() : Date.now(),
            productionRate: 2,
          };
        });
        setOwnedBusinesses(transformedBusinesses);
      } else {
        setOwnedBusinesses([]);
      }
    } catch (error) {
      console.error('Error loading owned businesses:', error);
      toast.error('Failed to load owned businesses');
    }
  };

  // Save owned businesses to localStorage whenever they change
  const saveBusinessesToStorage = (businesses: Business[]) => {
    if (player?.id) {
      const businessKey = `owned_businesses_${player.id}`;
      localStorage.setItem(businessKey, JSON.stringify(businesses));
    }
  };

  const handleBuyBusiness = async (business: Business) => {
    const currentMoney = player?.money || player?.stats?.money || 0;
    if (currentMoney < business.price) {
      toast.error(`Not enough money! You need $${business.price.toLocaleString()} but have $${currentMoney.toLocaleString()}`);
      return;
    }

    if (!player?.id) {
      toast.error('Player not found');
      return;
    }

    try {
      toast.dismiss();
      
      // Insert new business into database
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          player_id: player.id,
          business_type_id: business.id,
          level: 1,
          income_per_hour: business.baseIncome,
          last_collected: new Date().toISOString(),
          // Include fallback fields from business type in case columns don't exist yet
          name: business.name,
          description: business.description,
          type: business.type,
          price: business.price,
          income: business.baseIncome,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update player money
      updatePlayerMoney(-business.price);
      
      // Reload owned businesses
      loadOwnedBusinesses();
      
      setSelectedBusiness(null);
      toast.success(`🏢 You bought ${business.name}! Start making that dirty money!`);
    } catch (error) {
      console.error('Error buying business:', error);
      toast.error('Failed to buy business');
    }
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

  const confirmUpgrade = async () => {
    if (!showUpgradeConfirm) return;

    const { businessId, upgradeType, cost } = showUpgradeConfirm;
    const currentMoney = player?.money || player?.stats?.money || 0;
    
    if (currentMoney < cost) {
      toast.error(`Not enough money for upgrade! Need $${cost.toLocaleString()}`);
      setShowUpgradeConfirm(null);
      return;
    }

    try {
      const business = ownedBusinesses.find(b => b.id === businessId);
      if (!business) return;

      toast.dismiss();
      
      let updateData = {};
      if (upgradeType === "level") {
        const newLevel = Math.min(business.level + 1, business.maxLevel);
        const newIncome = Math.floor(business.baseIncome * (1 + (newLevel - 1) * 0.3)); // 30% increase per level
        updateData = { 
          level: newLevel,
          income_per_hour: newIncome
        };
        toast.success(`🔧 ${business.name} upgraded to level ${newLevel}! Income: $${newIncome.toLocaleString()}/hour`);
      } else if (upgradeType === "employees") {
        const newEmployees = Math.min(business.employees + 5, business.maxEmployees);
        updateData = { employees: newEmployees };
        toast.success(`👥 Hired 5 more employees for ${business.name}! Total: ${newEmployees}`);
      } else if (upgradeType === "security") {
        const newSecurity = Math.min(business.security + 10, 100);
        updateData = { security: newSecurity };
        toast.success(`🛡️ Security upgraded for ${business.name}! Security: ${newSecurity}%`);
      }
      
      // Update business in database
      const { error } = await supabase
        .from('businesses')
        .update(updateData)
        .eq('id', businessId);

      if (error) {
        throw error;
      }

      // Update player money
      updatePlayerMoney(-cost);
      
      // Reload owned businesses
      loadOwnedBusinesses();
      
      setShowUpgradeConfirm(null);
    } catch (error) {
      console.error('Error upgrading business:', error);
      toast.error('Failed to upgrade business');
      setShowUpgradeConfirm(null);
    }
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
      // Legal/Semi-Legal
      case "restaurant":
        return <Package size={20} className="text-orange-500" />;
      case "nightclub":
        return <Users size={20} className="text-purple-500" />;
      case "convenience":
        return <Package size={20} className="text-blue-500" />;
      case "casino":
        return <Star size={20} className="text-yellow-500" />;
      case "laundromat":
        return <Factory size={20} className="text-cyan-500" />;
      case "auto_shop":
        return <Truck size={20} className="text-blue-500" />;
      case "pawn_shop":
        return <DollarSign size={20} className="text-green-500" />;
      case "strip_club":
        return <Users size={20} className="text-pink-500" />;
      
      // Illegal Operations
      case "drug_lab":
        return <Zap size={20} className="text-purple-500" />;
      case "counterfeit_money":
        return <DollarSign size={20} className="text-green-500" />;
      case "weapon_factory":
        return <Shield size={20} className="text-red-500" />;
      case "arms_dealer":
        return <Shield size={20} className="text-red-500" />;
      case "chop_shop":
        return <Truck size={20} className="text-gray-500" />;
      case "smuggling_ring":
        return <Package size={20} className="text-indigo-500" />;
      case "cyber_crime":
        return <Zap size={20} className="text-blue-500" />;
      case "fake_documents":
        return <Factory size={20} className="text-amber-500" />;
      case "human_trafficking":
        return <AlertTriangle size={20} className="text-red-600" />;
      case "loan_shark":
        return <DollarSign size={20} className="text-red-500" />;
      case "protection_racket":
        return <Shield size={20} className="text-orange-500" />;
      case "illegal_gambling":
        return <Star size={20} className="text-red-500" />;
        
      // Legacy types
      case "counterfeit":
        return <DollarSign size={20} className="text-green-500" />;
      case "weapons":
        return <Shield size={20} className="text-red-500" />;
      case "drugs":
        return <Zap size={20} className="text-purple-500" />;
      case "garage":
        return <Truck size={20} className="text-blue-500" />;
      default:
        return <Factory size={20} className="text-gray-500" />;
    }
  };

  const getBusinessTypeColor = (type: string) => {
    switch (type) {
      // Legal/Semi-Legal (Green/Blue tones)
      case "restaurant":
        return "border-orange-500/30 bg-orange-500/10";
      case "nightclub":
        return "border-purple-500/30 bg-purple-500/10";
      case "convenience":
        return "border-blue-500/30 bg-blue-500/10";
      case "casino":
        return "border-yellow-500/30 bg-yellow-500/10";
      case "laundromat":
        return "border-cyan-500/30 bg-cyan-500/10";
      case "auto_shop":
        return "border-blue-500/30 bg-blue-500/10";
      case "pawn_shop":
        return "border-green-500/30 bg-green-500/10";
      case "strip_club":
        return "border-pink-500/30 bg-pink-500/10";
      
      // Illegal Operations (Red/Dark tones)
      case "drug_lab":
        return "border-purple-600/30 bg-purple-600/10";
      case "counterfeit_money":
        return "border-green-600/30 bg-green-600/10";
      case "weapon_factory":
        return "border-red-600/30 bg-red-600/10";
      case "arms_dealer":
        return "border-red-600/30 bg-red-600/10";
      case "chop_shop":
        return "border-gray-600/30 bg-gray-600/10";
      case "smuggling_ring":
        return "border-indigo-600/30 bg-indigo-600/10";
      case "cyber_crime":
        return "border-blue-600/30 bg-blue-600/10";
      case "fake_documents":
        return "border-amber-600/30 bg-amber-600/10";
      case "human_trafficking":
        return "border-red-700/30 bg-red-700/10";
      case "loan_shark":
        return "border-red-600/30 bg-red-600/10";
      case "protection_racket":
        return "border-orange-600/30 bg-orange-600/10";
      case "illegal_gambling":
        return "border-red-600/30 bg-red-600/10";
        
      // Legacy types
      case "counterfeit":
        return "border-green-500/30 bg-green-500/10";
      case "weapons":
        return "border-red-500/30 bg-red-500/10";
      case "drugs":
        return "border-purple-500/30 bg-purple-500/10";
      case "garage":
        return "border-blue-500/30 bg-blue-500/10";
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
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-2 text-white/60">Loading businesses...</p>
          </div>
        ) : (
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
        )}
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
              className="w-48 h-48 object-cover rounded-lg mb-4 mx-auto"
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
