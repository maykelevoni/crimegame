import React, { useState, useEffect } from "react";
import {
  Wine,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Users,
  Heart,
  Zap,
  Star,
  Search,
  Filter,
  Upload,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Prostitute {
  id: string;
  name: string;
  description: string;
  price: number;
  energy_cost: number;
  created_at: string;
}

interface NightlifeVenue {
  id: string;
  name: string;
  description: string;
  type: "bar" | "rave" | "club" | "lounge";
  price: number;
  energy_cost: number;
  effects: {
    energy?: number;
    addiction?: number;
    health?: number;
    reputation?: number;
  };
  image_url?: string;
  risk_level: number;
  isActive: boolean;
  created_at: string;
}


const NightlifeManagement = () => {
  const [prostitutes, setProstitutes] = useState<Prostitute[]>([]);
  const [venues, setVenues] = useState<NightlifeVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"venues" | "prostitutes">("venues");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProstitute, setEditingProstitute] = useState<Prostitute | null>(null);
  const [editingVenue, setEditingVenue] = useState<NightlifeVenue | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const [stats, setStats] = useState({
    totalVenues: 0,
    totalProstitutes: 0,
    totalVisits: 0,
    averagePrice: 0,
    activeVenues: 0,
  });

  // Load data from database
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProstitutes(), loadVenues()]);
    } catch (error) {
      console.error('Error loading nightlife data:', error);
      toast.error('Failed to load nightlife data');
    } finally {
      setLoading(false);
    }
  };

  const loadProstitutes = async () => {
    try {
      const { data: prostituteData, error } = await supabase
        .from('prostitutes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (prostituteData && prostituteData.length > 0) {
        setProstitutes(prostituteData);
      } else {
        // Mock data fallback
        const mockProstitutes: Prostitute[] = [
          {
            id: "1",
            name: "Sophia",
            description: "Elegant and sophisticated companion for upscale clientele",
            price: 200,
            energy_cost: 5,
            venue_id: "5", // Luxury Escort Service
            image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
            effects: { energy: 40, addiction: 3 },
            available: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Carmen",
            description: "Experienced and discreet professional services",
            price: 150,
            energy_cost: 3,
            venue_id: "4", // Red Light District
            image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
            effects: { energy: 25, addiction: 5 },
            available: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Isabella",
            description: "Young and enthusiastic companion with great personality",
            price: 100,
            energy_cost: 2,
            venue_id: "4", // Red Light District
            image_url: "https://images.unsplash.com/photo-1494790108755-2616b2e31b89?w=400&h=400&fit=crop&crop=faces",
            effects: { energy: 15, addiction: 8 },
            available: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "4",
            name: "Maria",
            description: "Friendly and approachable with excellent service",
            price: 120,
            energy_cost: 2,
            venue_id: "5", // Luxury Escort Service
            image_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=faces",
            effects: { energy: 20, addiction: 4 },
            available: true,
            created_at: new Date().toISOString(),
          },
        ];
        setProstitutes(mockProstitutes);
      }
    } catch (error) {
      console.error('Error loading prostitutes:', error);
    }
  };

  const loadVenues = async () => {
    try {
      const { data: venueData, error } = await supabase
        .from('nightlife_venues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (venueData && venueData.length > 0) {
        const transformedVenues: NightlifeVenue[] = venueData.map(venue => ({
          id: venue.id,
          name: venue.name,
          description: venue.description,
          type: venue.type,
          price: venue.price,
          energy_cost: venue.energy_cost,
          effects: venue.effects || {},
          image_url: venue.image_url,
          risk_level: venue.risk_level,
          isActive: venue.is_active,
          created_at: venue.created_at,
        }));
        setVenues(transformedVenues);
      } else {
        // Mock data fallback
        const mockVenues: NightlifeVenue[] = [
          {
            id: "1",
            name: "The Crimson Lounge",
            description: "Upscale bar with premium drinks and live music",
            type: "bar",
            price: 50,
            energy_cost: 3,
            effects: { energy: 20, reputation: 5 },
            image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&crop=center",
            risk_level: 2,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Underground Rave",
            description: "High-energy electronic music venue with party atmosphere",
            type: "rave",
            price: 30,
            energy_cost: 5,
            effects: { energy: 50, addiction: 2 },
            image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
            risk_level: 4,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Elite Members Club",
            description: "Exclusive club for high-class clientele",
            type: "club",
            price: 100,
            energy_cost: 4,
            effects: { energy: 30, reputation: 15 },
            image_url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=800&h=600&fit=crop&crop=center",
            risk_level: 1,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "4",
            name: "Red Light District",
            description: "Discreet services for adult entertainment",
            type: "companion",
            price: 150,
            energy_cost: 0,
            effects: { energy: 25, addiction: 5 },
            image_url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&crop=center",
            risk_level: 3,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "5",
            name: "Luxury Escort Service",
            description: "High-end companionship for elite clients",
            type: "companion",
            price: 300,
            energy_cost: 0,
            effects: { energy: 40, addiction: 3 },
            image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
            risk_level: 1,
            isActive: true,
            created_at: new Date().toISOString(),
          },
        ];
        setVenues(mockVenues);
      }
    } catch (error) {
      console.error('Error loading venues:', error);
    }
  };

  useEffect(() => {
    calculateStats();
  }, [venues, prostitutes]);

  const calculateStats = () => {
    const totalVenues = venues.length;
    const totalProstitutes = prostitutes.length;
    const activeVenues = venues.filter(v => v.isActive).length;
    const averagePrice = [...venues, ...prostitutes].reduce((sum, item) => sum + item.price, 0) / (totalVenues + totalProstitutes);

    setStats({
      totalVenues,
      totalProstitutes,
      totalVisits: 1234, // Mock data
      averagePrice: averagePrice || 0,
      activeVenues,
    });
  };

  const venueTypes = ["all", ...Array.from(new Set(venues.map(v => v.type)))];

  const filteredVenues = venues.filter(venue => {
    const matchesType = selectedType === "all" || venue.type === selectedType;
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredProstitutes = prostitutes.filter(prostitute => {
    const matchesSearch = prostitute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prostitute.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Venue management functions
  const addVenue = async (newVenue: Omit<NightlifeVenue, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('nightlife_venues')
        .insert([{
          name: newVenue.name,
          description: newVenue.description,
          type: newVenue.type,
          price: newVenue.price,
          energy_cost: newVenue.energy_cost,
          effects: newVenue.effects,
          image_url: newVenue.image_url,
          risk_level: newVenue.risk_level,
          is_active: newVenue.isActive,
        }])
        .select()
        .single();

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data) {
        const transformedVenue: NightlifeVenue = {
          ...newVenue,
          id: data.id,
          created_at: data.created_at,
        };
        setVenues([...venues, transformedVenue]);
        toast.success("Venue added successfully");
      } else {
        const venue: NightlifeVenue = {
          ...newVenue,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        setVenues([...venues, venue]);
        toast.success("Venue added successfully (local only)");
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding venue:', error);
      toast.error('Failed to add venue');
    }
  };

  const updateVenue = async (id: string, updates: Partial<NightlifeVenue>) => {
    try {
      const { error } = await supabase
        .from('nightlife_venues')
        .update({
          name: updates.name,
          description: updates.description,
          type: updates.type,
          price: updates.price,
          energy_cost: updates.energy_cost,
          effects: updates.effects,
          image_url: updates.image_url,
          risk_level: updates.risk_level,
          is_active: updates.isActive,
        })
        .eq('id', id);

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      setVenues(venues.map(venue => 
        venue.id === id ? { ...venue, ...updates } : venue
      ));
      toast.success("Venue updated successfully");
      setEditingVenue(null);
    } catch (error) {
      console.error('Error updating venue:', error);
      toast.error('Failed to update venue');
    }
  };

  const deleteVenue = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;
    
    try {
      const { error } = await supabase
        .from('nightlife_venues')
        .delete()
        .eq('id', id);

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      setVenues(venues.filter(venue => venue.id !== id));
      toast.success("Venue deleted successfully");
    } catch (error) {
      console.error('Error deleting venue:', error);
      toast.error('Failed to delete venue');
    }
  };

  // Prostitute management functions
  const addProstitute = async (newProstitute: Omit<Prostitute, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('prostitutes')
        .insert([{
          name: newProstitute.name,
          description: newProstitute.description,
          price: newProstitute.price,
          energy_cost: newProstitute.energy_cost,
        }])
        .select()
        .single();

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data) {
        setProstitutes([...prostitutes, data]);
        toast.success("Prostitute added successfully");
      } else {
        const prostitute: Prostitute = {
          ...newProstitute,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        setProstitutes([...prostitutes, prostitute]);
        toast.success("Prostitute added successfully (local only)");
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding prostitute:', error);
      toast.error('Failed to add prostitute');
    }
  };

  const updateProstitute = async (id: string, updates: Partial<Prostitute>) => {
    try {
      const { error } = await supabase
        .from('prostitutes')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          energy_cost: updates.energy_cost,
        })
        .eq('id', id);

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      setProstitutes(prostitutes.map(prostitute => 
        prostitute.id === id ? { ...prostitute, ...updates } : prostitute
      ));
      toast.success("Prostitute updated successfully");
      setEditingProstitute(null);
    } catch (error) {
      console.error('Error updating prostitute:', error);
      toast.error('Failed to update prostitute');
    }
  };

  const deleteProstitute = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prostitute?")) return;
    
    try {
      const { error } = await supabase
        .from('prostitutes')
        .delete()
        .eq('id', id);

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      setProstitutes(prostitutes.filter(prostitute => prostitute.id !== id));
      toast.success("Prostitute deleted successfully");
    } catch (error) {
      console.error('Error deleting prostitute:', error);
      toast.error('Failed to delete prostitute');
    }
  };

  const toggleVenueStatus = (id: string) => {
    const venue = venues.find(v => v.id === id);
    if (venue) {
      updateVenue(id, { isActive: !venue.isActive });
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      bar: "bg-blue-100 text-blue-800 border-blue-300",
      rave: "bg-purple-100 text-purple-800 border-purple-300",
      club: "bg-green-100 text-green-800 border-green-300",
      lounge: "bg-orange-100 text-orange-800 border-orange-300"
    };
    return colors[type as keyof typeof colors] || colors.bar;
  };

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 7) return "text-red-600 bg-red-100";
    if (riskLevel >= 4) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  // Form Components
  const VenueForm = ({ venue, onSubmit, onCancel }: {
    venue?: NightlifeVenue;
    onSubmit: (venue: Omit<NightlifeVenue, "id" | "created_at">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: venue?.name || "",
      description: venue?.description || "",
      type: venue?.type || "bar" as NightlifeVenue["type"],
      price: venue?.price || 50,
      energy_cost: venue?.energy_cost || 5,
      effects: {
        energy: venue?.effects?.energy || 10,
        addiction: venue?.effects?.addiction || 0,
        health: venue?.effects?.health || 0,
        reputation: venue?.effects?.reputation || 0,
      },
      image_url: venue?.image_url || "",
      risk_level: venue?.risk_level || 1,
      isActive: venue?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {venue ? "Edit Venue" : "Add New Venue"}
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
                  onChange={(e) => setFormData({...formData, type: e.target.value as NightlifeVenue["type"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="bar">Bar</option>
                  <option value="rave">Rave</option>
                  <option value="club">Club</option>
                  <option value="lounge">Lounge</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy Cost</label>
                <input
                  type="number"
                  value={formData.energy_cost}
                  onChange={(e) => setFormData({...formData, energy_cost: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level (1-10)</label>
                <input
                  type="number"
                  value={formData.risk_level}
                  onChange={(e) => setFormData({...formData, risk_level: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  max="10"
                  required
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
                {venue ? "Update" : "Add"} Venue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ProstituteForm = ({ prostitute, onSubmit, onCancel }: {
    prostitute?: Prostitute;
    onSubmit: (prostitute: Omit<Prostitute, "id" | "created_at">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: prostitute?.name || "",
      description: prostitute?.description || "",
      price: prostitute?.price || 50,
      energy_cost: prostitute?.energy_cost || 5,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {prostitute ? "Edit Prostitute" : "Add New Prostitute"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

              <div className="col-span-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy Cost</label>
                <input
                  type="number"
                  value={formData.energy_cost}
                  onChange={(e) => setFormData({...formData, energy_cost: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="0"
                  required
                />
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
                {prostitute ? "Update" : "Add"} Prostitute
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading nightlife data...</p>
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
            <Wine className="text-blue-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalVenues}</h3>
              <p className="text-gray-600 font-medium">Total Venues</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Heart className="text-pink-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalProstitutes}</h3>
              <p className="text-gray-600 font-medium">Prostitutes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeVenues}</h3>
              <p className="text-gray-600 font-medium">Active Venues</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalVisits.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Total Visits</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">${Math.round(stats.averagePrice)}</h3>
              <p className="text-gray-600 font-medium">Average Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Nightlife Management</h2>
          <p className="text-gray-600">Manage venues and entertainment services</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add {activeTab === "venues" ? "Venue" : "Prostitute"}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1">
        <div className="flex">
          <button
            onClick={() => setActiveTab("venues")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "venues"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Venues ({venues.length})
          </button>
          <button
            onClick={() => setActiveTab("prostitutes")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "prostitutes"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Prostitutes ({prostitutes.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          {activeTab === "venues" && (
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                {venueTypes.map(type => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content Tables */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "venues" ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Venue</th>
                  <th className="text-left p-4 font-medium text-gray-900">Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Price</th>
                  <th className="text-left p-4 font-medium text-gray-900">Effects</th>
                  <th className="text-left p-4 font-medium text-gray-900">Risk</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-right p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVenues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{venue.name}</div>
                        <div className="text-sm text-gray-500">{venue.description}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(venue.type)}`}>
                        {venue.type.charAt(0).toUpperCase() + venue.type.slice(1)}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-500" />
                        <span className="font-medium">${venue.price}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {venue.effects.energy && venue.effects.energy > 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            +{venue.effects.energy} Energy
                          </span>
                        )}
                        {venue.effects.reputation && venue.effects.reputation > 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            +{venue.effects.reputation} Rep
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(venue.risk_level)}`}>
                        Level {venue.risk_level}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => toggleVenueStatus(venue.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          venue.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {venue.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingVenue(venue)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteVenue(venue.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Image</th>
                  <th className="text-left p-4 font-medium text-gray-900">Name</th>
                  <th className="text-left p-4 font-medium text-gray-900">Description</th>
                  <th className="text-left p-4 font-medium text-gray-900">Price</th>
                  <th className="text-left p-4 font-medium text-gray-900">Energy Cost</th>
                  <th className="text-right p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProstitutes.map((prostitute) => (
                  <tr key={prostitute.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={prostitute.image_url}
                        alt={prostitute.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{prostitute.name}</div>
                    </td>

                    <td className="p-4">
                      <div className="text-sm text-gray-500">{prostitute.description}</div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-500" />
                        <span className="font-medium">${prostitute.price}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Zap size={14} className="text-blue-500" />
                        <span className="font-medium">{prostitute.energy_cost}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProstitute(prostitute)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteProstitute(prostitute.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && activeTab === "venues" && (
        <VenueForm
          onSubmit={addVenue}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {showAddModal && activeTab === "prostitutes" && (
        <ProstituteForm
          onSubmit={addProstitute}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingVenue && (
        <VenueForm
          venue={editingVenue}
          onSubmit={(updatedVenue) => updateVenue(editingVenue.id, updatedVenue)}
          onCancel={() => setEditingVenue(null)}
        />
      )}

      {editingProstitute && (
        <ProstituteForm
          prostitute={editingProstitute}
          onSubmit={(updatedProstitute) => updateProstitute(editingProstitute.id, updatedProstitute)}
          onCancel={() => setEditingProstitute(null)}
        />
      )}
    </div>
  );
};

export default NightlifeManagement;