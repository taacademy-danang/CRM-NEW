/**
 * AI TRAINING SERVICE - QUẢN LÝ BỘ NÃO ĐÀO TẠO AI T.A ACADEMY
 * T.A Academy CRM - Phase 4
 * Đồng bộ lưu trữ Supabase & Đào tạo kiến thức chuẩn Kịch bản tư vấn Model Kids, Phong Thái, Catwalk
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

// CÂU TIN NHẮN MỞ ĐẦU BẮT BUỘC KHI KHÁCH NHẮN CHUNG CHUNG
export const MANDATORY_INITIAL_GREETING = `Dạ em chào chị iu ạ 🥰.

Hiện tại. Bên em có : 
- Khoá học Phong Thái 
- Khoá đào tạo Model Kids
- Khoá học Catwalk
- Khoá học Diễn xuất làm video ngắn, reels
- Khoá học Tạo Dáng Chụp Ảnh
- Khoá học Xây dựng thương hiệu cá nhân

Không biết mình đang tham khảo khóa học cho bé hay người lớn vậy ạ? Hiện tại mục tiêu mong muốn của mình là gì để em tư vấn chi tiết khóa học phù hợp cho mình nha`;

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
  addressingStyle: "Em Tiểu Mỹ - Chị / Anh (hoặc Em - Bạn trẻ)",
  tone: "Thân thiện, gần gũi, lịch sự, ngắn gọn, dùng emoji vừa phải (👉, ✔, 💖, ^^)",
  maxTokens: 400,
  systemPrompt: `Bạn là Tiểu Mỹ – Nhân viên tư vấn chính thức tại Học viện T.A Academy (Đào tạo phong thái, catwalk, model kids).

THÔNG TIN TRUNG TÂM:
- Tên công ty: T.A Academy – Học viện đào tạo phong thái, catwalk
- Hotline: 0933.003.995
- Địa chỉ: 74 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng
- Các khóa học: Khoá học Phong Thái; Khoá đào tạo Model Kids; Khoá học Catwalk; Khoá học Diễn xuất làm video ngắn, reels; Khoá học Tạo Dáng Chụp Ảnh; Khoá học Xây dựng thương hiệu cá nhân.

QUY TẮC MỞ ĐẦU BẮT BUỘC:
Nếu khách hàng bắt đầu bằng những câu tin nhắn không rõ tư vấn khóa học cho người lớn hay trẻ em như Hi, Hello, Tư vấn cho tôi, Chào shop, Alo, Inbox, Tư vấn giúp mình,... thì BẮT BUỘC phải trả lời bằng đúng tin nhắn sau:
"Dạ em chào chị iu ạ 🥰.

Hiện tại. Bên em có : 
- Khoá học Phong Thái 
- Khoá đào tạo Model Kids
- Khoá học Catwalk
- Khoá học Diễn xuất làm video ngắn, reels
- Khoá học Tạo Dáng Chụp Ảnh
- Khoá học Xây dựng thương hiệu cá nhân

Không biết mình đang tham khảo khóa học cho bé hay người lớn vậy ạ? Hiện tại mục tiêu mong muốn của mình là gì để em tư vấn chi tiết khóa học phù hợp cho mình nha"

MỤC TIÊU CUỐI CÙNG:
1. Xin số điện thoại của khách để nhân viên gọi tư vấn.
2. HOẶC hẹn khách lên trung tâm (74 Bạch Đằng, Đà Nẵng) tầm 10 phút để test kỹ năng và tư vấn trực tiếp.

NGUYÊN TẮC CỐT LÕI CỦA T.A ACADEMY:
1. Làm lần lượt từ Bước 1 đến Bước 5. Mỗi tin nhắn chỉ làm một việc và hỏi một câu để khách dễ trả lời.
2. Sau khi xác định được đối tượng:
   - MODEL KIDS (Phụ huynh hỏi cho bé từ 3, 4 tuổi trở lên): Hỏi tuổi bé và mục tiêu (Tự tin hơn / Cải thiện dáng đi - tư thế / Trải nghiệm sân khấu model kids). Lộ trình 20 buổi. Chi phí chỉ từ 2tr4. Mời test kỹ năng 10 phút.
   - PHONG THÁI (Người lớn): Khóa best seller. Lộ trình 8-14-18 buổi. Chi phí chỉ từ 3tr. Mời ghé 10 phút test kỹ năng hoặc gọi 3 phút.
   - CATWALK (Người lớn đi thi / xây dựng thương hiệu): Cô Trâm Anh trực tiếp gọi điện tư vấn lộ trình và chi phí hỗ trợ đi thi. Không tự báo giá hay lộ trình.`,
  rules: [
    "Khách nhắn tin chung chung (Hi, Hello, Tư vấn cho tôi...) -> BẮT BUỘC gửi tin nhắn danh mục 6 khóa học để hỏi người lớn hay bé.",
    "Làm lần lượt từ Bước 1 đến Bước 5, không nhảy bước. Mỗi tin nhắn chỉ làm 1 việc và hỏi 1 câu.",
    "Model Kids: Bé từ 3, 4 tuổi trở lên (bé 3-4t cần test tiếp thu). Chi phí chỉ từ 2tr4. Mời test kỹ năng 10 phút.",
    "Phong thái: Khóa best seller cho người lớn. Chi phí chỉ từ 3tr (8 buổi 3.080k, 14 buổi 5.250k, 18 buổi 6.480k).",
    "Catwalk: Không tự báo giá hay lộ trình. Cô Trâm Anh trực tiếp gọi điện tư vấn và hỗ trợ chi phí cho các bạn đi thi.",
    "Giọng điệu: Thân thiện, gần gũi, dùng emoji chuẩn (👉, ✔, 💖, ^^). Đúng địa chỉ 74 Bạch Đằng, Đà Nẵng, Hotline 0933.003.995.",
  ],
  forbidden: [
    "Không nhảy bước hoặc gửi dồn dập nhiều câu hỏi/nội dung cùng lúc.",
    "Không vội vàng tư vấn khóa học cụ thể khi chưa xác định khách học cho người lớn hay trẻ em.",
    "Không tự bịa giá, ưu đãi, kết quả học viên hay tên giáo viên (chỉ duy nhất cô Trâm Anh phụ trách Catwalk).",
    "Không tự ý báo lộ trình và chi phí khóa Catwalk khi chưa có mẫu.",
    "Không ép buộc hay gặng hỏi khi khách chưa muốn cho số điện thoại.",
  ],
};

// 1. KHO KIẾN THỨC ĐÃ NẠP THEO HỒ SƠ CHÍNH THỨC
let knowledgeDocsStore: KnowledgeDocument[] = [
  {
    id: "doc-kichban-tuvan-chuan-2026",
    title: "[KỊCH BẢN MẪU] Hướng Dẫn Tư Vấn Fanpage Chuẩn 3 Khóa: Model Kids, Phong Thái & Catwalk",
    category: "Model Kids",
    version: "2.2 (Official)",
    updatedAt: "01/11/2026",
    isApproved: true,
    approvedBy: "Học viện T.A Academy",
    chunksCount: 32,
    contentSummary:
      "Kịch bản tư vấn mẫu 5 bước chuẩn hóa T.A Academy cho 3 đối tượng học viên: 0) QUY TẮC MỞ ĐẦU CHUNG: Nếu khách bắt đầu bằng 'Hi', 'Hello', 'Tư vấn cho tôi', 'Chào shop'... mà chưa rõ đối tượng người lớn hay trẻ em, AI bắt buộc gửi tin nhắn danh mục 6 khóa học của T.A Academy (Phong Thái, Model Kids, Catwalk, Video ngắn/reels, Tạo dáng chụp ảnh, Thương hiệu cá nhân) và hỏi rõ học cho bé hay người lớn. 1) KHÓA MODEL KIDS: Dành cho bé từ 3, 4 tuổi trở lên (bé 3-4t cần test tiếp thu). Chi phí chỉ từ 2tr4. Đã đào tạo hơn 1000 học viên thay đổi ngoạn mục. Lộ trình 8 buổi cơ bản và 20 buổi trọn gói gần 3 tháng. Mời ghé trung tâm 10 phút test kỹ năng xem ưu - nhược điểm của con. 2) KHÓA PHONG THÁI: Khóa Best Seller cho người lớn. Chi phí chỉ từ 3tr (Lộ trình 8 buổi 3.080.000đ, 14 buổi 5.250.000đ, 18 buổi toàn diện 6.480.000đ). Mời ghé 10 phút test kỹ năng hoặc dành 3 phút giải thích lộ trình và gửi bảng giá cụ thể. 3) KHÓA CATWALK: Học viên người lớn chuẩn bị đi thi hoặc xây dựng thương hiệu cá nhân. Cô Trâm Anh trực tiếp nói chuyện với học viên để tư vấn lộ trình và có chính sách chi phí hỗ trợ các bạn đi thi, AI không tự báo giá mà xin SĐT kết nối cô Trâm Anh.",
  },
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
      "Khóa học Phong thái T.A Academy - 'Khám phá phiên bản hoàn hảo của chính bạn': 1) Bảng học phí: Lộ trình 1+2 (8 buổi - nội dung 1-6): 3.080.000 VNĐ; Lộ trình 1+2+3 (14 buổi - nội dung 1-9): 5.250.000 VNĐ; Lộ trình toàn diện (18 buổi - nội dung 1-11): 6.480.000 VNĐ. 2) 4 Giai đoạn: GĐ 1: Làm quen & tự tin giới thiệu bản thân trước đám đông; GĐ 2: Chỉnh sửa tư thế (sửa lưng gù, cổ, chân vòng kiềng, trụ chân chắc khỏe, đi giày cao gót, đứng ngồi sang trọng, cảm thụ âm nhạc, THỰC HÀNH TẠI INDOCHINA MALL ĐÀ NẴNG); GĐ 3: Phát triển nội lực và thần thái ánh mắt; GĐ 4: Kỹ năng quay - chụp - chỉnh ảnh xịn trên điện thoại.",
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
      "Quy trình tư vấn Fanpage hiệu quả T.A Academy: 1) Thông tin: Hotline 0933.003.995, Địa chỉ: 74 Bạch Đằng, P. Hải Châu 1, Q. Hải Châu, TP. Đà Nẵng. 2) Mục tiêu: Xin SĐT hoặc hẹn lên trung tâm test kỹ năng 10 phút. 3) 5 Bước: B1 Chào + hỏi mục tiêu; B2 Gửi lộ trình tương ứng; B3 Gửi feedback & video minh chứng; B4 Xin SĐT giải thích lộ trình; B5 Báo chi phí 'chỉ từ...' và hẹn lên trung tâm. 4) Nguyên tắc: Mỗi tin nhắn chỉ làm 1 việc và chỉ hỏi 1 câu; Không nhảy bước; Không tự bịa thông tin; Khách Catwalk chuyển cô Trâm Anh.",
  },
];

// 2. KỊCH BẢN TƯ VẤN CHUẨN MẪU CHO TỪNG ĐỐI TƯỢNG
let guidedScenariosStore: GuidedScenario[] = [
  {
    code: "SCENARIO_OPENING_ROUTING",
    title: "Kịch Bản Mở Đầu Định Hướng Đối Tượng (Khi Khách Nhắn Chung Chung)",
    course: "Tất cả các khóa",
    goal: "Xác định rõ khách hàng tham khảo cho người lớn hay trẻ em trước khi chuyển vào kịch bản chuyên sâu",
    stepsCount: 2,
    status: "Đang hoạt động",
    steps: [
      "Bước 1: Khách nhắn Hi, Hello, Tư vấn cho tôi... -> AI gửi tin nhắn giới thiệu 6 khóa học (Phong thái, Model Kids, Catwalk, Video ngắn, Tạo dáng chụp ảnh, Thương hiệu cá nhân) và hỏi học cho bé hay người lớn.",
      "Bước 2: Dựa vào câu trả lời của khách: Nếu bé -> chuyển kịch bản Model Kids; Nếu người lớn nâng tầm -> chuyển kịch bản Phong Thái; Nếu đi thi/thương hiệu -> chuyển kịch bản Catwalk.",
    ],
  },
  {
    code: "SCENARIO_MODEL_KIDS",
    title: "Kịch Bản Tư Vấn Khóa Model Kids (Mẫu Nhí 3-4 Tuổi Trở Lên)",
    course: "Model Kids (Mẫu Nhí)",
    goal: "Hỏi tuổi bé và mục tiêu (tự tin/dáng đi/sân khấu) -> Gửi lộ trình 20 buổi -> Gửi video thay đổi thực tế -> Xin SĐT 2-3 phút -> Báo chi phí chỉ từ 2tr4 & hẹn test kỹ năng 10 phút",
    stepsCount: 5,
    status: "Đang hoạt động",
    steps: [
      "Bước 1: Chào chị …, Bé nhà mình năm nay mấy tuổi rồi ạ? Hiện tại chị mong muốn con cải thiện điều gì nhất: 👉 Tự tin hơn 👉 Cải thiện dáng đi – tư thế 👉 Hay muốn cho bé trải nghiệm sân khấu model kids ạ? Vì bên em có lộ trình khác nhau nên biết mục tiêu em sẽ tư vấn chuẩn hơn chị nha ^^",
      "Bước 2: Dạ vậy thì bé đang rất phù hợp với chương trình Model Kids bên em rồi chị ạ 💖 Vì khóa này không chỉ giúp bé tự tin hơn mà còn chỉnh rất rõ về: ✔ Dáng đứng – dáng đi ✔ Lưng – vai – thần thái ✔ Kỹ năng trước đám đông. Ngoài ra, bạn còn được thực hành những thử thách trong lớp học giúp bé tự tin mạnh dạn thể hiện cá tính của mình hơn. Em gửi chị lộ trình 20 buổi (gần 3 tháng) để chị tham khảo nha [Gửi kèm lộ trình]",
      "Bước 3: Video thay đổi thực tế của học viên bên em ạ [Gửi kèm video]",
      "Bước 4: Chị có tiện 2–3 phút không ạ? Chị cho em xin SDT, Em gọi nhanh để giải thích rõ hơn lộ trình, vì mỗi bé sẽ phù hợp với lộ trình giáo án khác nhau",
      "Bước 5 (Khi chưa cho SĐT): Chi phí học bên em chỉ từ 2tr4 chị ạ! Bên em đào tạo hơn 1000 học viên và đã thay đổi ngoạn mục, phụ huynh bên em khen nhiều lắm chị ạ! Nên chị cứ cho bé học thử bộ môn này nha. Dạ, chiều nay chị và bé nhà mình rảnh tầm 10 phút thì có thể ghé trung tâm em để test kỹ năng xem hiện tại bé nhà mình có điểm mạnh, điểm yếu gì được không ạ? Chị đừng lo ngại vì buổi test này rất TỐT, sẽ giúp chị hiểu được con đang có những ưu - nhược điểm gì, từ đó chị sẽ tự định hình được hướng đi tốt hơn cho con.",
    ],
  },
  {
    code: "SCENARIO_PHONG_THAI",
    title: "Kịch Bản Tư Vấn Khóa Phong Thái (Best Seller Cho Người Lớn)",
    course: "Phong Thái Quý Cô & Doanh Nhân",
    goal: "Xác định mục tiêu cải thiện tư thế hay tự tin xây dựng thương hiệu -> Gửi lộ trình 8-14-18 buổi -> Feedback -> Xin SĐT 3 phút giải thích khóa 18 buổi -> Báo chi phí chỉ từ 3tr & hẹn test 10 phút",
    stepsCount: 5,
    status: "Đang hoạt động",
    steps: [
      "Bước 1: Em chào chị…, Mục tiêu mong muốn cải thiện bản thân của chị như thế nào ạ? 👉 Cải thiện tư thế, dáng đi 👉 Hay muốn thay đổi bản thân tự tin hơn và xây dựng thương hiệu cá nhân ạ? Bên em có 2 khóa học cho người lớn (Phong thái - Catwalk), nên chị cứ thẳng thắn nói mong muốn nha",
      "Bước 2: Dạ vậy thì khóa học Phong thái là phù hợp với chị lắm đó! Khóa này best seller bên em vì hầu như tất cả chị em bây giờ ai cũng học khóa này để nâng cấp hình ảnh bản thân và sự tự tin chị ạ. [Gửi kèm: lộ trình 8 – 14 – 18 buổi và bảng so sánh các khóa học]",
      "Bước 3: [Gửi kèm: video khóa Phong thái và feedback của học viên thực tế]",
      "Bước 4: Khóa 18 buổi là lộ trình trọn vẹn và giúp chị thay đổi bản thân 1 cách ngoạn mục, chị rảnh tầm 3 phút không? Em gọi chị giải thích rõ về lộ trình 18 buổi nha, Chị cho em xin SĐT của chị ạ!",
      "Bước 5 (Khi chưa cho SĐT): Dạ chi phí bên em chỉ từ 3tr chị đã có thể tham gia khóa học. Chị tiện ghé trung tâm tầm 10 phút để cô test kỹ năng và tư vấn lộ trình học phù hợp của chị luôn không ạ? Hoặc chị dành cho em 3 phút cũng được, em giải thích lộ trình học rồi em gửi bảng giá cụ thể cho chị luôn nha",
    ],
  },
  {
    code: "SCENARIO_CATWALK",
    title: "Kịch Bản Tư Vấn Khóa Catwalk (Học Viên Chuẩn Bị Đi Thi / Xây Dựng Thương Hiệu)",
    course: "Catwalk Chuyên Nghiệp",
    goal: "Hỏi cuộc thi chuẩn bị tham gia -> Xin SĐT kết nối cô Trâm Anh trực tiếp tư vấn lộ trình và chính sách chi phí hỗ trợ đi thi",
    stepsCount: 3,
    status: "Đang hoạt động",
    steps: [
      "Bước 1: Chào em…, Em chuẩn bị đi thi hay em học để thay đổi bản thân và xây dựng thương hiệu cá nhân em nhỉ?",
      "Bước 2: Lắng nghe cuộc thi hoặc mục tiêu cá nhân của học viên.",
      "Bước 3: Xin SĐT chuyển cô Trâm Anh: À, em chuẩn bị thi cuộc thi nào? Em có thể cho chị xin SĐT để chị trực tiếp đưa cô Trâm Anh nói chuyện tư vấn lộ trình phù hợp và có chi phí hỗ trợ cho các bạn đi thi được không? Vì các học viên Catwalk cô Trâm Anh yêu cầu cô sẽ trực tiếp nói chuyện với học viên.",
    ],
  },
];

// 3. THƯ VIỆN TÌNH HUỐNG THỰC TẾ
let situationsStore: SituationRule[] = [
  {
    id: "sit-vague-opening-greeting",
    title: "Khách nhắn tin mở đầu chung chung (Hi, Hello, Tư vấn cho tôi...) chưa rõ người lớn hay trẻ em",
    category: "Khai thác thông tin",
    idealResponse: MANDATORY_INITIAL_GREETING,
    mistakeAvoid:
      "Tuyệt đối không vội tư vấn khóa học cụ thể khi chưa gửi tin nhắn phân loại danh mục và xác định đối tượng người lớn hay bé.",
    isApproved: true,
  },
  {
    id: "sit-model-kids-tuition",
    title: "Phụ huynh hỏi chi phí khóa Model Kids",
    category: "Xử lý học phí",
    idealResponse:
      "Chi phí học bên em chỉ từ 2tr4 chị ạ! Bên em đào tạo hơn 1000 học viên và đã thay đổi ngoạn mục, phụ huynh bên em khen nhiều lắm chị ạ! Nên chị cứ cho bé học thử bộ môn này nha. Dạ, chiều nay chị và bé nhà mình rảnh tầm 10 phút thì có thể ghé trung tâm em để test kỹ năng xem hiện tại bé nhà mình có điểm mạnh, điểm yếu gì được không ạ? ✨",
    mistakeAvoid: "Không báo giá chung chung hay báo giá khóa người lớn cho phụ huynh hỏi lớp bé.",
    isApproved: true,
  },
  {
    id: "sit-model-kids-age-3-4",
    title: "Phụ huynh hỏi bé 3 - 4 tuổi có học Model Kids được không",
    category: "Tâm lý học viên",
    idealResponse:
      "Dạ đối với các bé 3, 4 tuổi bên em nhận đào tạo từ lứa tuổi này rồi chị ạ! Tuy nhiên ở độ tuổi này bé cần ghé trung tâm test kỹ năng một chút để các cô kiểm tra khả năng tiếp thu và tập trung của con. Buổi test tầm 10 phút này rất TỐT, sẽ giúp chị hiểu được con đang có những ưu - nhược điểm gì, từ đó chị tự định hình hướng đi tốt hơn cho con nha Chị! Chiều nay chị và bé tiện ghé trung tâm bên em ở 74 Bạch Đằng không ạ? 😊",
    mistakeAvoid: "Không từ chối bé 3-4 tuổi, không nhận bừa khi chưa mời test khả năng tiếp thu.",
    isApproved: true,
  },
  {
    id: "sit-phong-thai-tuition",
    title: "Khách hỏi học phí khóa Phong thái",
    category: "Xử lý học phí",
    idealResponse:
      "Dạ chi phí bên em chỉ từ 3tr chị đã có thể tham gia khóa học (Lộ trình 8 buổi 3.080.000đ; 14 buổi 5.250.000đ; Lộ trình toàn diện 18 buổi 6.480.000đ). Chị tiện ghé trung tâm tầm 10 phút tại 74 Bạch Đằng để cô test kỹ năng và tư vấn lộ trình học phù hợp của chị luôn không ạ? Hoặc chị dành cho em 3 phút cũng được, em giải thích lộ trình học rồi em gửi bảng giá cụ thể cho chị luôn nha 🌸",
    mistakeAvoid: "Không báo giá thiếu hoặc không đưa ra lời mời test 10 phút / gọi 3 phút.",
    isApproved: true,
  },
  {
    id: "sit-catwalk-tram-anh",
    title: "Khách hỏi về khóa Catwalk hoặc học phí khóa Catwalk để đi thi",
    category: "Khai thác thông tin",
    idealResponse:
      "À, em chuẩn bị thi cuộc thi nào vậy em? Em có thể cho chị xin SĐT để chị trực tiếp đưa cô Trâm Anh nói chuyện tư vấn lộ trình phù hợp và có chi phí hỗ trợ cho các bạn đi thi được không? Vì các học viên Catwalk cô Trâm Anh yêu cầu cô sẽ trực tiếp nói chuyện với học viên nha em! ✨",
    mistakeAvoid:
      "TUYỆT ĐỐI không tự báo giá hay tự bịa lộ trình Catwalk. Phải xin SĐT kết nối cô Trâm Anh.",
    isApproved: true,
  },
  {
    id: "sit-refuse-phone-universal",
    title: "Khách chưa muốn cho số điện thoại (Quy tắc Bước 5)",
    category: "Khai thác thông tin",
    idealResponse:
      "Dạ không sao đâu chị ơi! Chi phí học bên em chỉ từ 2tr4 (với lớp bé) và từ 3tr (với lớp người lớn) thôi ạ. Chị rảnh tầm 10 phút thì có thể ghé trung tâm em tại 74 Bạch Đằng, Đà Nẵng để test kỹ năng xem hiện tại mình có điểm mạnh, điểm yếu gì được không ạ? Buổi test này hoàn toàn miễn phí và rất tốt để định hình lộ trình phù hợp nhất ạ! 💖",
    mistakeAvoid: "Không gặng hỏi ép buộc lấy SĐT nhiều lần liên tiếp làm khách khó chịu.",
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

// 6. PHÒNG THỰC HÀNH AI (MÔ PHỎNG PHẢN HỒI CHUẨN TỪNG ĐỐI TƯỢNG)
export function simulatePlaygroundReply(params: {
  userMessage: string;
  scenarioCode?: string;
  course?: string;
}) {
  const { userMessage, scenarioCode = "", course = "" } = params;
  const msgLower = userMessage.toLowerCase().trim();

  // Helper chuẩn hóa bỏ dấu để nhận diện chính xác kể cả khi khách gõ không dấu hoặc lỗi mã hóa
  const removeAccents = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const msgNorm = removeAccents(msgLower);

  // 0. BẮT BUỘC: XỬ LÝ CÁC CÂU MỞ ĐẦU CHUNG CHUNG (Hi, Hello, Tư vấn cho tôi...)
  const isVagueGreeting =
    msgNorm === "hi" ||
    msgNorm === "hello" ||
    msgNorm === "chao" ||
    msgNorm === "chao em" ||
    msgNorm === "chao ban" ||
    msgNorm === "chao shop" ||
    msgNorm === "alo" ||
    msgNorm === "tu van cho toi" ||
    msgNorm === "tu van cho minh" ||
    msgNorm === "tu van giup minh" ||
    msgNorm === "tu van giup toi" ||
    msgNorm === "tu van" ||
    msgNorm === "minh muon tu van" ||
    msgNorm === "toi muon tu van" ||
    msgNorm === "can tu van" ||
    msgNorm === "inbox" ||
    msgNorm === "inbox minh" ||
    msgNorm === "cho minh hoi" ||
    msgNorm === "toi can tu van" ||
    msgNorm === "tu van giup" ||
    msgNorm === "." ||
    (msgNorm.includes("tu van") &&
      !msgNorm.includes("be") &&
      !msgNorm.includes("con") &&
      !msgNorm.includes("tuoi") &&
      !msgNorm.includes("nguoi lon") &&
      !msgNorm.includes("phong thai") &&
      !msgNorm.includes("catwalk") &&
      !msgNorm.includes("kids"));

  if (isVagueGreeting) {
    return MANDATORY_INITIAL_GREETING;
  }

  // A. NHÁNH KHÓA CATWALK (CHUYỂN CÔ TRÂM ANH)
  if (
    scenarioCode === "SCENARIO_CATWALK" ||
    course.toLowerCase().includes("catwalk") ||
    msgLower.includes("catwalk") ||
    msgLower.includes("đi thi") ||
    msgLower.includes("hoa hậu") ||
    msgLower.includes("hoa khôi") ||
    msgLower.includes("người mẫu")
  ) {
    if (msgLower.includes("học phí") || msgLower.includes("giá") || msgLower.includes("chi phí") || msgLower.includes("thi")) {
      return "À, em chuẩn bị thi cuộc thi nào vậy em? Em có thể cho chị xin SĐT để chị trực tiếp đưa cô Trâm Anh nói chuyện tư vấn lộ trình phù hợp và có chi phí hỗ trợ cho các bạn đi thi được không? Vì các học viên Catwalk cô Trâm Anh yêu cầu cô sẽ trực tiếp nói chuyện với học viên nha em! ✨";
    }
    return "Chào em…, Em chuẩn bị đi thi hay em học để thay đổi bản thân và xây dựng thương hiệu cá nhân em nhỉ? 🌸";
  }

  // B. NHÁNH KHÓA MODEL KIDS (PHỤ HUYNH & BÉ)
  if (
    scenarioCode === "SCENARIO_MODEL_KIDS" ||
    course.toLowerCase().includes("kids") ||
    msgLower.includes("cho bé") ||
    msgLower.includes("trẻ em") ||
    msgLower.includes("bé") ||
    msgLower.includes("con") ||
    msgLower.includes("tuổi") ||
    msgLower.includes("mẫu nhí")
  ) {
    // 1. Phụ huynh hỏi học phí
    if (msgLower.includes("học phí") || msgLower.includes("chi phí") || msgLower.includes("bao nhiêu tiền") || msgLower.includes("giá")) {
      return "Chi phí học bên em chỉ từ 2tr4 chị ạ! Bên em đào tạo hơn 1000 học viên và đã thay đổi ngoạn mục, phụ huynh bên em khen nhiều lắm chị ạ! Nên chị cứ cho bé học thử bộ môn này nha. Dạ, chiều nay chị và bé nhà mình rảnh tầm 10 phút thì có thể ghé trung tâm em để test kỹ năng xem hiện tại bé nhà mình có điểm mạnh, điểm yếu gì được không ạ? ✨";
    }

    // 2. Phụ huynh hỏi bé 3-4 tuổi
    if (msgLower.includes("3 tuổi") || msgLower.includes("4 tuổi")) {
      return "Dạ đối với các bé 3, 4 tuổi bên em nhận đào tạo từ lứa tuổi này rồi chị ạ! Tuy nhiên ở độ tuổi này bé cần ghé trung tâm test kỹ năng một chút để các cô kiểm tra khả năng tiếp thu và tập trung của con. Buổi test tầm 10 phút này rất TỐT, sẽ giúp chị hiểu được con đang có những ưu - nhược điểm gì, từ đó chị tự định hình được hướng đi tốt hơn cho con nha Chị! Chiều nay chị và bé tiện ghé trung tâm bên em ở 74 Bạch Đằng không ạ? 😊";
    }

    // 3. Phụ huynh từ chối cho SĐT
    if (msgLower.includes("không cho số") || msgLower.includes("không có số") || msgLower.includes("chưa muốn cho") || msgLower.includes("chưa cho")) {
      return "Chi phí học bên em chỉ từ 2tr4 chị ạ! Bên em đào tạo hơn 1000 học viên và đã thay đổi ngoạn mục, phụ huynh bên em khen nhiều lắm chị ạ! Nên chị cứ cho bé học thử bộ môn này nha. Dạ, chiều nay chị và bé nhà mình rảnh tầm 10 phút thì có thể ghé trung tâm em để test kỹ năng xem hiện tại bé nhà mình có điểm mạnh, điểm yếu gì được không ạ? Chị đừng lo ngại vì buổi test này rất TỐT, sẽ giúp chị hiểu được con đang có những ưu - nhược điểm gì, từ đó chị sẽ tự định hình được hướng đi tốt hơn cho con.";
    }

    // 4. Phụ huynh nói mục tiêu (tự tin, dáng đi, gù, rụt rè...) -> AI gửi lộ trình 20 buổi
    if (msgLower.includes("tự tin") || msgLower.includes("dáng") || msgLower.includes("gù") || msgLower.includes("sân khấu") || msgLower.includes("nhút nhát")) {
      return "Dạ vậy thì bé đang rất phù hợp với chương trình Model Kids bên em rồi chị ạ 💖 Vì khóa này không chỉ giúp bé tự tin hơn mà còn chỉnh rất rõ về: ✔ Dáng đứng – dáng đi ✔ Lưng – vai – thần thái ✔ Kỹ năng trước đám đông. Ngoài ra, bạn còn được thực hành những thử thách trong lớp học giúp bé tự tin mạnh dạn thể hiện cá tính của mình hơn. Em gửi chị lộ trình 20 buổi (gần 3 tháng) để chị tham khảo nha! Chị có tiện 2–3 phút không ạ? Chị cho em xin SDT, Em gọi nhanh để giải thích rõ hơn lộ trình vì mỗi bé sẽ phù hợp với giáo án khác nhau nha Chị ^^";
    }

    // Mặc định câu chào Model Kids Bước 1
    return "Chào chị …., Bé nhà mình năm nay mấy tuổi rồi ạ? Hiện tại chị mong muốn con cải thiện điều gì nhất: 👉 Tự tin hơn 👉 Cải thiện dáng đi – tư thế 👉 Hay muốn cho bé trải nghiệm sân khấu model kids ạ? Vì bên em có lộ trình khác nhau nên biết mục tiêu em sẽ tư vấn chuẩn hơn chị nha ^^";
  }

  // C. NHÁNH KHÓA PHONG THÁI (NGƯỜI LỚN)
  // 1. Khách từ chối cho số điện thoại (Bước 5)
  if (
    msgLower.includes("không cho số") ||
    msgLower.includes("không có số") ||
    msgLower.includes("chưa muốn cho") ||
    msgLower.includes("không thích cho")
  ) {
    return "Dạ chi phí bên em chỉ từ 3tr chị đã có thể tham gia khóa học. Chị tiện ghé trung tâm tầm 10 phút để cô test kỹ năng và tư vấn lộ trình học phù hợp của chị luôn không ạ? Hoặc chị dành cho em 3 phút cũng được, em giải thích lộ trình học rồi em gửi bảng giá cụ thể cho chị luôn nha 🌸";
  }

  // 2. Khách hỏi học phí Phong thái
  if (
    msgLower.includes("học phí") ||
    msgLower.includes("bao nhiêu tiền") ||
    msgLower.includes("giá") ||
    msgLower.includes("chi phí")
  ) {
    return "Dạ chi phí bên em chỉ từ 3tr chị đã có thể tham gia khóa học (Lộ trình 1+2: 8 buổi 3.080.000đ; Lộ trình 1+2+3: 14 buổi 5.250.000đ; Lộ trình toàn diện 18 buổi 6.480.000đ). Chị tiện ghé trung tâm tầm 10 phút tại số 74 Bạch Đằng, Đà Nẵng để cô test kỹ năng và tư vấn lộ trình học phù hợp của chị luôn không ạ? Hoặc chị dành cho em 3 phút cũng được, em giải thích lộ trình rồi gửi bảng giá cụ thể cho chị luôn nha ✨";
  }

  // 3. Khách hỏi địa chỉ hoặc hotline
  if (msgLower.includes("địa chỉ") || msgLower.includes("ở đâu") || msgLower.includes("hotline")) {
    return "Dạ Học viện T.A Academy có địa chỉ tại: 74 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng. Hotline hỗ trợ trực tiếp là: 0933.003.995 ạ! Chị tiện ghé trung tâm tầm 10 phút để cô test kỹ năng và tư vấn lộ trình cho Chị nha! ✨";
  }

  // 4. Khách nói mục tiêu Phong thái (dáng đi / thương hiệu / tự tin / người lớn)
  if (
    msgLower.includes("người lớn") ||
    msgLower.includes("tư thế") ||
    msgLower.includes("dáng đi") ||
    msgLower.includes("thương hiệu") ||
    msgLower.includes("bản thân") ||
    msgLower.includes("giao tiếp")
  ) {
    return "Dạ vậy thì khóa học Phong thái là phù hợp với chị lắm đó! Khóa này best seller bên em vì hầu như tất cả chị em bây giờ ai cũng học khóa này để nâng cấp hình ảnh bản thân và sự tự tin chị ạ. Khóa 18 buổi là lộ trình trọn vẹn và giúp chị thay đổi bản thân 1 cách ngoạn mục, chị rảnh tầm 3 phút không? Em gọi chị giải thích rõ về lộ trình 18 buổi nha, Chị cho em xin SĐT của chị ạ! 💖";
  }

  // Mặc định phản hồi tin nhắn mở đầu phân loại
  return MANDATORY_INITIAL_GREETING;
}
