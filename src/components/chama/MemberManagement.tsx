
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, User, Mail, Shield } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';

interface MemberManagementProps {
  chamaData: any;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ chamaData }) => {
  const { toast } = useToast();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const members = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Chair', joinDate: '2023-01-15', totalContributions: 60000, loansCount: 2, status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Treasurer', joinDate: '2023-01-20', totalContributions: 55000, loansCount: 1, status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Member', joinDate: '2023-02-01', totalContributions: 45000, loansCount: 0, status: 'active' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Member', joinDate: '2023-02-15', totalContributions: 40000, loansCount: 1, status: 'pending' }
  ];

  const handleInviteMember = () => {
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${inviteEmail}`,
    });

    setInviteEmail('');
    setShowInviteForm(false);
  };

  const handleApproveMembers = (memberId: string, memberName: string) => {
    toast({
      title: "Member Approved",
      description: `${memberName} has been approved and added to the group`,
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Chair': return 'default';
      case 'Treasurer': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Member Management</h2>
          <p className="text-muted-foreground">Manage group members and their roles</p>
        </div>
        <Button onClick={() => setShowInviteForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {showInviteForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Invite New Member</CardTitle>
            <CardDescription>Send an invitation to join the group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleInviteMember}>Send Invitation</Button>
              <Button variant="outline" onClick={() => setShowInviteForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Member Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.filter(m => m.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.filter(m => m.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Officers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.filter(m => m.role !== 'Member').length}</div>
            <p className="text-xs text-muted-foreground">Chair & Treasurer</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Contribution</CardTitle>
            <CurrencyDisplay 
              amount={members.reduce((sum, m) => sum + m.totalContributions, 0) / members.length} 
              className="h-4 w-4 text-muted-foreground text-xs" 
              showToggle={false} 
            />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay 
              amount={members.reduce((sum, m) => sum + m.totalContributions, 0) / members.length} 
              className="text-2xl font-bold" 
              showToggle={false} 
            />
            <p className="text-xs text-muted-foreground">Per member</p>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Members List</CardTitle>
          <CardDescription>View and manage all group members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </p>
                    <p className="text-xs text-muted-foreground">Joined: {member.joinDate}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                  <p className="text-sm">
                    <CurrencyDisplay amount={member.totalContributions} showToggle={false} />
                  </p>
                  <p className="text-xs text-muted-foreground">{member.loansCount} loans</p>
                </div>
                <div className="flex gap-2">
                  {member.status === 'pending' && (
                    <Button size="sm" onClick={() => handleApproveMembers(member.id, member.name)}>
                      Approve
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberManagement;
