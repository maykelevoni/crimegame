import { Heart, Battery } from 'lucide-react';

  <div className="flex items-center gap-2">
    <Heart size={20} className="text-cyber-green" />
    <div className="w-32 bg-cyber-dark-medium rounded-full h-2 overflow-hidden">
      <div
        className="bg-cyber-green h-2 rounded-full transition-all"
        style={{ width: `${(health / maxHealth) * 100}%` }}
      />
    </div>
    <span className="text-xs text-white">{health}/{maxHealth}</span>
  </div>

  <div className="flex items-center gap-2">
    <Battery size={20} className="text-cyber-blue" />
    <div className="w-32 bg-cyber-dark-medium rounded-full h-2 overflow-hidden">
      <div
        className="bg-cyber-blue h-2 rounded-full transition-all"
        style={{ width: `${(energy / maxEnergy) * 100}%` }}
      />
    </div>
    <span className="text-xs text-white">{energy}/{maxEnergy}</span>
  </div> 