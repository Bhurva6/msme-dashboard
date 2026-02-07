// User interface
export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: 'owner' | 'ops' | 'admin';
  created_at?: string;
  updated_at?: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Signup data
export interface SignupData {
  name: string;
  phone: string;
  email?: string;
}

// OTP data
export interface OTPData {
  phone: string;
  otp: string;
  name: string;
  email?: string;
}

// Login data
export interface LoginData {
  email: string;
  password: string;
}

// Set password data
export interface SetPasswordData {
  password: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Toast notification type
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Business interfaces
export interface Business {
  id: string;
  owner_id: string;
  legal_name: string;
  business_name?: string;
  entity_type: 'SOLE_PROPRIETOR' | 'PARTNERSHIP' | 'PRIVATE_LIMITED' | 'LLP' | 'PUBLIC_LIMITED';
  pan?: string;
  gstin?: string;
  udyam?: string;
  sector: string;
  city: string;
  state: string;
  brief_description?: string;
  profile_completion_percent: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentGroup {
  id: string;
  business_id: string;
  type: 'BS_PNL' | 'SANCTION' | 'PROFILE' | 'KYC_DIRECTOR' | 'ITR_DIRECTOR';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  document_group_id: string;
  file_name: string;
  file_url: string;
  mime_type: string;
  file_size_bytes: number;
  uploaded_at: string;
}

export interface Director {
  id: string;
  business_id: string;
  name: string;
  dob?: string;
  pan?: string;
  aadhaar_number?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface FundingUtility {
  id: string;
  business_id: string;
  type: 'TERM_LOAN' | 'WORKING_CAPITAL' | 'ASSET_FINANCE' | 'SCHEME_LOAN';
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  requested_amount?: number;
  tenure_months?: number;
  purpose?: string;
  security_type?: string;
  security_available?: boolean;
  existing_emis?: number;
  frequency?: string;
  asset_type?: string;
  asset_cost?: number;
  schemes_interested?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CompletionBreakdown {
  businessInfo: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  financials: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  sanctions: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  businessProfile: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  kycDirectors: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  itrDirectors: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
}
