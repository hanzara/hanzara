
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Target, TrendingUp, Calendar, Zap, Gift, Trophy, 
  Car, Home, GraduationCap, Plane, Heart, Smartphone,
  Plus, Edit, CheckCircle, AlertCircle, Clock, Coins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SavingsGoalsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Mock data for savings goals
  const savingsGoals = [
    {
      id: 1,
      name: 'New Car Fund',
      category: 'transport',
      icon: Car,
      targetAmount: 800000,
      currentAmount: 320000,
      startDate: '2024-01-01',
      targetDate: '2024-12-31',
      monthlyContribution: 50000,
      autoSave: true,
      priority: 'high',
      color: '#ef4444'
    },
    {
      id: 2,
      name: 'House Down Payment',
      category: 'housing',
      icon: Home,
      targetAmount: 2000000,
      currentAmount: 650000,
      startDate: '2023-06-01',
      targetDate: '2025-06-01',
      monthlyContribution: 75000,
      autoSave: true,
      priority: 'high',
      color: '#3b82f6'
    },
    {
      id: 3,
      name: 'Masters Degree',
      category: 'education',
      icon: GraduationCap,
      targetAmount: 500000,
      currentAmount: 180000,
      startDate: '2024-02-01',
      targetDate: '2024-08-01',
      monthlyContribution: 55000,
      autoSave: false,
      priority: 'medium',
      color: '#22c55e'
    },
    {
      id: 4,
      name: 'Europe Vacation',
      category: 'travel',
      icon: Plane,
      targetAmount: 300000,
      currentAmount: 120000,
      startDate: '2024-01-01',
      targetDate: '2024-07-01',
      monthlyContribution: 30000,
      autoSave: true,
      priority: 'low',
      color: '#f59e0b'
    }
  ];

  const savingsProgress = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 95000 },
    { month: 'Mar', amount: 150000 },
    { month: 'Apr', amount: 215000 },
    { month: 'May', amount: 285000 },
    { month: 'Jun', amount: 360000 },
  ];

  const goalCategories = [
    { id: 'transport', name: 'Transport', icon: Car, color: 'bg-red-500' },
    { id: 'housing', name: 'Housing', icon: Home, color: 'bg-blue-500' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-green-500' },
    { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-yellow-500' },
    { id: 'emergency', name: 'Emergency Fund', icon: Heart, color: 'bg-red-500' },
    { id: 'gadgets', name: 'Gadgets', icon: Smartphone, color: 'bg-purple-500' },
  ];

  const achievements = [
    { id: 1, name: 'First Goal Creator', description: 'Created your first savings goal', earned: true, points: 100 },
    { id: 2, name: 'Consistent Saver', description: '6 months of consistent contributions', earned: true, points: 500 },
    { id: 3, name: 'Goal Achiever', description: 'Completed your first savings goal', earned: false, points: 1000 },
    { id: 4, name: 'Auto-Save Master', description: 'Set up auto-save for 3+ goals', earned: false, points: 300 },
  ];

  const calculateProgress = (current, target) => {
    return Math.round((current / target) * 100);
  };

  const calculateTimeRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past due';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months`;
    return `${Math.ceil(diffDays / 365)} years`;
  };

  const handleCreateGoal = () => {
    toast({
      title: "Goal Created!",
      description: "Your new savings goal has been set up successfully",
    });
    setNewGoalOpen(false);
  };

  const handleContribute = (goalId, amount) => {
    toast({
      title: "Contribution Added",
      description: `KES ${amount.toLocaleString()} added to your goal`,
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Savings Goals
                </h1>
                <p className="text-muted-foreground text-lg">
                  Set goals, track progress, and achieve your financial dreams
                </p>
              </div>
              <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500">
                    <Plus className="h-4 w-4 mr-2" />
                    New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Savings Goal</DialogTitle>
                    <DialogDescription>
                      Set up a new goal to start saving systematically
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goal-name">Goal Name</Label>
                      <Input id="goal-name" placeholder="e.g., Emergency Fund" />
                    </div>
                    <div>
                      <Label htmlFor="goal-category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {goalCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="target-amount">Target Amount (KES)</Label>
                        <Input id="target-amount" type="number" placeholder="100000" />
                      </div>
                      <div>
                        <Label htmlFor="target-date">Target Date</Label>
                        <Input id="target-date" type="date" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="monthly-amount">Monthly Contribution (KES)</Label>
                      <Input id="monthly-amount" type="number" placeholder="10000" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Auto-Save</Label>
                        <p className="text-xs text-muted-foreground">Automatically save monthly</p>
                      </div>
                      <Switch />
                    </div>
                    <Button onClick={handleCreateGoal} className="w-full">
                      Create Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="goals" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="goals">My Goals</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="autosave">Auto-Save</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="goals">
              <div className="grid gap-6">
                {/* Savings Overview */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Saved</p>
                          <p className="text-3xl font-bold text-green-600">
                            KES {totalSaved.toLocaleString()}
                          </p>
                        </div>
                        <Coins className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Target</p>
                          <p className="text-3xl font-bold text-blue-600">
                            KES {totalTarget.toLocaleString()}
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Goals</p>
                          <p className="text-3xl font-bold text-purple-600">{savingsGoals.length}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Overall Progress</p>
                          <p className="text-3xl font-bold text-orange-600">
                            {Math.round((totalSaved / totalTarget) * 100)}%
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Goals List */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {savingsGoals.map((goal) => {
                    const Icon = goal.icon;
                    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                    const timeRemaining = calculateTimeRemaining(goal.targetDate);
                    
                    return (
                      <Card key={goal.id} className="overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Icon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{goal.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getPriorityColor(goal.priority)}>
                                    {goal.priority}
                                  </Badge>
                                  {goal.autoSave && (
                                    <Badge variant="outline" className="text-green-600 border-green-300">
                                      <Zap className="h-3 w-3 mr-1" />
                                      Auto-Save
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-muted-foreground">Progress</span>
                              <span className="text-sm font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-3" />
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-lg font-bold text-green-600">
                                KES {goal.currentAmount.toLocaleString()}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                of KES {goal.targetAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Monthly Contribution</p>
                              <p className="font-medium">KES {goal.monthlyContribution.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Time Remaining</p>
                              <p className="font-medium">{timeRemaining}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleContribute(goal.id, 5000)}
                            >
                              Add KES 5,000
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleContribute(goal.id, goal.monthlyContribution)}
                            >
                              Monthly Amount
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="progress">
              <div className="grid gap-6">
                {/* Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Savings Progress Over Time</CardTitle>
                    <CardDescription>Track your monthly savings growth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={savingsProgress}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#22c55e" 
                            strokeWidth={3}
                            dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Goal Distribution */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Goals by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={savingsGoals.map(goal => ({
                                name: goal.name,
                                value: goal.currentAmount,
                                fill: goal.color
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              dataKey="value"
                            />
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Savings Milestones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">First KES 100,000 Saved</p>
                            <p className="text-sm text-muted-foreground">Achieved 3 months ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">6 Months Consistent Saving</p>
                            <p className="text-sm text-muted-foreground">Achieved last month</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-600">First Goal Completion</p>
                            <p className="text-sm text-muted-foreground">Coming soon!</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="autosave">
              <div className="grid gap-6">
                {/* Auto-Save Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Auto-Save Settings
                    </CardTitle>
                    <CardDescription>
                      Automate your savings to reach goals faster
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable Auto-Save</h4>
                        <p className="text-sm text-muted-foreground">Automatically transfer money to your goals</p>
                      </div>
                      <Switch checked={autoSaveEnabled} onCheckedChange={setAutoSaveEnabled} />
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Auto-save transfers happen on the 1st of each month. Ensure sufficient balance in your account.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Auto-Save Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle>Goals with Auto-Save</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savingsGoals.filter(goal => goal.autoSave).map((goal) => {
                        const Icon = goal.icon;
                        return (
                          <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Icon className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{goal.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  KES {goal.monthlyContribution.toLocaleString()} monthly on 1st
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="grid gap-6">
                {/* Achievement Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold">2</h3>
                      <p className="text-muted-foreground">Achievements Earned</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Gift className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold">600</h3>
                      <p className="text-muted-foreground">Reward Points</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold">50%</h3>
                      <p className="text-muted-foreground">Completion Rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Achievements List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Your Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <Card key={achievement.id} className={`${
                          achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'
                              }`}>
                                {achievement.earned ? (
                                  <Trophy className="h-6 w-6 text-yellow-600" />
                                ) : (
                                  <Clock className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-medium ${
                                  achievement.earned ? 'text-yellow-900' : 'text-gray-500'
                                }`}>
                                  {achievement.name}
                                </h4>
                                <p className={`text-sm ${
                                  achievement.earned ? 'text-yellow-700' : 'text-gray-400'
                                }`}>
                                  {achievement.description}
                                </p>
                                <Badge variant="outline" className="mt-2">
                                  {achievement.points} points
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SavingsGoalsPage;
