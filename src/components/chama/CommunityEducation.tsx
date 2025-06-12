
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Bell } from 'lucide-react';

interface CommunityEducationProps {
  chamaData: any;
}

const CommunityEducation: React.FC<CommunityEducationProps> = ({ chamaData }) => {
  const messages = [
    { id: '1', sender: 'John Doe', message: 'Great meeting today! Looking forward to the investment opportunity.', time: '2 hours ago' },
    { id: '2', sender: 'Jane Smith', message: 'Has everyone submitted their contributions for this month?', time: '1 day ago' },
    { id: '3', sender: 'Admin', message: 'Reminder: Monthly meeting scheduled for January 15th at 6 PM', time: '2 days ago' }
  ];

  const educationResources = [
    { title: 'Financial Literacy Basics', type: 'Article', duration: '10 min read' },
    { title: 'Investment Strategies for SACCOs', type: 'Video', duration: '25 min' },
    { title: 'Understanding Loan Terms', type: 'Guide', duration: '15 min read' },
    { title: 'Business Planning Workshop', type: 'Course', duration: '2 hours' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Community & Education</h2>
        <p className="text-muted-foreground">Group communication and learning resources</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Group Chat
            </CardTitle>
            <CardDescription>Community bulletin board</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              {messages.map((message) => (
                <div key={message.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 p-2 border rounded-md text-sm"
              />
              <Button size="sm">Send</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Education Resources
            </CardTitle>
            <CardDescription>Financial literacy and business skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {educationResources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{resource.title}</h4>
                    <p className="text-xs text-muted-foreground">{resource.type} • {resource.duration}</p>
                  </div>
                  <Button size="sm" variant="outline">Access</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityEducation;
