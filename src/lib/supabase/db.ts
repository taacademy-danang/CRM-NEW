import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lấy thông tin kết nối Supabase từ biến môi trường
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wkuniwhcrgjejzxlwbzr.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_8fMu0h7nb54FrbsvTxBXFg__Odj8BNO";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });
    } catch (err) {
      console.error("[Supabase Client Init Error]:", err);
      return null;
    }
  }
  return supabaseInstance;
}

/**
 * 1. QUẢN LÝ KHÁCH HÀNG (CUSTOMERS / LEADS) TRONG SUPABASE
 */
export async function getCustomersFromSupabase() {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[Supabase getCustomers Error]:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("[Supabase getCustomers Catch]:", err);
    return null;
  }
}

export async function upsertCustomerToSupabase(customer: {
  id?: string;
  customer_code?: string;
  full_name: string;
  phone?: string | null;
  source?: string;
  status?: string;
  call_status?: string;
  course_ref?: string;
  ai_extracted_need?: string;
  dob?: string;
  elearning_status?: string;
  elearning_class?: string;
  notes?: string;
}) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("customers")
      .upsert(customer, { onConflict: "id" })
      .select()
      .single();
    if (error) {
      console.warn("[Supabase upsertCustomer Error]:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("[Supabase upsertCustomer Catch]:", err);
    return null;
  }
}

export async function deleteCustomerFromSupabase(id: string) {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from("customers").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * 2. QUẢN LÝ HỌC VIÊN TRUNG TÂM (CENTER STUDENTS: TA - STD - 001) TRONG SUPABASE
 */
export async function getCenterStudentsFromSupabase() {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("center_students")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[Supabase getCenterStudents Error]:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("[Supabase getCenterStudents Catch]:", err);
    return null;
  }
}

export async function upsertCenterStudentToSupabase(student: {
  id?: string;
  student_code: string;
  full_name: string;
  phone: string;
  dob?: string;
  course_code: string;
  course_title: string;
  sessions: number;
  display_course: string;
  elearning_status?: string;
  elearning_class?: string;
  notes?: string;
}) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("center_students")
      .upsert(student, { onConflict: "student_code" })
      .select()
      .single();
    if (error) {
      console.warn("[Supabase upsertCenterStudent Error]:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("[Supabase upsertCenterStudent Catch]:", err);
    return null;
  }
}

export async function deleteCenterStudentFromSupabase(idOrCode: string) {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb
      .from("center_students")
      .delete()
      .or(`id.eq.${idOrCode},student_code.eq.${idOrCode}`);
    return !error;
  } catch {
    return false;
  }
}

/**
 * 3. QUẢN LÝ HỘI THOẠI & TIN NHẮN TRONG SUPABASE
 */
export async function getConversationsFromSupabase() {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("[Supabase getConversations Error]:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("[Supabase getConversations Catch]:", err);
    return null;
  }
}

export async function upsertConversationToSupabase(conv: {
  id: string;
  name: string;
  avatar?: string;
  channel?: string;
  last_message?: string;
  time?: string;
  unread?: number;
  ai_mode?: string;
  agent_name?: string;
  phone?: string | null;
  phone_auto_extracted?: boolean;
  course?: string;
  course_category?: string;
  status?: string;
  ai_extracted_need?: string;
  elearning_status?: string;
}) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("conversations")
      .upsert(conv, { onConflict: "id" })
      .select()
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function getMessagesFromSupabase(conversationId: string) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function insertMessageToSupabase(msg: {
  id: string;
  conversation_id: string;
  sender_type: string;
  sender_name?: string | null;
  content: string;
  is_internal_note?: boolean;
  status?: string;
  created_at?: string;
}) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("messages").insert(msg).select().single();
    return data;
  } catch {
    return null;
  }
}

/**
 * 4. QUẢN LÝ TRUNG TÂM ĐÀO TẠO AI (KHO KIẾN THỨC, KỊCH BẢN, TÌNH HUỐNG)
 */
export async function getKnowledgeFromSupabase() {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("ai_knowledge").select("*");
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function upsertKnowledgeToSupabase(doc: {
  id: string;
  title: string;
  category: string;
  version: string;
  content_summary: string;
  is_approved: boolean;
  approved_by?: string;
  chunks_count: number;
  updated_at: string;
}) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("ai_knowledge").upsert(doc, { onConflict: "id" }).select().single();
    return data;
  } catch {
    return null;
  }
}

export async function deleteKnowledgeFromSupabase(id: string) {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from("ai_knowledge").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function getScenariosFromSupabase() {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("ai_scenarios").select("*");
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function upsertScenarioToSupabase(scenario: {
  code: string;
  title: string;
  course: string;
  goal?: string;
  status: string;
  steps: string[];
}) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("ai_scenarios").upsert(scenario, { onConflict: "code" }).select().single();
    return data;
  } catch {
    return null;
  }
}

export async function deleteScenarioFromSupabase(code: string) {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from("ai_scenarios").delete().eq("code", code);
    return !error;
  } catch {
    return false;
  }
}

export async function getSituationsFromSupabase() {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("ai_situations").select("*");
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function upsertSituationToSupabase(situation: {
  id: string;
  title: string;
  category: string;
  ideal_response: string;
  mistake_avoid?: string;
  is_approved: boolean;
}) {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("ai_situations").upsert(situation, { onConflict: "id" }).select().single();
    return data;
  } catch {
    return null;
  }
}

export async function deleteSituationFromSupabase(id: string) {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from("ai_situations").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}
