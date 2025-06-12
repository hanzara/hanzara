
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign } from 'lucide-react';

interface ReportsStatementsProps {
  chamaData: any;
}

const ReportsStatements: React.FC<ReportsStatementsProps> = ({ chamaData }) => {
  const reportTypes = [
    { name: 'Monthly Contribution Report', description: 'Member contributions for the current month', icon: DollarSign },
    { name: 'Loan Statement', description: 'Detailed loan portfolio and repayment status', icon: FileText },
    { name: 'Balance Sheet', description: 'Complete financial position of the group', icon: FileText },
    { name: 'Member Summary', description: 'Individual member activity and standings', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reports & Statements</h2>
        <p className="text-muted-foreground">Generate and download financial reports</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report, index) => {
          const IconComponent = report.icon;
          return (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {report.name}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm">Generate PDF</Button>
                  <Button size="sm" variant="outline">Email Report</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsStatements;
