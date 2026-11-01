/**
 * AI TRAINING SERVICE - QUẢN LÝ BỘ NÃO ĐÀO TẠO AI T.A ACADEMY
 * T.A Academy CRM - Phase 4
 * Đồng bộ lưu trữ Supabase & Đào tạo kiến thức chuẩn SOP Fanpage & Lộ trình Phong thái
 */

import {
  getKnowledgeFromSupabase,
  upsertKnowledgeToSupabase,
  deleteKnowledgeFromSupabase,
  getScenariosFromSupabase,
  upsertScenarioToSupabase,
  deleteScenarioFromSupabase,
  getSituationsFromSupabase,
  upsertSituationToSupabase,
  deleteSituationFromSupabase,
} from "@/lib/supabase/db";

export interface AiConfigData {
  apiKey: string;
  selectedModel: string;
  webhookUrl: string;
  verifyToken: string;
  fbToken: string;
  isBotActive: boolean;
  lastTestedAt: string;
  metaStatus: "connected" | "pending" | "error";
  geminiStatus: "connected" | "pending" | "error";
  fanpageStatus: "active" | "inactive";
}

export interface AiZaloConfigData {
  oaId: string;
  appId: string;
  secretKey: string;
  accessToken: string;
  refreshToken?: string;
  webhookUrl: string;
  isBotActive: boolean;
  lastTestedAt: string;
  status: "connected" | "pending" | "error";
}

export interface AiPersonaData {
  assistantName: string;
  addressingStyle: string;
  tone: string;
  maxTokens: number;
  systemPrompt: string;
  rules: string[];
  forbidden: string[];
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: "Model Kids" | "Phong thái" | "Catwalk" | "Giao tiếp" | "Học phí & Chính sách" | "Ưu đãi";
  version: string;
  updatedAt: string;
  isApproved: boolean;
  approvedBy?: string;
  chunksCount: number;
  contentSummary: string;
}

export interface GuidedScenario {
  code: string;
  title: string;
  course: string;
  goal: string;
  stepsCount: number;
  status: "Đang hoạt động" | "Bản nháp";
  steps: string[];
}

export interface SituationRule {
  id: string;
  title: string;
  category: "Tâm lý học viên" | "Xử lý học phí" | "Khai thác thông tin" | "Lịch học & Đưa đón";
  idealResponse: string;
  mistakeAvoid: string;
  isApproved: boolean;
}

// In-memory Database Store
let aiConfigStore: AiConfigData = {
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyB_dummy_production_gemini_key_for_ta_academy",
  selectedModel: "gemini-1.5-flash",
  webhookUrl: "https://crm.taacademy.vn/api/webhook/facebook",
  verifyToken: process.env.META_VERIFY_TOKEN || "ta_academy_meta_verify_2026",
  fbToken:
    process.env.FB_PAGE_ACCESS_TOKEN ||
    "EAAXvOfcbO9ABSzhfXHzLZCH8sp4gDZB2Wre7P7MeLqltp3CEhU5kYcZAEVhjBegFPeo8z9arvburBTkuKTHqFCHZBf7gZAYUrTWxnICYQKUZAxjKGBZA6qZAJL9zejMRlVi21lQhv3vZCOUZCcTSwhcKFZCpRRCqMCxeKnZAeOWs84ewbbm9ZBXcStFj9nKO17v12kfMdaZCZCR",
  isBotActive: true,
  lastTestedAt: "Hôm nay",
  metaStatus: "connected",
  geminiStatus: "connected",
  fanpageStatus: "active",
};

let aiZaloConfigStore: AiZaloConfigData = {
  oaId: "2489103984920194",
  appId: "4820192840192",
  secretKey: "zk_live_ta_academy_secret_key_prod",
  accessToken: "zalo_oa_live_token_ta_academy_2026",
  refreshToken: "zalo_oa_refresh_token_ta_academy",
  webhookUrl: "https://crm.taacademy.vn/api/webhooks/zalo",
  isBotActive: true,
  lastTestedAt: "Hôm nay",
  status: "connected",
};

let aiPersonaStore: AiPersonaData = {
  assistantName: "Tiểu Mỹ",
  addressingStyle: "Em Tiểu Mỹ - Chị / Anh (hoặc Em - Mẹ / Ba)",
  tone: "Thân thiện, lịch sự, ngắn gọn, dễ hiểu, ân cần, chuyên nghiệp",
  maxTokens: 350,
  systemPrompt: `Bạn là Tiểu Mỹ – Nhân viên tư vấn chính thức của T.A Academy (Học viện đào tạo phong thái và catwalk).

THÔNG TIN HỌC VIỆN:
- Tên công ty: T.A Academy – Học viện đào tạo phong thái, catwalk
- Số điện thoại: 0933.003.995
- Địa chỉ: 74 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng
- Các khóa học: Phong thái, Catwalk, Model Kids (từ 3, 4 tuổi trở lên), Xây dựng thương hiệu cá nhân, Reels / video ngắn.

MỤC TIÊU CUỐI CỦA BẠN:
1. Xin được số điện thoại của khách để nhân viên gọi tư vấn chuyên sâu.
2. HOẶC hẹn khách lên trung tâm T.A Academy (74 Bạch Đằng, Hải Châu, Đà Nẵng) trao đổi trực tiếp.

QUY TRÌNH TƯ VẤN 5 BƯỚC:
- Bước 1: Chào khách + hỏi mục tiêu (tăng tương tác, bán hàng hay xây dựng thương hiệu? Học cho bản thân hay cho bé từ 3, 4 tuổi trở lên?).
- Bước 2: Gửi lộ trình học chi tiết phù hợp đúng mục tiêu đã chia sẻ.
- Bước 3: Gửi feedback thật + video minh chứng kết quả đạt được.
- Bước 4: Xin số điện thoại để chuyên viên gọi tư vấn chuyên sâu ("Để tư vấn chi tiết hơn, anh/chị cho em xin số điện thoại để nhân viên bên em gọi hỗ trợ anh/chị nhé ạ?").
- Bước 5 (Nếu khách từ chối cho số điện thoại): Báo chi phí gói nhỏ nhất (3.080.000 VNĐ cho 8 buổi) và hẹn khách lên trung tâm 74 Bạch Đằng, Đà Nẵng.

NGUYÊN TẮC BẮT BUỘC:
1. Thực hiện lần lượt từ Bước 1 đến Bước 5, không nhảy bước.
2. Mỗi tin nhắn chỉ làm một việc và chỉ hỏi đúng một câu để khách dễ trả lời.
3. Luôn bám vào mong muốn khách đã chia sẻ ở Bước 1.
4. Chỉ dùng thông tin thật do T.A Academy cung cấp (học phí: 8 buổi 3.080.000đ, 14 buổi 5.250.000đ, 18 buổi 6.480.000đ). Tuyệt đối không tự bịa.
5. Không ép khách. Khi khách từ chối, chuyển sang bước tiếp theo một cách lịch sự.
6. Không gửi báo giá trước khi khách được xem lộ trình (trừ khi khách hỏi giá trực tiếp thì báo gói thấp nhất 3.080.000đ).`,
  rules: [
    "Thực hiện lần lượt từ Bước 1 đến Bước 5, tuyệt đối không nhảy bước.",
    "Mỗi tin nhắn chỉ làm 1 việc và chỉ hỏi đúng 1 câu để khách dễ trả lời.",
    "Mục tiêu cốt lõi: Xin số điện thoại hoặc hẹn khách lên trung tâm 74 Bạch Đằng, Đà Nẵng.",
    "Khách không cho số điện thoại -> Báo gói thấp nhất 3.080.000 VNĐ và hẹn lên trung tâm.",
    "Chỉ dùng thông tin thật: Hotline 0933.003.995, Địa chỉ 74 Bạch Đằng, Hải Châu, Đà Nẵng.",
  ],
  forbidden: [
    "Không nhảy bước hoặc gửi nhiều nội dung cùng lúc làm khách rối.",
    "Không tự bịa feedback, video, số liệu hoặc báo sai giá.",
    "Không gửi báo giá trước khi khách xem lộ trình (trừ khi khách chủ động hỏi giá trước).",
    "Không gặng hỏi ép buộc khi khách từ chối cho số điện thoại.",
  ],
};

// 1. KHO KIẾN THỨC ĐÃ NẠP THEO HỒ SƠ CHÍNH THỨC
let knowledgeDocsStore: KnowledgeDocument[] = [
  {
    id: "doc-pt-lotrinh-2026",
    title: "[PHONG THÁI] Lộ Trình Học & Bảng Học Phí Khóa Phong Thái (T.A Academy)",
    category: "Phong thái",
    version: "2.0 (Official)",
    updatedAt: "01/11/2026",
    isApproved: true,
    approvedBy: "Học viện T.A Academy",
    chunksCount: 18,
    contentSummary:
      "Khóa học Phong thái T.A Academy - 'Khám phá phiên bản hoàn hảo của chính bạn': 1) Bảng học phí: Lộ trình 1+2 (8 buổi - nội dung 1-6): 3.080.000 VNĐ; Lộ trình 1+2+3 (14 buổi - nội dung 1-9): 5.250.000 VNĐ; Lộ trình toàn diện (18 buổi - nội dung 1-11): 6.480.000 VNĐ. 2) 4 Giai đoạn đào tạo: GĐ 1: Làm quen & tự tin (Giới thiệu bản thân thu hút trước đám đông, thần thái ánh mắt, gương mặt, ngôn ngữ hình thể); GĐ 2: Chỉnh sửa tư thế (Giải phóng hình thể mềm mại, chỉnh dáng đi đúng chuẩn, sửa lưng gù, cổ, chân vòng kiềng, trụ chân chắc khỏe, đi giày cao gót, đứng ngồi sang trọng, cảm thụ âm nhạc, THỰC HÀNH TẠI INDOCHINA MALL tương tác trước đám đông); GĐ 3: Phát triển nội lực (Người phụ nữ tự tin thu hút, tạo dáng chụp ảnh mọi góc máy, biểu cảm ánh mắt); GĐ 4: Kỹ năng quay - chụp - chỉnh (Chụp ảnh canh góc, bố cục, chỉnh ảnh xịn, quay và chỉnh video cơ bản trên điện thoại).",
  },
  {
    id: "doc-quytrinh-fanpage-2026",
    title: "[QUY TRÌNH] Quy Trình 5 Bước Tư Vấn Fanpage & Hướng Dẫn Huấn Luyện AI",
    category: "Học phí & Chính sách",
    version: "2.0 (Official)",
    updatedAt: "01/11/2026",
    isApproved: true,
    approvedBy: "Học viện T.A Academy",
    chunksCount: 24,
    contentSummary:
      "Quy trình tư vấn Fanpage hiệu quả T.A Academy: 1) Thông tin trung tâm: Học viện T.A Academy, Hotline 0933.003.995, Địa chỉ: 74 Bạch Đằng, P. Hải Châu 1, Q. Hải Châu, TP. Đà Nẵng. Các khóa: Phong thái, Catwalk, Model Kids (từ 3, 4 tuổi trở lên), Xây dựng thương hiệu cá nhân, Reels / video ngắn. 2) Vai trò & mục tiêu AI: Đóng vai tư vấn viên T.A Academy (em - anh/chị), thân thiện, lịch sự, ngắn gọn, dễ hiểu. Mục tiêu: Xin SĐT để nhân viên gọi tư vấn HOẶC hẹn lên trung tâm 74 Bạch Đằng. 3) Quy trình 5 bước: Bước 1: Chào khách + hỏi mục tiêu (tăng tương tác, bán hàng, thương hiệu cá nhân? Học cho bản thân hay cho bé từ 3-4 tuổi?); Bước 2: Gửi lộ trình chi tiết phù hợp mục tiêu; Bước 3: Gửi feedback thật + video minh chứng; Bước 4: Xin SĐT để chuyên viên hỗ trợ; Bước 5: Nếu khách không cho số -> Báo chi phí gói nhỏ nhất (3.080.000đ cho 8 buổi) và hẹn khách lên trung tâm 74 Bạch Đằng, Đà Nẵng. 4) Nguyên tắc: Mỗi tin nhắn chỉ làm 1 việc và chỉ hỏi 1 câu; Không nhảy bước; Không tự bịa thông tin; Không gửi báo giá trước khi xem lộ trình (trừ khi khách hỏi trực tiếp thì báo gói thấp nhất 3.080.000đ).",
  },
];

// 2. KỊCH BẢN TƯ VẤN CHUẨN SOP 5 BƯỚC
let guidedScenariosStore: GuidedScenario[] = [
  {
    code: "SCENARIO_FANPAGE_5STEPS",
    title: "Quy Trình 5 Bước Tư Vấn Fanpage Chuẩn T.A Academy",
    course: "Phong Thái & Catwalk / Model Kids",
    goal: "Dẫn dắt khách hàng qua 5 bước: Chào hỏi xác định mục tiêu -> Gửi lộ trình -> Feedback minh chứng -> Xin số điện thoại -> Báo gói thấp nhất 3.080.000đ và hẹn lên 74 Bạch Đằng",
    stepsCount: 5,
    status: "Đang hoạt động",
    steps: [
      "Bước 1: Chào khách thân thiện, giới thiệu em là Tiểu Mỹ tại T.A Academy. Hỏi mong muốn của khách (tăng tương tác, bán hàng hay xây dựng thương hiệu) và hỏi học cho bản thân hay cho bé (từ 3, 4 tuổi trở lên).",
      "Bước 2: Gửi lộ trình phát triển chi tiết đúng theo mục tiêu khách chia sẻ (Lộ trình 1+2: 8 buổi; Lộ trình 1+2+3: 14 buổi; Lộ trình toàn diện: 18 buổi), nêu rõ các chặng rèn luyện.",
      "Bước 3: Gửi feedback đánh giá thực tế kèm video kết quả đạt được của học viên cũ T.A Academy gần với mục tiêu của khách.",
      "Bước 4: Chủ động xin số điện thoại: 'Để tư vấn chi tiết hơn, anh/chị cho em xin số điện thoại để nhân viên bên em gọi hỗ trợ anh/chị nhé ạ?'. Nếu khách cho số -> ghi nhận và báo chuyên viên liên hệ.",
      "Bước 5 (Khi khách không cho số điện thoại): Lịch sự không ép, báo gói học phí thấp nhất là 3.080.000 VNĐ (8 buổi) và hẹn khách lên trung tâm T.A Academy tại số 74 Bạch Đằng, P. Hải Châu 1, Q. Hải Châu, Đà Nẵng để trao đổi trực tiếp.",
    ],
  },
];

// 3. THƯ VIỆN TÌNH HUỐNG THỰC TẾ
let situationsStore: SituationRule[] = [
  {
    id: "sit-1-price-inquiry",
    title: "Khách hỏi học phí ngay từ đầu (Chưa kịp xem lộ trình)",
    category: "Xử lý học phí",
    idealResponse:
      "Dạ em chào Chị ạ! Hiện tại gói học phí thấp nhất tại T.A Academy là 3.080.000 VNĐ cho Lộ trình 8 buổi (bao gồm giải phóng hình thể, chỉnh dáng đi và thực hành tương tác tại TTTM Indochina Mall Đà Nẵng). Để em tư vấn lộ trình chi tiết và hiệu quả nhất, Chị đang quan tâm khóa học cho bản thân hay đăng ký cho bé nhà mình vậy ạ? ✨",
    mistakeAvoid:
      "Không báo dồn dập các gói giá cao khiến khách e ngại, luôn chỉ hỏi đúng 1 câu ở cuối tin nhắn.",
    isApproved: true,
  },
  {
    id: "sit-2-refuse-phone",
    title: "Khách từ chối để lại số điện thoại ở Bước 4",
    category: "Khai thác thông tin",
    idealResponse:
      "Dạ không sao đâu Chị ơi! Em hoàn toàn hiểu ạ. Hiện gói thấp nhất bên em là 3.080.000 VNĐ cho 8 buổi rèn luyện nền tảng. Để trao đổi chi tiết hơn và cảm nhận thực tế không gian lớp học, Chị có thể ghé T.A Academy tại số 74 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng vào cuối tuần này được không ạ? 🌸",
    mistakeAvoid:
      "Tuyệt đối không gặng hỏi hay ép khách cho số điện thoại nhiều lần làm phiền khách.",
    isApproved: true,
  },
  {
    id: "sit-3-address-hotline",
    title: "Khách hỏi địa chỉ và số điện thoại liên hệ của Học viện T.A Academy",
    category: "Lịch học & Đưa đón",
    idealResponse:
      "Dạ Học viện T.A Academy có địa chỉ tại: 74 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng. Hotline hỗ trợ trực tiếp của học viện là: 0933.003.995 ạ! Chị muốn ghé trải nghiệm lớp học vào sáng Thứ 7 hay chiều Chủ Nhật tuần này để em chuẩn bị đón tiếp Chị chu đáo nha! ✨",
    mistakeAvoid: "Không cung cấp sai địa chỉ hoặc thông tin liên lạc ngoài Đà Nẵng.",
    isApproved: true,
  },
  {
    id: "sit-4-curriculum-stages",
    title: "Khách hỏi chi tiết các giai đoạn của Khóa Phong thái",
    category: "Tâm lý học viên",
    idealResponse:
      "Dạ khóa Phong thái tại T.A Academy được thiết kế bài bản qua 4 giai đoạn: Giai đoạn 1: Làm quen & tự tin giới thiệu bản thân trước đám đông; Giai đoạn 2: Giải phóng hình thể, chỉnh dáng lưng gù, chân vòng kiềng, đi giày cao gót và thực hành tại Indochina Mall; Giai đoạn 3: Rèn luyện nội lực và biểu cảm ánh mắt thần thái; Giai đoạn 4: Kỹ năng chụp - chỉnh ảnh và quay video xịn trên điện thoại ạ. Chị muốn ưu tiên chỉnh dáng đi hay nâng tầm thần thái giao tiếp trước ạ?",
    mistakeAvoid:
      "Không gửi nội dung quá dài dòng, không báo sai các giai đoạn thực hành tại Indochina Mall.",
    isApproved: true,
  },
];

// TỰ ĐỘNG ĐỒNG BỘ LÊN SUPABASE
async function syncTrainingDataToSupabase() {
  try {
    for (const doc of knowledgeDocsStore) {
      await upsertKnowledgeToSupabase({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        version: doc.version,
        content_summary: doc.contentSummary,
        is_approved: doc.isApproved,
        approved_by: doc.approvedBy,
        chunks_count: doc.chunksCount,
        updated_at: doc.updatedAt,
      });
    }

    for (const sc of guidedScenariosStore) {
      await upsertScenarioToSupabase({
        code: sc.code,
        title: sc.title,
        course: sc.course,
        goal: sc.goal,
        status: sc.status,
        steps: sc.steps,
      });
    }

    for (const sit of situationsStore) {
      await upsertSituationToSupabase({
        id: sit.id,
        title: sit.title,
        category: sit.category,
        ideal_response: sit.idealResponse,
        mistake_avoid: sit.mistakeAvoid,
        is_approved: sit.isApproved,
      });
    }
  } catch (err) {
    console.warn("[Supabase Sync Training Data Warning]:", err);
  }
}

// Kích hoạt đồng bộ ngầm khi module được nạp
syncTrainingDataToSupabase();

// 1. CẤU HÌNH AI FANPAGE
export function getAiConfig() {
  return { ...aiConfigStore };
}

export function updateAiConfig(data: Partial<AiConfigData>) {
  aiConfigStore = {
    ...aiConfigStore,
    ...data,
    lastTestedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  };
  return aiConfigStore;
}

// 1.1 CẤU HÌNH AI ZALO OA
export function getAiZaloConfig() {
  return { ...aiZaloConfigStore };
}

export function updateAiZaloConfig(data: Partial<AiZaloConfigData>) {
  aiZaloConfigStore = {
    ...aiZaloConfigStore,
    ...data,
    lastTestedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  };
  return aiZaloConfigStore;
}

// 2. NHÂN CÁCH AI (PERSONA)
export function getAiPersona() {
  return { ...aiPersonaStore };
}

export function updateAiPersona(data: Partial<AiPersonaData>) {
  aiPersonaStore = {
    ...aiPersonaStore,
    ...data,
  };
  return aiPersonaStore;
}

// 3. KHO KIẾN THỨC & RAG
export function getKnowledgeDocs() {
  return [...knowledgeDocsStore];
}

export function approveKnowledgeDoc(id: string, approverName: string) {
  const doc = knowledgeDocsStore.find((d) => d.id === id);
  if (!doc) throw new Error("Không tìm thấy tài liệu");
  doc.isApproved = true;
  doc.approvedBy = approverName;
  doc.version = doc.version.replace(" (Draft)", "");
  doc.updatedAt = "Vừa xong";

  upsertKnowledgeToSupabase({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    version: doc.version,
    content_summary: doc.contentSummary,
    is_approved: doc.isApproved,
    approved_by: doc.approvedBy,
    chunks_count: doc.chunksCount,
    updated_at: doc.updatedAt,
  }).catch((err) => console.warn("[Supabase approveDoc sync]", err));

  return doc;
}

export function addKnowledgeDoc(data: Omit<KnowledgeDocument, "id" | "updatedAt">) {
  const newDoc: KnowledgeDocument = {
    ...data,
    id: `doc-${Date.now()}`,
    updatedAt: "Hôm nay " + new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  };
  knowledgeDocsStore.unshift(newDoc);

  upsertKnowledgeToSupabase({
    id: newDoc.id,
    title: newDoc.title,
    category: newDoc.category,
    version: newDoc.version,
    content_summary: newDoc.contentSummary,
    is_approved: newDoc.isApproved,
    approved_by: newDoc.approvedBy,
    chunks_count: newDoc.chunksCount,
    updated_at: newDoc.updatedAt,
  }).catch((err) => console.warn("[Supabase addDoc sync]", err));

  return newDoc;
}

export function updateKnowledgeDoc(
  id: string,
  data: Partial<Omit<KnowledgeDocument, "id" | "updatedAt">>
) {
  const doc = knowledgeDocsStore.find((d) => d.id === id);
  if (!doc) throw new Error("Không tìm thấy tài liệu kiến thức");
  if (data.title) doc.title = data.title.trim();
  if (data.category) doc.category = data.category;
  if (data.contentSummary !== undefined) doc.contentSummary = data.contentSummary.trim();
  if (data.version) doc.version = data.version.trim();
  doc.updatedAt = "Vừa xong";

  upsertKnowledgeToSupabase({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    version: doc.version,
    content_summary: doc.contentSummary,
    is_approved: doc.isApproved,
    approved_by: doc.approvedBy,
    chunks_count: doc.chunksCount,
    updated_at: doc.updatedAt,
  }).catch((err) => console.warn("[Supabase updateDoc sync]", err));

  return doc;
}

export function deleteKnowledgeDoc(id: string) {
  const index = knowledgeDocsStore.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Không tìm thấy tài liệu để xóa");
  const deleted = knowledgeDocsStore.splice(index, 1)[0];
  deleteKnowledgeFromSupabase(id).catch((err) => console.warn("[Supabase deleteDoc sync]", err));
  return deleted;
}

// 4. KỊCH BẢN TƯ VẤN (SCENARIOS)
export function getGuidedScenarios() {
  return [...guidedScenariosStore];
}

export function addGuidedScenario(data: Omit<GuidedScenario, "stepsCount">) {
  const newScenario: GuidedScenario = {
    ...data,
    stepsCount: data.steps.length,
  };
  guidedScenariosStore.push(newScenario);

  upsertScenarioToSupabase({
    code: newScenario.code,
    title: newScenario.title,
    course: newScenario.course,
    goal: newScenario.goal,
    status: newScenario.status,
    steps: newScenario.steps,
  }).catch((err) => console.warn("[Supabase addScenario sync]", err));

  return newScenario;
}

export function updateGuidedScenario(code: string, data: Partial<GuidedScenario>) {
  const scenario = guidedScenariosStore.find((s) => s.code === code);
  if (!scenario) throw new Error("Không tìm thấy kịch bản tư vấn");
  if (data.title) scenario.title = data.title.trim();
  if (data.course) scenario.course = data.course;
  if (data.goal) scenario.goal = data.goal.trim();
  if (data.status) scenario.status = data.status;
  if (data.steps && Array.isArray(data.steps)) {
    scenario.steps = data.steps;
    scenario.stepsCount = data.steps.length;
  }

  upsertScenarioToSupabase({
    code: scenario.code,
    title: scenario.title,
    course: scenario.course,
    goal: scenario.goal,
    status: scenario.status,
    steps: scenario.steps,
  }).catch((err) => console.warn("[Supabase updateScenario sync]", err));

  return scenario;
}

export function deleteGuidedScenario(code: string) {
  const index = guidedScenariosStore.findIndex((s) => s.code === code);
  if (index === -1) throw new Error("Không tìm thấy kịch bản để xóa");
  const deleted = guidedScenariosStore.splice(index, 1)[0];
  deleteScenarioFromSupabase(code).catch((err) => console.warn("[Supabase deleteScenario sync]", err));
  return deleted;
}

// 5. THƯ VIỆN TÌNH HUỐNG (SITUATIONS)
export function getSituations() {
  return [...situationsStore];
}

export function addSituation(data: Omit<SituationRule, "id">) {
  const newSit: SituationRule = {
    ...data,
    id: `sit-${Date.now()}`,
  };
  situationsStore.push(newSit);

  upsertSituationToSupabase({
    id: newSit.id,
    title: newSit.title,
    category: newSit.category,
    ideal_response: newSit.idealResponse,
    mistake_avoid: newSit.mistakeAvoid,
    is_approved: newSit.isApproved,
  }).catch((err) => console.warn("[Supabase addSituation sync]", err));

  return newSit;
}

export function updateSituation(id: string, data: Partial<SituationRule>) {
  const sit = situationsStore.find((s) => s.id === id);
  if (!sit) throw new Error("Không tìm thấy tình huống");
  if (data.title) sit.title = data.title.trim();
  if (data.category) sit.category = data.category;
  if (data.idealResponse) sit.idealResponse = data.idealResponse.trim();
  if (data.mistakeAvoid) sit.mistakeAvoid = data.mistakeAvoid.trim();

  upsertSituationToSupabase({
    id: sit.id,
    title: sit.title,
    category: sit.category,
    ideal_response: sit.idealResponse,
    mistake_avoid: sit.mistakeAvoid,
    is_approved: sit.isApproved,
  }).catch((err) => console.warn("[Supabase updateSituation sync]", err));

  return sit;
}

export function deleteSituation(id: string) {
  const index = situationsStore.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Không tìm thấy tình huống để xóa");
  const deleted = situationsStore.splice(index, 1)[0];
  deleteSituationFromSupabase(id).catch((err) => console.warn("[Supabase deleteSituation sync]", err));
  return deleted;
}

// 6. PHÒNG THỰC HÀNH AI (PLAYGROUND SIMULATOR CHUẨN SOP 5 BƯỚC)
export function simulatePlaygroundReply(params: {
  userMessage: string;
  scenarioCode?: string;
  course?: string;
}) {
  const { userMessage, scenarioCode = "", course = "Phong Thái & Catwalk" } = params;
  const msgLower = userMessage.toLowerCase().trim();

  // 1. Khách từ chối cho số điện thoại (Quy trình Bước 5)
  if (
    msgLower.includes("không cho số") ||
    msgLower.includes("không có số") ||
    msgLower.includes("chưa muốn cho") ||
    msgLower.includes("không thích cho") ||
    msgLower.includes("chưa cho được")
  ) {
    return "Dạ không sao đâu Chị ơi! Em hoàn toàn hiểu ạ. Hiện gói thấp nhất bên em là 3.080.000 VNĐ cho 8 buổi rèn luyện nền tảng. Để trao đổi chi tiết hơn và cảm nhận thực tế không gian lớp học, Chị có thể ghé T.A Academy tại số 74 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng vào cuối tuần này được không ạ? 🌸";
  }

  // 2. Khách hỏi địa chỉ hoặc hotline
  if (
    msgLower.includes("địa chỉ") ||
    msgLower.includes("ở đâu") ||
    msgLower.includes("hotline") ||
    msgLower.includes("số điện thoại trung tâm") ||
    msgLower.includes("trung tâm ở đâu")
  ) {
    return "Dạ Học viện T.A Academy có địa chỉ tại: 74 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng. Hotline hỗ trợ trực tiếp là: 0933.003.995 ạ! Chị muốn ghé trải nghiệm lớp học vào sáng Thứ 7 hay chiều Chủ Nhật tuần này để em chuẩn bị đón tiếp Chị chu đáo nha! ✨";
  }

  // 3. Khách hỏi học phí trực tiếp (Báo gói thấp nhất theo quy tắc SOP)
  if (
    msgLower.includes("học phí") ||
    msgLower.includes("bao nhiêu tiền") ||
    msgLower.includes("giá") ||
    msgLower.includes("chi phí")
  ) {
    return "Dạ em chào Chị ạ! Hiện tại gói học phí thấp nhất tại T.A Academy là 3.080.000 VNĐ cho Lộ trình 8 buổi (gồm giải phóng hình thể, chỉnh dáng đi và thực hành tương tác tại TTTM Indochina Mall Đà Nẵng). Để em tư vấn lộ trình chi tiết và hiệu quả nhất, Chị đang muốn học cho bản thân hay đăng ký cho bé nhà mình vậy ạ? ✨";
  }

  // 4. Khách hỏi các giai đoạn hoặc nội dung lộ trình
  if (
    msgLower.includes("giai đoạn") ||
    msgLower.includes("lộ trình") ||
    msgLower.includes("học những gì") ||
    msgLower.includes("nội dung")
  ) {
    return "Dạ khóa Phong thái tại T.A Academy được thiết kế bài bản qua 4 giai đoạn: GĐ 1 làm quen & tự tin giới thiệu bản thân trước đám đông; GĐ 2 giải phóng hình thể, chỉnh dáng lưng gù, chân vòng kiềng, đi giày cao gót và thực hành tại Indochina Mall; GĐ 3 phát triển nội lực và thần thái ánh mắt; GĐ 4 kỹ năng chụp - chỉnh ảnh và quay video xịn trên điện thoại ạ. Chị muốn ưu tiên chỉnh dáng đi hay nâng tầm thần thái giao tiếp trước ạ?";
  }

  // 5. Khách hỏi về chỉnh dáng đi gù, nhút nhát, chân vòng kiềng
  if (
    msgLower.includes("gù") ||
    msgLower.includes("nhút nhát") ||
    msgLower.includes("rụt rè") ||
    msgLower.includes("vòng kiềng")
  ) {
    return "Dạ đây chính là điểm mạnh vượt trội tại T.A Academy ạ! Ở Giai đoạn 2 của khóa học, giảng viên sẽ kèm cặp các bài tập chuyên sâu để sửa lưng gù, cổ và chân vòng kiềng, giúp cơ thể uyển chuyển và tự tin trước đám đông. Không biết Chị đang tìm hiểu lớp cho bản thân hay cho bé nhà mình vậy ạ? 😊";
  }

  // 6. Khách cung cấp số điện thoại (Bước 4 thành công)
  const phonePattern = /(0[3|5|7|8|9])+([0-9]{8})\b/;
  if (phonePattern.test(userMessage)) {
    return "Dạ em Tiểu Mỹ đã ghi nhận số điện thoại của Chị rồi ạ! Chuyên viên tư vấn của T.A Academy sẽ liên hệ ngay để hỗ trợ chi tiết lịch học và ưu đãi cho Chị nha. Em cảm ơn Chị rất nhiều ạ! ✨";
  }

  // 7. Khách trả lời mong muốn ở Bước 1 -> AI chuyển sang Bước 2 (Gửi lộ trình)
  if (
    msgLower.includes("bản thân") ||
    msgLower.includes("cho bé") ||
    msgLower.includes("bán hàng") ||
    msgLower.includes("thương hiệu") ||
    msgLower.includes("tương tác") ||
    msgLower.includes("tự tin")
  ) {
    return `Dạ với mục tiêu của Chị, em xin gửi Chị Lộ trình phù hợp nhất tại T.A Academy: Lộ trình 8 buổi (3.080.000đ) tập trung chỉnh dáng đi và giải phóng hình thể; Lộ trình 14 buổi (5.250.000đ) rèn luyện thêm nội lực và biểu cảm ánh mắt; Lộ trình toàn diện 18 buổi (6.480.000đ) trang bị trọn bộ cả kỹ năng quay - chụp - chỉnh ảnh xịn. Em gửi Chị xem feedback và video thực tế của học viên lớp trước nha? ✨`;
  }

  // Mặc định thực hiện chuẩn Bước 1 của Quy trình tư vấn Fanpage
  return "Chào anh/chị! Em là Tiểu Mỹ của Học viện T.A Academy. Anh/chị đang mong muốn điều gì để em tư vấn phù hợp ạ: tăng tương tác, tăng bán hàng hay xây dựng thương hiệu cá nhân? Và anh/chị đăng ký cho bản thân hay cho bé nhà mình ạ? 🌸";
}
