import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { sendPasswordByEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsLoading(true);
    
    try {
      const result = await sendPasswordByEmail(email.trim());
      if (result.success) {
        toast.success("Reset link sent to your email!");
        onClose();
      } else {
        toast.error(result.error || "Failed to send email");
      }
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-cyber-blue/20 rounded-lg transition-colors"
        >
          <X size={20} className="text-cyber-blue" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-cyber-blue/80">Enter your email to get reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
            placeholder="your@email.com"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold py-3 px-4 rounded-lg hover:from-cyber-purple hover:to-cyber-blue transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};