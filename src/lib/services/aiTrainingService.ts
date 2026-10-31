/**
 * AI TRAINING SERVICE - QUẢN LÝ BỘ NÃO ĐÀO TẠO AI T.A ACADEMY
 * T.A Academy CRM - Phase 4
 */

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
  apiKey: "AIzaSyB_dummy_production_gemini_key_for_ta_academy",
  selectedModel: "gemini-1.5-flash",
  webhookUrl: "https://crm.taacademy.vn/api/webhooks/meta",
  verifyToken: "ta_academy_meta_verify_2026",
  fbToken: "EAAGm0PXq1...mock_valid_page_access_token_ta_academy",
  isBotActive: true,
  lastTestedAt: "Hôm nay 08:30",
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
  lastTestedAt: "Hôm nay 09:15",
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

let knowledgeDocsStore: KnowledgeDocument[] = [
  {
    id: "doc-1",
    title: "Chính Sách Học Phí & Ưu Đãi Các Khóa Tuyển Sinh 2026",
    category: "Học phí & Chính sách",
    version: "2.1",
    updatedAt: "28/10/2026",
    isApproved: true,
    approvedBy: "Nguyễn Thị Lan (Admin)",
    chunksCount: 14,
    contentSummary: "Học phí niêm yết: Model Kids 6.800.000đ/12 buổi; Phong Thái Quý Cô 7.500.000đ/10 buổi; Catwalk 8.500.000đ/12 buổi. Ưu đãi tặng voucher 15% khi chốt đăng ký trong tuần.",
  },
  {
    id: "doc-2",
    title: "Giáo Trình Khóa Model Kids Tài Năng (4-12 Tuổi)",
    category: "Model Kids",
    version: "1.5",
    updatedAt: "25/10/2026",
    isApproved: true,
    approvedBy: "Nguyễn Thị Lan (Admin)",
    chunksCount: 28,
    contentSummary: "Lộ trình 12 buổi: Giải phóng hình thể, chỉnh dáng đi gù lưng, biểu cảm khuôn mặt trước ống kính, kỹ thuật pose dáng và casting show thời trang nhí.",
  },
  {
    id: "doc-3",
    title: "Lộ Trình Đào Tạo Phong Thái Quý Cô & Doanh Nhân",
    category: "Phong thái",
    version: "1.2",
    updatedAt: "20/10/2026",
    isApproved: true,
    approvedBy: "Nguyễn Thị Lan (Admin)",
    chunksCount: 32,
    contentSummary: "Rèn luyện dáng đứng kiêu hãnh, dáng ngồi quý tộc, phong thái bàn tiệc chuẩn quốc tế, ngôn ngữ cơ thể đàm phán thương vụ đỉnh cao.",
  },
  {
    id: "doc-4",
    title: "Chương Trình Catwalk Chuyên Nghiệp & Cơ Hội Trình Diễn",
    category: "Catwalk",
    version: "1.1",
    updatedAt: "15/10/2026",
    isApproved: true,
    approvedBy: "Nguyễn Thị Lan (Admin)",
    chunksCount: 22,
    contentSummary: "Giảng viên trực tiếp là các Siêu mẫu hàng đầu. 100% học viên tốt nghiệp được casting tham gia Vietnam Junior Fashion Week.",
  },
  {
    id: "doc-5",
    title: "Bản Dự Thảo Chính Sách Học Bổng Mùa Hè 2027",
    category: "Ưu đãi",
    version: "0.9 (Draft)",
    updatedAt: "Hôm nay 09:30",
    isApproved: false,
    chunksCount: 8,
    contentSummary: "Dự thảo giảm 20% nhóm 3 bé trở lên cho kỳ nghỉ hè. Đang chờ Ban Giám Đốc phê duyệt.",
  },
];

let guidedScenariosStore: GuidedScenario[] = [
  {
    code: "SCENARIO_MODEL_KIDS",
    title: "Tư Vấn Khóa Mẫu Nhí (Model Kids)",
    course: "Model Kids (Mẫu Nhí)",
    goal: "Khai thác tính cách bé (nhút nhát/tự tin), giới thiệu giáo trình sân khấu, chốt lịch học thử",
    stepsCount: 4,
    status: "Đang hoạt động",
    steps: [
      "Bước 1: Chào hỏi ân cần, hỏi thăm tên bé và độ tuổi hiện tại.",
      "Bước 2: Tìm hiểu mục tiêu (chỉnh dáng đi gù, muốn con dạn dĩ, hay định hướng diễn viên/mẫu nhí).",
      "Bước 3: Nêu bật phương pháp sư phạm tâm lý và giảng viên hoa hậu/siêu mẫu.",
      "Bước 4: Mời phụ huynh đưa bé tham gia trải nghiệm buổi học thử miễn phí cuối tuần.",
    ],
  },
  {
    code: "SCENARIO_PHONG_THAI",
    title: "Tư Vấn Phong Thái Quý Cô & Doanh Nhân",
    course: "Phong Thái Doanh Nhân",
    goal: "Thấu hiểu mong muốn nâng tầm thần thái, đàm phán đối tác và giao tiếp thanh lịch",
    stepsCount: 4,
    status: "Đang hoạt động",
    steps: [
      "Bước 1: Lắng nghe nhu cầu về phong thái công sở, giao tiếp hoặc dự tiệc ngoại giao.",
      "Bước 2: Giới thiệu lộ trình cá nhân hóa chỉnh dáng đứng, dáng ngồi, ánh mắt và nụ cười.",
      "Bước 3: Cung cấp thời khóa biểu linh hoạt ngoài giờ và học phí niêm yết chuẩn.",
      "Bước 4: Xin số điện thoại để gửi cẩm nang phong thái độc quyền và đặt lịch tham quan viện.",
    ],
  },
  {
    code: "SCENARIO_TUITION_INQUIRY",
    title: "Phụ Huynh Hỏi Học Phí & Ưu Đãi",
    course: "Đa khóa học",
    goal: "Báo học phí niêm yết chuẩn, nêu bật giá trị giảng viên hoa hậu/siêu mẫu kèm chính sách ưu đãi",
    stepsCount: 3,
    status: "Đang hoạt động",
    steps: [
      "Bước 1: Báo học phí chính xác theo tài liệu được phê duyệt, không úp mở.",
      "Bước 2: Nêu rõ các giá trị trọn gói đã bao gồm (trang phục, chụp ảnh profile, show diễn).",
      "Bước 3: Giới thiệu ưu đãi đặc quyền trong tuần để thúc đẩy đăng ký sớm.",
    ],
  },
  {
    code: "SCENARIO_HIGH_PRICE_OBJECTION",
    title: "Xử Lý Khi Phụ Huynh Chê Học Phí Cao",
    course: "Đa khóa học",
    goal: "Đồng cảm, phân tích sự khác biệt về chất lượng đào tạo và cam kết kết quả",
    stepsCount: 3,
    status: "Đang hoạt động",
    steps: [
      "Bước 1: Đồng cảm với trăn trở tài chính của phụ huynh.",
      "Bước 2: Phân tích sĩ số lớp giới hạn chỉ 8-10 học viên và sự đồng hành của siêu mẫu có bằng sư phạm.",
      "Bước 3: Mời phụ huynh cho con học thử 1 buổi hoàn toàn miễn phí để trực tiếp đánh giá chất lượng.",
    ],
  },
];

let situationsStore: SituationRule[] = [
  {
    id: "sit-1",
    title: "Phụ huynh thắc mắc: 'Bé nhà chị rất nhút nhát, sợ không theo kịp các bạn'",
    category: "Tâm lý học viên",
    idealResponse:
      "Dạ Mẹ hoàn toàn yên tâm nhé ạ! Đây chính là lý do rất nhiều phụ huynh gửi gắm các bé đến T.A Academy. Giáo trình Model Kids được thiết kế từ các bài tập giải phóng hình thể nhẹ nhàng, giảng viên sẽ kèm cặp riêng từng bé để giúp con mở lòng, tự tin hơn qua từng buổi học mà không hề có áp lực thi cử ạ.",
    mistakeAvoid: "Không nói 'con nhút nhát vậy phải tập nhiều mới được' làm phụ huynh lo lắng.",
    isApproved: true,
  },
  {
    id: "sit-2",
    title: "Phụ huynh so sánh: 'Học phí bên em cao hơn trung tâm khác'",
    category: "Xử lý học phí",
    idealResponse:
      "Dạ em rất hiểu trăn trở của Chị ạ! Sự khác biệt lớn nhất tại T.A Academy là đội ngũ giảng viên trực tiếp đứng lớp đều là các Siêu mẫu, Hoa hậu chuyên nghiệp có bằng sư phạm, sĩ số lớp giới hạn chỉ 8–10 học viên để đảm bảo chất lượng, và 100% các bé đều được tham gia trình diễn tại các Tuần lễ thời trang lớn sau khóa học ạ.",
    mistakeAvoid: "Không chê bai trung tâm đối thủ, không tự ý giảm giá khi chưa có chính sách.",
    isApproved: true,
  },
  {
    id: "sit-3",
    title: "Phụ huynh từ chối để lại số điện thoại",
    category: "Khai thác thông tin",
    idealResponse:
      "Dạ không sao đâu Chị ơi! Em xin phép gửi Chị bản lịch khai giảng và hình ảnh lớp học qua tin nhắn này để Chị tham khảo trước nhé ạ. Nếu Chị cần hỗ trợ thêm thông tin gì, em luôn sẵn sàng tư vấn cho Chị nha!",
    mistakeAvoid: "Không gặng hỏi ép buộc lấy số điện thoại nhiều lần liên tiếp.",
    isApproved: true,
  },
  {
    id: "sit-4",
    title: "Phụ huynh hỏi về đưa đón và thời gian học ngoài giờ",
    category: "Lịch học & Đưa đón",
    idealResponse:
      "Dạ học viện có các ca học sáng và chiều Thứ 7, Chủ Nhật rất thuận tiện để Mẹ đưa đón con mà không ảnh hưởng giờ học văn hóa. Tại học viện có sảnh chờ máy lạnh và khu vực đậu xe ô tô an toàn cho Ba Mẹ ngồi quan sát lớp học của bé nữa ạ!",
    mistakeAvoid: "Không báo lịch học không chắc chắn hoặc hứa đón hộ khi chưa có dịch vụ.",
    isApproved: true,
  },
];

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
  return doc;
}

export function addKnowledgeDoc(data: Omit<KnowledgeDocument, "id" | "updatedAt">) {
  const newDoc: KnowledgeDocument = {
    ...data,
    id: `doc-${Date.now()}`,
    updatedAt: "Hôm nay " + new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  };
  knowledgeDocsStore.unshift(newDoc);
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
  return doc;
}

export function deleteKnowledgeDoc(id: string) {
  const index = knowledgeDocsStore.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Không tìm thấy tài liệu để xóa");
  const deleted = knowledgeDocsStore.splice(index, 1)[0];
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
  return newScenario;
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
  return newSit;
}

// 6. PHÒNG THỰC HÀNH AI (PLAYGROUND SIMULATOR)
export function simulatePlaygroundReply(params: {
  userMessage: string;
  scenarioCode: string;
  course: string;
}) {
  const { userMessage, scenarioCode, course } = params;
  const msgLower = userMessage.toLowerCase();

  // 1. Kiểm tra tình huống nhạy cảm trong Thư viện tình huống đã duyệt
  if (msgLower.includes("nhút nhát") || msgLower.includes("gù lưng") || msgLower.includes("rụt rè")) {
    const sit = situationsStore.find((s) => s.id === "sit-1");
    if (sit) return sit.idealResponse;
  }

  if (msgLower.includes("đắt") || msgLower.includes("cao hơn") || msgLower.includes("giá cao")) {
    const sit = situationsStore.find((s) => s.id === "sit-2");
    if (sit) return sit.idealResponse;
  }

  if (msgLower.includes("không cho số") || msgLower.includes("không có số") || msgLower.includes("chưa muốn cho số")) {
    const sit = situationsStore.find((s) => s.id === "sit-3");
    if (sit) return sit.idealResponse;
  }

  // 2. Kiểm tra câu hỏi học phí -> Trích xuất từ Kho kiến thức RAG đã duyệt
  if (msgLower.includes("học phí") || msgLower.includes("bao nhiêu tiền") || msgLower.includes("giá")) {
    if (course.includes("Model Kids")) {
      return "Dạ học phí niêm yết chính thức của khóa Model Kids tại T.A Academy là 6.800.000 VNĐ cho lộ trình 12 buổi học tiêu chuẩn cùng chuyên gia. Trong tuần này học viện có ưu đãi đặc quyền tặng kèm 1 buổi chụp ảnh profile chuyên nghiệp cho bé khi Mẹ đăng ký giữ chỗ sớm nha Mẹ!";
    }
    if (course.includes("Phong Thái")) {
      return "Dạ khóa đào tạo Phong Thái Quý Cô & Doanh Nhân tại T.A Academy có học phí niêm yết là 7.500.000 VNĐ cho 10 buổi học chuyên sâu, cam kết hoàn thiện dáng đứng, dáng ngồi và thần thái đàm phán tự tin ạ!";
    }
    if (course.includes("Catwalk")) {
      return "Dạ khóa Catwalk Chuyên Nghiệp có học phí niêm yết là 8.500.000 VNĐ cho 12 buổi đào tạo cùng Siêu mẫu hàng đầu, 100% học viên tốt nghiệp đều được tham gia casting trình diễn sân khấu thời trang thực tế ạ!";
    }
    return "Dạ học phí các khóa tuyển sinh tại T.A Academy dao động từ 6.800.000đ đến 8.500.000đ cho trọn khóa cùng các chuyên gia hàng đầu. Em có thể gửi Chị bảng học phí chi tiết từng khóa qua Zalo hoặc điện thoại nhé ạ!";
  }

  // 3. Phản hồi theo kịch bản được chọn
  if (scenarioCode === "SCENARIO_MODEL_KIDS") {
    if (msgLower.includes("học thử") || msgLower.includes("trải nghiệm")) {
      return "Dạ tuyệt vời quá Mẹ ơi! Cuối tuần này (Thứ 7 lúc 09:00 hoặc Chủ Nhật lúc 15:00) học viện có tổ chức lớp học thử trải nghiệm miễn phí cho các bé. Mẹ cho em xin số điện thoại để em đăng ký ca phù hợp và chuẩn bị trang phục cho con nha Mẹ! ✨";
    }
    return `Dạ em Tiểu Mỹ rất vui được hỗ trợ Mẹ tìm hiểu khóa ${course} cho bé ạ! Mẹ cho em hỏi bé nhà mình năm nay được mấy tuổi rồi ạ? Con thích biểu diễn thời trang hay Mẹ muốn rèn dáng đi tự tin cho con trước đám đông ha Mẹ? 😊`;
  }

  if (scenarioCode === "SCENARIO_PHONG_THAI") {
    return `Dạ em Tiểu Mỹ xin chào Chị ạ! Khóa ${course} tại T.A Academy được thiết kế đặc biệt để giúp các chị em phụ nữ làm chủ ngôn ngữ cơ thể, dáng đi thanh lịch và thần thái tự tin trong công việc lẫn cuộc sống. Không biết mục tiêu ưu tiên nhất của Chị là phong thái giao tiếp hay định hình phong cách cá nhân ạ? 🌸`;
  }

  // Mặc định phản hồi chuẩn phong thái T.A Academy
  return `Dạ em Tiểu Mỹ đã ghi nhận thông tin từ Chị ạ! Với khóa ${course}, các giảng viên tại T.A Academy sẽ kèm cặp sát sao để đảm bảo kết quả tốt nhất. Chị cho em xin số điện thoại để em gửi clip mẫu bài học và đăng ký buổi học thử trải nghiệm cho Chị nha! ✨`;
}
