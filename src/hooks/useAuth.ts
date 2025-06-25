import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          // Desabilitar confirmação de email para evitar rate limits
          data: {
            email_confirm: true,
          },
        },
      });

      if (error) {
        // Tratamento específico para rate limit
        if (
          error.message.includes("rate limit") ||
          error.message.includes("too many requests")
        ) {
          const errorMessage =
            "Limite de tentativas excedido. Aguarde alguns minutos antes de tentar novamente.";
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
