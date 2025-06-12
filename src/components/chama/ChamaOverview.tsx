
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, Calendar, FileText, Bell } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';

interface ChamaOverviewProps {
  chamaData: any;
}

const ChamaOverview: React.FC<ChamaOverviewProps> = ({ chamaData }) => {
  const upcomingEvents = [
    { type: 'meeting', title: 'Monthly Meeting', date: '2024-01-15', time: '6:00 PM' },
    { type: 'deadline', title: 'Contribution Deadline', date: '2024-01-20', time: '11:59 PM' },
    { type: 'vote', title: 'Investment Proposal Vote', date: '2024-01-25', time: '6:00 PM' }
  ];

  const recentActivity = [
    { member: 'John Doe', action: 'Made contribution', amount: 5000, date: '2 hours ago' },
    { member: 'Jane Smith', action: 'Applied for loan', amount: 50000, date: '1 day ago' },
    { member: 'Mike Johnson', action: 'Joined group', amount: null, date: '3 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={chamaData.totalSavings} className="text-2xl font-bold text-white" showToggle={false} />
            <p className="text-xs text-blue-100">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Loans Issued</CardTitle>
            <FileText className="h-4 w-4 text-green-200" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={chamaData.loansIssued} className="text-2xl font-bold text-white" showToggle={false} />
            <p className="text-xs text-green-100">{chamaData.activeLoans} active loans</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Total Members</CardTitle>
            <Users className="h-4 w-4 text-purple-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chamaData.memberCount}</div>
            <p className="text-xs text-purple-100">+3 this month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Monthly Contributions</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-200" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={chamaData.totalContributions / 12} className="text-2xl font-bold text-white" showToggle={false} />
            <p className="text-xs text-orange-100">Average per month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Important dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                </div>
                <Badge variant={event.type === 'deadline' ? 'destructive' : 'secondary'}>
                  {event.type}
                </Badge>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              View Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest member activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="font-medium">{activity.member}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                    {activity.amount && (
                      <span className="ml-1">
                        - <CurrencyDisplay amount={activity.amount} showToggle={false} />
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChamaOverview;
