
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Clock, 
  Coins,
  Award,
  Lock,
  Unlock,
  Calculator,
  Star,
  Target,
  PieChart
} from 'lucide-react';

const StakingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPool, setSelectedPool] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');

  const stakingPools = [
    {
      id: 1,
      name: 'USDC Flex Pool',
      asset: 'USDC',
      apy: 8.5,
      tvl: 125000000,
      minStake: 100,
      lockPeriod: 0,
      type: 'flexible',
      riskLevel: 'Low',
      features: ['Instant withdrawal', 'Daily rewards', 'Auto-compound'],
      description: 'Flexible staking with no lock period'
    },
    {
      id: 2,
      name: 'BTC Genesis Pool',
      asset: 'BTC',
      apy: 12.8,
      tvl: 89000000,
      minStake: 0.001,
      lockPeriod: 30,
      type: 'fixed',
      riskLevel: 'Medium',
      features: ['Higher rewards', 'Bonus multipliers', 'Early unlock penalty'],
      description: '30-day locked staking with premium rewards'
    },
    {
      id: 3,
      name: 'ETH Validator Pool',
      asset: 'ETH',
      apy: 15.2,
      tvl: 67000000,
      minStake: 0.1,
      lockPeriod: 90,
      type: 'validator',
      riskLevel: 'Medium',
      features: ['Validator rewards', 'MEV rewards', 'Slashing protection'],
      description: 'Participate in Ethereum validation with professional operators'
    },
    {
      id: 4,
      name: 'DeFi Yield Farm',
      asset: 'Multi',
      apy: 25.4,
      tvl: 45000000,
      minStake: 500,
      lockPeriod: 180,
      type: 'farming',
      riskLevel: 'High',
      features: ['Liquidity mining', 'Governance tokens', 'Impermanent loss protection'],
      description: 'High-yield farming across multiple DeFi protocols'
    }
  ];

  const myStakes = [
    {
      id: 1,
      poolName: 'USDC Flex Pool',
      asset: 'USDC',
      stakedAmount: 5000,
      earnedRewards: 142.50,
      apy: 8.5,
      stakingDate: '2024-01-15',
      unlockDate: null,
      status: 'active'
    },
    {
      id: 2,
      poolName: 'BTC Genesis Pool',
      asset: 'BTC',
      stakedAmount: 0.05,
      earnedRewards: 0.002,
      apy: 12.8,
      stakingDate: '2024-02-01',
      unlockDate: '2024-03-02',
      status: 'locked'
    }
  ];

  const rewardsHistory = [
    { date: '2024-06-19', amount: 2.85, asset: 'USDC', source: 'USDC Flex Pool' },
    { date: '2024-06-18', amount: 0.00008, asset: 'BTC', source: 'BTC Genesis Pool' },
    { date: '2024-06-17', amount: 2.82, asset: 'USDC', source: 'USDC Flex Pool' },
  ];

  const handleStake = () => {
    if (!selectedPool || !stakeAmount) {
      toast({
        title: "Missing Information",
        description: "Please select a pool and enter stake amount",
        variant: "destructive"
      });
      return;
    }

    const pool = stakingPools.find(p => p.id.toString() === selectedPool);
    toast({
      title: "Staking Successful! 🎉",
      description: `Successfully staked in ${pool?.name}. Rewards will start accumulating immediately.`,
    });
  };

  const handleUnstake = (stakeId: number) => {
    toast({
      title: "Unstaking Initiated! 💫",
      description: "Your funds will be available after the cooldown period.",
    });
  };

  const calculateRewards = (amount: number, apy: number, days: number) => {
    return (amount * (apy / 100) * (days / 365)).toFixed(2);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Staking Hub</h1>
          <p className="text-muted-foreground">Earn passive income by staking your crypto assets</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Total Staked</span>
              </div>
              <div className="text-2xl font-bold">KES 425,320</div>
              <div className="text-sm text-green-600">+12.5% this month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Total Rewards</span>
              </div>
              <div className="text-2xl font-bold">KES 18,650</div>
              <div className="text-sm text-green-600">+8.2% this week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Avg APY</span>
              </div>
              <div className="text-2xl font-bold">11.4%</div>
              <div className="text-sm text-muted-foreground">Across all pools</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">Active Stakes</span>
              </div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Pools</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pools">Staking Pools</TabsTrigger>
            <TabsTrigger value="my-stakes">My Stakes</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stakingPools.map((pool) => (
                <Card key={pool.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Coins className="w-4 h-4 text-white" />
                        </div>
                        {pool.name}
                      </CardTitle>
                      <Badge className={getRiskColor(pool.riskLevel)}>
                        {pool.riskLevel} Risk
                      </Badge>
                    </div>
                    <CardDescription>{pool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{pool.apy}%</div>
                        <div className="text-sm text-muted-foreground">APY</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold">KES {(pool.tvl / 1000000).toFixed(1)}M</div>
                        <div className="text-sm text-muted-foreground">TVL</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Min Stake:</span>
                        <span>{pool.minStake} {pool.asset}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lock Period:</span>
                        <span>{pool.lockPeriod === 0 ? 'Flexible' : `${pool.lockPeriod} days`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Type:</span>
                        <span className="capitalize">{pool.type}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {pool.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          Stake Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Stake in {pool.name}</DialogTitle>
                          <DialogDescription>
                            Start earning {pool.apy}% APY on your {pool.asset}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Amount to Stake</Label>
                            <Input 
                              type="number" 
                              placeholder={`Min: ${pool.minStake} ${pool.asset}`}
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(e.target.value)}
                            />
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Rewards</div>
                            <div className="font-semibold">
                              {stakeAmount ? calculateRewards(parseFloat(stakeAmount), pool.apy, 30) : '0'} {pool.asset}
                            </div>
                          </div>
                          <Button 
                            onClick={() => {
                              setSelectedPool(pool.id.toString());
                              handleStake();
                            }} 
                            className="w-full"
                          >
                            Confirm Stake
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-stakes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Active Stakes</CardTitle>
                <CardDescription>Manage your staking positions</CardDescription>
              </CardHeader>
              <CardContent>
                {myStakes.length > 0 ? (
                  <div className="space-y-4">
                    {myStakes.map((stake) => (
                      <div key={stake.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-semibold">{stake.poolName}</div>
                            <div className="text-sm text-muted-foreground">
                              Staked: {stake.stakedAmount} {stake.asset}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={stake.status === 'active' ? 'default' : 'secondary'}>
                              {stake.status === 'locked' ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                              {stake.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Earned Rewards</div>
                            <div className="font-semibold text-green-600">
                              {stake.earnedRewards} {stake.asset}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">APY</div>
                            <div className="font-semibold">{stake.apy}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Staking Date</div>
                            <div className="font-semibold">{stake.stakingDate}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Unlock Date</div>
                            <div className="font-semibold">
                              {stake.unlockDate || 'Flexible'}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Claim Rewards
                          </Button>
                          <Button size="sm" variant="outline">
                            Add More
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleUnstake(stake.id)}
                            disabled={stake.status === 'locked'}
                          >
                            {stake.status === 'locked' ? 'Locked' : 'Unstake'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active stakes</p>
                    <Button className="mt-4" onClick={() => document.querySelector('[value="pools"]')?.click()}>
                      Start Staking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rewards History</CardTitle>
                <CardDescription>Track your staking rewards over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rewardsHistory.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{reward.source}</div>
                          <div className="text-sm text-muted-foreground">{reward.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          +{reward.amount} {reward.asset}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Staking Calculator
                </CardTitle>
                <CardDescription>Calculate potential returns from staking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Stake Amount</Label>
                      <Input type="number" placeholder="Enter amount" />
                    </div>
                    <div>
                      <Label>Staking Pool</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pool" />
                        </SelectTrigger>
                        <SelectContent>
                          {stakingPools.map((pool) => (
                            <SelectItem key={pool.id} value={pool.id.toString()}>
                              {pool.name} - {pool.apy}% APY
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Staking Period (Days)</Label>
                      <Input type="number" placeholder="30" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Projected Rewards</div>
                      <div className="text-3xl font-bold text-blue-600">0.00</div>
                      <div className="text-sm text-muted-foreground">Total earnings</div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Daily Rewards</div>
                      <div className="text-2xl font-bold text-green-600">0.00</div>
                      <div className="text-sm text-muted-foreground">Per day</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StakingPage;
