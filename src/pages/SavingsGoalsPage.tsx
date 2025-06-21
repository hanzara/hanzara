
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  Zap,
  Trophy,
  Gift,
  Star,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  ShoppingBag,
  Smartphone,
  Coffee
} from 'lucide-react';

const SavingsGoalsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      targetAmount: 50000,
      currentAmount: 12500,
      targetDate: "2024-12-31",
      category: "emergency",
      autoSave: true,
      monthlyTarget: 3125,
      priority: "high",
      description: "Build a 6-month emergency fund for financial security"
    },
    {
      id: 2,
      name: "Dream Vacation",
      targetAmount: 80000,
      currentAmount: 25000,
      targetDate: "2024-08-15",
      category: "travel",
      autoSave: false,
      monthlyTarget: 6667,
      priority: "medium",
      description: "Safari trip to Maasai Mara and Zanzibar"
    }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: "First Goal Created", description: "Created your first savings goal", unlocked: true, icon: Target },
    { id: 2, title: "Quarter Way There", description: "Reached 25% of any goal", unlocked: true, icon: TrendingUp },
    { id: 3, title: "Consistent Saver", description: "Made deposits for 30 consecutive days", unlocked: false, icon: Calendar },
    { id: 4, title: "Goal Crusher", description: "Completed your first savings goal", unlocked: false, icon: Trophy }
  ]);

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: '',
    description: '',
    autoSave: false,
    monthlyTarget: ''
  });

  const goalCategories = [
    { value: 'emergency', label: 'Emergency Fund', icon: Target, color: 'bg-red-500' },
    { value: 'travel', label: 'Travel', icon: Plane, color: 'bg-blue-500' },
    { value: 'education', label: 'Education', icon: GraduationCap, color: 'bg-green-500' },
    { value: 'home', label: 'Home', icon: Home, color: 'bg-purple-500' },
    { value: 'car', label: 'Vehicle', icon: Car, color: 'bg-orange-500' },
    { value: 'health', label: 'Health', icon: Heart, color: 'bg-pink-500' },
    { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-indigo-500' },
    { value: 'gadgets', label: 'Gadgets', icon: Smartphone, color: 'bg-teal-500' }
  ];

  const calculateProgress = (current, target) => {
    const currentNum = Number(current) || 0;
    const targetNum = Number(target) || 1;
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const goal = {
      id: goals.length + 1,
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: 0,
      targetDate: newGoal.targetDate,
      category: newGoal.category,
      description: newGoal.description,
      autoSave: newGoal.autoSave,
      monthlyTarget: Number(newGoal.monthlyTarget),
      priority: 'medium'
    };

    setGoals([...goals, goal]);
    setNewGoal({
      name: '',
      targetAmount: '',
      targetDate: '',
      category: '',
      description: '',
      autoSave: false,
      monthlyTarget: ''
    });

    toast({
      title: "Goal Created!",
      description: `Your ${goal.name} savings goal has been created successfully.`
    });
  };

  const handleDeposit = (goalId, amount) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.currentAmount + Number(amount);
        const isCompleted = newAmount >= goal.targetAmount;
        
        if (isCompleted) {
          toast({
            title: "🎉 Goal Completed!",
            description: `Congratulations! You've reached your ${goal.name} goal!`
          });
        }
        
        return { ...goal, currentAmount: newAmount };
      }
      return goal;
    }));

    toast({
      title: "Deposit Successful",
      description: `KES ${amount} has been added to your savings goal.`
    });
  };

  const getCategoryIcon = (category) => {
    const cat = goalCategories.find(c => c.value === category);
    return cat ? cat.icon : Target;
  };

  const getCategoryColor = (category) => {
    const cat = goalCategories.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Savings Goals</h1>
          <p className="text-lg text-gray-600">Turn your dreams into achievable financial goals</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">KES {totalSaved.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">KES {totalTarget.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{goals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{completedGoals}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals">My Goals</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Savings Goals</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Savings Goal</DialogTitle>
                    <DialogDescription>
                      Set up a new savings goal to track your progress
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goal-name">Goal Name</Label>
                      <Input
                        id="goal-name"
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                        placeholder="e.g., Emergency Fund"
                      />
                    </div>
                    <div>
                      <Label htmlFor="target-amount">Target Amount (KES)</Label>
                      <Input
                        id="target-amount"
                        type="number"
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="target-date">Target Date</Label>
                      <Input
                        id="target-date"
                        type="date"
                        value={newGoal.targetDate}
                        onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {goalCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                        placeholder="Brief description of your goal"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-save"
                        checked={newGoal.autoSave}
                        onCheckedChange={(checked) => setNewGoal({ ...newGoal, autoSave: checked })}
                      />
                      <Label htmlFor="auto-save">Enable Auto-Save</Label>
                    </div>
                    <Button onClick={handleCreateGoal} className="w-full">
                      Create Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const Icon = getCategoryIcon(goal.category);
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                
                return (
                  <Card key={goal.id} className="relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-2 ${getCategoryColor(goal.category)}`} />
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)} text-white`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{goal.name}</CardTitle>
                            <CardDescription className="text-sm">{goal.description}</CardDescription>
                          </div>
                        </div>
                        {goal.autoSave && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="mr-1 h-3 w-3" />
                            Auto
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-semibold">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Saved</p>
                          <p className="font-semibold text-green-600">KES {goal.currentAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Target</p>
                          <p className="font-semibold">KES {goal.targetAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-gray-600">Target Date</p>
                        <p className="font-semibold">{new Date(goal.targetDate).toLocaleDateString()}</p>
                      </div>

                      <Separator />

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1">Add Money</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Add to {goal.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="deposit-amount">Amount (KES)</Label>
                                <Input
                                  id="deposit-amount"
                                  type="number"
                                  placeholder="1000"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      const amount = e.target.value;
                                      if (amount) {
                                        handleDeposit(goal.id, amount);
                                        e.target.value = '';
                                      }
                                    }
                                  }}
                                />
                              </div>
                              <Button 
                                onClick={() => {
                                  const input = document.getElementById('deposit-amount');
                                  const amount = input.value;
                                  if (amount) {
                                    handleDeposit(goal.id, amount);
                                    input.value = '';
                                  }
                                }}
                                className="w-full"
                              >
                                Add Money
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" className="px-3">
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card key={achievement.id} className={`relative ${achievement.unlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                              {achievement.title}
                            </h3>
                            <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.unlocked && (
                            <Trophy className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Savings Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span>Monthly Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-green-600">
                        KES 8,500
                      </div>
                      <p className="text-sm text-gray-600">
                        Average monthly savings across all goals
                      </p>
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">+12% from last month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <span>Goal Completion Rate</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-blue-600">
                        68%
                      </div>
                      <p className="text-sm text-gray-600">
                        Average progress across all active goals
                      </p>
                      <Progress value={68} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SavingsGoalsPage;
