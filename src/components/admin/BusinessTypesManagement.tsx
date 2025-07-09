import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Package,
  Shield,
  Star,
  Users,
  Settings,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface BusinessType {
  id: string;
  name: string;
  description: string;
  category: "legal" | "semi-legal" | "illegal";
  icon: string;
  image: string;
  color: string;
  isActive: boolean;
  basePrice: number;
  baseIncome: number;
  riskLevel: number;
  maxLevel: number;
  created_at: string;
}

const BusinessTypesManagement = () => {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingType, setEditingType] = useState<BusinessType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [stats, setStats] = useState({
    totalTypes: 0,
    activeTypes: 0,
    legalTypes: 0,
    illegalTypes: 0,
    averageRisk: 0,
  });

  useEffect(() => {
    loadBusinessTypes();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [businessTypes]);

  const loadBusinessTypes = async () => {
    try {
      setLoading(true);
      
      // Mock data for business types
      const mockBusinessTypes: BusinessType[] = [
        {
          id: "1",
          name: "Restaurant",
          description: "Food service business with steady income",
          category: "legal",
          icon: "🍴",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&crop=center",
          color: "#10B981",
          isActive: true,
          basePrice: 50000,
          baseIncome: 5000,
          riskLevel: 1,
          maxLevel: 10,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Nightclub",
          description: "Entertainment venue with high income potential",
          category: "semi-legal",
          icon: "🍾",
          image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=800&h=600&fit=crop&crop=center",
          color: "#8B5CF6",
          isActive: true,
          basePrice: 150000,
          baseIncome: 15000,
          riskLevel: 3,
          maxLevel: 15,
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Convenience Store",
          description: "24/7 retail with steady customer flow",
          category: "legal",
          icon: "🏪",
          image: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800&h=600&fit=crop&crop=center",
          color: "#3B82F6",
          isActive: true,
          basePrice: 75000,
          baseIncome: 7500,
          riskLevel: 1,
          maxLevel: 8,
          created_at: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Weapon Factory",
          description: "High-risk illegal weapons manufacturing",
          category: "illegal",
          icon: "🔫",
          image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop&crop=center",
          color: "#EF4444",
          isActive: true,
          basePrice: 500000,
          baseIncome: 50000,
          riskLevel: 9,
          maxLevel: 20,
          created_at: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Casino",
          description: "Luxury gambling establishment",
          category: "semi-legal",
          icon: "🎰",
          image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=600&fit=crop&crop=center",
          color: "#F59E0B",
          isActive: true,
          basePrice: 1000000,
          baseIncome: 100000,
          riskLevel: 5,
          maxLevel: 25,
          created_at: new Date().toISOString(),
        },
      ];
      
      setBusinessTypes(mockBusinessTypes);
      toast.success('Business types loaded successfully');
    } catch (error) {
      console.error('Error loading business types:', error);
      toast.error('Failed to load business types');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalTypes = businessTypes.length;
    const activeTypes = businessTypes.filter(t => t.isActive).length;
    const legalTypes = businessTypes.filter(t => t.category === "legal").length;
    const illegalTypes = businessTypes.filter(t => t.category === "illegal").length;
    const averageRisk = businessTypes.reduce((sum, t) => sum + t.riskLevel, 0) / totalTypes;

    setStats({
      totalTypes,
      activeTypes,
      legalTypes,
      illegalTypes,
      averageRisk: averageRisk || 0,
    });
  };

  const categories = ["all", "legal", "semi-legal", "illegal"];

  const filteredTypes = businessTypes.filter(type => {
    const matchesCategory = selectedCategory === "all" || type.category === selectedCategory;
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addBusinessType = (newType: Omit<BusinessType, "id" | "created_at">) => {
    const type: BusinessType = {
      ...newType,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    
    setBusinessTypes([...businessTypes, type]);
    setShowAddModal(false);
    toast.success("Business type added successfully");
  };

  const updateBusinessType = (id: string, updates: Partial<BusinessType>) => {
    setBusinessTypes(businessTypes.map(type => 
      type.id === id ? { ...type, ...updates } : type
    ));
    setEditingType(null);
    toast.success("Business type updated successfully");
  };

  const deleteBusinessType = (id: string) => {
    if (!confirm("Are you sure you want to delete this business type? This will affect all existing businesses of this type.")) return;
    
    setBusinessTypes(businessTypes.filter(type => type.id !== id));
    toast.success("Business type deleted successfully");
  };

  const toggleTypeStatus = (id: string) => {
    const type = businessTypes.find(t => t.id === id);
    if (type) {
      updateBusinessType(id, { isActive: !type.isActive });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "legal": return "text-green-600 bg-green-100";
      case "semi-legal": return "text-yellow-600 bg-yellow-100";
      case "illegal": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 8) return "text-red-600 bg-red-100";
    if (riskLevel >= 6) return "text-orange-600 bg-orange-100";
    if (riskLevel >= 4) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const BusinessTypeForm = ({ type, onSubmit, onCancel }: {
    type?: BusinessType;
    onSubmit: (type: Omit<BusinessType, "id" | "created_at">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: type?.name || "",
      description: type?.description || "",
      category: type?.category || "legal" as BusinessType["category"],
      icon: type?.icon || "🏢",
      image: type?.image || "",
      color: type?.color || "#3B82F6",
      isActive: type?.isActive ?? true,
      basePrice: type?.basePrice || 50000,
      baseIncome: type?.baseIncome || 5000,
      riskLevel: type?.riskLevel || 1,
      maxLevel: type?.maxLevel || 10,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {type ? "Edit Business Type" : "Add New Business Type"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as BusinessType["category"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="legal">Legal</option>
                  <option value="semi-legal">Semi-Legal</option>
                  <option value="illegal">Illegal</option>
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="🏢"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full h-12 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Price ($)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: parseInt(e.target.value)})}
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
                  max="50"
                  required
                />
              </div>

              <div className="col-span-2">
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
                {type ? "Update" : "Add"} Business Type
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
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalTypes}</h3>
              <p className="text-gray-600 font-medium">Total Types</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeTypes}</h3>
              <p className="text-gray-600 font-medium">Active Types</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Shield className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.legalTypes}</h3>
              <p className="text-gray-600 font-medium">Legal Types</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.illegalTypes}</h3>
              <p className="text-gray-600 font-medium">Illegal Types</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-orange-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.averageRisk.toFixed(1)}</h3>
              <p className="text-gray-600 font-medium">Avg Risk Level</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Business Types</h2>
          <p className="text-gray-600">Manage business categories and their properties</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Business Type
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search business types..."
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
                  {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Business Types Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Image</th>
                <th className="text-left p-4 font-medium text-gray-900">Type</th>
                <th className="text-left p-4 font-medium text-gray-900">Category</th>
                <th className="text-left p-4 font-medium text-gray-900">Base Price</th>
                <th className="text-left p-4 font-medium text-gray-900">Base Income</th>
                <th className="text-left p-4 font-medium text-gray-900">Risk Level</th>
                <th className="text-left p-4 font-medium text-gray-900">Max Level</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={type.image}
                      alt={type.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center";
                      }}
                    />
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                        style={{ backgroundColor: type.color }}
                      >
                        {type.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{type.name}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(type.category)}`}>
                      {type.category.charAt(0).toUpperCase() + type.category.slice(1)}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="text-green-500" />
                      <span className="font-medium">{type.basePrice.toLocaleString()}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} className="text-blue-500" />
                      <span className="font-medium">${type.baseIncome.toLocaleString()}/h</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(type.riskLevel)}`}>
                      Level {type.riskLevel}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-medium text-gray-900">{type.maxLevel}</span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleTypeStatus(type.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        type.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {type.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingType(type)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteBusinessType(type.id)}
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
        </div>
      </div>

      {/* Add Business Type Modal */}
      {showAddModal && (
        <BusinessTypeForm
          onSubmit={addBusinessType}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Business Type Modal */}
      {editingType && (
        <BusinessTypeForm
          type={editingType}
          onSubmit={(updatedType) => updateBusinessType(editingType.id, updatedType)}
          onCancel={() => setEditingType(null)}
        />
      )}
    </div>
  );
};

export default BusinessTypesManagement;