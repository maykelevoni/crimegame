import React, { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
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
      toast.error("Nome de usuário é obrigatório!");
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      toast.error("Nome de usuário deve ter pelo menos 3 caracteres!");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Por favor, digite um email válido!");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem!");
      setIsLoading(false);
      return;
    }

    // Stronger password validation
    if (formData.password.length < 12) {
      toast.error("A senha deve ter pelo menos 12 caracteres!");
      setIsLoading(false);
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      toast.error("A senha deve conter pelo menos uma letra maiúscula!");
      setIsLoading(false);
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      toast.error("A senha deve conter pelo menos uma letra minúscula!");
      setIsLoading(false);
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      toast.error("A senha deve conter pelo menos um número!");
      setIsLoading(false);
      return;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
      toast.error("A senha deve conter pelo menos um caractere especial!");
      setIsLoading(false);
      return;
    }

    // Check for common weak passwords
    const commonPasswords = [
      "123456789012", "password1234", "admin123456", "qwerty123456",
      "letmein12345", "welcome12345", "senha1234567"
    ];
    
    if (commonPasswords.includes(formData.password.toLowerCase())) {
      toast.error("Esta senha é muito comum. Escolha uma senha mais segura!");
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

        // Create player stats
        await supabase.from("player_stats").insert({
          player_id: result.data.user.id,
          health: 100,
          max_health: 100,
          energy: 100,
          max_energy: 100,
          addiction: 0,
          reputation: 0,
          money: 0, // Start with 0 money as requested
          wanted_level: 0,
          is_imprisoned: false,
          is_hospitalized: false,
        });

        console.log("Player stats created successfully");
        setUserId(result.data.user.id);
        onClose();
      } else {
        console.error("SignUp failed:", result.error);

        // Tratamento específico para rate limit
        if (
          result.error &&
          (result.error.includes("rate limit") ||
            result.error.includes("too many requests"))
        ) {
          alert(
            "Limite de tentativas excedido. Aguarde alguns minutos antes de tentar novamente."
          );
        } else {
          alert(`Erro no registro: ${result.error}`);
        }
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);

      // Tratamento específico para rate limit
      if (error && typeof error === "object" && "message" in error) {
        const errorMessage = (error as Error).message;
        if (
          errorMessage.includes("rate limit") ||
          errorMessage.includes("too many requests")
        ) {
          alert(
            "Limite de tentativas excedido. Aguarde alguns minutos antes de tentar novamente."
          );
        } else {
          alert(`Erro no registro: ${errorMessage}`);
        }
      } else if (typeof error === "object") {
        alert(`Erro no registro: ${JSON.stringify(error)}`);
      } else {
        alert(`Erro no registro: ${String(error)}`);
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
          <h2 className="text-2xl font-bold text-white mb-2">Registro</h2>
          <p className="text-cyber-blue/80">
            Crie sua conta e comece sua jornada
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
              Nome do Jogador
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
              placeholder="Seu nome no jogo"
              required
            />
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
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-cyber-blue mb-2"
            >
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-cyber-blue mb-2"
            >
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
                placeholder="••••••••"
                required
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
                Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-cyber-blue/80 text-sm">
            Já tem uma conta?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-cyber-blue hover:text-white transition-colors font-medium"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
