import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div className="relative">
        <Loader2
          className={`${sizeClasses[size]} animate-spin text-cyber-blue`}
        />
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-cyber-blue/20 rounded-full animate-pulse`}
        ></div>
      </div>
      {text && (
        <p className="text-sm text-cyber-blue/80 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Loading overlay para telas inteiras
export const LoadingOverlay: React.FC<{ text?: string }> = ({
  text = "Carregando...",
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

// Loading skeleton para cards
export const LoadingSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-cyber-blue/20 rounded-lg h-32 mb-3"></div>
      <div className="bg-cyber-blue/20 rounded h-4 mb-2"></div>
      <div className="bg-cyber-blue/20 rounded h-3 w-2/3"></div>
    </div>
  );
};
