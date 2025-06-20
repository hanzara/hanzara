
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import LanguageSelector from './LanguageSelector';
import NotificationCenter from './NotificationCenter';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, TrendingUp, Plus, LogOut, Bell, CreditCard, Vote, Smartphone, ArrowLeftRight, Shield, Coins } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItemClass = (path: string) => 
    `flex items-center gap-2 transition-colors ${isActive(path) 
      ? 'text-primary' 
      : 'text-muted-foreground hover:text-primary'
    }`;

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div 
                className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
                ChamaVault
              </div>
              
              {user && (
                <div className="hidden md:flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className={navItemClass('/')}
                  >
                    <Home className="h-4 w-4" />
                    {t('nav.home', 'Home')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/chamas')}
                    className={navItemClass('/chamas')}
                  >
                    <Users className="h-4 w-4" />
                    {t('nav.chamas', 'Chamas')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/analytics')}
                    className={navItemClass('/analytics')}
                  >
                    <TrendingUp className="h-4 w-4" />
                    {t('nav.analytics', 'Analytics')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/loans')}
                    className={navItemClass('/loans')}
                  >
                    <CreditCard className="h-4 w-4" />
                    Loans
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/blockchain-lending')}
                    className={navItemClass('/blockchain-lending')}
                  >
                    <Shield className="h-4 w-4" />
                    DeFi Loans
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/p2p-trading')}
                    className={navItemClass('/p2p-trading')}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    P2P Trade
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/staking')}
                    className={navItemClass('/staking')}
                  >
                    <Coins className="h-4 w-4" />
                    Staking
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/voting')}
                    className={navItemClass('/voting')}
                  >
                    <Vote className="h-4 w-4" />
                    Voting
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/investments')}
                    className={navItemClass('/investments')}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Investments
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/mobile-money')}
                    className={navItemClass('/mobile-money')}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile Money
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/create-chama')}
                    className={navItemClass('/create-chama')}
                  >
                    <Plus className="h-4 w-4" />
                    {t('nav.create', 'Create')}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Notification Bell */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setNotificationOpen(true)}
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    {t('nav.welcome', 'Welcome')}, {user.email?.split('@')[0]}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.signOut', 'Sign Out')}
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    {t('nav.signIn', 'Sign In')}
                  </Button>
                  <AuthModal 
                    open={authModalOpen} 
                    onOpenChange={setAuthModalOpen} 
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <NotificationCenter 
        isOpen={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />
    </>
  );
};

export default Navigation;
