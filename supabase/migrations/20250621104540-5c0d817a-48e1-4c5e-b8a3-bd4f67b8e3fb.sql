
-- Create user roles table for different user types
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('borrower', 'investor', 'chama_member', 'admin')),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own roles during signup
CREATE POLICY "Users can insert their own roles" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create comprehensive loan applications table
CREATE TABLE public.loan_applications_new (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  borrower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Personal Information
  full_name TEXT NOT NULL,
  national_id TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  nationality TEXT DEFAULT 'Kenyan',
  phone_number TEXT NOT NULL,
  email_address TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  postal_address TEXT,
  
  -- Employment/Income Information
  employment_status TEXT NOT NULL CHECK (employment_status IN ('employed', 'self_employed', 'student', 'unemployed')),
  employer_business_name TEXT,
  job_title_business_type TEXT,
  monthly_income NUMERIC NOT NULL,
  employment_length_months INTEGER,
  employer_address TEXT,
  
  -- Loan Details
  loan_amount NUMERIC NOT NULL,
  loan_purpose TEXT NOT NULL,
  loan_term_months INTEGER NOT NULL,
  repayment_frequency TEXT DEFAULT 'monthly' CHECK (repayment_frequency IN ('weekly', 'monthly')),
  repayment_source TEXT,
  
  -- Banking Information
  bank_name TEXT,
  bank_account_number TEXT,
  bank_branch TEXT,
  mpesa_number TEXT,
  
  -- Guarantor Information (JSON array for multiple guarantors)
  guarantors JSONB DEFAULT '[]'::jsonb,
  
  -- Collateral Information (JSON for flexibility)
  collateral JSONB,
  
  -- Application Status and Metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'funded', 'active', 'completed', 'defaulted')),
  risk_rating TEXT CHECK (risk_rating IN ('low', 'medium', 'high')),
  credit_score NUMERIC,
  interest_rate NUMERIC,
  monthly_payment NUMERIC,
  total_amount NUMERIC,
  funding_progress NUMERIC DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  funded_at TIMESTAMP WITH TIME ZONE,
  
  -- Declarations
  terms_accepted BOOLEAN DEFAULT false,
  credit_check_consent BOOLEAN DEFAULT false,
  data_sharing_consent BOOLEAN DEFAULT false
);

-- Enable RLS on loan applications
ALTER TABLE public.loan_applications_new ENABLE ROW LEVEL SECURITY;

-- Policy to allow borrowers to view their own applications
CREATE POLICY "Borrowers can view their own applications" ON public.loan_applications_new
  FOR SELECT USING (auth.uid() = borrower_id);

-- Policy to allow borrowers to insert their own applications
CREATE POLICY "Borrowers can insert their own applications" ON public.loan_applications_new
  FOR INSERT WITH CHECK (auth.uid() = borrower_id);

-- Policy to allow investors to view approved applications
CREATE POLICY "Investors can view approved applications" ON public.loan_applications_new
  FOR SELECT USING (
    status IN ('approved', 'funded', 'active') AND 
    EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'investor')
  );

-- Create loan investments table for investor funding
CREATE TABLE public.loan_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_application_id UUID REFERENCES public.loan_applications_new(id) ON DELETE CASCADE NOT NULL,
  investor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  investment_amount NUMERIC NOT NULL,
  expected_return NUMERIC NOT NULL,
  investment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on loan investments
ALTER TABLE public.loan_investments ENABLE ROW LEVEL SECURITY;

-- Policy to allow investors to view their own investments
CREATE POLICY "Investors can view their own investments" ON public.loan_investments
  FOR SELECT USING (auth.uid() = investor_id);

-- Policy to allow investors to insert their own investments
CREATE POLICY "Investors can insert their own investments" ON public.loan_investments
  FOR INSERT WITH CHECK (auth.uid() = investor_id);

-- Function to calculate risk rating based on application data
CREATE OR REPLACE FUNCTION public.calculate_risk_rating(
  income NUMERIC,
  loan_amount NUMERIC,
  employment_months INTEGER,
  has_collateral BOOLEAN DEFAULT false
) RETURNS TEXT AS $$
BEGIN
  DECLARE
    debt_to_income NUMERIC;
    risk_score INTEGER := 0;
  BEGIN
    -- Calculate debt-to-income ratio
    debt_to_income := (loan_amount / 12) / income;
    
    -- Risk scoring logic
    IF debt_to_income > 0.5 THEN risk_score := risk_score + 3; END IF;
    IF debt_to_income > 0.3 THEN risk_score := risk_score + 2; END IF;
    IF employment_months < 6 THEN risk_score := risk_score + 2; END IF;
    IF employment_months < 12 THEN risk_score := risk_score + 1; END IF;
    IF has_collateral THEN risk_score := risk_score - 1; END IF;
    
    -- Return risk rating
    IF risk_score >= 4 THEN RETURN 'high'; END IF;
    IF risk_score >= 2 THEN RETURN 'medium'; END IF;
    RETURN 'low';
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to update loan application with calculated fields
CREATE OR REPLACE FUNCTION public.process_loan_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate risk rating
  NEW.risk_rating := public.calculate_risk_rating(
    NEW.monthly_income,
    NEW.loan_amount,
    NEW.employment_length_months,
    (NEW.collateral IS NOT NULL AND NEW.collateral != '{}')
  );
  
  -- Set default interest rate based on risk
  IF NEW.interest_rate IS NULL THEN
    NEW.interest_rate := CASE 
      WHEN NEW.risk_rating = 'low' THEN 12.0
      WHEN NEW.risk_rating = 'medium' THEN 18.0
      ELSE 24.0
    END;
  END IF;
  
  -- Calculate monthly payment (simple interest)
  NEW.monthly_payment := (NEW.loan_amount * (1 + (NEW.interest_rate / 100))) / NEW.loan_term_months;
  NEW.total_amount := NEW.monthly_payment * NEW.loan_term_months;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for loan application processing
CREATE TRIGGER process_loan_application_trigger
  BEFORE INSERT OR UPDATE ON public.loan_applications_new
  FOR EACH ROW EXECUTE FUNCTION public.process_loan_application();
