import React, { useState, useEffect } from "react";
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Pill,
  Scissors,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Treatment {
  id: string;
  name: string;
  description: string;
  type: "health" | "energy" | "addiction" | "plastic_surgery";
  cost: number;
  health_restore: number;
  energy_restore: number;
  addiction_reduction: number;
  wanted_level_reduction: number;
  duration_minutes: number;
  cooldown_minutes: number;
  min_level: number;
  available: boolean;
  created_at: string;
}

const HospitalManagement = () => {
  const queryClient = useQueryClient();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "health" as Treatment["type"],
    cost: 0,
    health_restore: 0,
    energy_restore: 0,
    addiction_reduction: 0,
    wanted_level_reduction: 0,
    duration_minutes: 0,
    cooldown_minutes: 60,
    min_level: 1,
    available: true,
  });

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading treatments:', error);
        toast.error('Failed to load treatments');
        return;
      }

      if (data) {
        setTreatments(data);
        toast.success(`Loaded ${data.length} treatments`);
      }
    } catch (error) {
      console.error('Error loading treatments:', error);
      toast.error('Failed to load treatments');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "health",
      cost: 0,
      health_restore: 0,
      energy_restore: 0,
      addiction_reduction: 0,
      wanted_level_reduction: 0,
      duration_minutes: 0,
      cooldown_minutes: 60,
      min_level: 1,
      available: true,
    });
    setEditingTreatment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all numeric fields are actually numbers
    const dataToSave = {
      ...formData,
      cost: Number(formData.cost),
      health_restore: Number(formData.health_restore),
      energy_restore: Number(formData.energy_restore),
      addiction_reduction: Number(formData.addiction_reduction),
      wanted_level_reduction: Number(formData.wanted_level_reduction),
      duration_minutes: Number(formData.duration_minutes),
      cooldown_minutes: Number(formData.cooldown_minutes),
      min_level: Number(formData.min_level),
    };
    
    try {
      if (editingTreatment) {
        const { data, error } = await supabase
          .from('treatments')
          .update(dataToSave)
          .eq('id', editingTreatment.id);

        if (error) throw error;
        toast.success('Treatment updated successfully!');
      } else {
        const { error } = await supabase
          .from('treatments')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Treatment added successfully!');
      }

      // Invalidate React Query cache used by HospitalView
      queryClient.invalidateQueries({ queryKey: ["treatments"] });
      
      setShowAddModal(false);
      resetForm();
      // Small delay to ensure database is updated before refetch
      setTimeout(() => {
        loadTreatments();
      }, 100);
    } catch (error: any) {
      console.error('Error saving treatment:', error);
      toast.error(error.message || 'Failed to save treatment');
    }
  };

  const handleEdit = (treatment: Treatment) => {
    setFormData({
      name: treatment.name,
      description: treatment.description,
      type: treatment.type,
      cost: treatment.cost,
      health_restore: treatment.health_restore,
      energy_restore: treatment.energy_restore,
      addiction_reduction: treatment.addiction_reduction,
      wanted_level_reduction: treatment.wanted_level_reduction,
      duration_minutes: treatment.duration_minutes,
      cooldown_minutes: treatment.cooldown_minutes,
      min_level: treatment.min_level,
      available: treatment.available,
    });
    setEditingTreatment(treatment);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this treatment?')) return;

    try {
      const { error } = await supabase
        .from('treatments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Treatment deleted successfully!');
      
      // Invalidate React Query cache used by HospitalView
      queryClient.invalidateQueries({ queryKey: ["treatments"] });
      
      loadTreatments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete treatment');
    }
  };

  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "health": return <Heart className="text-red-500" size={16} />;
      case "energy": return <Zap className="text-yellow-500" size={16} />;
      case "addiction": return <Pill className="text-cyan-500" size={16} />;
      case "plastic_surgery": return <Scissors className="text-purple-500" size={16} />;
      default: return <Heart className="text-gray-500" size={16} />;
    }
  };

  const getEffectsString = (treatment: Treatment) => {
    const effects = [];
    if (treatment.health_restore > 0) effects.push(`+${treatment.health_restore} Health`);
    if (treatment.energy_restore > 0) effects.push(`+${treatment.energy_restore} Energy`);
    if (treatment.addiction_reduction > 0) effects.push(`-${treatment.addiction_reduction} Addiction`);
    if (treatment.wanted_level_reduction > 0) effects.push(`-${treatment.wanted_level_reduction} Wanted`);
    return effects.join(", ") || "No effects";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Treatment
        </button>
      </div>

      {/* Treatments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Treatment</th>
                <th className="text-left p-4 font-medium text-gray-900">Type</th>
                <th className="text-left p-4 font-medium text-gray-900">Cost</th>
                <th className="text-left p-4 font-medium text-gray-900">Effects</th>
                <th className="text-left p-4 font-medium text-gray-900">Level</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTreatments.map((treatment) => (
                <tr key={treatment.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{treatment.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {treatment.description}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(treatment.type)}
                      <span className="text-sm capitalize">
                        {treatment.type.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="text-green-600" />
                      <span className="font-medium">
                        {treatment.cost.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">
                      {getEffectsString(treatment)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Level {treatment.min_level}+
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      treatment.available 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {treatment.available ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(treatment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(treatment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTreatments.length === 0 && (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No treatments found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new treatment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingTreatment ? "Edit Treatment" : "Add New Treatment"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as Treatment["type"]})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="health">Health</option>
                    <option value="energy">Energy</option>
                    <option value="addiction">Addiction</option>
                    <option value="plastic_surgery">Plastic Surgery</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value) || 0})}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Level</label>
                  <input
                    type="number"
                    value={formData.min_level}
                    onChange={(e) => setFormData({...formData, min_level: parseInt(e.target.value)})}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Health Restore</label>
                  <input
                    type="number"
                    value={formData.health_restore}
                    onChange={(e) => setFormData({...formData, health_restore: parseInt(e.target.value)})}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Energy Restore</label>
                  <input
                    type="number"
                    value={formData.energy_restore}
                    onChange={(e) => setFormData({...formData, energy_restore: parseInt(e.target.value)})}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Addiction Reduction</label>
                  <input
                    type="number"
                    value={formData.addiction_reduction}
                    onChange={(e) => setFormData({...formData, addiction_reduction: parseInt(e.target.value)})}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wanted Level Reduction</label>
                  <input
                    type="number"
                    value={formData.wanted_level_reduction}
                    onChange={(e) => setFormData({...formData, wanted_level_reduction: parseInt(e.target.value)})}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cooldown (min)</label>
                  <input
                    type="number"
                    value={formData.cooldown_minutes}
                    onChange={(e) => setFormData({...formData, cooldown_minutes: parseInt(e.target.value)})}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    min="0"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({...formData, available: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available to players</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTreatment ? "Update" : "Add"} Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalManagement;