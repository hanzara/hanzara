
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, Bell, FileText } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';

interface SavingsContributionsProps {
  chamaData: any;
}

const SavingsContributions: React.FC<SavingsContributionsProps> = ({ chamaData }) => {
  const { toast } = useToast();
  const [contributionAmount, setContributionAmount] = useState('5000');

  const contributionSettings = {
    amount: 5000,
    frequency: 'monthly',
    dueDate: '15th of each month',
    reminderDays: 3
  };

  const recentContributions = [
    { id: '1', member: 'John Doe', amount: 5000, date: '2024-01-15', method: 'M-PESA', status: 'completed' },
    { id: '2', member: 'Jane Smith', amount: 5000, date: '2024-01-15', method: 'Bank Transfer', status: 'completed' },
    { id: '3', member: 'Mike Johnson', amount: 5000, date: '2024-01-14', method: 'Cash', status: 'pending' },
    { id: '4', member: 'Sarah Wilson', amount: 5000, date: '2024-01-13', method: 'M-PESA', status: 'completed' }
  ];

  const handleMakeContribution = () => {
    toast({
      title: "Contribution Initiated",
      description: `Your contribution of KES ${contributionAmount} has been initiated`,
    });
  };

  const handleSendReminder = () => {
    toast({
      title: "Reminders Sent",
      description: "Payment reminders have been sent to all members with pending contributions",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Savings & Contributions</h2>
          <p className="text-muted-foreground">Manage group savings and member contributions</p>
        </div>
        <Button onClick={handleSendReminder} className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Send Reminders
        </Button>
      </div>

      {/* Contribution Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Contribution Settings</CardTitle>
          <CardDescription>Current contribution requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-lg font-bold">
                <CurrencyDisplay amount={contributionSettings.amount} showToggle={false} />
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-muted-foreground">Frequency</p>
              <p className="text-lg font-bold capitalize">{contributionSettings.frequency}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="text-lg font-bold">{contributionSettings.dueDate}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Bell className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-muted-foreground">Reminder</p>
              <p className="text-lg font-bold">{contributionSettings.reminderDays} days before</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Make Contribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Make Contribution</CardTitle>
            <CardDescription>Submit your monthly contribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Contribution Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="5000"
              />
            </div>
            <div>
              <Label htmlFor="method">Payment Method</Label>
              <select id="method" className="w-full p-2 border rounded-md bg-background">
                <option value="mpesa">M-PESA</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="app">In-App Payment</option>
              </select>
            </div>
            <Button onClick={handleMakeContribution} className="w-full">
              Make Contribution
            </Button>
          </CardContent>
        </Card>

        {/* Payment Statistics */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Payment Statistics</CardTitle>
            <CardDescription>This month's contribution summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span>Completed Payments</span>
                <Badge variant="secondary">
                  {recentContributions.filter(c => c.status === 'completed').length}/{recentContributions.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span>Pending Payments</span>
                <Badge variant="destructive">
                  {recentContributions.filter(c => c.status === 'pending').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span>Total Collected</span>
                <CurrencyDisplay 
                  amount={recentContributions.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.amount, 0)} 
                  showToggle={false} 
                  className="font-bold"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contributions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Contributions
          </CardTitle>
          <CardDescription>Latest contribution transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentContributions.map((contribution) => (
              <div key={contribution.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    contribution.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                  <div>
                    <h3 className="font-medium">{contribution.member}</h3>
                    <p className="text-sm text-muted-foreground">{contribution.date} • {contribution.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <CurrencyDisplay amount={contribution.amount} showToggle={false} className="font-medium" />
                  <Badge variant={contribution.status === 'completed' ? 'secondary' : 'destructive'} className="ml-2">
                    {contribution.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsContributions;
