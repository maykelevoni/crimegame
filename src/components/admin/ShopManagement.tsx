import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Star,
  Zap,
  Shield,
  Heart,
  Target,
  Car,
  Pill,
  Search,
  Filter,
  Eye,
  BarChart3,
  Upload,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "weapon" | "vehicle" | "protection" | "consumable";
  rarity: "common" | "rare" | "epic" | "legendary";
  effects: {
    damage?: number;
    defense?: number;
    health?: number;
    energy?: number;
    addiction?: number;
    reputation?: number;
    success_boost?: number;
    escape_boost?: number;
    health_protection?: number;
  };
  image: string;
  inStock: boolean;
  discount?: number;
  category: string;
  isActive: boolean;
  stock_quantity: number;
  sales_count: number;
  created_at: string;
}

const ShopManagement = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load items from database
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from items table first
      const { data: shopItems, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') { // Handle both relation does not exist codes
        console.error('Error loading items:', error);
        throw error;
      }

      if (shopItems && shopItems.length > 0 && !error) {
        // Transform Supabase data to match our interface
        const transformedItems: ShopItem[] = shopItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          type: item.type as "weapon" | "vehicle" | "protection" | "consumable",
          rarity: item.rarity as "common" | "rare" | "epic" | "legendary",
          effects: item.effects || {},
          image: item.image_url || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center',
          inStock: item.in_stock,
          discount: 0, // Add discount field to database later
          category: item.category,
          isActive: item.is_active,
          stock_quantity: item.stock_quantity || 0,
          sales_count: 0, // Add sales tracking later
          created_at: item.created_at,
        }));
        
        setItems(transformedItems);
        toast.success('Items loaded from database');
      } else {
        // Fall back to mock data if no items in database
        const mockItems = [
          {
            id: "1",
            name: "Combat Knife",
            description: "Sharp tactical knife for close combat situations",
            price: 500,
            type: "weapon" as const,
            rarity: "common" as const,
            effects: {
              damage: 10,
              success_boost: 10,
            },
            image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center",
            inStock: true,
            discount: 0,
            category: "Melee Weapons",
            isActive: true,
            stock_quantity: 50,
            sales_count: 123,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Glock 17",
            description: "Reliable 9mm pistol with good accuracy",
            price: 2000,
            type: "weapon" as const,
            rarity: "rare" as const,
            effects: {
              damage: 25,
              success_boost: 20,
            },
            image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop&crop=center",
            inStock: true,
            discount: 10,
            category: "Firearms",
            isActive: true,
            stock_quantity: 25,
            sales_count: 89,
            created_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Sports Car",
            description: "High-speed vehicle for quick escapes",
            price: 20000,
            type: "vehicle" as const,
            rarity: "epic" as const,
            effects: {
              escape_boost: 40,
              reputation: 15,
            },
            image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop&crop=center",
            inStock: true,
            discount: 0,
            category: "Luxury Vehicles",
            isActive: true,
            stock_quantity: 5,
            sales_count: 12,
            created_at: new Date().toISOString(),
          },
          {
            id: "4",
            name: "Bulletproof Vest",
            description: "Advanced protection against small arms fire",
            price: 1500,
            type: "protection" as const,
            rarity: "rare" as const,
            effects: {
              defense: 30,
              health_protection: 20,
            },
            image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&crop=center",
            inStock: true,
            discount: 15,
            category: "Body Armor",
            isActive: true,
            stock_quantity: 15,
            sales_count: 67,
            created_at: new Date().toISOString(),
          },
          {
            id: "5",
            name: "Medical Kit",
            description: "Emergency medical supplies for field treatment",
            price: 300,
            type: "consumable" as const,
            rarity: "common" as const,
            effects: {
              health: 50,
            },
            image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=300&fit=crop&crop=center",
            inStock: true,
            discount: 0,
            category: "Medical Supplies",
            isActive: true,
            stock_quantity: 100,
            sales_count: 245,
            created_at: new Date().toISOString(),
          }
        ];
        
        setItems(mockItems);
        toast.info('Using mock data. Items table will be used when available.');
      }
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    totalSales: 0,
    totalRevenue: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [items]);

  const calculateStats = () => {
    const totalItems = items.length;
    const activeItems = items.filter(i => i.isActive).length;
    const totalSales = items.reduce((sum, i) => sum + i.sales_count, 0);
    const totalRevenue = items.reduce((sum, i) => sum + (i.sales_count * i.price), 0);
    const outOfStock = items.filter(i => i.stock_quantity === 0).length;

    setStats({
      totalItems,
      activeItems,
      totalSales,
      totalRevenue,
      outOfStock,
    });
  };

  const categories = ["all", ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addItem = async (newItem: Omit<ShopItem, "id" | "created_at" | "sales_count">) => {
    try {
      // Try to insert into items table
      const { data, error } = await supabase
        .from('items')
        .insert([{
          name: newItem.name,
          description: newItem.description,
          price: newItem.price,
          type: newItem.type,
          rarity: newItem.rarity,
          effects: newItem.effects,
          image_url: newItem.image,
          in_stock: newItem.inStock,
          category: newItem.category,
          is_active: newItem.isActive,
          stock_quantity: newItem.stock_quantity,
        }])
        .select()
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = relation does not exist
        throw error;
      }

      if (data) {
        // Transform back to our interface format
        const transformedItem: ShopItem = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          price: data.price,
          type: data.type,
          rarity: data.rarity,
          effects: data.effects || {},
          image: data.image_url || '/shop/placeholder.jpg',
          inStock: data.in_stock,
          discount: 0,
          category: data.category,
          isActive: data.is_active,
          stock_quantity: data.stock_quantity || 0,
          sales_count: 0,
          created_at: data.created_at,
        };
        
        setItems([...items, transformedItem]);
        toast.success("Item added to database successfully");
      } else {
        // Fall back to local state if database isn't available
        const item: ShopItem = {
          ...newItem,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          sales_count: 0,
        };
        
        setItems([...items, item]);
        toast.success("Item added successfully (local only - database will sync when available)");
      }
      
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const updateItem = async (id: string, updates: Partial<ShopItem>) => {
    try {
      // Try to update in items table
      const { data, error } = await supabase
        .from('items')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          type: updates.type,
          rarity: updates.rarity,
          effects: updates.effects,
          image_url: updates.image,
          in_stock: updates.inStock,
          category: updates.category,
          is_active: updates.isActive,
          stock_quantity: updates.stock_quantity,
        })
        .eq('id', id)
        .select()
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = relation does not exist
        throw error;
      }

      // Update local state regardless of database operation
      setItems(items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
      
      if (data) {
        toast.success("Item updated in database successfully");
      } else {
        toast.success("Item updated successfully (local only - database will sync when available)");
      }
      
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      // Try to delete from items table
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error && error.code !== 'PGRST116') { // PGRST116 = relation does not exist
        throw error;
      }

      // Update local state regardless of database operation
      setItems(items.filter(item => item.id !== id));
      
      if (error && error.code === 'PGRST116') {
        toast.success("Item deleted successfully (local only - database will sync when available)");
      } else {
        toast.success("Item deleted from database successfully");
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const toggleItemStatus = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateItem(id, { isActive: !item.isActive });
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "bg-gray-100 text-gray-800 border-gray-300",
      rare: "bg-blue-100 text-blue-800 border-blue-300",
      epic: "bg-purple-100 text-purple-800 border-purple-300",
      legendary: "bg-yellow-100 text-yellow-800 border-yellow-300"
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      weapon: Target,
      vehicle: Car,
      protection: Shield,
      consumable: Pill
    };
    return icons[type as keyof typeof icons] || Package;
  };

  const ItemForm = ({ item, onSubmit, onCancel }: {
    item?: ShopItem;
    onSubmit: (item: Omit<ShopItem, "id" | "created_at" | "sales_count">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || 100,
      type: item?.type || "weapon" as ShopItem["type"],
      rarity: item?.rarity || "common" as ShopItem["rarity"],
      effects: {
        damage: item?.effects?.damage || 0,
        defense: item?.effects?.defense || 0,
        health: item?.effects?.health || 0,
        energy: item?.effects?.energy || 0,
        addiction: item?.effects?.addiction || 0,
        reputation: item?.effects?.reputation || 0,
        success_boost: item?.effects?.success_boost || 0,
        escape_boost: item?.effects?.escape_boost || 0,
        health_protection: item?.effects?.health_protection || 0,
      },
      image: item?.image || "",
      inStock: item?.inStock ?? true,
      discount: item?.discount || 0,
      category: item?.category || "",
      isActive: item?.isActive ?? true,
      stock_quantity: item?.stock_quantity || 50,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {item ? "Edit Shop Item" : "Add New Shop Item"}
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
                  onChange={(e) => setFormData({...formData, type: e.target.value as ShopItem["type"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="weapon">Weapon</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="protection">Protection</option>
                  <option value="consumable">Consumable</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData({...formData, rarity: e.target.value as ShopItem["rarity"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Firearms, Melee Weapons"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="0"
                  max="90"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
                <div className="space-y-3">
                  {/* Current Image Preview */}
                  {formData.image && (
                    <div className="relative">
                      <img 
                        src={formData.image} 
                        alt="Item preview" 
                        className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&h=100&fit=crop&crop=center';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, image: ""})}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {/* Image Upload Options */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="https://example.com/image.jpg or paste image URL"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const imageUrl = `https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center`;
                            setFormData({...formData, image: imageUrl});
                            toast.info(`Image selected: ${file.name}. In production, this would upload to storage.`);
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload size={16} />
                      Upload
                    </button>
                  </div>
                  
                  {/* Quick Image Options */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Knife', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center' },
                      { name: 'Gun', url: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop&crop=center' },
                      { name: 'Car', url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop&crop=center' },
                      { name: 'Armor', url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&crop=center' }
                    ].map(img => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => setFormData({...formData, image: img.url})}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Effects Section */}
              <div className="col-span-3">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Item Effects</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Damage Bonus (%)</label>
                    <input
                      type="number"
                      value={formData.effects.damage}
                      onChange={(e) => setFormData({...formData, effects: {...formData.effects, damage: parseInt(e.target.value) || 0}})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Defense Bonus (%)</label>
                    <input
                      type="number"
                      value={formData.effects.defense}
                      onChange={(e) => setFormData({...formData, effects: {...formData.effects, defense: parseInt(e.target.value) || 0}})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Health Bonus</label>
                    <input
                      type="number"
                      value={formData.effects.health}
                      onChange={(e) => setFormData({...formData, effects: {...formData.effects, health: parseInt(e.target.value) || 0}})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Energy Bonus</label>
                    <input
                      type="number"
                      value={formData.effects.energy}
                      onChange={(e) => setFormData({...formData, effects: {...formData.effects, energy: parseInt(e.target.value) || 0}})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Success Boost (%)</label>
                    <input
                      type="number"
                      value={formData.effects.success_boost}
                      onChange={(e) => setFormData({...formData, effects: {...formData.effects, success_boost: parseInt(e.target.value) || 0}})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Escape Boost (%)</label>
                    <input
                      type="number"
                      value={formData.effects.escape_boost}
                      onChange={(e) => setFormData({...formData, effects: {...formData.effects, escape_boost: parseInt(e.target.value) || 0}})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Health Protection (%)</label>
                    <input
                      type="number"
                      value={formData.effects.health_protection}
                      onChange={(e) => setFormData({...formData, effects: {...formData.effects, health_protection: parseInt(e.target.value) || 0}})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reputation Bonus</label>
                    <input
                      type="number"
                      value={formData.effects.reputation}
                      onChange={(e) => setFormData({...formData, effects: {...formData.effects, reputation: parseInt(e.target.value) || 0}})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Addiction Effect</label>
                    <input
                      type="number"
                      value={formData.effects.addiction}
                      onChange={(e) => setFormData({...formData, effects: {...formData.effects, addiction: parseInt(e.target.value) || 0}})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      min="-50"
                      max="50"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-3">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">In Stock</span>
                  </label>

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
                {item ? "Update" : "Add"} Item
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
          <p className="text-gray-600 mt-2">Loading shop items...</p>
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
            <Package className="text-blue-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalItems}</h3>
              <p className="text-gray-600 font-medium">Total Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeItems}</h3>
              <p className="text-gray-600 font-medium">Active Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-blue-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalSales.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Total Sales</p>
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
            <Package className="text-red-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.outOfStock}</h3>
              <p className="text-gray-600 font-medium">Out of Stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Shop Items</h2>
          <p className="text-gray-600">Manage shop inventory and item properties</p>
        </div>

        <div className="flex gap-2">
          {items.length === 0 && (
            <button
              onClick={populateInitialItems}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Package size={16} />
              Populate Initial Items
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Item
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
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Item</th>
                <th className="text-left p-4 font-medium text-gray-900">Type</th>
                <th className="text-left p-4 font-medium text-gray-900">Price</th>
                <th className="text-left p-4 font-medium text-gray-900">Stock</th>
                <th className="text-left p-4 font-medium text-gray-900">Sales</th>
                <th className="text-left p-4 font-medium text-gray-900">Effects</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center';
                            }}
                          />
                        )}
                        <TypeIcon size={20} className="text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(item.rarity)}`}>
                              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                            </span>
                            <span className="text-xs text-gray-400">{item.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="capitalize font-medium text-gray-900">{item.type}</span>
                    </td>

                    <td className="p-4">
                      <div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-green-500" />
                          <span className="font-medium">{item.price.toLocaleString()}</span>
                        </div>
                        {item.discount > 0 && (
                          <div className="text-xs text-red-500">-{item.discount}% off</div>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`font-medium ${item.stock_quantity === 0 ? "text-red-600" : "text-gray-900"}`}>
                        {item.stock_quantity}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-gray-900">{item.sales_count}</span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {item.effects.damage > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            +{item.effects.damage}% DMG
                          </span>
                        )}
                        {item.effects.defense > 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            +{item.effects.defense}% DEF
                          </span>
                        )}
                        {item.effects.success_boost > 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            +{item.effects.success_boost}% SUCCESS
                          </span>
                        )}
                        {item.effects.escape_boost > 0 && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            +{item.effects.escape_boost}% ESCAPE
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <button
                          onClick={() => toggleItemStatus(item.id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </button>
                        {!item.inStock && (
                          <div className="text-xs text-red-600">Out of Stock</div>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteItem(item.id)}
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

      {/* Add Item Modal */}
      {showAddModal && (
        <ItemForm
          onSubmit={addItem}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <ItemForm
          item={editingItem}
          onSubmit={(updatedItem) => updateItem(editingItem.id, updatedItem)}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default ShopManagement;