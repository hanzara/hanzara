
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, FileText, Bell } from 'lucide-react';

interface MeetingsVotingProps {
  chamaData: any;
}

const MeetingsVoting: React.FC<MeetingsVotingProps> = ({ chamaData }) => {
  const { toast } = useToast();
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);

  const upcomingMeetings = [
    { id: '1', title: 'Monthly General Meeting', date: '2024-01-15', time: '18:00', location: 'Community Hall', attendees: 18, status: 'scheduled' },
    { id: '2', title: 'Investment Committee Meeting', date: '2024-01-22', time: '19:00', location: 'Online', attendees: 5, status: 'scheduled' }
  ];

  const activePolls = [
    { id: '1', question: 'Should we invest in the downtown plot?', deadline: '2024-01-20', totalVotes: 15, yourVote: null, options: [
      { text: 'Yes, proceed with investment', votes: 12 },
      { text: 'No, wait for better opportunity', votes: 3 }
    ]},
    { id: '2', question: 'New contribution amount for next year?', deadline: '2024-01-25', totalVotes: 8, yourVote: 'KES 6,000', options: [
      { text: 'Keep current KES 5,000', votes: 3 },
      { text: 'Increase to KES 6,000', votes: 4 },
      { text: 'Increase to KES 7,000', votes: 1 }
    ]}
  ];

  const handleScheduleMeeting = () => {
    toast({
      title: "Meeting Scheduled",
      description: "Meeting has been scheduled and invitations will be sent",
    });
    setShowMeetingForm(false);
  };

  const handleCreatePoll = () => {
    toast({
      title: "Poll Created",
      description: "Poll has been created and members can now vote",
    });
    setShowPollForm(false);
  };

  const handleVote = (pollId: string, optionText: string) => {
    toast({
      title: "Vote Recorded",
      description: `Your vote for "${optionText}" has been recorded`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meetings & Voting</h2>
          <p className="text-muted-foreground">Schedule meetings and conduct group voting</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowPollForm(true)} variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Create Poll
          </Button>
          <Button onClick={() => setShowMeetingForm(true)} className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {showMeetingForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Schedule New Meeting</CardTitle>
            <CardDescription>Set up a meeting for the group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meetingTitle">Meeting Title *</Label>
              <Input id="meetingTitle" placeholder="Monthly General Meeting" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meetingDate">Date</Label>
                <Input id="meetingDate" type="date" />
              </div>
              <div>
                <Label htmlFor="meetingTime">Time</Label>
                <Input id="meetingTime" type="time" />
              </div>
            </div>
            <div>
              <Label htmlFor="meetingLocation">Location</Label>
              <Input id="meetingLocation" placeholder="Community Hall or Online" />
            </div>
            <div>
              <Label htmlFor="agenda">Agenda</Label>
              <Input id="agenda" placeholder="Meeting agenda items" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
              <Button variant="outline" onClick={() => setShowMeetingForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showPollForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Create New Poll</CardTitle>
            <CardDescription>Create a poll for group decision making</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pollQuestion">Poll Question *</Label>
              <Input id="pollQuestion" placeholder="What should we vote on?" />
            </div>
            <div>
              <Label htmlFor="pollDeadline">Voting Deadline</Label>
              <Input id="pollDeadline" type="datetime-local" />
            </div>
            <div>
              <Label>Poll Options</Label>
              <div className="space-y-2">
                <Input placeholder="Option 1" />
                <Input placeholder="Option 2" />
                <Button variant="outline" size="sm">Add Option</Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreatePoll}>Create Poll</Button>
              <Button variant="outline" onClick={() => setShowPollForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Meetings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Meetings
            </CardTitle>
            <CardDescription>Scheduled group meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{meeting.title}</h3>
                    <Badge variant="secondary">{meeting.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {meeting.date} at {meeting.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {meeting.attendees} expected attendees
                    </p>
                    <p>Location: {meeting.location}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">
                      <Bell className="h-3 w-3 mr-1" />
                      Send Reminder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Polls */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Polls
            </CardTitle>
            <CardDescription>Ongoing group voting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePolls.map((poll) => (
                <div key={poll.id} className="p-4 border rounded-lg bg-white/50">
                  <div className="mb-3">
                    <h3 className="font-medium mb-1">{poll.question}</h3>
                    <p className="text-sm text-muted-foreground">
                      Deadline: {poll.deadline} • {poll.totalVotes} votes so far
                    </p>
                  </div>
                  <div className="space-y-2">
                    {poll.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{option.text}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{option.votes} votes</span>
                          {poll.yourVote !== option.text && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleVote(poll.id, option.text)}
                            >
                              Vote
                            </Button>
                          )}
                          {poll.yourVote === option.text && (
                            <Badge variant="secondary">Your Vote</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeetingsVoting;
