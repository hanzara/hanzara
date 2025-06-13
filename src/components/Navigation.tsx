
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Users, DollarSign, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';

const Navigation = () => {
  const { user, signOut, supabaseConnected } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          {!supabaseConnected && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800">
                Supabase connection not configured. Please set up your environment variables.
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Chama Circle
                </span>
              </div>
              
              {user && supabaseConnected && (
                <div className="hidden md:flex items-center space-x-6">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    My Chamas
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Contributions
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Analytics
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {user && supabaseConnected ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button variant="outline" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAuthModal(true)}
                    disabled={!supabaseConnected}
                  >
                    Login
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    onClick={() => setShowAuthModal(true)}
                    disabled={!supabaseConnected}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Navigation;
