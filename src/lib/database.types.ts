
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone_number: string | null
          id_number: string | null
          address: string | null
          occupation: string | null
          emergency_contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone_number?: string | null
          id_number?: string | null
          address?: string | null
          occupation?: string | null
          emergency_contact?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone_number?: string | null
          id_number?: string | null
          address?: string | null
          occupation?: string | null
          emergency_contact?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chamas: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          contribution_amount: number
          contribution_frequency: string
          max_members: number | null
          created_by: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          contribution_amount: number
          contribution_frequency?: string
          max_members?: number | null
          created_by: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          contribution_amount?: number
          contribution_frequency?: string
          max_members?: number | null
          created_by?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      chama_members: {
        Row: {
          id: string
          chama_id: string
          user_id: string
          role: 'admin' | 'treasurer' | 'secretary' | 'member'
          joined_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          chama_id: string
          user_id: string
          role?: 'admin' | 'treasurer' | 'secretary' | 'member'
          joined_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          chama_id?: string
          user_id?: string
          role?: 'admin' | 'treasurer' | 'secretary' | 'member'
          joined_at?: string
          is_active?: boolean
        }
      }
      contributions: {
        Row: {
          id: string
          chama_id: string
          member_id: string
          amount: number
          contribution_date: string
          payment_method: string | null
          reference_number: string | null
          status: 'pending' | 'completed' | 'overdue'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chama_id: string
          member_id: string
          amount: number
          contribution_date: string
          payment_method?: string | null
          reference_number?: string | null
          status?: 'pending' | 'completed' | 'overdue'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chama_id?: string
          member_id?: string
          amount?: number
          contribution_date?: string
          payment_method?: string | null
          reference_number?: string | null
          status?: 'pending' | 'completed' | 'overdue'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loans: {
        Row: {
          id: string
          chama_id: string
          borrower_id: string
          amount: number
          interest_rate: number
          purpose: string
          repayment_period_months: number
          monthly_payment: number
          status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted'
          approved_by: string | null
          approved_at: string | null
          disbursed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chama_id: string
          borrower_id: string
          amount: number
          interest_rate: number
          purpose: string
          repayment_period_months: number
          monthly_payment: number
          status?: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted'
          approved_by?: string | null
          approved_at?: string | null
          disbursed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chama_id?: string
          borrower_id?: string
          amount?: number
          interest_rate?: number
          purpose?: string
          repayment_period_months?: number
          monthly_payment?: number
          status?: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted'
          approved_by?: string | null
          approved_at?: string | null
          disbursed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'treasurer' | 'secretary' | 'member'
      contribution_status: 'pending' | 'completed' | 'overdue'
      loan_status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted'
    }
  }
}
