import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import ChamasPage from "./pages/ChamasPage";
import AdvancedChamaPage from "./pages/AdvancedChamaPage";
import CreateChamaPage from "./pages/CreateChamaPage";
import InviteMembersPage from "./pages/InviteMembersPage";
import MakeContributionPage from "./pages/MakeContributionPage";
import SchedulePaymentPage from "./pages/SchedulePaymentPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import LoanManagementPage from "./pages/LoanManagementPage";
import VotingSystemPage from "./pages/VotingSystemPage";
import InvestmentPage from "./pages/InvestmentPage";
import MobileMoneyPage from "./pages/MobileMoneyPage";
import P2PTradingPage from "./pages/P2PTradingPage";
import BlockchainLendingPage from "./pages/BlockchainLendingPage";
import StakingPage from "./pages/StakingPage";
import FinancialNavigatorPage from "./pages/FinancialNavigatorPage";
import AdaptiveCreditPage from "./pages/AdaptiveCreditPage";
import SmartWalletPage from "./pages/SmartWalletPage";
import CommunityHubPage from "./pages/CommunityHubPage";

const App = () => {
  console.log('App component rendering');
  
  // Create QueryClient instance inside component to avoid React hook issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      mutations: {
        retry: 1,
      },
    },
  }));
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* AI Navigator Routes */}
                <Route path="/financial-navigator" element={<FinancialNavigatorPage />} />
                <Route path="/cash-flow-predictor" element={<FinancialNavigatorPage />} />
                <Route path="/financial-health" element={<FinancialNavigatorPage />} />
                
                {/* Advanced Lending Routes */}
                <Route path="/adaptive-credit" element={<AdaptiveCreditPage />} />
                <Route path="/asset-financing" element={<AdaptiveCreditPage />} />
                
                {/* Smart Wallet */}
                <Route path="/smart-wallet" element={<SmartWalletPage />} />
                
                {/* Community Hub */}
                <Route path="/community-hub" element={<CommunityHubPage />} />
                
                {/* Existing Chama Routes */}
                <Route path="/chamas" element={<ChamasPage />} />
                <Route path="/chama/:id" element={<AdvancedChamaPage />} />
                <Route path="/create-chama" element={<CreateChamaPage />} />
                <Route path="/invite-members" element={<InviteMembersPage />} />
                <Route path="/make-contribution" element={<MakeContributionPage />} />
                <Route path="/schedule-payment" element={<SchedulePaymentPage />} />
                <Route path="/voting" element={<VotingSystemPage />} />
                
                {/* Existing Lending & Investment Routes */}
                <Route path="/loans" element={<LoanManagementPage />} />
                <Route path="/blockchain-lending" element={<BlockchainLendingPage />} />
                <Route path="/p2p-trading" element={<P2PTradingPage />} />
                <Route path="/staking" element={<StakingPage />} />
                <Route path="/investments" element={<InvestmentPage />} />
                <Route path="/mobile-money" element={<MobileMoneyPage />} />
                
                {/* Analytics */}
                <Route path="/analytics" element={<AnalyticsPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
