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
  entity_type: 'SOLE_PROPRIETOR' | 'PARTNERSHIP' | 'PRIVATE_LIMITED' | 'PVT_LTD' | 'LLP' | 'PUBLIC_LIMITED';
  pan?: string;
  gstin?: string;
  udyam?: string;
  udyam_registration?: string;
  sector: string;
  city: string;
  state: string;
  address?: string;
  pincode?: string;
  contact_email?: string;
  contact_phone?: string;
  year_established?: number;
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
  file_path?: string;
  mime_type: string;
  file_size: number;
  file_size_bytes?: number;
  uploaded_at: string;
  uploaded_by?: string;
  created_at?: string;
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verification_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface Director {
  id: string;
  business_id: string;
  full_name?: string;
  name?: string;
  date_of_birth?: string;
  dob?: string;
  pan?: string;
  aadhaar?: string;
  aadhaar_number?: string;
  designation?: string;
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
  amount?: number;
  tenure_months?: number;
  tenure?: number;
  interest_rate?: number;
  purpose?: string;
  security_type?: string;
  security_offered?: string;
  security_available?: boolean;
  existing_emis?: number;
  frequency?: string;
  repayment_frequency?: string;
  asset_type?: string;
  asset_cost?: number;
  schemes_interested?: string;
  interested_schemes?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CompletionBreakdown {
  overallCompletion?: number;
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
  directorKYC?: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  kycDirectors?: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  directorITR?: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  itrDirectors?: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  nextSteps?: string[];
}
