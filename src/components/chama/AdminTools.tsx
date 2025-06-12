
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, FileText, Shield, Bell } from 'lucide-react';

interface AdminToolsProps {
  chamaData: any;
}

const AdminTools: React.FC<AdminToolsProps> = ({ chamaData }) => {
  const adminActions = [
    { title: 'Customize Branding', description: 'Upload logo and customize group appearance', icon: User, action: 'Edit Branding' },
    { title: 'Export Data', description: 'Download complete group data for record keeping', icon: FileText, action: 'Export Now' },
    { title: 'Archive Chama', description: 'Archive this group while preserving all data', icon: Shield, action: 'Archive' },
    { title: 'Send Announcement', description: 'Broadcast message to all members', icon: Bell, action: 'Create' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Tools</h2>
        <p className="text-muted-foreground">Administrative controls and group management</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Group Settings</CardTitle>
          <CardDescription>Customize your group's appearance and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="groupLogo">Group Logo</Label>
            <Input id="groupLogo" type="file" accept="image/*" />
          </div>
          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input id="groupName" defaultValue={chamaData.name} />
          </div>
          <div>
            <Label htmlFor="groupDescription">Description</Label>
            <Input id="groupDescription" defaultValue={chamaData.description} />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {adminActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {action.title}
                </CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant={action.action === 'Archive' ? 'destructive' : 'default'}>
                  {action.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminTools;
