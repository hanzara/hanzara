
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, FileText, DollarSign } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';

interface InvestmentTrackingProps {
  chamaData: any;
}

const InvestmentTracking: React.FC<InvestmentTrackingProps> = ({ chamaData }) => {
  const { toast } = useToast();
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: '',
    amount: '',
    description: ''
  });

  const investments = [
    { id: '1', name: 'Downtown Plot', type: 'Real Estate', amount: 2000000, currentValue: 2400000, roi: 20, documents: 3, dateAdded: '2023-06-15' },
    { id: '2', name: 'Equity Bank Shares', type: 'Stocks', amount: 500000, currentValue: 580000, roi: 16, documents: 2, dateAdded: '2023-08-20' },
    { id: '3', name: 'Mama Mboga Business', type: 'Business', amount: 300000, currentValue: 420000, roi: 40, documents: 4, dateAdded: '2023-09-10' }
  ];

  const handleAddInvestment = () => {
    if (!newInvestment.name || !newInvestment.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Investment Added",
      description: `${newInvestment.name} has been added to the portfolio`,
    });

    setNewInvestment({
      name: '',
      type: '',
      amount: '',
      description: ''
    });
    setShowInvestmentForm(false);
  };

  const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvestmentCost = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const overallROI = ((totalInvestmentValue - totalInvestmentCost) / totalInvestmentCost) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Investment Tracking</h2>
          <p className="text-muted-foreground">Monitor and manage group investments</p>
        </div>
        <Button onClick={() => setShowInvestmentForm(true)} className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Add Investment
        </Button>
      </div>

      {/* Investment Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalInvestmentCost} className="text-2xl font-bold" showToggle={false} />
            <p className="text-xs text-muted-foreground">Initial investment</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalInvestmentValue} className="text-2xl font-bold" showToggle={false} />
            <p className="text-xs text-muted-foreground">Market value</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallROI.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay 
              amount={totalInvestmentValue - totalInvestmentCost} 
              className="text-2xl font-bold text-green-600" 
              showToggle={false} 
            />
            <p className="text-xs text-muted-foreground">Net gain</p>
          </CardContent>
        </Card>
      </div>

      {showInvestmentForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Add New Investment</CardTitle>
            <CardDescription>Record a new group investment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investmentName">Investment Name *</Label>
                <Input
                  id="investmentName"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                  placeholder="e.g., Downtown Plot"
                />
              </div>
              <div>
                <Label htmlFor="investmentType">Investment Type</Label>
                <select
                  id="investmentType"
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value})}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">Select type</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Stocks">Stocks</option>
                  <option value="Business">Business</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="investmentAmount">Investment Amount (KES) *</Label>
              <Input
                id="investmentAmount"
                type="number"
                value={newInvestment.amount}
                onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
                placeholder="2000000"
              />
            </div>
            <div>
              <Label htmlFor="investmentDescription">Description</Label>
              <Input
                id="investmentDescription"
                value={newInvestment.description}
                onChange={(e) => setNewInvestment({...newInvestment, description: e.target.value})}
                placeholder="Brief description of the investment"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddInvestment}>Add Investment</Button>
              <Button variant="outline" onClick={() => setShowInvestmentForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investment Portfolio */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Track performance of all group investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{investment.name}</h3>
                    <p className="text-sm text-muted-foreground">{investment.type} • Added {investment.dateAdded}</p>
                  </div>
                  <Badge variant={investment.roi > 0 ? 'secondary' : 'destructive'}>
                    {investment.roi > 0 ? '+' : ''}{investment.roi}% ROI
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Initial Investment</p>
                    <p className="font-medium">
                      <CurrencyDisplay amount={investment.amount} showToggle={false} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Value</p>
                    <p className="font-medium">
                      <CurrencyDisplay amount={investment.currentValue} showToggle={false} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit/Loss</p>
                    <p className={`font-medium ${investment.currentValue > investment.amount ? 'text-green-600' : 'text-red-600'}`}>
                      <CurrencyDisplay amount={investment.currentValue - investment.amount} showToggle={false} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Documents</p>
                    <p className="font-medium flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {investment.documents} files
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">View Documents</Button>
                  <Button size="sm" variant="outline">Update Value</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentTracking;
