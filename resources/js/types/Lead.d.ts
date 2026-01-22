export interface Lead {
    name: string;
    email: string | null;
    phone: string | null;
    whatsapp_number: string | null;

    status_id: number;
    source_id: number | null;

    assigned_to: number | null;

    town: string | null;
    address: string | null;

    created_at?: string;
    updated_at?: string;
}

// Types
export interface LeadStatus {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface LeadSource {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface LeadProfile {
  id: number
  lead_id: number
  occupation: string
  company: string
  interest: string
  created_at: string
  updated_at: string
}

export interface LeadNote {
  id: number
  lead_id: number
  user_id: number
  note: string
  created_at: string
  updated_at: string
}

export interface LeadCall {
  id: number
  lead_id: number
  user_id: number
  called_at: string
  result: string
  remarks: string
  created_at: string
  updated_at: string
}

export interface LeadReminder {
  id: number
  lead_id: number
  user_id: number
  remind_at: string
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  whatsapp_number: string
  status_id: number
  source_id: number
  assigned_to: number
  town: string
  address: string
  created_at: string
  updated_at: string
  // Relations
  status?: LeadStatus
  source?: LeadSource
  profile?: LeadProfile
  notes?: LeadNote[]
  calls?: LeadCall[]
  reminders?: LeadReminder[]
}

export interface User {
  id: number
  name: string
  email: string
}