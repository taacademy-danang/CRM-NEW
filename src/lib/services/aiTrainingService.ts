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

let aiPersonaStore: AiPersonaData = {
  assistantName: "Trợ lý An An",
  addressingStyle: "Em - Mẹ bé / Ba bé (hoặc Em - Chị / Anh)",
  tone: "Tươi tắn, ân cần, chuyên nghiệp, thấu cảm, đậm chất phong thái",
  maxTokens: 350,
  systemPrompt: `Bạn là An An - Trợ lý tư vấn tuyển sinh chính thức tại Học viện T.A Academy (Học viện đào tạo Phong thái, Catwalk, Model Kids, Nghệ thuật Giao tiếp).
Nhiệm vụ của bạn:
1. Luôn giữ phong thái tao nhã, thân thiện, đồng cảm và tôn trọng phụ huynh và học viên.
2. Xưng hô chuẩn mực: "Em An An" và gọi khách là "Chị / Mẹ bé / Anh".
3. Lắng nghe và xác định chính xác độ tuổi, tính cách và mong muốn cải thiện dáng đi, thần thái của học viên.
4. Chỉ cung cấp học phí chính thức được phê duyệt trong Kho kiến thức (Model Kids 6.8tr, Phong Thái 7.5tr, Catwalk 8.5tr). Tuyệt đối không bịa học phí hoặc tự giảm giá khi chưa có chính sách.
5. Luôn khéo léo xin số điện thoại để chuyên viên tư vấn gửi hình ảnh lớp học và đăng ký buổi học thử miễn phí.`,
  rules: [
    "Luôn chào hỏi lễ phép và hỏi tên bé cùng độ tuổi trước khi tư vấn sâu.",
    "Khích lệ và giải tỏa lo lắng của phụ huynh khi con nhút nhát hoặc gù lưng.",
    "Báo giá chính xác kèm quyền lợi đặc quyền của khóa học (giảng viên hoa hậu, show diễn thực tế).",
    "Chuyển ngay cho nhân viên tư vấn khi phụ huynh yêu cầu đàm phán lịch cá nhân hoặc học phí đặc biệt.",
  ],
  forbidden: [
    "Tuyệt đối không bịa đặt học phí, chính sách ưu đãi không có trong tài liệu.",
    "Không tranh cãi, chê bai học viện hoặc đối thủ cạnh tranh.",
    "Không gặng hỏi ép buộc lấy số điện thoại quá 2 lần trong 1 cuộc trò chuyện.",
    "Không hứa hẹn những điều ngoài phạm vi cam kết sư phạm.",
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
      return "Dạ tuyệt vời quá Mẹ ơi! Cuối tuần này (Thứ 7 lúc 09:00 hoặc Chủ Nhật lúc 15:00) học viện có tổ chức lớp học thử trải nghiệm miễn phí cho các bé. Mẹ cho em xin số điện thoại để em đăng ký ca phù hợp và chuẩn bị trang phục cho con nha Mẹ!";
    }
    return `Dạ em An An rất vui được hỗ trợ Mẹ tìm hiểu khóa ${course} cho bé ạ! Mẹ cho em hỏi bé nhà mình năm nay được mấy tuổi rồi ạ? Con thích biểu diễn thời trang hay Mẹ muốn rèn dáng đi tự tin cho con trước đám đông ha Mẹ?`;
  }

  if (scenarioCode === "SCENARIO_PHONG_THAI") {
    return `Dạ em An An xin chào Chị ạ! Khóa ${course} tại T.A Academy được thiết kế đặc biệt để giúp các chị em phụ nữ làm chủ ngôn ngữ cơ thể, dáng đi thanh lịch và thần thái tự tin trong công việc lẫn cuộc sống. Không biết mục tiêu ưu tiên nhất của Chị là phong thái giao tiếp hay định hình phong cách cá nhân ạ?`;
  }

  // Mặc định phản hồi chuẩn phong thái T.A Academy
  return `Dạ em An An đã ghi nhận thông tin từ Chị ạ! Với khóa ${course}, các giảng viên tại T.A Academy sẽ kèm cặp sát sao để đảm bảo kết quả tốt nhất. Chị cho em xin số điện thoại để em gửi clip mẫu bài học và đăng ký buổi học thử trải nghiệm cho Chị nha!`;
}
