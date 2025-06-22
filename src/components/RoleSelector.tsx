
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserRoles, UserRole } from '@/hooks/useUserRoles';
import { Users, TrendingUp, CreditCard, Shield } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelected?: () => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelected }) => {
  const { addRole, isAddingRole } = useUserRoles();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roleOptions = [
    {
      role: 'borrower' as UserRole,
      title: 'Borrower',
      description: 'Apply for loans and get funding from investors',
      icon: CreditCard,
      features: ['Apply for personal/business loans', 'Upload documents', 'Track loan status', 'Make repayments']
    },
    {
      role: 'investor' as UserRole,
      title: 'Investor',
      description: 'Fund loans and earn returns on your investments',
      icon: TrendingUp,
      features: ['Browse loan applications', 'Fund promising borrowers', 'Earn interest returns', 'Track portfolio performance']
    },
    {
      role: 'chama_member' as UserRole,
      title: 'Chama Member',
      description: 'Join investment groups and participate in group savings',
      icon: Users,
      features: ['Join investment groups', 'Make contributions', 'Access group loans', 'Participate in voting']
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    addRole({ role, isPrimary: true });
    onRoleSelected?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
        <p className="text-muted-foreground">Select how you'd like to use ChamaVault</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {roleOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card 
              key={option.role} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === option.role ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleRoleSelect(option.role)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4" 
                  disabled={isAddingRole}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect(option.role);
                  }}
                >
                  {isAddingRole ? 'Setting up...' : `Continue as ${option.title}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
