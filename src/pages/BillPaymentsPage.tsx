
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Receipt, Zap, Calendar, Bell, CreditCard, Smartphone, 
  Lightbulb, Wifi, Car, Home, GraduationCap, Heart,
  CheckCircle, Clock, AlertTriangle, Plus, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const BillPaymentsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedBill, setSelectedBill] = useState(null);
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);

  // Mock data for bills
  const billCategories = [
    { id: 'utilities', name: 'Utilities', icon: Lightbulb, color: 'bg-yellow-500' },
    { id: 'internet', name: 'Internet & TV', icon: Wifi, color: 'bg-blue-500' },
    { id: 'transport', name: 'Transport', icon: Car, color: 'bg-green-500' },
    { id: 'rent', name: 'Rent & Housing', icon: Home, color: 'bg-purple-500' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-indigo-500' },
    { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'bg-red-500' },
  ];

  const upcomingBills = [
    { 
      id: 1, 
      name: 'Kenya Power (KPLC)', 
      category: 'utilities',
      amount: 3500, 
      dueDate: '2024-03-15', 
      status: 'due_soon',
      accountNumber: '12345678',
      autopay: true,
      recurring: 'monthly'
    },
    { 
      id: 2, 
      name: 'Safaricom Fiber', 
      category: 'internet',
      amount: 4999, 
      dueDate: '2024-03-18', 
      status: 'upcoming',
      accountNumber: '0722123456',
      autopay: false,
      recurring: 'monthly'
    },
    { 
      id: 3, 
      name: 'Matatu Sacco', 
      category: 'transport',
      amount: 8000, 
      dueDate: '2024-03-20', 
      status: 'upcoming',
      accountNumber: 'MS001234',
      autopay: true,
      recurring: 'monthly'
    },
  ];

  const recentPayments = [
    { id: 1, name: 'Water Company', amount: 1200, date: '2024-03-10', status: 'completed' },
    { id: 2, name: 'Airtel Money', amount: 500, date: '2024-03-08', status: 'completed' },
    { id: 3, name: 'NHIF', amount: 1700, date: '2024-03-05', status: 'completed' },
  ];

  const billProviders = {
    utilities: [
      { name: 'Kenya Power (KPLC)', paybill: '888880', fields: ['Account Number'] },
      { name: 'Nairobi Water', paybill: '533000', fields: ['Account Number'] },
      { name: 'Nairobi County (Rates)', paybill: '200200', fields: ['Account Number'] },
    ],
    internet: [
      { name: 'Safaricom Fiber', paybill: '600100', fields: ['Phone Number'] },
      { name: 'Airtel Internet', paybill: '100100', fields: ['Account Number'] },
      { name: 'Telkom Kenya', paybill: '220220', fields: ['Phone Number'] },
    ],
    transport: [
      { name: 'Matatu Sacco', paybill: '800800', fields: ['Member Number'] },
      { name: 'Uber', paybill: '600600', fields: ['Phone Number'] },
      { name: 'Bolt', paybill: '700700', fields: ['Phone Number'] },
    ]
  };

  const handlePayBill = (billId) => {
    toast({
      title: "Payment Initiated",
      description: "Your bill payment has been processed successfully",
    });
  };

  const handleSetupAutoPay = (billId) => {
    toast({
      title: "Auto-Pay Activated",
      description: "Automatic payment has been set up for this bill",
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'due_soon': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Receipt className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Bill Payments
                </h1>
                <p className="text-muted-foreground text-lg">
                  Pay bills, set up auto-payments, and never miss a due date
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="pay" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pay">Pay Bills</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Bills</TabsTrigger>
              <TabsTrigger value="autopay">Auto-Pay</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>

            <TabsContent value="pay">
              <div className="grid gap-6">
                {/* Quick Bill Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Pay
                    </CardTitle>
                    <CardDescription>Select a category to pay your bills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {billCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-6 text-center">
                              <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <h4 className="font-medium text-sm">{category.name}</h4>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Bill Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pay Any Bill</CardTitle>
                    <CardDescription>Enter paybill details to pay any service provider</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paybill">Paybill Number</Label>
                        <Input id="paybill" placeholder="e.g., 888880" />
                      </div>
                      <div>
                        <Label htmlFor="account">Account Number</Label>
                        <Input id="account" placeholder="Enter account number" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Amount (KES)</Label>
                        <Input id="amount" type="number" placeholder="0.00" />
                      </div>
                      <div>
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="wallet">ChamaVault Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Bill
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="upcoming">
              <div className="grid gap-6">
                {/* Bills Summary */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Due This Month</p>
                          <p className="text-3xl font-bold text-red-600">KES 16,499</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Bills on Auto-Pay</p>
                          <p className="text-3xl font-bold text-green-600">2 of 3</p>
                        </div>
                        <Zap className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Next Due Date</p>
                          <p className="text-3xl font-bold text-blue-600">Mar 15</p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Bills List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Bills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingBills.map((bill) => (
                        <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Receipt className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{bill.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Due: {bill.dueDate} • Account: {bill.accountNumber}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold">KES {bill.amount.toLocaleString()}</p>
                              <Badge className={getStatusColor(bill.status)}>
                                {bill.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handlePayBill(bill.id)}>
                                Pay Now
                              </Button>
                              {!bill.autopay && (
                                <Button size="sm" variant="outline" onClick={() => handleSetupAutoPay(bill.id)}>
                                  <Zap className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="autopay">
              <div className="grid gap-6">
                {/* Auto-Pay Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Auto-Pay Settings
                    </CardTitle>
                    <CardDescription>
                      Set up automatic payments to never miss a bill
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Auto-Pay</h4>
                        <p className="text-sm text-muted-foreground">Automatically pay bills when due</p>
                      </div>
                      <Switch checked={autoPayEnabled} onCheckedChange={setAutoPayEnabled} />
                    </div>

                    <Alert>
                      <Bell className="h-4 w-4" />
                      <AlertDescription>
                        You'll receive notifications 3 days before auto-payments are processed
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Auto-Pay Bill List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bills with Auto-Pay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingBills.filter(bill => bill.autopay).map((bill) => (
                        <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                          <div className="flex items-center gap-4">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <h4 className="font-medium">{bill.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Auto-pays on {bill.dueDate} • KES {bill.amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Modify
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{payment.name}</h4>
                            <p className="text-sm text-muted-foreground">{payment.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">KES {payment.amount.toLocaleString()}</p>
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default BillPaymentsPage;
