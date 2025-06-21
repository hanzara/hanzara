
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { User, Briefcase, DollarSign, Building, Shield, FileText } from 'lucide-react';

interface LoanApplicationData {
  // Personal Information
  full_name: string;
  national_id: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  nationality: string;
  phone_number: string;
  email_address: string;
  physical_address: string;
  postal_address: string;
  
  // Employment Information
  employment_status: string;
  employer_business_name: string;
  job_title_business_type: string;
  monthly_income: number;
  employment_length_months: number;
  employer_address: string;
  
  // Loan Details
  loan_amount: number;
  loan_purpose: string;
  loan_term_months: number;
  repayment_frequency: string;
  repayment_source: string;
  
  // Banking Information
  bank_name: string;
  bank_account_number: string;
  bank_branch: string;
  mpesa_number: string;
  
  // Declarations
  terms_accepted: boolean;
  credit_check_consent: boolean;
  data_sharing_consent: boolean;
}

const LoanApplicationForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<LoanApplicationData>({
    defaultValues: {
      nationality: 'Kenyan',
      repayment_frequency: 'monthly',
      email_address: user?.email || ''
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: LoanApplicationData) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('loan_applications_new')
        .insert({
          borrower_id: user.id,
          ...data
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully. You'll receive updates via email.",
      });
      queryClient.invalidateQueries({ queryKey: ['loan-applications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit loan application",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoanApplicationData) => {
    submitMutation.mutate(data);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Employment', icon: Briefcase },
    { number: 3, title: 'Loan Details', icon: DollarSign },
    { number: 4, title: 'Banking', icon: Building },
    { number: 5, title: 'Review', icon: FileText }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Loan Application</h1>
        <p className="text-muted-foreground">Complete your loan application in 5 simple steps</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step.number ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="ml-2 hidden md:block">
                <div className="text-sm font-medium">{step.title}</div>
              </div>
              {step.number < steps.length && (
                <div className={`w-12 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        {...register('full_name', { required: 'Full name is required' })}
                        className={errors.full_name ? 'border-destructive' : ''}
                      />
                      {errors.full_name && <p className="text-sm text-destructive mt-1">{errors.full_name.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="national_id">National ID/Passport *</Label>
                      <Input
                        id="national_id"
                        {...register('national_id', { required: 'ID number is required' })}
                        className={errors.national_id ? 'border-destructive' : ''}
                      />
                      {errors.national_id && <p className="text-sm text-destructive mt-1">{errors.national_id.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth *</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        {...register('date_of_birth', { required: 'Date of birth is required' })}
                        className={errors.date_of_birth ? 'border-destructive' : ''}
                      />
                      {errors.date_of_birth && <p className="text-sm text-destructive mt-1">{errors.date_of_birth.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(value) => setValue('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="phone_number">Phone Number *</Label>
                      <Input
                        id="phone_number"
                        {...register('phone_number', { required: 'Phone number is required' })}
                        className={errors.phone_number ? 'border-destructive' : ''}
                      />
                      {errors.phone_number && <p className="text-sm text-destructive mt-1">{errors.phone_number.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email_address">Email Address *</Label>
                      <Input
                        id="email_address"
                        type="email"
                        {...register('email_address', { required: 'Email is required' })}
                        className={errors.email_address ? 'border-destructive' : ''}
                      />
                      {errors.email_address && <p className="text-sm text-destructive mt-1">{errors.email_address.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="physical_address">Physical Address *</Label>
                      <Textarea
                        id="physical_address"
                        {...register('physical_address', { required: 'Physical address is required' })}
                        className={errors.physical_address ? 'border-destructive' : ''}
                      />
                      {errors.physical_address && <p className="text-sm text-destructive mt-1">{errors.physical_address.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Employment Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employment_status">Employment Status *</Label>
                      <Select onValueChange={(value) => setValue('employment_status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self_employed">Self Employed</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="monthly_income">Monthly Income (KES) *</Label>
                      <Input
                        id="monthly_income"
                        type="number"
                        {...register('monthly_income', { 
                          required: 'Monthly income is required',
                          min: { value: 1, message: 'Income must be greater than 0' }
                        })}
                        className={errors.monthly_income ? 'border-destructive' : ''}
                      />
                      {errors.monthly_income && <p className="text-sm text-destructive mt-1">{errors.monthly_income.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="employer_business_name">Employer/Business Name</Label>
                      <Input
                        id="employer_business_name"
                        {...register('employer_business_name')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="job_title_business_type">Job Title/Business Type</Label>
                      <Input
                        id="job_title_business_type"
                        {...register('job_title_business_type')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="employment_length_months">Employment Length (Months)</Label>
                      <Input
                        id="employment_length_months"
                        type="number"
                        {...register('employment_length_months')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Loan Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Loan Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="loan_amount">Loan Amount (KES) *</Label>
                      <Input
                        id="loan_amount"
                        type="number"
                        {...register('loan_amount', { 
                          required: 'Loan amount is required',
                          min: { value: 1000, message: 'Minimum loan amount is KES 1,000' }
                        })}
                        className={errors.loan_amount ? 'border-destructive' : ''}
                      />
                      {errors.loan_amount && <p className="text-sm text-destructive mt-1">{errors.loan_amount.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="loan_term_months">Loan Term (Months) *</Label>
                      <Select onValueChange={(value) => setValue('loan_term_months', parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">12 Months</SelectItem>
                          <SelectItem value="18">18 Months</SelectItem>
                          <SelectItem value="24">24 Months</SelectItem>
                          <SelectItem value="36">36 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="loan_purpose">Loan Purpose *</Label>
                      <Textarea
                        id="loan_purpose"
                        {...register('loan_purpose', { required: 'Loan purpose is required' })}
                        placeholder="Describe how you intend to use this loan..."
                        className={errors.loan_purpose ? 'border-destructive' : ''}
                      />
                      {errors.loan_purpose && <p className="text-sm text-destructive mt-1">{errors.loan_purpose.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="repayment_source">Repayment Source</Label>
                      <Input
                        id="repayment_source"
                        {...register('repayment_source')}
                        placeholder="e.g., salary, business income"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Banking Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Banking Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bank_name">Bank Name</Label>
                      <Input
                        id="bank_name"
                        {...register('bank_name')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bank_account_number">Account Number</Label>
                      <Input
                        id="bank_account_number"
                        {...register('bank_account_number')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bank_branch">Branch</Label>
                      <Input
                        id="bank_branch"
                        {...register('bank_branch')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="mpesa_number">M-Pesa Number</Label>
                      <Input
                        id="mpesa_number"
                        {...register('mpesa_number')}
                        placeholder="254XXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review and Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms_accepted"
                        {...register('terms_accepted', { required: 'You must accept the terms and conditions' })}
                      />
                      <Label htmlFor="terms_accepted" className="text-sm">
                        I accept the terms and conditions of this loan application
                      </Label>
                    </div>
                    {errors.terms_accepted && <p className="text-sm text-destructive">{errors.terms_accepted.message}</p>}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="credit_check_consent"
                        {...register('credit_check_consent', { required: 'Credit check consent is required' })}
                      />
                      <Label htmlFor="credit_check_consent" className="text-sm">
                        I consent to credit checks and verification of my information
                      </Label>
                    </div>
                    {errors.credit_check_consent && <p className="text-sm text-destructive">{errors.credit_check_consent.message}</p>}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="data_sharing_consent"
                        {...register('data_sharing_consent', { required: 'Data sharing consent is required' })}
                      />
                      <Label htmlFor="data_sharing_consent" className="text-sm">
                        I consent to sharing my data with potential investors for funding purposes
                      </Label>
                    </div>
                    {errors.data_sharing_consent && <p className="text-sm text-destructive">{errors.data_sharing_consent.message}</p>}
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Application Summary</h4>
                    <div className="text-sm space-y-1">
                      <p>Loan Amount: KES {watch('loan_amount')?.toLocaleString()}</p>
                      <p>Term: {watch('loan_term_months')} months</p>
                      <p>Monthly Income: KES {watch('monthly_income')?.toLocaleString()}</p>
                      <p>Purpose: {watch('loan_purpose')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default LoanApplicationForm;
