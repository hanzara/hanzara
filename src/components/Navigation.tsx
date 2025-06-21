
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import LanguageSelector from "@/components/LanguageSelector";
import AuthModal from "@/components/AuthModal";
import NotificationCenter from "@/components/NotificationCenter";
import {
  BarChart3,
  Users,
  Plus,
  MessageSquare,
  CreditCard,
  TrendingUp,
  ArrowRightLeft,
  Wallet,
  Target,
  Receipt,
  Bell
} from "lucide-react"

const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div 
              className="text-xl font-bold text-primary cursor-pointer"
              onClick={() => navigate('/')}
            >
              ChamaVault
            </div>
            
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Financial Tools</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 w-[400px]">
                          <div className="grid gap-1">
                            <Button
                              variant="ghost"
                              className="justify-start h-auto p-2"
                              onClick={() => navigate('/bill-payments')}
                            >
                              <Receipt className="mr-2 h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Bill Payments</div>
                                <div className="text-xs text-muted-foreground">Pay bills & set up auto-pay</div>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start h-auto p-2"
                              onClick={() => navigate('/savings-goals')}
                            >
                              <Target className="mr-2 h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Savings Goals</div>
                                <div className="text-xs text-muted-foreground">Set & track savings goals</div>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start h-auto p-2"
                              onClick={() => navigate('/smart-wallet')}
                            >
                              <Wallet className="mr-2 h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Smart Wallet</div>
                                <div className="text-xs text-muted-foreground">AI-powered wallet management</div>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Lending & Investing</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 w-[400px]">
                          <div className="grid gap-1">
                            <Button
                              variant="ghost"
                              className="justify-start h-auto p-2"
                              onClick={() => navigate('/borrower-dashboard')}
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Borrow Money</div>
                                <div className="text-xs text-muted-foreground">Apply for personal & business loans</div>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start h-auto p-2"
                              onClick={() => navigate('/investor-dashboard')}
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Invest & Lend</div>
                                <div className="text-xs text-muted-foreground">Fund loans & earn returns</div>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start h-auto p-2"
                              onClick={() => navigate('/p2p-trading')}
                            >
                              <ArrowRightLeft className="mr-2 h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">P2P Trading</div>
                                <div className="text-xs text-muted-foreground">Trade digital assets</div>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Chamas & Groups</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 w-[400px]">
                          <div className="grid gap-1">
                            <Button
                              variant="ghost"
                              className="justify-start h-auto p-2"
                              onClick={() => navigate('/chamas')}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">My Chamas</div>
                                <div className="text-xs text-muted-foreground">View & manage your groups</div>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start h-auto p-2"
                              onClick={() => navigate('/create-chama')}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Create Chama</div>
                                <div className="text-xs text-muted-foreground">Start a new savings group</div>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start h-auto p-2"
                              onClick={() => navigate('/community-hub')}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Community Hub</div>
                                <div className="text-xs text-muted-foreground">Connect with other members</div>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <Button 
                        variant="ghost" 
                        onClick={() => navigate('/analytics')}
                        className="h-10"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </Button>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNotificationOpen(true)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <NotificationCenter 
              isOpen={isNotificationOpen} 
              onClose={() => setIsNotificationOpen(false)} 
            />
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/select-role')}>
                    Role Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/smart-wallet')}>
                    Smart Wallet
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
