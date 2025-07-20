import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  const { updatePassword } = useAuth();

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(password);
      if (result.success) {
        toast.success('Password updated successfully!');
        window.location.href = '/';
      } else {
        toast.error(result.error || 'Failed to update password');
      }
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h1>
          <p className="text-cyber-blue/80 mb-4">This password reset link is invalid or expired.</p>
          <a 
            href="/"
            className="bg-cyber-blue text-white px-6 py-3 rounded-lg hover:bg-cyber-purple transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-cyber-blue/80">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyber-blue mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
                placeholder="Enter new password"
                required
                minLength={6}
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
            <label className="block text-sm font-medium text-cyber-blue mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/50 border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue transition-colors"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold py-3 px-4 rounded-lg hover:from-cyber-purple hover:to-cyber-blue transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};