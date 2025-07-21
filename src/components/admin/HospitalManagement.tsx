import React, { useState } from "react";
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Clock,
  TrendingUp,
  Activity,
  Pill,
  Siren,
  Scissors,
  Zap,
  AlertCircle,
  X,
} from "lucide-react";
import { useTreatments } from "../../hooks/useTreatments";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "sonner";

interface Treatment {
  id: string;
  name: string;
  description: string;
  type: "health" | "energy" | "addiction" | "wanted_level" | "plastic_surgery";
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
  const { data: treatments = [], isLoading, refetch } = useTreatments();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
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

  // Reset form
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

  // Handle add/edit treatment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTreatment) {
        // Update existing treatment
        const { error } = await supabase
          .from("treatments")
          .update(formData)
          .eq("id", editingTreatment.id);

        if (error) throw error;
        toast.success("Treatment updated successfully!");
      } else {
        // Create new treatment
        const { error } = await supabase
          .from("treatments")
          .insert([formData]);

        if (error) throw error;
        toast.success("Treatment created successfully!");
      }

      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save treatment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete treatment
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from("treatments")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Treatment deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete treatment");
    }
  };

  // Handle edit
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
    setIsModalOpen(true);
  };

  // Filter treatments
  const filteredTreatments = treatments.filter((treatment: Treatment) => {
    const matchesSearch = treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treatment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || treatment.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Statistics
  const stats = {
    total: treatments.length,
    available: treatments.filter((t: Treatment) => t.available).length,
    avgCost: treatments.length > 0 ? Math.round(treatments.reduce((sum: number, t: Treatment) => sum + t.cost, 0) / treatments.length) : 0,
  };

  // Get icon for treatment type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "health": return <Heart className="w-4 h-4 text-red-500" />;
      case "energy": return <Zap className="w-4 h-4 text-yellow-500" />;
      case "addiction": return <Pill className="w-4 h-4 text-cyan-500" />;
      case "wanted_level": return <Siren className="w-4 h-4 text-orange-500" />;
      case "plastic_surgery": return <Scissors className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading treatments...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Management</h1>
          <p className="text-gray-600">Manage medical treatments and procedures</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Treatment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Treatments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Cost</p>
              <p className="text-2xl font-bold text-gray-900">${stats.avgCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search treatments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="health">Health</option>
              <option value="energy">Energy</option>
              <option value="addiction">Addiction</option>
              <option value="wanted_level">Wanted Level</option>
              <option value="plastic_surgery">Plastic Surgery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Treatments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cooldown
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTreatments.map((treatment: Treatment) => (
                <tr key={treatment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{treatment.name}</div>
                      <div className="text-sm text-gray-500">{treatment.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(treatment.type)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{treatment.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${treatment.cost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {treatment.health_restore > 0 && <div>+{treatment.health_restore} Health</div>}
                      {treatment.energy_restore > 0 && <div>+{treatment.energy_restore} Energy</div>}
                      {treatment.addiction_reduction > 0 && <div>-{treatment.addiction_reduction} Addiction</div>}
                      {treatment.wanted_level_reduction > 0 && <div>-{treatment.wanted_level_reduction} Wanted</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {treatment.cooldown_minutes} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      treatment.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {treatment.available ? "Available" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(treatment)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(treatment.id, treatment.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTreatments.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No treatments found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTreatment ? "Edit Treatment" : "Add New Treatment"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Treatment["type"] })}
                  >
                    <option value="health">Health</option>
                    <option value="energy">Energy</option>
                    <option value="addiction">Addiction</option>
                    <option value="wanted_level">Wanted Level</option>
                    <option value="plastic_surgery">Plastic Surgery</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.min_level}
                    onChange={(e) => setFormData({ ...formData, min_level: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Health Restore
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.health_restore}
                    onChange={(e) => setFormData({ ...formData, health_restore: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Energy Restore
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.energy_restore}
                    onChange={(e) => setFormData({ ...formData, energy_restore: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Addiction Reduction
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.addiction_reduction}
                    onChange={(e) => setFormData({ ...formData, addiction_reduction: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wanted Level Reduction
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.wanted_level_reduction}
                    onChange={(e) => setFormData({ ...formData, wanted_level_reduction: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cooldown (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.cooldown_minutes}
                    onChange={(e) => setFormData({ ...formData, cooldown_minutes: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Available to players</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingTreatment ? "Update" : "Create"}
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