
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, DollarSign, Users, Target, Eye, Wallet } from 'lucide-react';
import Navigation from '@/components/Navigation';

const InvestorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  // Fetch available loan applications for investment
  const { data: availableLoans, isLoading: loansLoading } = useQuery({
    queryKey: ['available-loans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loan_applications_new')
        .select('*')
        .in('status', ['approved', 'funded'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch investor's current investments
  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ['investor-investments', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('loan_investments')
        .select(`
          *,
          loan_applications_new (
            full_name,
            loan_amount,
            loan_purpose,
            interest_rate,
            loan_term_months,
            status
          )
        `)
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const investMutation = useMutation({
    mutationFn: async ({ loanId, amount }: { loanId: string; amount: number }) => {
      if (!user) throw new Error('User not authenticated');

      const loan = availableLoans?.find(l => l.id === loanId);
      if (!loan) throw new Error('Loan not found');

      const expectedReturn = amount * (1 + (loan.interest_rate / 100));

      const { error } = await supabase
        .from('loan_investments')
        .insert({
          loan_application_id: loanId,
          investor_id: user.id,
          investment_amount: amount,
          expected_return: expectedReturn
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Investment Successful",
        description: "Your investment has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['available-loans'] });
      queryClient.invalidateQueries({ queryKey: ['investor-investments'] });
      setSelectedLoan(null);
      setInvestmentAmount('');
    },
    onError: (error: any) => {
      toast({
        title: "Investment Failed",
        description: error.message || "Failed to process investment",
        variant: "destructive",
      });
    },
  });

  const handleInvest = () => {
    if (!selectedLoan || !investmentAmount) return;
    
    const amount = parseFloat(investmentAmount);
    if (amount <= 0 || amount > selectedLoan.loan_amount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount",
        variant: "destructive",
      });
      return;
    }

    investMutation.mutate({ loanId: selectedLoan.id, amount });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const portfolioStats = investments ? {
    totalInvestments: investments.length,
    totalInvested: investments.reduce((sum, inv) => sum + Number(inv.investment_amount), 0),
    expectedReturns: investments.reduce((sum, inv) => sum + Number(inv.expected_return), 0),
    activeInvestments: investments.filter(inv => inv.status === 'active').length
  } : null;

  if (loansLoading || investmentsLoading) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Investor Dashboard</h1>
          <p className="text-muted-foreground">Discover investment opportunities and manage your loan portfolio</p>
        </div>

        {/* Portfolio Stats */}
        {portfolioStats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Investments</p>
                    <p className="text-2xl font-bold">{portfolioStats.activeInvestments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invested</p>
                    <p className="text-2xl font-bold">KES {portfolioStats.totalInvested.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Returns</p>
                    <p className="text-2xl font-bold">KES {portfolioStats.expectedReturns.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Potential ROI</p>
                    <p className="text-2xl font-bold">
                      {portfolioStats.totalInvested > 0 
                        ? `${(((portfolioStats.expectedReturns - portfolioStats.totalInvested) / portfolioStats.totalInvested) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Investment Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Opportunities</CardTitle>
              <CardDescription>Browse and invest in approved loan applications</CardDescription>
            </CardHeader>
            <CardContent>
              {availableLoans && availableLoans.length > 0 ? (
                <div className="space-y-4">
                  {availableLoans.map((loan) => (
                    <div key={loan.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">KES {Number(loan.loan_amount).toLocaleString()}</h3>
                          <p className="text-sm text-muted-foreground">{loan.loan_purpose}</p>
                        </div>
                        <Badge className={getRiskColor(loan.risk_rating || 'medium')}>
                          {(loan.risk_rating || 'medium').toUpperCase()} RISK
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Interest Rate</p>
                          <p className="font-medium">{loan.interest_rate}% p.a.</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Term</p>
                          <p className="font-medium">{loan.loan_term_months} months</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Loan Application Details</DialogTitle>
                              <DialogDescription>
                                Review the borrower's information before investing
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Borrower</p>
                                  <p className="font-medium">{loan.full_name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                                  <p className="font-medium">KES {Number(loan.monthly_income).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Employment Status</p>
                                  <p className="font-medium">{loan.employment_status}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Loan Purpose</p>
                                  <p className="font-medium">{loan.loan_purpose}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => setSelectedLoan(loan)}
                            >
                              <DollarSign className="w-3 h-3" />
                              Invest
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Invest in Loan</DialogTitle>
                              <DialogDescription>
                                Enter the amount you want to invest in this loan
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="amount">Investment Amount (KES)</Label>
                                <Input
                                  id="amount"
                                  type="number"
                                  value={investmentAmount}
                                  onChange={(e) => setInvestmentAmount(e.target.value)}
                                  placeholder="Enter amount"
                                  max={selectedLoan?.loan_amount}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Maximum: KES {selectedLoan?.loan_amount?.toLocaleString()}
                                </p>
                              </div>
                              
                              {investmentAmount && selectedLoan && (
                                <div className="p-3 bg-muted rounded-lg text-sm">
                                  <p>Expected return: KES {(parseFloat(investmentAmount) * (1 + (selectedLoan.interest_rate / 100))).toLocaleString()}</p>
                                  <p>Profit: KES {(parseFloat(investmentAmount) * (selectedLoan.interest_rate / 100)).toLocaleString()}</p>
                                </div>
                              )}
                              
                              <Button 
                                onClick={handleInvest} 
                                disabled={investMutation.isPending || !investmentAmount}
                                className="w-full"
                              >
                                {investMutation.isPending ? 'Processing...' : 'Confirm Investment'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No investment opportunities available at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Investments */}
          <Card>
            <CardHeader>
              <CardTitle>Your Investments</CardTitle>
              <CardDescription>Track your active and completed investments</CardDescription>
            </CardHeader>
            <CardContent>
              {investments && investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div key={investment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">KES {Number(investment.investment_amount).toLocaleString()}</h3>
                          <p className="text-sm text-muted-foreground">
                            {(investment.loan_applications_new as any)?.loan_purpose}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {investment.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Expected Return</p>
                          <p className="font-medium">KES {Number(investment.expected_return).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Investment Date</p>
                          <p className="font-medium">{new Date(investment.investment_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">You haven't made any investments yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default InvestorDashboardPage;
