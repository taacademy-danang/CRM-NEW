/**
 * ĐẶC TẢ TYPESCRIPT TOÀN BỘ THỰC THỂ CRM & TUYỂN SINH T.A ACADEMY
 */

export type UserRole = "admin" | "manager" | "team_lead" | "consultant" | "teacher";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  role_id: UserRole;
  role_name?: string;
  team_id?: string | null;
  is_active: boolean;
}

export interface Student {
  id: string;
  parent_id: string;
  full_name: string;
  dob?: string | null;
  gender?: "male" | "female" | "other" | null;
  current_school?: string | null;
  hobby_and_traits?: string | null;
  special_notes?: string | null;
  created_at: string;
}

export type CustomerStatus =
  | "new"
  | "uncalled"
  | "called_unreachable"
  | "contacted"
  | "consulting"
  | "trial_scheduled"
  | "considering"
  | "enrolling"
  | "registered"
  | "lost";

export type CallStatus = "pending" | "unreachable" | "contacted" | "need_recall";
export type SlaAlertLevel = "none" | "warning_15m" | "danger_60m";

export interface Customer {
  id: string;
  customer_code: string;
  full_name: string;
  phone: string | null;
  secondary_phone?: string | null;
  email?: string | null;
  address?: string | null;
  source: "facebook" | "zalo" | "hotline" | "referral" | "website";
  status: CustomerStatus;
  call_status: CallStatus;
  first_phone_received_at: string | null;
  last_called_at?: string | null;
  sla_alert_level: SlaAlertLevel;
  assigned_to?: string | null;
  assigned_to_name?: string | null;
  interested_course_id?: string | null;
  interested_course_title?: string | null;
  notes?: string | null;
  students?: Student[];
  waiting_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  category: "phong_thai" | "catwalk" | "model_kids" | "giao_tiep";
  target_audience: string;
  min_age?: number | null;
  max_age?: number | null;
  duration_weeks: number;
  total_sessions: number;
  tuition_fee: number;
  discount_policy?: string | null;
  is_active: boolean;
}

export interface CallLog {
  id: string;
  customer_id: string;
  agent_id: string;
  agent_name?: string;
  phone_called: string;
  call_result: "connected" | "unreachable" | "busy" | "wrong_number" | "recall_requested";
  duration_seconds: number;
  call_summary: string;
  recall_at?: string | null;
  audio_recording_url?: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  customer_id: string;
  actor_id?: string | null;
  actor_name?: string | null;
  actor_type: "human" | "ai" | "system";
  activity_type: string;
  description: string;
  created_at: string;
}
