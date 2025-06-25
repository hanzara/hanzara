
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vote, CheckCircle, XCircle, Clock, Users, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VotingSystemProps {
  chamaId?: string;
}

const VotingSystem: React.FC<VotingSystemProps> = ({ chamaId }) => {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);

  // Mock data - in real app, this would come from useQuery
  const votes = [
    {
      id: '1',
      title: 'Increase Monthly Contribution',
      description: 'Proposal to increase monthly contribution from KES 5,000 to KES 7,500 to reach our target faster.',
      type: 'contribution_change',
      initiatedBy: 'John Doe',
      yesVotes: 8,
      noVotes: 2,
      totalEligibleVoters: 15,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: 'active',
      hasVoted: false,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '2',
      title: 'Loan Request - Sarah Wilson',
      description: 'Sarah Wilson has requested a loan of KES 50,000 for business expansion. Interest rate: 8% annually.',
      type: 'loan_approval',
      initiatedBy: 'Sarah Wilson',
      yesVotes: 12,
      noVotes: 1,
      totalEligibleVoters: 15,
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      status: 'active',
      hasVoted: true,
      userVote: 'yes',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: '3',
      title: 'Investment in Real Estate Project',
      description: 'Proposal to invest 30% of our savings (KES 150,000) in a real estate development project.',
      type: 'investment',
      initiatedBy: 'Michael Brown',
      yesVotes: 9,
      noVotes: 6,
      totalEligibleVoters: 15,
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (expired)
      status: 'completed',
      result: 'approved',
      hasVoted: true,
      userVote: 'yes',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    }
  ];

  const activeVotes = votes.filter(vote => vote.status === 'active');
  const completedVotes = votes.filter(vote => vote.status === 'completed');

  const getVoteTypeIcon = (type: string) => {
    switch (type) {
      case 'contribution_change': return '💰';
      case 'loan_approval': return '🏦';
      case 'investment': return '📈';
      case 'member_removal': return '👤';
      default: return '📊';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'expired': return 'outline';
      default: return 'outline';
    }
  };

  const handleVote = (voteId: string, decision: 'yes' | 'no') => {
    // In real app, this would call a mutation
    console.log(`Voting ${decision} on vote ${voteId}`);
    // Show success message
  };

  const calculateProgress = (vote: any) => {
    const totalVotes = vote.yesVotes + vote.noVotes;
    const participation = totalVotes / vote.totalEligibleVoters * 100;
    return participation;
  };

  const VoteCard = ({ vote }: { vote: any }) => (
    <Card key={vote.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getVoteTypeIcon(vote.type)}</span>
            <div>
              <CardTitle className="text-lg">{vote.title}</CardTitle>
              <CardDescription>by {vote.initiatedBy}</CardDescription>
            </div>
          </div>
          <Badge variant={getStatusColor(vote.status)} className="flex items-center gap-1">
            {vote.status === 'active' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
            {vote.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{vote.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Voting Progress</span>
            <span>{vote.yesVotes + vote.noVotes}/{vote.totalEligibleVoters} votes</span>
          </div>
          <Progress value={calculateProgress(vote)} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Yes: {vote.yesVotes}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span>No: {vote.noVotes}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            {vote.status === 'active' ? (
              <>Ends {formatDistanceToNow(vote.deadline, { addSuffix: true })}</>
            ) : (
              <>Ended {formatDistanceToNow(vote.deadline, { addSuffix: true })}</>
            )}
          </div>
          
          {vote.status === 'active' && !vote.hasVoted ? (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleVote(vote.id, 'no')}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-3 w-3 mr-1" />
                No
              </Button>
              <Button 
                size="sm"
                onClick={() => handleVote(vote.id, 'yes')}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Yes
              </Button>
            </div>
          ) : vote.hasVoted ? (
            <Badge variant="outline" className="text-xs">
              You voted: {vote.userVote}
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Voting & Decisions</h2>
          <p className="text-muted-foreground">Participate in democratic decision-making</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Proposal
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Vote className="h-4 w-4" />
            Active Votes ({activeVotes.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedVotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeVotes.length > 0 ? (
            activeVotes.map(vote => <VoteCard key={vote.id} vote={vote} />)
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Vote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground">No active votes at this time</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedVotes.length > 0 ? (
            completedVotes.map(vote => <VoteCard key={vote.id} vote={vote} />)
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground">No completed votes found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VotingSystem;
