
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
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
              
              {user && (
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
              {user ? (
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
                  >
                    Login
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    onClick={() => setShowAuthModal(true)}
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
