/**
 * INBOX SERVICE - QUẢN LÝ HỘP THƯ ĐA KÊNH & BỘ ĐIỀU KHIỂN AI ORCHESTRATOR
 * T.A Academy CRM - Phase 3
 */

import { AiConversationMode, ChannelType, Message, MessageSenderType } from "@/types/inbox";
import { addConsultation, updateConsultationStatus } from "./consultationService";

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

let mockConversations: ConversationItem[] = [
  {
    id: "conv-1",
    name: "Phạm Thu Hương",
    avatar: "H",
    channel: "facebook",
    lastMessage: "Bé nhà em 7 tuổi hơi nhút nhát, lưng đi hơi gù, số em là 0988123456 bên mình có lớp học thử không ạ?",
    time: "14:32",
    unread: 1,
    aiMode: "ai_auto",
    phone: "0988123456",
    phoneAutoExtracted: true,
    course: "Model Kids (Mẫu Nhí Tài Năng)",
    courseCategory: "model_kids",
    status: "uncalled",
    aiExtractedNeed: "Bé 7 tuổi nhút nhát, lưng đi gù, muốn rèn sự tự tin và dáng đi chuẩn mẫu nhí",
    elearningStatus: "not_enrolled",
  },
  {
    id: "conv-2",
    name: "Nguyễn Hoàng Nam",
    avatar: "N",
    channel: "zalo",
    lastMessage: "Em gửi giúp anh học phí chi tiết khóa Phong thái Doanh nhân nhé.",
    time: "13:15",
    unread: 0,
    aiMode: "human_takeover",
    agentName: "Lê Minh Trang",
    phone: "0912345888",
    phoneAutoExtracted: true,
    course: "Phong Thái Doanh Nhân",
    courseCategory: "phong_thai",
    status: "called",
    aiExtractedNeed: "Doanh nhân muốn học nâng tầm phong thái giao tiếp, thần thái đàm phán kinh doanh",
    elearningStatus: "not_enrolled",
  },
  {
    id: "conv-3",
    name: "Hoàng Kiều Trinh",
    avatar: "T",
    channel: "facebook",
    lastMessage: "Dạ em đã nhận được lịch học thử sáng thứ 7 rồi, cảm ơn học viện ạ!",
    time: "10:40",
    unread: 0,
    aiMode: "ai_auto",
    phone: "0909555666",
    phoneAutoExtracted: false,
    course: "Catwalk Chuyên Nghiệp",
    courseCategory: "catwalk",
    status: "trial_scheduled",
    aiExtractedNeed: "Đam mê thời trang, muốn rèn giải phóng hình thể sân khấu và casting show lớn",
    elearningStatus: "not_enrolled",
  },
  {
    id: "conv-4",
    name: "Vũ Mai Phương",
    avatar: "P",
    channel: "facebook",
    lastMessage: "Chị đã chuyển khoản học phí rồi em nhé, kiểm tra giúp chị.",
    time: "Hôm qua",
    unread: 0,
    aiMode: "human_takeover",
    agentName: "Trần Văn Bình",
    phone: "0934888999",
    phoneAutoExtracted: true,
    course: "Phong Thái Quý Cô",
    courseCategory: "phong_thai",
    status: "registered",
    aiExtractedNeed: "Chỉnh dáng đứng, ngồi quý cô thanh lịch và tự tin thuyết trình truyền cảm hứng",
    elearningStatus: "synced",
  },
];

let mockMessagesDb: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "m-1-1",
      conversation_id: "conv-1",
      sender_type: "customer",
      content: "Chào học viện T.A Academy, em muốn tìm hiểu khóa học cho con gái em ạ.",
      is_internal_note: false,
      status: "delivered",
      created_at: "14:28",
    },
    {
      id: "m-1-2",
      conversation_id: "conv-1",
      sender_type: "ai",
      sender_name: "AI An An (T.A Academy)",
      content:
        "Dạ em An An xin chào Chị Hương ạ! Rất vui được đồng hành cùng Chị và con. Chị cho em hỏi bé nhà mình năm nay được mấy tuổi rồi ạ? Mong muốn lớn nhất của Chị khi cho con tham gia lớp học là gì ha Chị?",
      is_internal_note: false,
      status: "delivered",
      created_at: "14:29",
    },
    {
      id: "m-1-3",
      conversation_id: "conv-1",
      sender_type: "customer",
      content:
        "Bé nhà em 7 tuổi hơi nhút nhát, lưng đi hơi gù, số em là 0988123456 bên mình có lớp học thử không ạ?",
      is_internal_note: false,
      status: "delivered",
      created_at: "14:32",
    },
  ],
  "conv-2": [
    {
      id: "m-2-1",
      conversation_id: "conv-2",
      sender_type: "customer",
      content: "Em gửi giúp anh học phí chi tiết khóa Phong thái Doanh nhân nhé.",
      is_internal_note: false,
      status: "delivered",
      created_at: "13:10",
    },
    {
      id: "m-2-2",
      conversation_id: "conv-2",
      sender_type: "human_agent",
      sender_name: "Lê Minh Trang",
      content:
        "Dạ em Trang - Chuyên viên tư vấn phong thái T.A Academy xin chào Anh Nam ạ. Khóa Phong Thái Doanh Nhân thiết kế riêng 12 buổi chuyên sâu giúp định hình phong thái đàm phán và thần thái lãnh đạo. Em gửi Anh lộ trình chi tiết qua Zalo này nhé ạ!",
      is_internal_note: false,
      status: "delivered",
      created_at: "13:15",
    },
  ],
  "conv-3": [
    {
      id: "m-3-1",
      conversation_id: "conv-3",
      sender_type: "customer",
      content: "Dạ em đã nhận được lịch học thử sáng thứ 7 rồi, cảm ơn học viện ạ!",
      is_internal_note: false,
      status: "delivered",
      created_at: "10:40",
    },
    {
      id: "m-3-2",
      conversation_id: "conv-3",
      sender_type: "ai",
      sender_name: "AI An An (T.A Academy)",
      content:
        "Dạ tuyệt vời quá Trinh ơi! Em nhớ chuẩn bị trang phục ôm sát nhẹ nhàng và giày cao gót thoải mái để buổi học thử đạt hiệu quả tốt nhất nha. Học viện T.A Academy hẹn gặp em vào 09:00 sáng Thứ 7 này nhé!",
      is_internal_note: false,
      status: "delivered",
      created_at: "10:41",
    },
  ],
  "conv-4": [
    {
      id: "m-4-1",
      conversation_id: "conv-4",
      sender_type: "customer",
      content: "Chị đã chuyển khoản học phí rồi em nhé, kiểm tra giúp chị.",
      is_internal_note: false,
      status: "delivered",
      created_at: "Hôm qua 16:40",
    },
    {
      id: "m-4-2",
      conversation_id: "conv-4",
      sender_type: "human_agent",
      sender_name: "Trần Văn Bình",
      content:
        "Dạ em Bình đã nhận đủ học phí khóa Phong Thái Quý Cô của Chị Phương rồi ạ! Em đã hoàn tất xếp lớp K26 trên hệ thống E-learning cho Chị. Chúc Chị sẽ có những trải nghiệm thăng hạng phong thái tuyệt vời cùng T.A Academy!",
      is_internal_note: false,
      status: "delivered",
      created_at: "Hôm qua 16:45",
    },
  ],
};

// 1. LẤY DANH SÁCH HỘI THOẠI
export function getInboxConversations(params?: {
  channel?: string;
  search?: string;
  mode?: string;
}) {
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

// 2. LẤY TOÀN BỘ TIN NHẮN THEO HỘI THOẠI
export function getConversationMessages(conversationId: string): Message[] {
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
    sender_name: data.senderName || (data.senderType === "ai" ? "AI An An" : "Tư vấn viên"),
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

  // QUY TẮC CỐT LÕI:
  // Nếu nhân viên gửi tin -> Tự động chuyển chế độ sang "human_takeover" (Khóa AI can thiệp)
  if (data.senderType === "human_agent") {
    conversation.aiMode = "human_takeover";
    conversation.agentName = data.senderName || "Tư vấn viên";
    conversation.unread = 0;
  }

  // Nếu khách gửi tin -> Tự động trích xuất SĐT nếu có
  if (data.senderType === "customer") {
    extractPhoneAndNeeds(conversation, data.content);
  }

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

  // Tạo phản hồi ngữ cảnh thông minh chuẩn T.A Academy
  let replyText = "";
  const lowerMsg = lastCustomerMessage.toLowerCase();

  if (lowerMsg.includes("học thử") || lowerMsg.includes("lịch học")) {
    replyText = `Dạ em An An xin gửi Mẹ lịch học thử trải nghiệm miễn phí khóa ${conversation.course} vào Thứ 7 (09:00 - 10:30) hoặc Chủ Nhật (15:00 - 16:30) tuần này ạ. Mẹ đăng ký ca nào để em giữ chỗ và chuẩn bị giáo cụ tốt nhất cho con nhé?`;
  } else if (lowerMsg.includes("học phí") || lowerMsg.includes("giá")) {
    replyText = `Dạ khóa ${conversation.course} tại T.A Academy có lộ trình chuẩn 12 buổi học trực tiếp cùng chuyên gia phong thái, học phí niêm yết là 6.500.000đ. Đang có ưu đãi đặc quyền tặng 1 buổi định hình dáng đi cá nhân nếu Mẹ đăng ký trong tuần này ạ!`;
  } else if (lowerMsg.includes("địa chỉ") || lowerMsg.includes("ở đâu")) {
    replyText = `Dạ trụ sở chính Học viện T.A Academy tại Toà nhà Landmark, Quận 1, TP.HCM ạ. Học viện có bãi đỗ xe ô tô và sảnh đón phụ huynh rất tiện lợi. Em xin phép đón Mẹ và bé đến tham quan lớp học vào ngày gần nhất nha Mẹ!`;
  } else {
    replyText = `Dạ em An An đã ghi nhận mong muốn của Chị về khóa ${conversation.course} cho bé. Để tư vấn lộ trình phù hợp nhất với thể trạng và tính cách của con, Chị cho em xin số điện thoại để chuyên viên tư vấn gọi điện gửi ảnh lớp học trực quan cho Chị nha!`;
  }

  if (isCopilot) {
    // Chỉ trả về gợi ý cho nhân viên duyệt
    return {
      suggestedReply: replyText,
      intentDetected: "consultation_inquiry",
    };
  }

  // Nếu là AI Auto -> Gửi tin nhắn trực tiếp
  return sendInboxMessage({
    conversationId,
    content: replyText,
    senderType: "ai",
    senderName: "AI An An (T.A Academy)",
  });
}

// 6. TỰ ĐỘNG TRÍCH XUẤT SĐT VÀ NHU CẦU TỪ TIN NHẮN KHÁCH HÀNG
function extractPhoneAndNeeds(conversation: ConversationItem, content: string) {
  // Regex tìm kiếm số điện thoại Việt Nam (10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)
  const phoneMatch = content.match(/(?:0|\+84)(?:3|5|7|8|9)\d{8}/);
  if (phoneMatch) {
    const extractedPhone = phoneMatch[0];
    conversation.phone = extractedPhone;
    conversation.phoneAutoExtracted = true;
    conversation.status = "uncalled"; // Kích hoạt đưa vào danh sách Khách chưa gọi (SLA)
  }

  // Tự động phân tích nhu cầu
  if (content.toLowerCase().includes("nhút nhát") || content.toLowerCase().includes("gù")) {
    conversation.aiExtractedNeed = "Bé nhút nhát, lưng đi hơi gù, muốn rèn dáng đi tự tin trước đám đông";
  } else if (content.toLowerCase().includes("thời trang") || content.toLowerCase().includes("show")) {
    conversation.aiExtractedNeed = "Quan tâm cơ hội diễn show và giải phóng hình thể sân khấu";
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

  // 1. Phân loại khóa học quan tâm
  const lowerMsg = data.messageText.toLowerCase();
  let courseCategory: "model_kids" | "phong_thai" | "catwalk" | "giao_tiep" = "model_kids";
  let courseName = "Model Kids (Mẫu Nhí Tài Năng)";

  if (lowerMsg.includes("phong thái") || lowerMsg.includes("quý cô") || lowerMsg.includes("doanh nhân")) {
    courseCategory = "phong_thai";
    courseName = "Phong Thái Quý Cô & Doanh Nhân";
  } else if (lowerMsg.includes("catwalk") || lowerMsg.includes("sân khấu") || lowerMsg.includes("người mẫu")) {
    courseCategory = "catwalk";
    courseName = "Catwalk Chuyên Nghiệp";
  } else if (lowerMsg.includes("giao tiếp") || lowerMsg.includes("thuyết trình") || lowerMsg.includes("tự tin")) {
    courseCategory = "giao_tiep";
    courseName = "Nghệ Thuật Giao Tiếp & Thuyết Trình";
  }

  // 2. Tìm hoặc khởi tạo hội thoại trong Hộp thư
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

  // 3. Trích xuất SĐT & nhu cầu
  extractPhoneAndNeeds(conversation, data.messageText);

  // 4. Lưu tin nhắn của khách hàng
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

  // 5. Tự động sinh câu trả lời AI nếu đang bật ai_auto
  let aiReplyText = "";
  let aiMessage: Message | null = null;

  if (conversation.aiMode === "ai_auto") {
    if (lowerMsg.includes("học thử") || lowerMsg.includes("trải nghiệm")) {
      aiReplyText = `Dạ em An An xin chào ${senderName}! Em rất vui được hỗ trợ Chị tìm hiểu khóa ${conversation.course}. Cuối tuần này (Thứ 7 lúc 09:00 hoặc Chủ Nhật lúc 15:00) học viện có tổ chức lớp học thử trải nghiệm miễn phí ạ. Chị cho em xin số điện thoại để em giữ chỗ và chuẩn bị trang phục cho con nha!`;
    } else if (lowerMsg.includes("học phí") || lowerMsg.includes("bao nhiêu tiền") || lowerMsg.includes("giá")) {
      aiReplyText = `Dạ học phí chính thức khóa ${conversation.course} tại T.A Academy được đào tạo trực tiếp cùng các chuyên gia hàng đầu. Trong tuần này học viện đang có ưu đãi đặc quyền tặng kèm 1 buổi định hình phong thái cá nhân khi đăng ký giữ chỗ sớm ạ!`;
    } else {
      aiReplyText = `Dạ em An An (T.A Academy) đã nhận được tin nhắn từ ${senderName} ạ! Với khóa ${conversation.course}, giảng viên sẽ kèm cặp sát sao để đạt kết quả tốt nhất. Chị cho em xin số điện thoại hoặc độ tuổi của bé để em tư vấn giáo trình chi tiết nhất cho mình nha!`;
    }

    aiMessage = {
      id: `m-ai-${Date.now()}`,
      conversation_id: conversation.id,
      sender_type: "ai",
      sender_name: "AI An An (T.A Academy)",
      content: aiReplyText,
      is_internal_note: false,
      status: "delivered",
      created_at: timeString,
    };
    mockMessagesDb[conversation.id].push(aiMessage);
    conversation.lastMessage = aiReplyText;
  }

  // 6. Đồng bộ sang Quản lý khách hàng tư vấn nếu có SĐT hoặc khách hàng mới
  let syncedLead = null;
  try {
    syncedLead = addConsultation({
      customerName: senderName,
      phone: conversation.phone || null,
      courseRef: courseCategory,
      aiExtractedNeed: conversation.aiExtractedNeed || "Khách nhắn tin qua Fanpage",
      source: "facebook",
    });
  } catch (e) {
    console.error("Lỗi đồng bộ khách hàng tư vấn:", e);
  }

  return {
    conversation,
    customerMessage: customerMsg,
    aiMessage,
    aiReplyText,
    extractedPhone: conversation.phone || null,
    extractedNeed: conversation.aiExtractedNeed,
    syncedLead,
  };
}
