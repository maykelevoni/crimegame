import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseService } from "@/services/supabaseService";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setAuthState((prev) => ({
            ...prev,
            error: error.message,
            loading: false,
          }));
          return;
        }

        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null,
        });
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (playerNameOrEmail: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      let email = playerNameOrEmail;
      
      // Check if input looks like an email (contains @)
      if (!playerNameOrEmail.includes('@')) {
        // It's a player name, lookup email from localStorage first
        const userMap = JSON.parse(localStorage.getItem('crimegame_users') || '{}');
        const localEmail = userMap[playerNameOrEmail];
        
        if (localEmail) {
          email = localEmail;
        } else {
          // Try database lookup as fallback
          const dbEmail = await SupabaseService.getUserEmailByPlayerName(playerNameOrEmail);
          if (dbEmail && !dbEmail.startsWith('__LOOKUP_USER_ID__')) {
            email = dbEmail;
          } else if (dbEmail && dbEmail.startsWith('__LOOKUP_USER_ID__')) {
            // We got a user_id but can't get email directly, inform user to use email
            setAuthState((prev) => ({
              ...prev,
              error: "Username found! Please login using your email address instead of username.",
              loading: false,
            }));
            return { success: false, error: "Username found! Please login using your email address instead of username." };
          } else {
            setAuthState((prev) => ({
              ...prev,
              error: "Player not found. Please check your username or use your email address.",
              loading: false,
            }));
            return { success: false, error: "Player not found. Please check your username or use your email address." };
          }
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
        return { success: false, error: error.message };
      }

      // Store successful username-email mapping for future use
      if (playerNameOrEmail !== email && !playerNameOrEmail.includes('@')) {
        const userMap = JSON.parse(localStorage.getItem('crimegame_users') || '{}');
        userMap[playerNameOrEmail] = email;
        localStorage.setItem('crimegame_users', JSON.stringify(userMap));
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Enable email confirmation for security
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        // Tratamento específico para rate limit
        if (
          error.message.includes("rate limit") ||
          error.message.includes("too many requests")
        ) {
          const errorMessage =
            "Attempt limit exceeded. Wait a few minutes before trying again.";
          setAuthState((prev) => ({
            ...prev,
            error: errorMessage,
            loading: false,
          }));
          return { success: false, error: errorMessage };
        }

        setAuthState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
        return { success: false, error: error.message };
      }

      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
        return { success: false, error: error.message };
      }

      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
        return { success: false, error: error.message };
      }

      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    clearError,
  };
};
