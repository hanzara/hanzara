import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const upcomingContributions = [
    { chama: 'Unity Savings Group', amount: 5000, date: '2024-01-15', status: 'pending' },
    { chama: 'School Fees Chama', amount: 3000, date: '2024-01-12', status: 'due' }
  ];

  const recentActivity = [
    { type: 'contribution', chama: 'Unity Savings Group', amount: 5000, date: '2023-12-15' },
    { type: 'payout', chama: 'School Fees Chama', amount: 24000, date: '2023-12-10' },
    { type: 'joined', chama: 'Tech Entrepreneurs Chama', date: '2023-12-05' }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-chama':
        navigate('/create-chama');
        break;
      case 'invite-members':
        navigate('/invite-members');
        break;
      case 'make-contribution':
        navigate('/make-contribution');
        break;
      case 'schedule-payment':
        navigate('/schedule-payment');
        break;
      case 'view-analytics':
        navigate('/analytics');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Welcome to Chama Circle Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build wealth together through digital savings groups. Join thousands of Kenyans saving and investing as a community.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <CurrencyDisplay amount={336000} className="text-2xl font-bold text-white" showToggle={false} />
              <p className="text-xs text-blue-100">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Chamas</CardTitle>
              <Users className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-green-100">Both performing well</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Monthly Contribution</CardTitle>
              <Calendar className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <CurrencyDisplay amount={8000} className="text-2xl font-bold text-white" showToggle={false} />
              <p className="text-xs text-purple-100">Next due Jan 12</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.5%</div>
              <p className="text-xs text-orange-100">Annual return</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Contributions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Contributions
              </CardTitle>
              <CardDescription>Your scheduled payments this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingContributions.map((contribution, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{contribution.chama}</p>
                    <p className="text-sm text-muted-foreground">{contribution.date}</p>
                  </div>
                  <div className="text-right">
                    <CurrencyDisplay amount={contribution.amount} showToggle={false} className="font-medium" />
                    <Badge variant={contribution.status === 'due' ? 'destructive' : 'secondary'} className="ml-2">
                      {contribution.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View All Contributions
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest chama transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'contribution' ? 'bg-green-500' :
                    activity.type === 'payout' ? 'bg-blue-500' : 'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.type === 'contribution' ? 'Contribution made' :
                       activity.type === 'payout' ? 'Payout received' : 'Joined chama'}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.chama}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  {activity.amount && (
                    <CurrencyDisplay amount={activity.amount} showToggle={false} className="text-sm font-medium" />
                  )}
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>What would you like to do today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickAction('create-chama')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Chama
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickAction('invite-members')}
              >
                <Users className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickAction('make-contribution')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Make Contribution
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickAction('schedule-payment')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Payment
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickAction('view-analytics')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Savings Journey?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of Kenyans who are building wealth through community savings. 
              Create your first chama today and start achieving your financial goals together.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary">
                Create Your First Chama
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Discover Existing Chamas
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
