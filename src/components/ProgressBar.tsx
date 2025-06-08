
import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar = ({ current, max, color = 'cyber-blue', showText = true, size = 'md' }: ProgressBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorMap = {
    'cyber-blue': 'bg-cyber-blue',
    'cyber-green': 'bg-cyber-green',
    'cyber-purple': 'bg-cyber-purple',
    'cyber-orange': 'bg-cyber-orange'
  };

  return (
    <div className="w-full">
      <div className={`cyber-border ${sizeClasses[size]} rounded-full overflow-hidden`}>
        <div 
          className={`${colorMap[color as keyof typeof colorMap]} h-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-xs mt-1 text-gray-400">
          <span>{current}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
