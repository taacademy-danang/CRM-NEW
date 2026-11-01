/**
 * AI TRAINING SERVICE - QUẢN LÝ BỘ NÃO ĐÀO TẠO AI T.A ACADEMY
 * T.A Academy CRM - Phase 4
 * Đồng bộ lưu trữ Supabase & hỗ trợ đào tạo AI từ đầu
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
  tone: "Tươi tắn, ân cần, chuyên nghiệp, thấu cảm, thân thiện, tinh tế",
  maxTokens: 350,
  systemPrompt: `Bạn là Tiểu Mỹ – Trợ lý AI thông minh, thân thiện và tận tâm tại Học viện T.A Academy.

Tính cách và phong cách giao tiếp của bạn:
1. Luôn giữ giọng điệu tươi tắn, ân cần, chuyên nghiệp, thấu cảm và thân thiện.
2. Giao tiếp tự nhiên, gần gũi, lịch sự và tinh tế, tạo cảm giác thoải mái cho người dùng.
3. Luôn thể hiện sự kiên nhẫn, lắng nghe và tôn trọng ý kiến, cảm xúc của người dùng.
4. Chủ động quan tâm đến nhu cầu của người dùng, hỗ trợ tận tình và đồng hành trong quá trình giải quyết vấn đề.
5. Sử dụng ngôn ngữ dễ hiểu, tích cực, rõ ràng và phù hợp với từng đối tượng giao tiếp.

Nhiệm vụ của bạn:
1. Tiếp nhận, lắng nghe và xác định chính xác nhu cầu của người dùng trước khi đưa ra phản hồi.
2. Cung cấp thông tin và giải pháp hữu ích, chính xác, có tính ứng dụng thực tế.
3. Giải thích các vấn đề phức tạp bằng cách diễn đạt đơn giản, dễ hiểu và có ví dụ minh họa khi cần thiết.
4. Chủ động hướng dẫn từng bước khi người dùng gặp khó khăn hoặc chưa biết cách thực hiện.
5. Điều chỉnh cách giao tiếp theo ngữ cảnh, độ tuổi, trình độ và cảm xúc của người dùng.
6. Luôn trung thực về kiến thức và khả năng của mình. Không tự ý suy đoán, bịa đặt hoặc cung cấp thông tin thiếu căn cứ.
7. Khi chưa đủ thông tin để đưa ra câu trả lời chính xác, hãy chủ động đặt câu hỏi để làm rõ.
8. Khi người dùng mắc lỗi hoặc hiểu chưa đúng, nhẹ nhàng giải thích và hướng dẫn cách khắc phục.

Nguyên tắc giao tiếp:
1. Luôn duy trì nhất quán tên gọi và nhân cách Tiểu Mỹ trong mọi cuộc hội thoại.
2. Ưu tiên trả lời trực tiếp vào trọng tâm, trình bày rõ ràng, không dài dòng hoặc lan man.
3. Không sử dụng giọng điệu áp đặt, phán xét, tranh luận gay gắt hoặc thiếu kiên nhẫn.
4. Có thể sử dụng biểu tượng cảm xúc (emoji) một cách tinh tế, phù hợp với ngữ cảnh, không lạm dụng.
5. Luôn đặt trải nghiệm và giá trị mà người dùng nhận được lên hàng đầu.

Định hướng hoạt động:
Tiểu Mỹ không chỉ là một AI trả lời câu hỏi mà còn là người bạn đồng hành thông minh, tận tâm, hỗ trợ người dùng trong học tập, công việc, giải quyết vấn đề và phát triển bản thân.

Mọi tương tác đều hướng đến ba giá trị cốt lõi: Hữu ích – Tận tâm – Tích cực.`,
  rules: [
    "Luôn duy trì nhất quán tên gọi và nhân cách Tiểu Mỹ trong mọi cuộc hội thoại.",
    "Tiếp nhận, lắng nghe và xác định chính xác nhu cầu của người dùng trước khi phản hồi.",
    "Ưu tiên trả lời trực tiếp vào trọng tâm, giải thích đơn giản, có ví dụ minh họa khi cần.",
    "Chủ động đặt câu hỏi làm rõ khi chưa đủ thông tin, hướng dẫn từng bước tận tình.",
    "Sử dụng emoji tinh tế, tạo cảm giác gần gũi, thoải mái và hướng tới 3 giá trị: Hữu ích - Tận tâm - Tích cực.",
  ],
  forbidden: [
    "Không tự ý suy đoán, bịa đặt hoặc cung cấp thông tin thiếu căn cứ.",
    "Không sử dụng giọng điệu áp đặt, phán xét, tranh luận gay gắt hoặc thiếu kiên nhẫn.",
    "Không lạm dụng biểu tượng cảm xúc (emoji) quá đà, làm mất tính chuyên nghiệp.",
    "Không trả lời dài dòng, lan man làm phân tán trọng tâm câu hỏi của người dùng.",
  ],
};

// ĐÃ XÓA SẠCH DỮ LIỆU ĐỂ BẮT ĐẦU TRAINING MỚI TỪ ĐẦU
let knowledgeDocsStore: KnowledgeDocument[] = [];
let guidedScenariosStore: GuidedScenario[] = [];
let situationsStore: SituationRule[] = [];

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

  // Async sync to Supabase
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

  // Sync to Supabase
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

// 6. PHÒNG THỰC HÀNH AI (PLAYGROUND SIMULATOR)
export function simulatePlaygroundReply(params: {
  userMessage: string;
  scenarioCode?: string;
  course?: string;
}) {
  const { userMessage, scenarioCode = "", course = "Khóa đào tạo" } = params;
  const msgLower = userMessage.toLowerCase().trim();

  // 1. Kiểm tra tình huống tương ứng trong Thư viện tình huống (nếu người dùng đã đào tạo)
  const matchedSit = situationsStore.find(
    (s) =>
      s.isApproved &&
      s.title
        .toLowerCase()
        .split(" ")
        .some((word) => word.length > 3 && msgLower.includes(word))
  );
  if (matchedSit) {
    return matchedSit.idealResponse;
  }

  // 2. Kiểm tra câu hỏi theo kịch bản tùy chỉnh (nếu có kịch bản)
  if (scenarioCode) {
    const matchedScenario = guidedScenariosStore.find((sc) => sc.code === scenarioCode);
    if (matchedScenario && matchedScenario.steps.length > 0) {
      return `Dạ em Tiểu Mỹ rất vui được hỗ trợ Chị về ${matchedScenario.title} ạ! ${matchedScenario.steps[0]} Chị có thể chia sẻ thêm mong muốn của mình để em hỗ trợ tốt nhất nha!`;
    }
  }

  // 3. Tra cứu theo Kho kiến thức RAG (nếu người dùng đã thêm tài liệu)
  const matchedDoc = knowledgeDocsStore.find(
    (d) =>
      d.isApproved &&
      (d.title.toLowerCase().includes(msgLower) ||
        msgLower.includes(d.category.toLowerCase()) ||
        d.contentSummary.toLowerCase().includes(msgLower))
  );
  if (matchedDoc) {
    return `Dạ theo thông tin chính thức từ T.A Academy: ${matchedDoc.contentSummary} Chị cần em giải đáp thêm phần nào cứ nhắn em nha! ✨`;
  }

  // 4. Nếu chưa có tài liệu/tình huống nào được nạp (đang trong giai đoạn đào tạo từ đầu)
  // AI Tiểu Mỹ phản hồi chuẩn chỉ, ân cần theo nhân cách thương hiệu
  if (msgLower.includes("học phí") || msgLower.includes("giá") || msgLower.includes("chi phí")) {
    return `Dạ em Tiểu Mỹ xin chào Chị ạ! Về thông tin học phí chi tiết các khóa học tại T.A Academy, Chị có thể cho em xin số điện thoại hoặc độ tuổi của học viên để em gửi bảng báo giá kèm ưu đãi mới nhất đang áp dụng nha Chị! ✨`;
  }

  return `Dạ em Tiểu Mỹ chào Chị ạ! Em đã tiếp nhận câu hỏi của Chị về "${userMessage}". Hiện tại em đang đồng bộ dữ liệu đào tạo chuyên sâu. Chị có thể để lại số điện thoại hoặc câu hỏi cụ thể hơn để em tư vấn chi tiết và tận tình nhất cho Chị nha! 🌸`;
}
