"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

// Create a default value for server-side rendering
const defaultValue: AuthContextType = {
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ data: null, error: "Authentication not available during server-side rendering" }),
  signInWithGoogle: async () => ({ error: "Authentication not available during server-side rendering" }),
  signUp: async () => ({ data: null, error: "Authentication not available during server-side rendering" }),
  signOut: async () => { },
  resetPassword: async () => ({ error: "Authentication not available during server-side rendering" }),
};

const AuthContext = createContext<AuthContextType>(defaultValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(typeof window === 'undefined') // Start with true on server, false on client initially
  const router = useRouter()

  // Initialize Supabase client only on the client side
  useEffect(() => {
    // On the client side, we want to show loading state initially
    setIsLoading(true);

    // Skip initialization on the server side
    if (typeof window === 'undefined') {
      return;
    }

    const supabase = createClientSupabaseClient();

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else {
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        // Ensure loading is set to false after initialization
        setIsLoading(false);
      }
    };

    // Wait a tick to ensure proper hydration
    const timer = setTimeout(getSession, 0);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      setUser(session?.user || null);
      // Only refresh router if we're in the browser
      if (typeof window !== 'undefined') {
        router.refresh();
      }
    });

    return () => {
      clearTimeout(timer);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    if (typeof window === 'undefined') {
      console.error("Cannot sign in from server side");
      return { data: null, error: "Cannot sign in from server side" };
    }

    const supabase = createClientSupabaseClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (error) {
      console.error("Error signing in:", error);
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    if (typeof window === 'undefined') {
      console.error("Cannot sign in from server side");
      return { error: "Cannot sign in from server side" };
    }

    const supabase = createClientSupabaseClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      return { error };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (typeof window === 'undefined') {
      console.error("Cannot sign up from server side");
      return { data: null, error: "Cannot sign up from server side" };
    }

    const supabase = createClientSupabaseClient();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?message=check-email`,
        },
      });
      return { data, error };
    } catch (error) {
      console.error("Error signing up:", error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    if (typeof window === 'undefined') {
      console.error("Cannot sign out from server side");
      return;
    }

    const supabase = createClientSupabaseClient();
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const resetPassword = async (email: string) => {
    if (typeof window === 'undefined') {
      console.error("Cannot reset password from server side");
      return { error: "Cannot reset password from server side" };
    }

    const supabase = createClientSupabaseClient();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { error };
    }
  };

  const value = {
    user: user ?? null,
    session: session ?? null,
    isLoading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  // No need to throw an error here since we provide a default value
  return context;
};
