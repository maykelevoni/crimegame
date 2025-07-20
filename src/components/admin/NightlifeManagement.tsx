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
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";


interface NightlifeConsumable {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "drink" | "drug" | "brothel";
  effects: {
    energy?: number;
    health?: number;
    addiction?: number;
    reputation?: number;
  };
  image_url?: string;
  available: boolean;
  created_at: string;
}

interface NightlifeVenue {
  id: string;
  name: string;
  description: string;
  type: "bar" | "rave" | "brothel";
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

interface VenueConsumable {
  id: string;
  venue_id: string;
  consumable_id: string;
  venue_price: number;
  venue_effects: {
    energy?: number;
    addiction?: number;
    health?: number;
    reputation?: number;
  };
  available: boolean;
  created_at: string;
  updated_at: string;
  venue?: NightlifeVenue;
  consumable?: NightlifeConsumable;
}


const NightlifeManagement = () => {
  const [nightlifeConsumables, setNightlifeConsumables] = useState<NightlifeConsumable[]>([]);
  const [venues, setVenues] = useState<NightlifeVenue[]>([]);
  const [venueConsumables, setVenueConsumables] = useState<VenueConsumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"venues" | "consumables" | "venue-consumables" | "grouped">("venues");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConsumable, setEditingConsumable] = useState<NightlifeConsumable | null>(null);
  const [editingVenue, setEditingVenue] = useState<NightlifeVenue | null>(null);
  const [editingVenueConsumable, setEditingVenueConsumable] = useState<VenueConsumable | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [expandedVenues, setExpandedVenues] = useState<Set<string>>(new Set());
  
  // Local storage for venue images since database updates are blocked
  const [venueImages, setVenueImages] = useState<Record<string, string>>({});

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
      await Promise.all([loadVenues(), loadNightlifeConsumables(), loadVenueConsumables()]);
    } catch (error) {
      toast.error('Failed to load nightlife data');
    } finally {
      setLoading(false);
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
        const transformedVenues: NightlifeVenue[] = venueData.map(venue => {
          // Extract image URL from description if it exists
          const descriptionParts = venue.description?.split('|IMG:') || [''];
          const actualDescription = descriptionParts[0];
          const dbImageUrl = descriptionParts[1] || venue.image_url || '';
          
          // Use local storage image if available, otherwise use database image
          const finalImageUrl = venueImages[venue.id] || dbImageUrl;
          
          return {
            id: venue.id,
            name: venue.name,
            description: actualDescription,
            type: venue.type,
            price: venue.money_cost || 0,
            energy_cost: venue.energy_cost || 0,
            effects: venue.effects || {},
            image_url: finalImageUrl,
            risk_level: venue.risk_level || 1,
            isActive: venue.available || false,
            created_at: venue.created_at,
          };
        });
        setVenues(transformedVenues);
      } else {
        // Mock data fallback - crime-themed nightlife venues
        const mockVenues: NightlifeVenue[] = [
          {
            id: "1",
            name: "The Godfather's Den",
            description: "Upscale speakeasy where crime bosses conduct business over premium whiskey",
            type: "bar",
            price: 80,
            energy_cost: 3,
            effects: { energy: 25, reputation: 10 },
            image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&crop=center",
            risk_level: 2,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Biker's Paradise",
            description: "Rough bar where motorcycle club members and enforcers drink and brawl",
            type: "bar",
            price: 35,
            energy_cost: 4,
            effects: { energy: 30, reputation: -5 },
            image_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop&crop=center",
            risk_level: 6,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "The Velvet Bar",
            description: "High-end establishment where arms dealers and drug kingpins network",
            type: "bar",
            price: 120,
            energy_cost: 2,
            effects: { energy: 40, reputation: 15 },
            image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
            risk_level: 2,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "4",
            name: "Neon Underworld",
            description: "Underground rave where street hustlers and hackers gather for illegal deals",
            type: "rave",
            price: 40,
            energy_cost: 6,
            effects: { energy: 60, addiction: 3 },
            image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
            risk_level: 5,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "5",
            name: "Street Racer's Rave",
            description: "Underground party where car thieves and street racers gather after midnight",
            type: "rave",
            price: 60,
            energy_cost: 5,
            effects: { energy: 45, addiction: 2 },
            image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
            risk_level: 4,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "6",
            name: "Red Light District",
            description: "Discreet services for adult entertainment in the shadowy back streets",
            type: "prostitutes",
            price: 150,
            energy_cost: 0,
            effects: { energy: 25, addiction: 5 },
            image_url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&crop=center",
            risk_level: 3,
            isActive: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "7",
            name: "Elite Escort Service",
            description: "High-end companionship for crime bosses and wealthy criminals",
            type: "prostitutes",
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
    }
  };

  const loadNightlifeConsumables = async () => {
    try {
      const { data: consumableData, error } = await supabase
        .from('nightlife_consumables')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (consumableData && consumableData.length > 0) {
        // Force update to ensure we're using real database data
        setNightlifeConsumables([]);
        setTimeout(() => {
          setNightlifeConsumables(consumableData);
        }, 100);
      } else {
        setNightlifeConsumables([]);
      }
    } catch (error) {
      // Set empty array on error
      setNightlifeConsumables([]);
    }
  };

  const loadVenueConsumables = async () => {
    try {
      const { data: venueConsumableData, error } = await supabase
        .from('venue_consumables')
        .select(`
          *,
          venue:nightlife_venues(*),
          consumable:nightlife_consumables(*)
        `)
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (venueConsumableData && venueConsumableData.length > 0) {
        setVenueConsumables(venueConsumableData);
      } else {
        setVenueConsumables([]);
      }
    } catch (error) {
      setVenueConsumables([]);
    }
  };

  useEffect(() => {
    calculateStats();
  }, [venues, nightlifeConsumables, venueConsumables]);

  const calculateStats = () => {
    const totalVenues = venues.length;
    const totalConsumables = nightlifeConsumables.length;
    const activeVenues = venues.filter(v => v.isActive).length;
    const allItems = [...venues, ...nightlifeConsumables];
    const averagePrice = allItems.reduce((sum, item) => sum + item.price, 0) / allItems.length;

    setStats({
      totalVenues,
      totalProstitutes: totalConsumables,
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

  const filteredConsumables = nightlifeConsumables.filter(consumable => {
    const matchesSearch = consumable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumable.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Venue-Consumable management functions
  const addVenueConsumable = async (newVenueConsumable: Omit<VenueConsumable, "id" | "created_at" | "updated_at" | "venue" | "consumable">) => {
    try {
      const { data, error } = await supabase
        .from('venue_consumables')
        .insert([{
          venue_id: newVenueConsumable.venue_id,
          consumable_id: newVenueConsumable.consumable_id,
          venue_price: newVenueConsumable.venue_price,
          venue_effects: newVenueConsumable.venue_effects,
          available: newVenueConsumable.available,
        }])
        .select(`
          *,
          venue:nightlife_venues(*),
          consumable:nightlife_consumables(*)
        `)
        .single();

      if (error) throw error;

      if (data) {
        setVenueConsumables([...venueConsumables, data]);
        toast.success("Venue pricing added successfully");
      }
      setShowAddModal(false);
    } catch (error) {
      toast.error('Failed to add venue pricing');
    }
  };

  const updateVenueConsumable = async (id: string, updates: Partial<VenueConsumable>) => {
    try {
      const { error } = await supabase
        .from('venue_consumables')
        .update({
          venue_price: updates.venue_price,
          venue_effects: updates.venue_effects,
          available: updates.available,
        })
        .eq('id', id);

      if (error) throw error;

      setVenueConsumables(venueConsumables.map(vc => 
        vc.id === id ? { ...vc, ...updates } : vc
      ));
      toast.success("Venue pricing updated successfully");
      setEditingVenueConsumable(null);
    } catch (error) {
      toast.error('Failed to update venue pricing');
    }
  };

  const deleteVenueConsumable = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue pricing?")) return;
    
    try {
      const { error } = await supabase
        .from('venue_consumables')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVenueConsumables(venueConsumables.filter(vc => vc.id !== id));
      toast.success("Venue pricing deleted successfully");
    } catch (error) {
      toast.error('Failed to delete venue pricing');
    }
  };

  // Venue management functions
  const addVenue = async (newVenue: Omit<NightlifeVenue, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('nightlife_venues')
        .insert([{
          name: newVenue.name,
          description: newVenue.description,
          type: newVenue.type,
          money_cost: newVenue.price,
          energy_cost: newVenue.energy_cost,
          image_url: newVenue.image_url,
          available: newVenue.isActive,
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
      toast.error('Failed to add venue');
    }
  };

  const updateVenue = async (id: string, updates: Partial<NightlifeVenue>) => {
    try {
      const { data, error } = await supabase
        .from('nightlife_venues')
        .update({
          name: updates.name,
          description: updates.description,
          type: updates.type,
          money_cost: updates.price,
          energy_cost: updates.energy_cost,
          image_url: updates.image_url,
          available: updates.isActive,
        })
        .eq('id', id)
        .select();

      if (error) {
        // Fallback to local storage
        if (updates.image_url) {
          setVenueImages(prev => ({
            ...prev,
            [id]: updates.image_url!
          }));
        }
        toast.success("Venue updated successfully (local storage fallback)");
      } else {
        toast.success("Venue updated successfully");
      }

      // Update local venue state
      setVenues(venues.map(venue => 
        venue.id === id ? { ...venue, ...updates } : venue
      ));
      
      setEditingVenue(null);
    } catch (error) {
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
      toast.error('Failed to delete venue');
    }
  };

  // Consumable management functions
  const addConsumable = async (newConsumable: Omit<NightlifeConsumable, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('nightlife_consumables')
        .insert([{
          name: newConsumable.name,
          description: newConsumable.description,
          price: newConsumable.price,
          type: newConsumable.type,
          effects: newConsumable.effects,
          image_url: newConsumable.image_url,
          available: newConsumable.available,
        }])
        .select()
        .single();

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data) {
        setNightlifeConsumables([...nightlifeConsumables, data]);
        toast.success("Consumable added successfully");
      }
      setShowAddModal(false);
      // Reload data to ensure UI is up to date
      await loadNightlifeConsumables();
    } catch (error) {
      toast.error('Failed to add consumable');
    }
  };

  const updateConsumable = async (id: string, updates: Partial<NightlifeConsumable>) => {
    try {
      
      // First check if the record exists
      const { data: existingRecord } = await supabase
        .from('nightlife_consumables')
        .select('*')
        .eq('id', id)
        .single();
      
      
      const { data, error } = await supabase
        .from('nightlife_consumables')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          type: updates.type,
          effects: updates.effects,
          image_url: updates.image_url,
          available: updates.available,
        })
        .eq('id', id)
        .select();

      
      if (error) {
        throw error;
      }
      

      setNightlifeConsumables(nightlifeConsumables.map(consumable => 
        consumable.id === id ? { ...consumable, ...updates } : consumable
      ));
      toast.success("Consumable updated successfully");
      setEditingConsumable(null);
      // Reload data to ensure UI is up to date
      await loadNightlifeConsumables();
    } catch (error) {
      toast.error('Failed to update consumable');
    }
  };

  const deleteConsumable = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consumable?")) return;
    
    try {
      const { error } = await supabase
        .from('nightlife_consumables')
        .delete()
        .eq('id', id);

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      setNightlifeConsumables(nightlifeConsumables.filter(consumable => consumable.id !== id));
      toast.success("Consumable deleted successfully");
    } catch (error) {
      toast.error('Failed to delete consumable');
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
      brothel: "bg-pink-100 text-pink-800 border-pink-300",
    };
    return colors[type as keyof typeof colors] || colors.bar;
  };

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 7) return "text-red-600 bg-red-100";
    if (riskLevel >= 4) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  // Helper functions for grouped view
  const toggleVenueExpanded = (venueId: string) => {
    const newExpanded = new Set(expandedVenues);
    if (newExpanded.has(venueId)) {
      newExpanded.delete(venueId);
    } else {
      newExpanded.add(venueId);
    }
    setExpandedVenues(newExpanded);
  };

  const expandAllVenues = () => {
    setExpandedVenues(new Set(venues.map(v => v.id)));
  };

  const collapseAllVenues = () => {
    setExpandedVenues(new Set());
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
                  <option value="brothel">Brothel</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image size={16} className="inline mr-1" />
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-32 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
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

  const ConsumableForm = ({ consumable, onSubmit, onCancel }: {
    consumable?: NightlifeConsumable;
    onSubmit: (consumable: Omit<NightlifeConsumable, "id" | "created_at">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: consumable?.name || "",
      description: consumable?.description || "",
      price: consumable?.price || 50,
      type: consumable?.type || "drink" as NightlifeConsumable["type"],
      effects: {
        energy: consumable?.effects?.energy || 0,
        health: consumable?.effects?.health || 0,
        addiction: consumable?.effects?.addiction || 0,
        reputation: consumable?.effects?.reputation || 0,
      },
      image_url: consumable?.image_url || "",
      available: consumable?.available ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {consumable ? "Edit Consumable" : "Add New Consumable"}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as NightlifeConsumable["type"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="drink">Drink</option>
                  <option value="drug">Drug</option>
                  <option value="brothel">Brothel</option>
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy Effect</label>
                <input
                  type="number"
                  value={formData.effects.energy}
                  onChange={(e) => setFormData({...formData, effects: {...formData.effects, energy: parseInt(e.target.value) || 0}})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Effect</label>
                <input
                  type="number"
                  value={formData.effects.health}
                  onChange={(e) => setFormData({...formData, effects: {...formData.effects, health: parseInt(e.target.value) || 0}})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reputation Effect</label>
                <input
                  type="number"
                  value={formData.effects.reputation}
                  onChange={(e) => setFormData({...formData, effects: {...formData.effects, reputation: parseInt(e.target.value) || 0}})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Addiction Effect</label>
                <input
                  type="number"
                  value={formData.effects.addiction}
                  onChange={(e) => setFormData({...formData, effects: {...formData.effects, addiction: parseInt(e.target.value) || 0}})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image size={16} className="inline mr-1" />
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-32 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({...formData, available: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Available</span>
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
                {consumable ? "Update" : "Add"} Consumable
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const VenueConsumableForm = ({ venues, consumables, venueConsumable, onSubmit, onCancel }: {
    venues: NightlifeVenue[];
    consumables: NightlifeConsumable[];
    venueConsumable?: VenueConsumable;
    onSubmit: (venueConsumable: Omit<VenueConsumable, "id" | "created_at" | "updated_at" | "venue" | "consumable">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      venue_id: venueConsumable?.venue_id || "",
      consumable_id: venueConsumable?.consumable_id || "",
      venue_price: venueConsumable?.venue_price || 50,
      venue_effects: {
        energy: venueConsumable?.venue_effects?.energy || 0,
        health: venueConsumable?.venue_effects?.health || 0,
        addiction: venueConsumable?.venue_effects?.addiction || 0,
        reputation: venueConsumable?.venue_effects?.reputation || 0,
      },
      available: venueConsumable?.available ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.venue_id || !formData.consumable_id) {
        toast.error("Please select both venue and consumable");
        return;
      }
      onSubmit(formData);
    };

    const selectedConsumable = consumables.find(c => c.id === formData.consumable_id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              {venueConsumable ? "Edit" : "Add"} Venue Pricing
            </h3>
            <p className="text-gray-600 mt-1">
              Set venue-specific pricing and effects for consumables
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                <select
                  value={formData.venue_id}
                  onChange={(e) => setFormData({...formData, venue_id: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select a venue</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} ({venue.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consumable</label>
                <select
                  value={formData.consumable_id}
                  onChange={(e) => setFormData({...formData, consumable_id: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Select a consumable</option>
                  {consumables.map((consumable) => (
                    <option key={consumable.id} value={consumable.id}>
                      {consumable.name} (${consumable.price} - {consumable.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Price
                  {selectedConsumable && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Base: ${selectedConsumable.price})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  value={formData.venue_price}
                  onChange={(e) => setFormData({...formData, venue_price: parseFloat(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available</label>
                <label className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({...formData, available: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Available for purchase</span>
                </label>
              </div>

              <div className="col-span-2">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Venue-Specific Effects</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Energy</label>
                    <input
                      type="number"
                      value={formData.venue_effects.energy}
                      onChange={(e) => setFormData({
                        ...formData, 
                        venue_effects: {...formData.venue_effects, energy: parseInt(e.target.value) || 0}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Health</label>
                    <input
                      type="number"
                      value={formData.venue_effects.health}
                      onChange={(e) => setFormData({
                        ...formData, 
                        venue_effects: {...formData.venue_effects, health: parseInt(e.target.value) || 0}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Addiction</label>
                    <input
                      type="number"
                      value={formData.venue_effects.addiction}
                      onChange={(e) => setFormData({
                        ...formData, 
                        venue_effects: {...formData.venue_effects, addiction: parseInt(e.target.value) || 0}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reputation</label>
                    <input
                      type="number"
                      value={formData.venue_effects.reputation}
                      onChange={(e) => setFormData({
                        ...formData, 
                        venue_effects: {...formData.venue_effects, reputation: parseInt(e.target.value) || 0}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
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
                {venueConsumable ? "Update" : "Add"} Venue Pricing
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
              <p className="text-gray-600 font-medium">Consumables</p>
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
          <p className="text-gray-600">Manage venues and their consumables</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add {activeTab === "venues" ? "Venue" : activeTab === "consumables" ? "Consumable" : activeTab === "venue-consumables" ? "Venue Pricing" : "Item"}
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
            onClick={() => setActiveTab("consumables")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "consumables"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Consumables ({nightlifeConsumables.length})
          </button>
          <button
            onClick={() => setActiveTab("venue-consumables")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "venue-consumables"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Venue Pricing
          </button>
          <button
            onClick={() => setActiveTab("grouped")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "grouped"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Grouped View
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
                  <th className="text-left p-4 font-medium text-gray-900">Image</th>
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
                      {venue.image_url ? (
                        <img
                          src={venue.image_url}
                          alt={venue.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Image size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
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
          ) : activeTab === "consumables" ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Image</th>
                  <th className="text-left p-4 font-medium text-gray-900">Name</th>
                  <th className="text-left p-4 font-medium text-gray-900">Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Description</th>
                  <th className="text-left p-4 font-medium text-gray-900">Price</th>
                  <th className="text-left p-4 font-medium text-gray-900">Effects</th>
                  <th className="text-right p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredConsumables.map((consumable) => (
                  <tr key={consumable.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      {consumable.image_url ? (
                        <img
                          src={consumable.image_url}
                          alt={consumable.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Image size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{consumable.name}</div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        consumable.type === 'brothel' 
                          ? 'bg-pink-100 text-pink-800 border-pink-200'
                          : consumable.type === 'drink'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}>
                        {consumable.type === 'brothel' ? 'Brothel' : 
                         consumable.type === 'drink' ? 'Drink' : 'Drug'}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-sm text-gray-500">{consumable.description}</div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-500" />
                        <span className="font-medium">${consumable.price}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {consumable.effects?.energy && (
                          <span className={`px-2 py-1 text-xs rounded ${
                            consumable.effects.energy > 0 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {consumable.effects.energy > 0 ? '+' : ''}{consumable.effects.energy} Energy
                          </span>
                        )}
                        {consumable.effects?.health && (
                          <span className={`px-2 py-1 text-xs rounded ${
                            consumable.effects.health > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {consumable.effects.health > 0 ? '+' : ''}{consumable.effects.health} Health
                          </span>
                        )}
                        {consumable.effects?.reputation && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            +{consumable.effects.reputation} Reputation
                          </span>
                        )}
                        {consumable.effects?.addiction && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            +{consumable.effects.addiction} Addiction
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingConsumable(consumable)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteConsumable(consumable.id)}
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
          ) : activeTab === "venue-consumables" ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Venue</th>
                  <th className="text-left p-4 font-medium text-gray-900">Consumable</th>
                  <th className="text-left p-4 font-medium text-gray-900">Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Base Price</th>
                  <th className="text-left p-4 font-medium text-gray-900">Venue Price</th>
                  <th className="text-left p-4 font-medium text-gray-900">Venue Effects</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-right p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {venueConsumables.map((vc) => (
                  <tr key={vc.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{vc.venue?.name || 'Unknown Venue'}</div>
                      <div className="text-sm text-gray-500">{vc.venue?.type}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{vc.consumable?.name || 'Unknown Consumable'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        vc.consumable?.type === 'brothel' 
                          ? 'bg-pink-100 text-pink-800 border-pink-200'
                          : vc.consumable?.type === 'drink'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}>
                        {vc.consumable?.type === 'brothel' ? 'Brothel' : 
                         vc.consumable?.type === 'drink' ? 'Drink' : 'Drug'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-gray-400" />
                        <span className="text-gray-600">${vc.consumable?.price || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-500" />
                        <span className="font-medium">${vc.venue_price}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {vc.venue_effects?.energy && (
                          <span className={`px-2 py-1 text-xs rounded ${
                            vc.venue_effects.energy > 0 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vc.venue_effects.energy > 0 ? '+' : ''}{vc.venue_effects.energy} Energy
                          </span>
                        )}
                        {vc.venue_effects?.health && (
                          <span className={`px-2 py-1 text-xs rounded ${
                            vc.venue_effects.health > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vc.venue_effects.health > 0 ? '+' : ''}{vc.venue_effects.health} Health
                          </span>
                        )}
                        {vc.venue_effects?.reputation && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            +{vc.venue_effects.reputation} Reputation
                          </span>
                        )}
                        {vc.venue_effects?.addiction && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            +{vc.venue_effects.addiction} Addiction
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vc.available
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {vc.available ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingVenueConsumable(vc)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteVenueConsumable(vc.id)}
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
          ) : activeTab === "grouped" ? (
            <div className="space-y-6">
              {/* Expand/Collapse Controls */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <h3 className="font-medium text-gray-900">Venue Overview</h3>
                  <span className="text-sm text-gray-500">
                    {venues.length} venues, {expandedVenues.size} expanded
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAllVenues}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  >
                    <Eye size={14} />
                    Expand All
                  </button>
                  <button
                    onClick={collapseAllVenues}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  >
                    <EyeOff size={14} />
                    Collapse All
                  </button>
                </div>
              </div>
              {venues.map((venue) => {
                const venueConsumablesForVenue = venueConsumables.filter(vc => vc.venue_id === venue.id);
                return (
                  <div key={venue.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Venue Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {venue.image_url ? (
                            <img
                              src={venue.image_url}
                              alt={venue.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{venue.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(venue.type)}`}>
                              {venue.type.charAt(0).toUpperCase() + venue.type.slice(1)}
                            </span>
                            <button
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                venue.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {venue.isActive ? "Active" : "Inactive"}
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{venue.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} className="text-green-500" />
                              <span className="font-medium">${venue.price} entry</span>
                            </div>
                            <div className="flex gap-2">
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
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleVenueExpanded(venue.id)}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                          >
                            {expandedVenues.has(venue.id) ? (
                              <>
                                <ChevronUp size={16} />
                                Hide Items ({venueConsumablesForVenue.length})
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                Show Items ({venueConsumablesForVenue.length})
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setEditingVenue(venue)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Venue Consumables */}
                    {expandedVenues.has(venue.id) && (
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">
                            Available Consumables ({venueConsumablesForVenue.length})
                          </h4>
                          <button
                            onClick={() => {
                              setActiveTab("venue-consumables");
                              setSearchTerm(venue.name);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Manage Pricing
                          </button>
                        </div>
                      
                      {venueConsumablesForVenue.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No consumables configured for this venue</p>
                          <button
                            onClick={() => {
                              setActiveTab("venue-consumables");
                              setShowAddModal(true);
                            }}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Add Consumables
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {venueConsumablesForVenue.map((vc) => (
                            <div key={vc.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                              <div className="flex items-start gap-3">
                                <img
                                  src={vc.consumable?.image_url}
                                  alt={vc.consumable?.name}
                                  className="w-12 h-12 rounded object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-medium text-gray-900 truncate">
                                      {vc.consumable?.name}
                                    </h5>
                                    <button
                                      onClick={() => setEditingVenueConsumable(vc)}
                                      className="p-1 text-gray-400 hover:text-blue-600"
                                    >
                                      <Edit size={12} />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                      vc.consumable?.type === 'brothel' 
                                        ? 'bg-pink-100 text-pink-800 border-pink-200'
                                        : vc.consumable?.type === 'drink'
                                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                                        : 'bg-purple-100 text-purple-800 border-purple-200'
                                    }`}>
                                      {vc.consumable?.type === 'brothel' ? 'Service' : 
                                       vc.consumable?.type === 'drink' ? 'Drink' : 'Drug'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <DollarSign size={12} className="text-green-500" />
                                        <span className="font-medium text-green-600">${vc.venue_price}</span>
                                      </div>
                                      {vc.venue_price !== vc.consumable?.price && (
                                        <div className="flex items-center gap-1">
                                          <DollarSign size={10} className="text-gray-400" />
                                          <span className="text-gray-400 line-through text-xs">${vc.consumable?.price}</span>
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        vc.available
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {vc.available ? "Available" : "Unavailable"}
                                    </button>
                                  </div>
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {vc.venue_effects?.energy && (
                                      <span className={`px-1 py-0.5 text-xs rounded ${
                                        vc.venue_effects.energy > 0 
                                          ? 'bg-blue-100 text-blue-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {vc.venue_effects.energy > 0 ? '+' : ''}{vc.venue_effects.energy} Energy
                                      </span>
                                    )}
                                    {vc.venue_effects?.health && (
                                      <span className={`px-1 py-0.5 text-xs rounded ${
                                        vc.venue_effects.health > 0 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {vc.venue_effects.health > 0 ? '+' : ''}{vc.venue_effects.health} Health
                                      </span>
                                    )}
                                    {vc.venue_effects?.reputation && (
                                      <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                                        +{vc.venue_effects.reputation} Rep
                                      </span>
                                    )}
                                    {vc.venue_effects?.addiction && (
                                      <span className="px-1 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                                        +{vc.venue_effects.addiction}% Addiction
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                        </div>
                    )}
                  </div>
                );
              })}
              
              {venues.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-4">No venues found</p>
                  <button
                    onClick={() => {
                      setActiveTab("venues");
                      setShowAddModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Your First Venue
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && activeTab === "venues" && (
        <VenueForm
          onSubmit={addVenue}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {showAddModal && activeTab === "consumables" && (
        <ConsumableForm
          onSubmit={addConsumable}
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

      {editingConsumable && (
        <ConsumableForm
          consumable={editingConsumable}
          onSubmit={(updatedConsumable) => updateConsumable(editingConsumable.id, updatedConsumable)}
          onCancel={() => setEditingConsumable(null)}
        />
      )}

      {showAddModal && activeTab === "venue-consumables" && (
        <VenueConsumableForm
          venues={venues}
          consumables={nightlifeConsumables}
          onSubmit={addVenueConsumable}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingVenueConsumable && (
        <VenueConsumableForm
          venues={venues}
          consumables={nightlifeConsumables}
          venueConsumable={editingVenueConsumable}
          onSubmit={(updatedVC) => updateVenueConsumable(editingVenueConsumable.id, updatedVC)}
          onCancel={() => setEditingVenueConsumable(null)}
        />
      )}
    </div>
  );
};

export default NightlifeManagement;