import React, { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/stores/gameStore";
import { SupabaseService } from "@/services/supabaseService";
import { supabase } from "@/lib/supabase";

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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, error, clearError } = useAuth();
  const { setUserId } = useGameStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!");
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
          formData.name,
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
        alert(`Erro no registro: ${result.error}`);
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      // Mostra o erro detalhado do Supabase se existir
      if (error && typeof error === "object" && "message" in error) {
        alert(`Erro no registro: ${(error as Error).message}`);
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
              htmlFor="name"
              className="block text-sm font-medium text-cyber-blue mb-2"
            >
              Nome do Jogador
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
