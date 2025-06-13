
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  supabaseConnected: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Test Supabase connection first
    const checkConnection = async () => {
      const { connected } = await testSupabaseConnection();
      setSupabaseConnected(connected);
      
      if (!connected) {
        console.warn('Supabase not properly connected. Authentication features will be limited.');
        setLoading(false);
        return;
      }

      // Get initial session only if connected
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      }
      setLoading(false);
    };

    checkConnection();

    // Listen for auth changes only if Supabase is connected
    let subscription: any;
    
    if (supabaseConnected) {
      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Create or update profile
          try {
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                full_name: session.user.user_metadata.full_name || '',
                updated_at: new Date().toISOString(),
              });

            if (error) {
              console.error('Error updating profile:', error);
            }
          } catch (err) {
            console.error('Profile update failed:', err);
          }
        }
      });
      
      subscription = authSubscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabaseConnected]);

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabaseConnected) {
      toast({
        title: "Connection Error",
        description: "Supabase is not properly configured. Please check your environment setup.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseConnected) {
      toast({
        title: "Connection Error",
        description: "Supabase is not properly configured. Please check your environment setup.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    if (!supabaseConnected) {
      toast({
        title: "Connection Error",
        description: "Supabase is not properly configured.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    supabaseConnected,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
