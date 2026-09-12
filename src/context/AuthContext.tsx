import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  changePassword: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
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
    console.log('🔍 Loading user profile for:', userId, email);
    
    // Set user immediately with default display name
    const defaultDisplayName = email.split('@')[0] || 'Student';
    const appUser: User = { id: userId, email, displayName: defaultDisplayName };
    setUser(appUser);
    localStorage.setItem('uoftflow_user', JSON.stringify(appUser));
    
    // Try to load profile from Supabase (non-blocking)
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single();

      console.log('📋 Profile query result:', { profile, error });

      // If profile exists, update with display name
      if (profile && profile.display_name) {
        const updatedUser = { ...appUser, displayName: profile.display_name };
        setUser(updatedUser);
        localStorage.setItem('uoftflow_user', JSON.stringify(updatedUser));
        console.log('✅ User profile loaded:', updatedUser);
      } else if (error?.code === 'PGRST116') {
        // Profile doesn't exist (PGRST116 = no rows returned), try to create it
        console.log('⚠️ Profile not found, creating new profile...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            display_name: defaultDisplayName,
          });
        
        if (insertError) {
          console.warn('⚠️ Could not create profile (non-critical):', insertError.message);
          // Don't block login - user can still use the app
        } else {
          console.log('✅ Profile created successfully');
        }
      }
    } catch (err) {
      console.warn('⚠️ Profile loading failed (non-critical):', err);
      // Don't block login - user can still use the app
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting to sign in:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('🔑 Sign in result:', { data, error });

    if (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }

    if (data.user) {
      console.log('✅ User authenticated, loading profile...');
      await loadUserProfile(data.user.id, data.user.email || email);
    } else {
      console.error('❌ No user data returned from sign in');
      throw new Error('Sign in failed: No user data returned');
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      throw error;
    }

    // Check if email confirmation is required
    if (data.user && !data.session) {
      // Email confirmation required - user needs to check their email
      throw new Error('Please check your email to confirm your account before signing in.');
    }

    // If we have a session, user is already signed in (email confirmation not required)
    if (data.session && data.user) {
      // Create profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        display_name: displayName,
      });
      
      // Set user in context
      const appUser: User = { 
        id: data.user.id, 
        email: data.user.email || email, 
        displayName 
      };
      setUser(appUser);
      localStorage.setItem('uoftflow_user', JSON.stringify(appUser));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('uoftflow_user');
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        changePassword,
        resetPassword,
        updatePassword,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
