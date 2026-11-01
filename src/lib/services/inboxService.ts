/**
 * INBOX SERVICE - QUẢN LÝ HỘP THƯ ĐA KÊNH & BỘ ĐIỀU KHIỂN AI ORCHESTRATOR
 * T.A Academy CRM - Phase 3
 */

import { AiConversationMode, ChannelType, Message, MessageSenderType } from "@/types/inbox";
import { addConsultation, updateConsultationStatus } from "./consultationService";
import { getAiConfig } from "./aiTrainingService";
import { upsertConversationToSupabase, insertMessageToSupabase } from "@/lib/supabase/db";

export interface ConversationItem {
  id: string;
  name: string;
  avatar: string;
  channel: ChannelType;
  lastMessage: string;
  time: string;
  unread: number;
  aiMode: AiConversationMode;
  agentName?: string;
  phone?: string;
  phoneAutoExtracted: boolean;
  course: string;
  courseCategory: "model_kids" | "phong_thai" | "catwalk" | "giao_tiep";
  status: string;
  aiExtractedNeed: string;
  elearningStatus: "synced" | "not_enrolled";
}

// DỮ LIỆU HỘI THOẠI & TIN NHẮN THỰC TẾ (KHÔNG DÙNG DỮ LIỆU GIẢ - CHỈ LƯU DỮ LIỆU THẬT)
let mockConversations: ConversationItem[] = [];
let mockMessagesDb: Record<string, Message[]> = {};

// Helper format thời gian
function formatFbTime(isoString: string) {
  try {
    const d = new Date(isoString);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return `${hours}:${minutes} Hôm nay`;
    }
    return `${hours}:${minutes} ${d.getDate()}/${d.getMonth() + 1}`;
  } catch {
    return "Vừa xong";
  }
}

// BỘ TRÍCH XUẤT THÔNG TIN THÔNG MINH TỪ TIN NHẮN KHÁCH HÀNG (SĐT, ĐỘ TUỔI, NHU CẦU THỰC TẾ)
export function extractCustomerInsights(
  messagesData: Array<{ message?: string; from?: any }> = [],
  snippet: string = "",
  customerName: string = ""
) {
  const customerMsgs: string[] = [];
  for (const m of messagesData) {
    const isBot =
      m.from?.id === "212422015280468" ||
      m.from?.name?.toLowerCase().includes("t. a") ||
      m.from?.name?.toLowerCase().includes("studio");
    if (!isBot && m.message) {
      customerMsgs.push(m.message);
    }
  }

  const fullText = customerMsgs.join(" ") + " " + snippet;

  // 1. Số điện thoại (Phone)
  let extractedPhone: string | undefined = undefined;
  const phoneMatch =
    fullText.match(/(?:0|\+84)(?:3|5|7|8|9)\d{8}/) || fullText.match(/\b(0\d{9,10})\b/);
  if (phoneMatch) {
    extractedPhone = phoneMatch[0];
  }

  // 2. Độ tuổi (Age) - Nhận diện chính xác từ tin nhắn khách hàng (vd: "Con tôi 7 tuổi tư vấn" -> 7 tuổi)
  let extractedAge: number | undefined = undefined;
  for (const msg of customerMsgs) {
    const ageMatch =
      msg.match(/(?:con|bé|cháu)?\s*(?:tôi|mình|em|chị|nhà em)?\s*(?:được|nay)?\s*(\d{1,2})\s*(?:tuổi|t\b|tháng)/i) ||
      msg.match(/\b(\d{1,2})\s*(?:tuổi|tháng)\b/i);
    if (ageMatch && ageMatch[1]) {
      const num = parseInt(ageMatch[1], 10);
      if (num >= 2 && num <= 70) {
        extractedAge = num;
        break;
      }
    }
  }
  if (!extractedAge) {
    const ageMatch =
      fullText.match(/(?:con|bé|cháu)?\s*(?:tôi|mình|em|chị|nhà em)?\s*(?:được|nay)?\s*(\d{1,2})\s*(?:tuổi|tháng)/i) ||
      fullText.match(/\b(\d{1,2})\s*(?:tuổi|tháng)\b/i);
    if (ageMatch && ageMatch[1]) {
      const num = parseInt(ageMatch[1], 10);
      if (num >= 2 && num <= 70) extractedAge = num;
    }
  }

  // 3. Khóa học quan tâm
  let course = "Model Kids (Mẫu Nhí Tài Năng)";
  let courseCategory: ConversationItem["courseCategory"] = "model_kids";
  const lowerAll = fullText.toLowerCase();
  if (
    lowerAll.includes("phong thái") ||
    lowerAll.includes("doanh nhân") ||
    lowerAll.includes("quý cô")
  ) {
    course = "Phong Thái Quý Cô & Doanh Nhân";
    courseCategory = "phong_thai";
  } else if (
    lowerAll.includes("catwalk") ||
    lowerAll.includes("sân khấu") ||
    lowerAll.includes("hoa hậu")
  ) {
    course = "Catwalk Chuyên Nghiệp";
    courseCategory = "catwalk";
  } else if (
    lowerAll.includes("giao tiếp") ||
    lowerAll.includes("thuyết trình") ||
    lowerAll.includes("mc")
  ) {
    course = "Nghệ Thuật Giao Tiếp & Thuyết Trình";
    courseCategory = "giao_tiep";
  }

  // 4. Phân tích nhu cầu thực tế
  const specificNeeds: string[] = [];
  if (
    lowerAll.includes("dáng đi") ||
    lowerAll.includes("cải thiện dáng") ||
    lowerAll.includes("chỉnh dáng")
  ) {
    specificNeeds.push("cải thiện dáng đi");
  }
  if (lowerAll.includes("gù") || lowerAll.includes("lưng")) {
    specificNeeds.push("chỉnh tật gù lưng");
  }
  if (lowerAll.includes("nhút nhát") || lowerAll.includes("tự tin") || lowerAll.includes("rụt rè")) {
    specificNeeds.push("rèn luyện sự tự tin");
  }
  if (lowerAll.includes("học thử") || lowerAll.includes("trải nghiệm")) {
    specificNeeds.push("đăng ký học thử");
  }
  if (
    lowerAll.includes("học phí") ||
    lowerAll.includes("chi phí") ||
    lowerAll.includes("bao nhiêu tiền")
  ) {
    specificNeeds.push("hỏi học phí");
  }
  if (
    lowerAll.includes("casting") ||
    lowerAll.includes("người mẫu") ||
    lowerAll.includes("mẫu nhí")
  ) {
    specificNeeds.push("định hướng mẫu nhí & sân khấu");
  }

  let aiExtractedNeed = "";
  if (extractedAge && specificNeeds.length > 0) {
    aiExtractedNeed = `Bé ${extractedAge} tuổi, phụ huynh muốn ${specificNeeds.join(", ")}`;
  } else if (extractedAge) {
    aiExtractedNeed = `Bé ${extractedAge} tuổi, phụ huynh muốn tư vấn khóa học phù hợp lứa tuổi`;
  } else if (specificNeeds.length > 0) {
    aiExtractedNeed = `Phụ huynh quan tâm: ${specificNeeds.join(", ")}`;
  } else if (customerMsgs.length > 0) {
    const lastCustomerMsg =
      customerMsgs[0].length > 60 ? customerMsgs[0].slice(0, 60) + "..." : customerMsgs[0];
    aiExtractedNeed = `Khách hàng nhắn: "${lastCustomerMsg}"`;
  } else {
    aiExtractedNeed = "Khách hàng nhắn tin quan tâm khóa học qua Fanpage Facebook";
  }

  const currentYear = new Date().getFullYear();
  const dob = extractedAge
    ? `Năm ${currentYear - extractedAge} (${extractedAge} tuổi)`
    : "Chưa cập nhật";

  return {
    phone: extractedPhone,
    age: extractedAge,
    dob,
    course,
    courseCategory,
    aiExtractedNeed,
  };
}

export function clearAllInboxData() {
  mockConversations = [];
  mockMessagesDb = {};
}

// 1. LẤY DANH SÁCH HỘI THOẠI
export async function getInboxConversations(params?: {
  channel?: string;
  search?: string;
  mode?: string;
  sync?: boolean;
}) {
  const config = getAiConfig();
  const fbToken = config.fbToken || process.env.FB_PAGE_ACCESS_TOKEN;

  // Chỉ đồng bộ từ Facebook Graph API khi người dùng chủ động yêu cầu (sync = true)
  if (params?.sync && fbToken && fbToken.startsWith("EA")) {
    try {
      const fbRes = await fetch(
        `https://graph.facebook.com/v19.0/me/conversations?fields=id,snippet,updated_time,participants,unread_count,messages.limit(50){id,message,from,created_time}&limit=25&access_token=${fbToken}`,
        { cache: "no-store" }
      );
      if (fbRes.ok) {
        const fbJson = await fbRes.json();
        if (fbJson.data && Array.isArray(fbJson.data)) {
          for (const item of fbJson.data) {
            // Xác định khách hàng trong danh sách người tham gia
            const customer =
              item.participants?.data?.find(
                (p: any) =>
                  p.email &&
                  !p.email.includes("212422015280468") &&
                  !p.name?.includes("T. A")
              ) || item.participants?.data?.[0];

            const customerName = customer?.name || "Khách Facebook";
            const snippet = item.snippet || "";
            const messagesData = item.messages?.data || [];

            // AI Bóc tách dữ liệu chính xác (SĐT, Tuổi, Nhu cầu)
            const insights = extractCustomerInsights(messagesData, snippet, customerName);

            // Lưu cache các tin nhắn để hiển thị ngay trong cửa sổ chat
            if (messagesData.length > 0) {
              const sorted = [...messagesData].reverse();
              mockMessagesDb[item.id] = sorted
                .filter((m: any) => m.message)
                .map((m: any) => {
                  const isPage =
                    m.from?.id === "212422015280468" ||
                    m.from?.name?.toLowerCase().includes("t. a") ||
                    m.from?.name?.toLowerCase().includes("studio");
                  return {
                    id: m.id || `fb-msg-${Date.now()}-${Math.random()}`,
                    conversation_id: item.id,
                    sender_type: isPage ? "ai" : "customer",
                    sender_name: isPage ? "Tiểu Mỹ (T.A Academy)" : m.from?.name || "Khách hàng",
                    content: m.message,
                    is_internal_note: false,
                    status: "delivered",
                    created_at: formatFbTime(m.created_time),
                  };
                });
            }

            const existingIndex = mockConversations.findIndex(
              (c) => c.id === item.id || c.name === customerName
            );

            const convData: ConversationItem = {
              id: item.id,
              name: customerName,
              avatar: customerName.charAt(0).toUpperCase() || "F",
              channel: "facebook",
              lastMessage: snippet,
              time: formatFbTime(item.updated_time),
              unread: item.unread_count || 0,
              aiMode: "ai_auto",
              phone: insights.phone,
              phoneAutoExtracted: Boolean(insights.phone),
              course: insights.course,
              courseCategory: insights.courseCategory,
              status: insights.phone ? "uncalled" : "consulting",
              aiExtractedNeed: insights.aiExtractedNeed,
              elearningStatus: "not_enrolled",
            };

            if (existingIndex >= 0) {
              mockConversations[existingIndex] = {
                ...mockConversations[existingIndex],
                ...convData,
              };
            } else {
              mockConversations.unshift(convData);
            }

            // Tự động đồng bộ sang danh sách khách hàng tư vấn với thông tin chính xác
            try {
              addConsultation({
                customerName,
                phone: insights.phone || null,
                courseRef: insights.courseCategory,
                aiExtractedNeed: insights.aiExtractedNeed,
                source: "facebook",
                dob: insights.dob,
              });
            } catch (syncErr) {
              // Bỏ qua nếu đã đồng bộ
            }
          }
        }
      }
    } catch (fbErr) {
      console.error("[FB Sync Conversations Error]:", fbErr);
    }
  }

  let list = [...mockConversations];

  if (params?.channel && params.channel !== "all") {
    list = list.filter((c) => c.channel === params.channel);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.course.toLowerCase().includes(q)
    );
  }

  if (params?.mode && params.mode !== "all") {
    list = list.filter((c) => c.aiMode === params.mode);
  }

  return list;
}

// 2. LẤY TOÀN BỘ TIN NHẮN THEO HỘI THOẠI (KẾT NỐI REAL-TIME GRAPH API)
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const config = getAiConfig();
  const fbToken = config.fbToken || process.env.FB_PAGE_ACCESS_TOKEN;

  // Nếu là hội thoại Facebook thực tế (id bắt đầu bằng t_)
  if (conversationId.startsWith("t_") && fbToken && fbToken.startsWith("EA")) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${conversationId}/messages?fields=id,message,created_time,from&limit=50&access_token=${fbToken}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const sorted = [...json.data].reverse();
          const mappedMessages: Message[] = sorted
            .filter((m: any) => m.message)
            .map((m: any) => {
              const isPage =
                m.from?.id === "212422015280468" ||
                m.from?.name?.toLowerCase().includes("t. a") ||
                m.from?.name?.toLowerCase().includes("studio");
              return {
                id: m.id,
                conversation_id: conversationId,
                sender_type: isPage ? "ai" : "customer",
                sender_name: isPage ? "Tiểu Mỹ (T.A Academy)" : m.from?.name || "Khách hàng",
                content: m.message,
                is_internal_note: false,
                status: "delivered",
                created_at: formatFbTime(m.created_time),
              };
            });
          mockMessagesDb[conversationId] = mappedMessages;
          return mappedMessages;
        }
      }
    } catch (fbErr) {
      console.error("[FB Fetch Messages Error]:", fbErr);
    }
  }

  return mockMessagesDb[conversationId] || [];
}

// 3. GỬI TIN NHẮN (TỪ KHÁCH HÀNG HOẶC NHÂN VIÊN)
export function sendInboxMessage(data: {
  conversationId: string;
  content: string;
  senderType: MessageSenderType;
  senderName?: string;
}) {
  const conversation = mockConversations.find((c) => c.id === data.conversationId);
  if (!conversation) {
    throw new Error("Không tìm thấy hội thoại");
  }

  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const newMessage: Message = {
    id: `m-${Date.now()}`,
    conversation_id: data.conversationId,
    sender_type: data.senderType,
    sender_name: data.senderName || (data.senderType === "ai" ? "Tiểu Mỹ (T.A Academy)" : "Tư vấn viên"),
    content: data.content,
    is_internal_note: false,
    status: "delivered",
    created_at: timeString,
  };

  if (!mockMessagesDb[data.conversationId]) {
    mockMessagesDb[data.conversationId] = [];
  }
  mockMessagesDb[data.conversationId].push(newMessage);

  // Cập nhật thông tin hội thoại
  conversation.lastMessage = data.content;
  conversation.time = timeString;

  // Nếu nhân viên gửi tin -> Tự động chuyển chế độ sang "human_takeover" (Khóa AI can thiệp)
  if (data.senderType === "human_agent") {
    conversation.aiMode = "human_takeover";
    conversation.agentName = data.senderName || "Tư vấn viên";
    conversation.unread = 0;
  }

  // Nếu khách gửi tin -> Tự động trích xuất SĐT và nhu cầu nếu có
  if (data.senderType === "customer") {
    extractPhoneAndNeeds(conversation, data.content);
  }

  // Đồng bộ lên Supabase
  upsertConversationToSupabase({
    id: conversation.id,
    name: conversation.name,
    avatar: conversation.avatar,
    channel: conversation.channel,
    last_message: conversation.lastMessage,
    time: conversation.time,
    unread: conversation.unread,
    ai_mode: conversation.aiMode,
    agent_name: conversation.agentName,
    phone: conversation.phone,
    phone_auto_extracted: conversation.phoneAutoExtracted,
    course: conversation.course,
    course_category: conversation.courseCategory,
    status: conversation.status,
    ai_extracted_need: conversation.aiExtractedNeed,
    elearning_status: conversation.elearningStatus,
  }).catch((e) => console.warn("[Supabase sync conversation]", e));

  insertMessageToSupabase({
    id: newMessage.id,
    conversation_id: newMessage.conversation_id,
    sender_type: newMessage.sender_type,
    sender_name: newMessage.sender_name ?? undefined,
    content: newMessage.content,
    is_internal_note: newMessage.is_internal_note,
    status: newMessage.status,
    created_at: newMessage.created_at,
  }).catch((e) => console.warn("[Supabase sync message]", e));

  return { conversation, message: newMessage };
}

// 4. ĐỔI CHẾ ĐỘ ĐIỀU KHIỂN AI (AI Orchestrator)
export function updateConversationMode(
  conversationId: string,
  mode: AiConversationMode,
  agentName?: string
) {
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (!conversation) throw new Error("Không tìm thấy hội thoại");

  conversation.aiMode = mode;
  if (mode === "human_takeover") {
    conversation.agentName = agentName || "Tư vấn viên tiếp quản";
  } else if (mode === "ai_auto") {
    conversation.agentName = undefined;
  }

  return conversation;
}

// 5. SINH CÂU TRẢ LỜI TỰ ĐỘNG TỪ AI HOẶC GỢI Ý COPILOT
export function generateAiResponse(conversationId: string, isCopilot = false) {
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (!conversation) throw new Error("Không tìm thấy hội thoại");

  const lastCustomerMessage =
    mockMessagesDb[conversationId]
      ?.filter((m) => m.sender_type === "customer")
      .slice(-1)[0]?.content || "";

  let replyText = "";
  const lowerMsg = lastCustomerMessage.toLowerCase();

  if (lowerMsg.includes("học thử") || lowerMsg.includes("lịch học")) {
    replyText = `Dạ em Tiểu Mỹ xin gửi Mẹ lịch học thử trải nghiệm miễn phí khóa ${conversation.course} vào Thứ 7 (09:00 - 10:30) hoặc Chủ Nhật (15:00 - 16:30) tuần này ạ. Mẹ đăng ký ca nào để em giữ chỗ và chuẩn bị giáo cụ tốt nhất cho con nhé? ✨`;
  } else if (lowerMsg.includes("học phí") || lowerMsg.includes("bao nhiêu")) {
    replyText = `Dạ khóa ${conversation.course} tại T.A Academy có học phí niêm yết là 6.800.000 VNĐ cho lộ trình 12 buổi kèm cặp chuyên sâu cùng các chuyên gia hàng đầu. Đặc biệt trong tuần này học viện có ưu đãi đặc quyền tặng kèm 1 buổi chụp hình profile chuyên nghiệp cho bé. Mẹ cho em xin số điện thoại để em gửi ưu đãi cho con nha Mẹ! 🌸`;
  } else if (lowerMsg.includes("gù") || lowerMsg.includes("nhút nhát")) {
    replyText = `Dạ Mẹ hoàn toàn yên tâm nha! Đây là trăn trở của rất nhiều phụ huynh khi mới đưa con đến T.A Academy. Giáo trình khóa ${conversation.course} được thiết kế với các bài tập chỉnh dáng đi, giải phóng hình thể nhẹ nhàng để con tự tin mở lòng hơn qua từng buổi học mà không có bất kỳ áp lực nào ạ. Em mời Mẹ cho bé ghé học thử một buổi nhé ạ!`;
  } else {
    replyText = `Dạ em Tiểu Mỹ xin chào Chị ạ! Rất vui được đồng hành cùng Chị. Với khóa ${conversation.course}, giảng viên tại T.A Academy sẽ kèm cặp sát sao để con rèn luyện phong thái và dáng đi chuẩn nhất. Chị cho em xin thêm thông tin về độ tuổi của bé hoặc số điện thoại để em hỗ trợ tư vấn chi tiết cho mình nha! ✨`;
  }

  if (isCopilot) {
    return {
      suggestedReply: replyText,
      intentDetected: "consultation_inquiry",
    };
  }

  return sendInboxMessage({
    conversationId,
    content: replyText,
    senderType: "ai",
    senderName: "Tiểu Mỹ (T.A Academy)",
  });
}

// 6. TỰ ĐỘNG TRÍCH XUẤT SĐT VÀ NHU CẦU TỪ TIN NHẮN KHÁCH HÀNG
function extractPhoneAndNeeds(conversation: ConversationItem, content: string) {
  const phoneMatch =
    content.match(/(?:0|\+84)(?:3|5|7|8|9)\d{8}/) || content.match(/\b(0\d{9,10})\b/);
  if (phoneMatch) {
    conversation.phone = phoneMatch[0];
    conversation.phoneAutoExtracted = true;
    conversation.status = "uncalled";
  }

  let age: number | undefined = undefined;
  const ageMatch =
    content.match(/(?:con|bé|cháu)?\s*(?:tôi|mình|em|chị|nhà em)?\s*(?:được|nay)?\s*(\d{1,2})\s*(?:tuổi|t\b|tháng)/i) ||
    content.match(/\b(\d{1,2})\s*(?:tuổi|tháng)\b/i);
  if (ageMatch && ageMatch[1]) {
    const num = parseInt(ageMatch[1], 10);
    if (num >= 2 && num <= 70) age = num;
  }

  const lower = content.toLowerCase();
  const specificNeeds: string[] = [];
  if (
    lower.includes("dáng đi") ||
    lower.includes("cải thiện dáng") ||
    lower.includes("chỉnh dáng")
  ) {
    specificNeeds.push("cải thiện dáng đi");
  }
  if (lower.includes("gù") || lower.includes("lưng")) {
    specificNeeds.push("chỉnh tật gù lưng");
  }
  if (lower.includes("nhút nhát") || lower.includes("tự tin") || lower.includes("rụt rè")) {
    specificNeeds.push("rèn luyện sự tự tin");
  }
  if (lower.includes("học thử") || lower.includes("trải nghiệm")) {
    specificNeeds.push("đăng ký học thử");
  }
  if (lower.includes("học phí") || lower.includes("chi phí")) {
    specificNeeds.push("tư vấn học phí");
  }

  if (age && specificNeeds.length > 0) {
    conversation.aiExtractedNeed = `Bé ${age} tuổi, phụ huynh muốn ${specificNeeds.join(", ")}`;
  } else if (age) {
    conversation.aiExtractedNeed = `Bé ${age} tuổi, phụ huynh muốn tư vấn khóa học phù hợp`;
  } else if (specificNeeds.length > 0) {
    conversation.aiExtractedNeed = `Phụ huynh quan tâm: ${specificNeeds.join(", ")}`;
  }

  try {
    const currentYear = new Date().getFullYear();
    const dob = age ? `Năm ${currentYear - age} (${age} tuổi)` : undefined;
    addConsultation({
      customerName: conversation.name,
      phone: conversation.phone || null,
      courseRef: conversation.courseCategory,
      aiExtractedNeed: conversation.aiExtractedNeed,
      source: conversation.channel,
      dob,
    });
  } catch (err) {
    // Bỏ qua lỗi đồng bộ
  }
}

// 7. TIẾP NHẬN & XỬ LÝ TIN NHẮN TỪ FACEBOOK FANPAGE WEBHOOK (HOẶC BỘ GIẢ LẬP TEST)
export function handleIncomingFacebookMessage(data: {
  senderId: string;
  senderName?: string;
  messageText: string;
}) {
  const senderId = data.senderId || `fb_user_${Date.now()}`;
  const convId = `fb-${senderId}`;
  const senderName = data.senderName?.trim() || `Khách Facebook #${senderId.slice(-4)}`;

  const lowerMsg = data.messageText.toLowerCase();
  let courseCategory: "model_kids" | "phong_thai" | "catwalk" | "giao_tiep" = "model_kids";
  let courseName = "Model Kids (Mẫu Nhí Tài Năng)";

  if (
    lowerMsg.includes("phong thái") ||
    lowerMsg.includes("quý cô") ||
    lowerMsg.includes("doanh nhân")
  ) {
    courseCategory = "phong_thai";
    courseName = "Phong Thái Quý Cô & Doanh Nhân";
  } else if (
    lowerMsg.includes("catwalk") ||
    lowerMsg.includes("sân khấu") ||
    lowerMsg.includes("người mẫu")
  ) {
    courseCategory = "catwalk";
    courseName = "Catwalk Chuyên Nghiệp";
  } else if (
    lowerMsg.includes("giao tiếp") ||
    lowerMsg.includes("thuyết trình") ||
    lowerMsg.includes("tự tin")
  ) {
    courseCategory = "giao_tiep";
    courseName = "Nghệ Thuật Giao Tiếp & Thuyết Trình";
  }

  let conversation = mockConversations.find((c) => c.id === convId || c.name === senderName);
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  if (!conversation) {
    conversation = {
      id: convId,
      name: senderName,
      avatar: senderName.charAt(0).toUpperCase() || "F",
      channel: "facebook",
      lastMessage: data.messageText,
      time: timeString,
      unread: 1,
      aiMode: "ai_auto",
      phoneAutoExtracted: false,
      course: courseName,
      courseCategory,
      status: "consulting",
      aiExtractedNeed: "Khách nhắn tin từ Fanpage Facebook",
      elearningStatus: "not_enrolled",
    };
    mockConversations.unshift(conversation);
  } else {
    conversation.lastMessage = data.messageText;
    conversation.time = timeString;
    conversation.unread += 1;
  }

  extractPhoneAndNeeds(conversation, data.messageText);

  const customerMsg: Message = {
    id: `m-cust-${Date.now()}`,
    conversation_id: conversation.id,
    sender_type: "customer",
    sender_name: senderName,
    content: data.messageText,
    is_internal_note: false,
    status: "delivered",
    created_at: timeString,
  };

  if (!mockMessagesDb[conversation.id]) {
    mockMessagesDb[conversation.id] = [];
  }
  mockMessagesDb[conversation.id].push(customerMsg);

  // Tự động kích hoạt phản hồi của AI Tiểu Mỹ nếu hội thoại ở chế độ AI Auto
  let aiReply: Message | null = null;
  if (conversation.aiMode === "ai_auto") {
    const res = generateAiResponse(conversation.id, false);
    if ("message" in res) {
      aiReply = res.message;
    }
  }

  return { conversation, customerMessage: customerMsg, aiReply };
}
