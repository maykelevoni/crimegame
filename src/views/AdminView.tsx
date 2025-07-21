import React, { useState } from "react";
import {
  Users,
  ShoppingCart,
  Building2,
  Gamepad2,
  Wine,
  Target,
  BarChart3,
  Settings,
  Database,
  Shield,
  Plus,
  Edit,
  Trash2,
  Heart,
  Search,
  Download,
  Upload,
  Gift,
} from "lucide-react";
import AdminDashboard from "../components/admin/AdminDashboard";
import PlayerManagement from "../components/admin/PlayerManagement";
import ShopManagement from "../components/admin/ShopManagement";
import BusinessTypesManagement from "../components/admin/BusinessTypesManagement";
import CrimeManagement from "../components/admin/CrimeManagement";
import NightlifeManagement from "../components/admin/NightlifeManagement";
import CasinoManagement from "../components/admin/CasinoManagement";
import HospitalManagement from "../components/admin/HospitalManagement";
import DailyRewardsManagement from "../components/admin/DailyRewardsManagement";
import AvatarManagement from "../components/admin/AvatarManagement";

type AdminSection = 
  | "dashboard" 
  | "players" 
  | "shop" 
  | "business-types"
  | "crimes" 
  | "nightlife" 
  | "casino"
  | "hospital"
  | "rewards"
  | "avatars";

const AdminView = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  const menuItems = [
    {
      id: "dashboard" as AdminSection,
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview & Statistics"
    },
    {
      id: "players" as AdminSection,
      label: "Players",
      icon: Users,
      description: "Manage Players"
    },
    {
      id: "shop" as AdminSection,
      label: "Shop Items",
      icon: ShoppingCart,
      description: "Manage Store Inventory"
    },
    {
      id: "business-types" as AdminSection,
      label: "Business Types",
      icon: Settings,
      description: "Manage Business Categories"
    },
    {
      id: "crimes" as AdminSection,
      label: "Crimes",
      icon: Target,
      description: "Manage Crime Types"
    },
    {
      id: "nightlife" as AdminSection,
      label: "Nightlife",
      icon: Wine,
      description: "Manage Venues & Characters"
    },
    {
      id: "casino" as AdminSection,
      label: "Casino",
      icon: Gamepad2,
      description: "Manage Games"
    },
    {
      id: "hospital" as AdminSection,
      label: "Hospital",
      icon: Heart,
      description: "Manage Treatments"
    },
    {
      id: "rewards" as AdminSection,
      label: "Daily Rewards",
      icon: Gift,
      description: "Manage Rewards System"
    },
    {
      id: "avatars" as AdminSection,
      label: "Avatars",
      icon: Users,
      description: "Manage Player Avatars"
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "players":
        return <PlayerManagement />;
      case "shop":
        return <ShopManagement />;
      case "business-types":
        return <BusinessTypesManagement />;
      case "crimes":
        return <CrimeManagement />;
      case "nightlife":
        return <NightlifeManagement />;
      case "casino":
        return <CasinoManagement />;
      case "hospital":
        return <HospitalManagement />;
      case "rewards":
        return <DailyRewardsManagement />;
      case "avatars":
        return <AvatarManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center gap-3">
            <Shield className="text-white" size={28} />
            <div>
              <h1 className="text-white font-bold text-xl">Admin Panel</h1>
              <p className="text-purple-100 text-sm">Urban Hustle</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={20} 
                      className={`${
                        isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-600"
                      }`} 
                    />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {menuItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h2>
              <p className="text-gray-600 text-sm">
                {menuItems.find(item => item.id === activeSection)?.description}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download size={16} />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus size={16} />
                Add New
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminView;