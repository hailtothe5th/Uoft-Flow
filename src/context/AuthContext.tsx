import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email || '');
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('uoftflow_user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem('uoftflow_user');
          }
        }
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string, email: string) => {
    // Try to load profile from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', userId)
      .single();

    const displayName = profile?.display_name || email.split('@')[0] || 'Student';
    const appUser: User = { id: userId, email, displayName };
    setUser(appUser);
    localStorage.setItem('uoftflow_user', JSON.stringify(appUser));
  };

  const signIn = async (email: string, displayName: string) => {
    // Try Supabase auth first
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: { display_name: displayName },
        },
      });

      if (error) {
        // Fallback to local auth if Supabase fails
        console.warn('Supabase auth failed, using local auth:', error.message);
        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          displayName,
        };
        setUser(newUser);
        localStorage.setItem('uoftflow_user', JSON.stringify(newUser));
        return;
      }

      // If magic link sent, create user locally for immediate use
      const supabaseUser = data?.user as { id: string; email?: string } | null;
      if (supabaseUser) {
        // Upsert profile
        await supabase.from('profiles').upsert({
          id: supabaseUser.id,
          email: supabaseUser.email,
          display_name: displayName,
        });
        const appUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || email,
          displayName,
        };
        setUser(appUser);
        localStorage.setItem('uoftflow_user', JSON.stringify(appUser));
      } else {
        // Magic link sent - create local user for immediate use
        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          displayName,
        };
        setUser(newUser);
        localStorage.setItem('uoftflow_user', JSON.stringify(newUser));
      }
    } catch {
      // Fallback to local auth
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        displayName,
      };
      setUser(newUser);
      localStorage.setItem('uoftflow_user', JSON.stringify(newUser));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('uoftflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
