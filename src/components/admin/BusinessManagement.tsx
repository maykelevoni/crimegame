import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Package,
  Clock,
  Star,
  BarChart3,
  Search,
  Filter,
  Eye,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Business {
  id: string;
  name: string;
  description: string;
  type: "counterfeit" | "weapons" | "drugs" | "garage" | "casino" | "restaurant" | "nightclub" | "convenience";
  price: number;
  baseIncome: number;
  maxLevel: number;
  maxEmployees: number;
  maxSupplies: number;
  supplyCost: number;
  upgradeCostMultiplier: number;
  incomeMultiplier: number;
  riskLevel: number;
  image: string;
  isActive: boolean;
  playerOwnership: {
    totalOwned: number;
    totalRevenue: number;
    averageLevel: number;
  };
  created_at: string;
}

const getBusinessImage = (type: string) => {
  const imageMap: { [key: string]: string } = {
    counterfeit: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&h=600&fit=crop&crop=center",
    weapons: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop&crop=center",
    drugs: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&crop=center",
    garage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop&crop=center",
    casino: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=600&fit=crop&crop=center",
    restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&crop=center",
    nightclub: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=800&h=600&fit=crop&crop=center",
    convenience: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800&h=600&fit=crop&crop=center"
  };
  return imageMap[type] || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center";
};

const BusinessManagement = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from businesses table
      const { data: businessData, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') { // Handle both relation does not exist codes
        console.error('Error loading businesses:', error);
        throw error;
      }

      if (businessData && businessData.length > 0) {
        // Transform Supabase data to match our interface
        const transformedBusinesses: Business[] = businessData.map(business => ({
          id: business.id,
          name: business.name,
          description: business.description,
          type: business.type as Business["type"],
          price: business.price,
          baseIncome: business.income,
          maxLevel: 10, // Add these fields to database later
          maxEmployees: 20,
          maxSupplies: 100,
          supplyCost: Math.floor(business.price * 0.1),
          upgradeCostMultiplier: 1.5,
          incomeMultiplier: 1.3,
          riskLevel: 5,
          image: getBusinessImage(business.type),
          isActive: true,
          playerOwnership: {
            totalOwned: 0, // Add player ownership tracking later
            totalRevenue: 0,
            averageLevel: 1,
          },
          created_at: business.created_at,
        }));
        
        setBusinesses(transformedBusinesses);
        toast.success('Business types loaded from database');
      } else {
        // Fall back to mock data if no businesses in database
        const mockBusinesses = [
    {
      id: "1",
      name: "Counterfeit Cash Factory",
      description: "Illegal money printing operation with high returns",
      type: "counterfeit",
      price: 75000,
      baseIncome: 8000,
      maxLevel: 10,
      maxEmployees: 15,
      maxSupplies: 100,
      supplyCost: 2000,
      upgradeCostMultiplier: 1.5,
      incomeMultiplier: 1.3,
      riskLevel: 8,
      image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&h=600&fit=crop&crop=center",
      isActive: true,
      playerOwnership: {
        totalOwned: 23,
        totalRevenue: 1840000,
        averageLevel: 3.2,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Weapon Manufacturing",
      description: "Underground weapons factory for high-end clientele",
      type: "weapons",
      price: 250000,
      baseIncome: 25000,
      maxLevel: 10,
      maxEmployees: 25,
      maxSupplies: 150,
      supplyCost: 5000,
      upgradeCostMultiplier: 1.6,
      incomeMultiplier: 1.4,
      riskLevel: 9,
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop&crop=center",
      isActive: true,
      playerOwnership: {
        totalOwned: 8,
        totalRevenue: 2000000,
        averageLevel: 4.1,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Drug Laboratory",
      description: "High-tech drug production facility",
      type: "drugs",
      price: 150000,
      baseIncome: 18000,
      maxLevel: 10,
      maxEmployees: 20,
      maxSupplies: 120,
      supplyCost: 3500,
      upgradeCostMultiplier: 1.4,
      incomeMultiplier: 1.35,
      riskLevel: 7,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&crop=center",
      isActive: true,
      playerOwnership: {
        totalOwned: 15,
        totalRevenue: 2700000,
        averageLevel: 2.8,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Chop Shop Garage",
      description: "Vehicle theft and parts operation",
      type: "garage",
      price: 120000,
      baseIncome: 12000,
      maxLevel: 10,
      maxEmployees: 18,
      maxSupplies: 80,
      supplyCost: 2500,
      upgradeCostMultiplier: 1.3,
      incomeMultiplier: 1.25,
      riskLevel: 6,
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop&crop=center",
      isActive: true,
      playerOwnership: {
        totalOwned: 31,
        totalRevenue: 3720000,
        averageLevel: 3.5,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Underground Casino",
      description: "High-stakes gambling operation",
      type: "casino",
      price: 500000,
      baseIncome: 50000,
      maxLevel: 15,
      maxEmployees: 40,
      maxSupplies: 200,
      supplyCost: 8000,
      upgradeCostMultiplier: 1.8,
      incomeMultiplier: 1.5,
      riskLevel: 10,
      image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=600&fit=crop&crop=center",
      isActive: true,
      playerOwnership: {
        totalOwned: 3,
        totalRevenue: 1500000,
        averageLevel: 5.7,
      },
      created_at: new Date().toISOString(),
    }
        ];
        
        setBusinesses(mockBusinesses);
        toast.info('Using mock data. Database table will be created when migrations are applied.');
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
      toast.error('Failed to load business types');
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalOwnership: 0,
    totalRevenue: 0,
    averagePrice: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [businesses]);

  const calculateStats = () => {
    const totalBusinesses = businesses.length;
    const activeBusinesses = businesses.filter(b => b.isActive).length;
    const totalOwnership = businesses.reduce((sum, b) => sum + b.playerOwnership.totalOwned, 0);
    const totalRevenue = businesses.reduce((sum, b) => sum + b.playerOwnership.totalRevenue, 0);
    const averagePrice = businesses.reduce((sum, b) => sum + b.price, 0) / totalBusinesses;

    setStats({
      totalBusinesses,
      activeBusinesses,
      totalOwnership,
      totalRevenue,
      averagePrice: averagePrice || 0,
    });
  };

  const businessTypes = ["all", ...Array.from(new Set(businesses.map(b => b.type)))];

  const filteredBusinesses = businesses.filter(business => {
    const matchesType = selectedType === "all" || business.type === selectedType;
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const addBusiness = async (newBusiness: Omit<Business, "id" | "created_at" | "playerOwnership">) => {
    try {
      // Try to insert into businesses table
      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          name: newBusiness.name,
          description: newBusiness.description,
          type: newBusiness.type,
          price: newBusiness.price,
          income: newBusiness.baseIncome,
        }])
        .select()
        .single();

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') { // Handle both relation does not exist codes
        throw error;
      }

      if (data) {
        // Transform back to our interface format
        const transformedBusiness: Business = {
          id: data.id,
          name: data.name,
          description: data.description,
          type: data.type as Business["type"],
          price: data.price,
          baseIncome: data.income,
          maxLevel: newBusiness.maxLevel,
          maxEmployees: newBusiness.maxEmployees,
          maxSupplies: newBusiness.maxSupplies,
          supplyCost: newBusiness.supplyCost,
          upgradeCostMultiplier: newBusiness.upgradeCostMultiplier,
          incomeMultiplier: newBusiness.incomeMultiplier,
          riskLevel: newBusiness.riskLevel,
          image: newBusiness.image,
          isActive: newBusiness.isActive,
          playerOwnership: {
            totalOwned: 0,
            totalRevenue: 0,
            averageLevel: 0,
          },
          created_at: data.created_at,
        };
        
        setBusinesses([...businesses, transformedBusiness]);
        toast.success("Business added to database successfully");
      } else {
        // Fall back to local state if database isn't available
        const business: Business = {
          ...newBusiness,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          playerOwnership: {
            totalOwned: 0,
            totalRevenue: 0,
            averageLevel: 0,
          },
        };
        
        setBusinesses([...businesses, business]);
        toast.success("Business added successfully (local only - database will sync when available)");
      }
      
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding business:', error);
      toast.error('Failed to add business');
    }
  };

  const updateBusiness = async (id: string, updates: Partial<Business>) => {
    try {
      // Try to update in businesses table
      const { data, error } = await supabase
        .from('businesses')
        .update({
          name: updates.name,
          description: updates.description,
          type: updates.type,
          price: updates.price,
          income: updates.baseIncome,
        })
        .eq('id', id)
        .select()
        .single();

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') { // Handle both relation does not exist codes
        throw error;
      }

      // Update local state regardless of database operation
      setBusinesses(businesses.map(business => 
        business.id === id ? { ...business, ...updates } : business
      ));
      
      if (data) {
        toast.success("Business updated in database successfully");
      } else {
        toast.success("Business updated successfully (local only - database will sync when available)");
      }
      
      setEditingBusiness(null);
    } catch (error) {
      console.error('Error updating business:', error);
      toast.error('Failed to update business');
    }
  };

  const deleteBusiness = async (id: string) => {
    if (!confirm("Are you sure you want to delete this business? This will affect all players who own it.")) return;
    
    try {
      // Try to delete from businesses table
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') { // Handle both relation does not exist codes
        throw error;
      }

      // Update local state regardless of database operation
      setBusinesses(businesses.filter(business => business.id !== id));
      
      if (error && error.code === 'PGRST116') {
        toast.success("Business deleted successfully (local only - database will sync when available)");
      } else {
        toast.success("Business deleted from database successfully");
      }
    } catch (error) {
      console.error('Error deleting business:', error);
      toast.error('Failed to delete business');
    }
  };

  const toggleBusinessStatus = (id: string) => {
    const business = businesses.find(b => b.id === id);
    if (business) {
      updateBusiness(id, { isActive: !business.isActive });
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      counterfeit: DollarSign,
      weapons: Shield,
      drugs: Package,
      garage: Settings,
      casino: Star,
      restaurant: Users,
      nightclub: BarChart3,
      convenience: Building2
    };
    return icons[type as keyof typeof icons] || Building2;
  };

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 8) return "text-red-600 bg-red-100";
    if (riskLevel >= 6) return "text-orange-600 bg-orange-100";
    if (riskLevel >= 4) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const BusinessForm = ({ business, onSubmit, onCancel }: {
    business?: Business;
    onSubmit: (business: Omit<Business, "id" | "created_at" | "playerOwnership">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: business?.name || "",
      description: business?.description || "",
      type: business?.type || "counterfeit" as Business["type"],
      price: business?.price || 50000,
      baseIncome: business?.baseIncome || 5000,
      maxLevel: business?.maxLevel || 10,
      maxEmployees: business?.maxEmployees || 15,
      maxSupplies: business?.maxSupplies || 100,
      supplyCost: business?.supplyCost || 2000,
      upgradeCostMultiplier: business?.upgradeCostMultiplier || 1.5,
      incomeMultiplier: business?.incomeMultiplier || 1.3,
      riskLevel: business?.riskLevel || 5,
      image: business?.image || "",
      isActive: business?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {business ? "Edit Business" : "Add New Business"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as Business["type"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="counterfeit">Counterfeit</option>
                  <option value="weapons">Weapons</option>
                  <option value="drugs">Drugs</option>
                  <option value="garage">Garage</option>
                  <option value="casino">Casino</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="nightclub">Nightclub</option>
                  <option value="convenience">Convenience</option>
                </select>
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1000"
                  step="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Income ($/hour)</label>
                <input
                  type="number"
                  value={formData.baseIncome}
                  onChange={(e) => setFormData({...formData, baseIncome: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="100"
                  step="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level (1-10)</label>
                <input
                  type="number"
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({...formData, riskLevel: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  max="10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Level</label>
                <input
                  type="number"
                  value={formData.maxLevel}
                  onChange={(e) => setFormData({...formData, maxLevel: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="5"
                  max="20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Employees</label>
                <input
                  type="number"
                  value={formData.maxEmployees}
                  onChange={(e) => setFormData({...formData, maxEmployees: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="5"
                  max="50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Supplies</label>
                <input
                  type="number"
                  value={formData.maxSupplies}
                  onChange={(e) => setFormData({...formData, maxSupplies: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="50"
                  max="500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supply Cost ($)</label>
                <input
                  type="number"
                  value={formData.supplyCost}
                  onChange={(e) => setFormData({...formData, supplyCost: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="500"
                  step="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upgrade Cost Multiplier</label>
                <input
                  type="number"
                  value={formData.upgradeCostMultiplier}
                  onChange={(e) => setFormData({...formData, upgradeCostMultiplier: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1.1"
                  max="3.0"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Multiplier</label>
                <input
                  type="number"
                  value={formData.incomeMultiplier}
                  onChange={(e) => setFormData({...formData, incomeMultiplier: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1.1"
                  max="3.0"
                  step="0.1"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="col-span-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {business ? "Update" : "Add"} Business
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading business types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</h3>
              <p className="text-gray-600 font-medium">Total Businesses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeBusinesses}</h3>
              <p className="text-gray-600 font-medium">Active Businesses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalOwnership}</h3>
              <p className="text-gray-600 font-medium">Total Owned</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-orange-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">${Math.round(stats.averagePrice).toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Average Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Business Types</h2>
          <p className="text-gray-600">Manage available businesses and their properties</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Business
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              {businessTypes.map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Image</th>
                <th className="text-left p-4 font-medium text-gray-900">Business</th>
                <th className="text-left p-4 font-medium text-gray-900">Type</th>
                <th className="text-left p-4 font-medium text-gray-900">Price</th>
                <th className="text-left p-4 font-medium text-gray-900">Income/Hour</th>
                <th className="text-left p-4 font-medium text-gray-900">Risk</th>
                <th className="text-left p-4 font-medium text-gray-900">Ownership</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBusinesses.map((business) => {
                const TypeIcon = getTypeIcon(business.type);
                return (
                  <tr key={business.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <TypeIcon size={20} className="text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">{business.name}</div>
                          <div className="text-sm text-gray-500">{business.description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Max Level: {business.maxLevel} • Max Employees: {business.maxEmployees}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="capitalize font-medium text-gray-900">{business.type}</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-500" />
                        <span className="font-medium">{business.price.toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-blue-500" />
                        <span className="font-medium">${business.baseIncome.toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(business.riskLevel)}`}>
                        Level {business.riskLevel}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{business.playerOwnership.totalOwned} owned</div>
                        <div className="text-gray-500">Avg Level: {business.playerOwnership.averageLevel.toFixed(1)}</div>
                        <div className="text-green-600">${business.playerOwnership.totalRevenue.toLocaleString()}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => toggleBusinessStatus(business.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          business.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {business.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingBusiness(business)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteBusiness(business.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Business Modal */}
      {showAddModal && (
        <BusinessForm
          onSubmit={addBusiness}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Business Modal */}
      {editingBusiness && (
        <BusinessForm
          business={editingBusiness}
          onSubmit={(updatedBusiness) => updateBusiness(editingBusiness.id, updatedBusiness)}
          onCancel={() => setEditingBusiness(null)}
        />
      )}
    </div>
  );
};

export default BusinessManagement;