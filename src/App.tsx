
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chamas" element={<ChamasPage />} />
              <Route path="/chama/:id" element={<AdvancedChamaPage />} />
              <Route path="/create-chama" element={<CreateChamaPage />} />
              <Route path="/invite-members" element={<InviteMembersPage />} />
              <Route path="/make-contribution" element={<MakeContributionPage />} />
              <Route path="/schedule-payment" element={<SchedulePaymentPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
