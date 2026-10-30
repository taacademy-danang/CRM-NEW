/**
 * TYPES CHO HỘP THƯ TƯ VẤN ĐA KÊNH & AI ORCHESTRATOR
 */

export type ChannelType = "facebook" | "zalo" | "website";
export type AiConversationMode = "ai_auto" | "human_takeover" | "ai_copilot" | "return_to_ai" | "closed";
export type MessageSenderType = "customer" | "ai" | "human_agent" | "system";

export interface ChannelAccount {
  id: string;
  channel_id: ChannelType;
  external_account_id: string;
  name: string;
  is_active: boolean;
  last_sync_at?: string | null;
}

export interface Conversation {
  id: string;
  channel_account_id: string;
  customer_id?: string | null;
  external_thread_id: string;
  sender_external_id: string;
  sender_name: string;
  sender_avatar_url?: string | null;
  last_message_content?: string | null;
  last_message_at: string;
  unread_count: number;
  ai_mode: AiConversationMode;
  human_assigned_to?: string | null;
  human_assigned_name?: string | null;
  takeover_at?: string | null;
  is_ai_reply_allowed: boolean;
  channel_type: ChannelType;
  customer_phone?: string | null;
  interested_course?: string | null;
  tags?: string[];
}

export interface Message {
  id: string;
  conversation_id: string;
  external_message_id?: string | null;
  sender_type: MessageSenderType;
  sender_id?: string | null;
  sender_name?: string | null;
  content: string;
  media_urls?: string[];
  is_internal_note: boolean;
  ai_suggested_reply?: string | null;
  status: "pending" | "sent" | "delivered" | "failed";
  created_at: string;
}

export interface AiEvaluation {
  id: string;
  session_id: string;
  score_natural_dialogue: number;    // 0-20
  score_need_discovery: number;       // 0-20
  score_knowledge_accuracy: number;   // 0-20
  score_objection_handling: number;   // 0-20
  score_closing_and_handoff: number;  // 0-20
  total_score: number;                // 0-100
  has_critical_error: boolean;        // Quy tắc loại trừ
  evaluator_notes?: string | null;
  evaluated_by: string;
  created_at: string;
}
