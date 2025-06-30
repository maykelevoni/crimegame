import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, Loader2, Info, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/stores/gameStore";
import { SupabaseService } from "@/services/supabaseService";
import { supabase } from "@/integrations/supabase/client";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    notCommon: true
  });

  const { signUp, error, clearError } = useAuth();
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

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
  };

  // Username availability check
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    try {
      const { data, error } = await supabase
        .from('players')
        .select('name')
        .eq('name', username)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking username:', error);
        setUsernameStatus('idle');
      } else if (data) {
        // Username exists
        setUsernameStatus('taken');
      } else {
        // No user found, username is available
        setUsernameStatus('available');
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameStatus('idle');
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    // Check for common weak passwords
    const commonPasswords = [
      "123456789012", "password1234", "admin123456", "qwerty123456",
      "letmein12345", "welcome12345", "senha1234567"
    ];

    const strength = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      notCommon: !commonPasswords.includes(password.toLowerCase())
    };
    setPasswordStrength(strength);
  };

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username.trim()) {
        checkUsernameAvailability(formData.username.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  // Password strength check on change
  useEffect(() => {
    if (formData.password) {
      checkPasswordStrength(formData.password);
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Sanitize input based on field type
    let sanitizedValue = value;
    if (name === 'username' || name === 'email') {
      sanitizedValue = sanitizeInput(value);
    }
    
    // Length limits for security
    const maxLengths = { username: 50, email: 254, password: 128, confirmPassword: 128 };
    if (sanitizedValue.length > maxLengths[name as keyof typeof maxLengths]) {
      return; // Don't update if exceeds length
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Comprehensive input validation
    if (!formData.username.trim()) {
      toast.error("Username is required!");
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters!");
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required!");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email!");
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 12) {
      toast.error("Password must be at least 12 characters!");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    // Check for common weak passwords
    const commonPasswords = [
      "123456789012", "password1234", "admin123456", "qwerty123456",
      "letmein12345", "welcome12345", "senha1234567"
    ];
    
    if (commonPasswords.includes(formData.password.toLowerCase())) {
      toast.error("This password is too common. Choose a more secure password!");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Starting registration process...");

      const result = await signUp(formData.email, formData.password);
      console.log("SignUp result:", result);

      if (result.success && result.data?.user) {
        console.log("User created successfully, creating player profile...");

        // Create player profile with correct parameters
        const player = await SupabaseService.createPlayer(
          formData.username,
          result.data.user.id
        );

        console.log("Player created:", player);

        console.log("Player stats created successfully");
        
        // Store username-email mapping for login
        const userMap = JSON.parse(localStorage.getItem('crimegame_users') || '{}');
        userMap[formData.username] = formData.email;
        localStorage.setItem('crimegame_users', JSON.stringify(userMap));
        
        // Small delay to ensure database operations complete
        setTimeout(() => {
          setUserId(result.data.user.id);
          onClose();
        }, 100);
      } else {
        console.error("SignUp failed:", result.error);

        // Rate limit handling
        if (result.error && result.error.includes("rate limit")) {
          toast.error("Too many registration attempts. Please wait a few minutes before trying again.");
        } else if (result.error && result.error.includes("already registered")) {
          toast.error("This email is already registered. Try logging in instead.");
        } else {
          toast.error(result.error || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("rate limit")) {
          toast.error("Too many attempts. Please wait before trying again.");
        } else if (error.message.includes("already exists") || error.message.includes("duplicate")) {
          toast.error("Username or email already exists. Please choose different ones.");
        } else {
          toast.error(`Registration error: ${error.message}`);
        }
      } else {
        toast.error(`Registration error: ${String(error)}`);
      }
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
          <h2 className="text-2xl font-bold text-white mb-2">Register</h2>
          <p className="text-cyber-blue/80">
            Create your account and start your journey
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-cyber-blue mb-2"
            >
              Player Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 pr-10 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
                placeholder="Choose your player name"
                required
                minLength={3}
                maxLength={50}
              />
              {/* Username status indicator */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {usernameStatus === 'checking' && (
                  <Loader2 size={16} className="text-cyber-blue animate-spin" />
                )}
                {usernameStatus === 'available' && (
                  <Check size={16} className="text-green-400" />
                )}
                {usernameStatus === 'taken' && (
                  <AlertCircle size={16} className="text-red-400" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-cyber-blue/60 text-xs">
                💡 Choose a unique name for your criminal career
              </p>
              {usernameStatus === 'available' && (
                <span className="text-green-400 text-xs">✓ Available</span>
              )}
              {usernameStatus === 'taken' && (
                <span className="text-red-400 text-xs">✗ Taken</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-cyber-blue mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
              placeholder="your@email.com"
              required
              maxLength={254}
            />
            <p className="text-cyber-blue/60 text-xs mt-1">
              💡 You'll use your player name to login, not this email
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
                placeholder="••••••••••••"
                required
                minLength={12}
                maxLength={128}
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
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className={passwordStrength.length ? "text-green-400" : "text-red-400"}>
                    {passwordStrength.length ? "✓" : "✗"} 12+ chars
                  </span>
                  <span className={passwordStrength.uppercase ? "text-green-400" : "text-red-400"}>
                    {passwordStrength.uppercase ? "✓" : "✗"} Uppercase
                  </span>
                  <span className={passwordStrength.lowercase ? "text-green-400" : "text-red-400"}>
                    {passwordStrength.lowercase ? "✓" : "✗"} Lowercase
                  </span>
                  <span className={passwordStrength.number ? "text-green-400" : "text-red-400"}>
                    {passwordStrength.number ? "✓" : "✗"} Number
                  </span>
                  <span className={passwordStrength.special ? "text-green-400" : "text-red-400"}>
                    {passwordStrength.special ? "✓" : "✗"} Special
                  </span>
                  <span className={passwordStrength.notCommon ? "text-green-400" : "text-red-400"}>
                    {passwordStrength.notCommon ? "✓" : "✗"} Not common
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-cyber-blue mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
                placeholder="••••••••••••"
                required
                maxLength={128}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-cyber-blue/20 rounded transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} className="text-cyber-blue" />
                ) : (
                  <Eye size={16} className="text-cyber-blue" />
                )}
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`text-xs mt-1 ${
                formData.password === formData.confirmPassword 
                  ? "text-green-400" 
                  : "text-red-400"
              }`}>
                {formData.password === formData.confirmPassword 
                  ? "✓ Passwords match" 
                  : "✗ Passwords don't match"
                }
              </p>
            )}
          </div>

          {/* Security tip */}
          <div className="bg-cyber-blue/10 border border-cyber-blue/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-cyber-blue mt-0.5 flex-shrink-0" />
              <div className="text-xs text-cyber-blue/80">
                <p className="font-medium mb-1">🔐 Security Tips:</p>
                <ul className="text-cyber-blue/60 space-y-0.5">
                  <li>• Use a unique password you don't use anywhere else</li>
                  <li>• Your password must be at least 12 characters</li>
                  <li>• Include uppercase, lowercase, numbers and symbols</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || usernameStatus === 'taken'}
            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold py-3 px-4 rounded-lg hover:from-cyber-purple hover:to-cyber-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-cyber-blue/80 text-sm">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-cyber-blue hover:text-white transition-colors font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};