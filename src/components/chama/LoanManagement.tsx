
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';

interface LoanManagementProps {
  chamaData: any;
}

const LoanManagement: React.FC<LoanManagementProps> = ({ chamaData }) => {
  const { toast } = useToast();
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [loanApplication, setLoanApplication] = useState({
    amount: '',
    purpose: '',
    repaymentPeriod: '12',
    guarantors: ''
  });

  const activeLoans = [
    { id: '1', borrower: 'John Doe', amount: 100000, purpose: 'Business expansion', interestRate: 5, monthlyPayment: 8797, remainingBalance: 75000, dueDate: '2024-02-15', status: 'active' },
    { id: '2', borrower: 'Jane Smith', amount: 50000, purpose: 'Emergency', interestRate: 5, monthlyPayment: 4399, remainingBalance: 35000, dueDate: '2024-02-10', status: 'active' },
    { id: '3', borrower: 'Mike Johnson', amount: 75000, purpose: 'Education', interestRate: 5, monthlyPayment: 6598, remainingBalance: 0, dueDate: '2024-01-20', status: 'overdue' }
  ];

  const loanSettings = {
    maxLoanAmount: 200000,
    interestRate: 5,
    maxRepaymentPeriod: 24,
    requireGuarantors: true,
    minGuarantors: 2
  };

  const handleLoanApplication = () => {
    if (!loanApplication.amount || !loanApplication.purpose) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Loan Application Submitted",
      description: "Your loan application has been submitted for review",
    });

    setLoanApplication({
      amount: '',
      purpose: '',
      repaymentPeriod: '12',
      guarantors: ''
    });
    setShowLoanForm(false);
  };

  const calculateMonthlyPayment = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Loan Management</h2>
          <p className="text-muted-foreground">Apply for loans and track repayments</p>
        </div>
        <Button onClick={() => setShowLoanForm(true)} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Apply for Loan
        </Button>
      </div>

      {/* Loan Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans Issued</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={chamaData.loansIssued} className="text-2xl font-bold" showToggle={false} />
            <p className="text-xs text-muted-foreground">{activeLoans.length} active loans</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay 
              amount={activeLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0)} 
              className="text-2xl font-bold" 
              showToggle={false} 
            />
            <p className="text-xs text-muted-foreground">Remaining to collect</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanSettings.interestRate}%</div>
            <p className="text-xs text-muted-foreground">Per annum</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Loans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {activeLoans.filter(loan => loan.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {showLoanForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Loan Application</CardTitle>
            <CardDescription>Apply for a loan from the group fund</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanAmount">Loan Amount (KES) *</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanApplication.amount}
                  onChange={(e) => setLoanApplication({...loanApplication, amount: e.target.value})}
                  placeholder={`Max: ${loanSettings.maxLoanAmount.toLocaleString()}`}
                />
              </div>
              <div>
                <Label htmlFor="repaymentPeriod">Repayment Period (months)</Label>
                <select
                  id="repaymentPeriod"
                  value={loanApplication.repaymentPeriod}
                  onChange={(e) => setLoanApplication({...loanApplication, repaymentPeriod: e.target.value})}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="purpose">Purpose of Loan *</Label>
              <Input
                id="purpose"
                value={loanApplication.purpose}
                onChange={(e) => setLoanApplication({...loanApplication, purpose: e.target.value})}
                placeholder="Business expansion, education, emergency, etc."
              />
            </div>
            <div>
              <Label htmlFor="guarantors">Guarantors (comma-separated names)</Label>
              <Input
                id="guarantors"
                value={loanApplication.guarantors}
                onChange={(e) => setLoanApplication({...loanApplication, guarantors: e.target.value})}
                placeholder="John Doe, Jane Smith"
              />
            </div>
            {loanApplication.amount && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Loan Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Principal Amount: <CurrencyDisplay amount={parseInt(loanApplication.amount)} showToggle={false} /></div>
                  <div>Interest Rate: {loanSettings.interestRate}% per annum</div>
                  <div>
                    Monthly Payment: 
                    <CurrencyDisplay 
                      amount={calculateMonthlyPayment(parseInt(loanApplication.amount), loanSettings.interestRate, parseInt(loanApplication.repaymentPeriod))} 
                      showToggle={false} 
                    />
                  </div>
                  <div>Repayment Period: {loanApplication.repaymentPeriod} months</div>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleLoanApplication}>Submit Application</Button>
              <Button variant="outline" onClick={() => setShowLoanForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Loans */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>Current loan portfolio and repayment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeLoans.map((loan) => (
              <div key={loan.id} className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{loan.borrower}</h3>
                    <p className="text-sm text-muted-foreground">{loan.purpose}</p>
                  </div>
                  <Badge variant={loan.status === 'overdue' ? 'destructive' : 'secondary'}>
                    {loan.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Loan Amount</p>
                    <p className="font-medium">
                      <CurrencyDisplay amount={loan.amount} showToggle={false} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Payment</p>
                    <p className="font-medium">
                      <CurrencyDisplay amount={loan.monthlyPayment} showToggle={false} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining Balance</p>
                    <p className="font-medium">
                      <CurrencyDisplay amount={loan.remainingBalance} showToggle={false} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Due Date</p>
                    <p className="font-medium">{loan.dueDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanManagement;
