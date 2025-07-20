import React, { useState } from "react";
import { X, Eye, EyeOff, Loader2, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/stores/gameStore";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgotPassword,
}) => {
  const [playerName, setPlayerName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, error, clearError } = useAuth();
  const { setUserId } = useGameStore();

  // Input sanitization function
  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  };

  // Player name validation function
  const isValidPlayerName = (name: string): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 50;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Input validation
    if (!playerName.trim()) {
      toast.error("Player name is required!");
      setIsLoading(false);
      return;
    }

    if (!isValidPlayerName(playerName)) {
      toast.error("Player name must be between 3-50 characters!");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required!");
      setIsLoading(false);
      return;
    }

    // Sanitize inputs
    const sanitizedPlayerName = sanitizeInput(playerName);
    
    try {
      const result = await signIn(sanitizedPlayerName, password);
      if (result.success) {
        setUserId(result.data?.user?.id || null);
        onClose();
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-xl p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-cyber-blue/20 rounded-lg transition-colors"
        >
          <X size={20} className="text-cyber-blue" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
          <p className="text-cyber-blue/80">Enter the world of urban crime</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 text-sm">{error}</p>
                <p className="text-red-300 text-xs mt-1">
                  💡 Check if your player name and password are correct
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Game info tip */}
        <div className="bg-cyber-blue/10 border border-cyber-blue/20 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-cyber-blue mt-0.5 flex-shrink-0" />
            <div className="text-xs text-cyber-blue/80">
              <p className="font-medium mb-1">🎮 Welcome to Crime Game!</p>
              <p className="text-cyber-blue/60">
                This is an urban strategy game. Build your criminal empire, 
                make deals and dominate the city streets!
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="playerName"
              className="block text-sm font-medium text-cyber-blue mb-2"
            >
              Player Name or Email
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
              placeholder="Your player name or email"
              required
            />
            <p className="text-cyber-blue/60 text-xs mt-1">
              💡 You can now login with your player name or email address
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-cyber-blue mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-cyber-blue/20 rounded transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-cyber-blue" />
                ) : (
                  <Eye size={16} className="text-cyber-blue" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-cyber-blue/60 text-xs">
                💡 Use your player name or email to login
              </p>
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-cyber-blue hover:text-white transition-colors text-xs font-medium"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold py-3 px-4 rounded-lg hover:from-cyber-purple hover:to-cyber-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-cyber-blue/80 text-sm">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-cyber-blue hover:text-white transition-colors font-medium"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
