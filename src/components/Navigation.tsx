import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import LanguageSelector from './LanguageSelector';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, TrendingUp, Plus, LogOut } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div 
              className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/')}
            >
              ChamaVault
            </div>
            
            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
                <Button
                  variant={isActive('/chamas') ? 'default' : 'ghost'}
                  onClick={() => navigate('/chamas')}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Chamas
                </Button>
                <Button
                  variant={isActive('/analytics') ? 'default' : 'ghost'}
                  onClick={() => navigate('/analytics')}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </Button>
                <Button
                  variant={isActive('/create-chama') ? 'default' : 'ghost'}
                  onClick={() => navigate('/create-chama')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <AuthModal />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
