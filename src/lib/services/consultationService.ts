/**
 * CONSULTATION SERVICE - QUẢN LÝ KHÁCH HÀNG TƯ VẤN & TỰ ĐỘNG ĐỒNG BỘ E-LEARNING
 * T.A Academy CRM - Phase 2
 */

export interface CustomerConsultationRow {
  stt: number;
  id: string;
  customerName: string;
  phone: string | null;
  phoneAutoExtracted: boolean;
  courseRef: "model_kids" | "phong_thai" | "catwalk" | "giao_tiep";
  courseRefLabel: string;
  aiExtractedNeed: string;
  careStatus: "consulting" | "called" | "uncalled" | "trial_scheduled" | "registered" | "lost";
  elearningStatus: "synced" | "pending" | "not_enrolled";
  elearningClass?: string;
  receivedAt: string;
  source?: string;
}

let mockConsultations: CustomerConsultationRow[] = [
  {
    stt: 1,
    id: "lead-01",
    customerName: "Phạm Thu Hương",
    phone: "0988123456",
    phoneAutoExtracted: true,
    courseRef: "model_kids",
    courseRefLabel: "Model Kids",
    aiExtractedNeed: "Bé 7 tuổi nhút nhát, lưng đi hơi gù, phụ huynh muốn con tự tin trước đám đông và rèn dáng đi chuẩn",
    careStatus: "uncalled",
    elearningStatus: "not_enrolled",
    receivedAt: "14:10 Hôm nay",
    source: "facebook",
  },
  {
    stt: 2,
    id: "lead-02",
    customerName: "Nguyễn Hoàng Nam",
    phone: "0912345888",
    phoneAutoExtracted: true,
    courseRef: "phong_thai",
    courseRefLabel: "Phong Thái",
    aiExtractedNeed: "Doanh nhân muốn học nâng tầm phong thái giao tiếp, thần thái đàm phán kinh doanh và tạo ấn tượng đối tác",
    careStatus: "called",
    elearningStatus: "not_enrolled",
    receivedAt: "13:45 Hôm nay",
    source: "zalo",
  },
  {
    stt: 3,
    id: "lead-03",
    customerName: "Hoàng Kiều Trinh",
    phone: "0909555666",
    phoneAutoExtracted: false,
    courseRef: "catwalk",
    courseRefLabel: "Catwalk",
    aiExtractedNeed: "Đam mê thời trang, muốn rèn giải phóng hình thể sân khấu và tìm kiếm cơ hội casting show diễn thời trang lớn",
    careStatus: "trial_scheduled",
    elearningStatus: "not_enrolled",
    receivedAt: "10:15 Hôm nay",
    source: "facebook",
  },
  {
    stt: 4,
    id: "lead-04",
    customerName: "Vũ Mai Phương",
    phone: "0934888999",
    phoneAutoExtracted: true,
    courseRef: "phong_thai",
    courseRefLabel: "Phong Thái",
    aiExtractedNeed: "Cần chỉnh dáng đứng, dáng ngồi quý cô thanh lịch và tự tin thuyết trình truyền cảm hứng",
    careStatus: "registered",
    elearningStatus: "synced",
    elearningClass: "Lớp Phong Thái K26 (Đã xếp lớp)",
    receivedAt: "Hôm qua",
    source: "hotline",
  },
  {
    stt: 5,
    id: "lead-05",
    customerName: "Trần Bảo Ngọc",
    phone: "0966778899",
    phoneAutoExtracted: true,
    courseRef: "model_kids",
    courseRefLabel: "Model Kids",
    aiExtractedNeed: "Bé 5 tuổi muốn học để tham gia chụp lookbook Tết và rèn biểu cảm gương mặt vui tươi, lanh lợi",
    careStatus: "consulting",
    elearningStatus: "not_enrolled",
    receivedAt: "Hôm qua",
    source: "facebook",
  },
  {
    stt: 6,
    id: "lead-06",
    customerName: "Đinh Công Lý",
    phone: null,
    phoneAutoExtracted: false,
    courseRef: "giao_tiep",
    courseRefLabel: "Giao Tiếp",
    aiExtractedNeed: "Phụ huynh muốn rèn cho con kỹ năng đứng trước lớp phát biểu tự tin, không run sợ",
    careStatus: "consulting",
    elearningStatus: "not_enrolled",
    receivedAt: "Hôm qua",
    source: "facebook",
  },
  {
    stt: 7,
    id: "lead-07",
    customerName: "Lê Cẩm Tú",
    phone: "0945112233",
    phoneAutoExtracted: true,
    courseRef: "catwalk",
    courseRefLabel: "Catwalk",
    aiExtractedNeed: "Sinh viên 20 tuổi muốn học catwalk để thi Hoa hậu Hoàn Vũ Việt Nam",
    careStatus: "registered",
    elearningStatus: "synced",
    elearningClass: "Lớp Catwalk Master K12 (Đã xếp lớp)",
    receivedAt: "2 ngày trước",
    source: "referral",
  },
];

export function getConsultations(params?: {
  search?: string;
  course?: string;
  status?: string;
  source?: string;
}) {
  let result = [...mockConsultations];

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        c.aiExtractedNeed.toLowerCase().includes(q)
    );
  }

  if (params?.course && params.course !== "all") {
    result = result.filter((c) => c.courseRef === params.course);
  }

  if (params?.status && params.status !== "all") {
    result = result.filter((c) => c.careStatus === params.status);
  }

  return result.map((item, index) => ({
    ...item,
    stt: index + 1,
  }));
}

export function updateConsultationStatus(
  id: string,
  newStatus: CustomerConsultationRow["careStatus"]
) {
  const item = mockConsultations.find((c) => c.id === id);
  if (!item) {
    throw new Error("Không tìm thấy khách hàng tư vấn");
  }

  item.careStatus = newStatus;

  // QUY TẮC NGHIỆP VỤ CỐT LÕI:
  // Nếu chuyển sang "registered" (Đã đăng ký) -> Tự động chuyển qua E-learning để xếp lớp
  if (newStatus === "registered") {
    item.elearningStatus = "synced";
    const courseTitle = item.courseRefLabel;
    item.elearningClass = `Lớp ${courseTitle} K${Math.floor(Math.random() * 5 + 25)} (Đã xếp lớp)`;
  }

  return item;
}

export function addConsultation(data: {
  customerName: string;
  phone?: string | null;
  courseRef: CustomerConsultationRow["courseRef"];
  aiExtractedNeed?: string;
  source?: string;
}) {
  const courseLabels: Record<string, string> = {
    model_kids: "Model Kids",
    phong_thai: "Phong Thái",
    catwalk: "Catwalk",
    giao_tiep: "Giao Tiếp",
  };

  const newItem: CustomerConsultationRow = {
    stt: mockConsultations.length + 1,
    id: `lead-${Date.now()}`,
    customerName: data.customerName,
    phone: data.phone || null,
    phoneAutoExtracted: Boolean(data.phone),
    courseRef: data.courseRef,
    courseRefLabel: courseLabels[data.courseRef] || "Model Kids",
    aiExtractedNeed: data.aiExtractedNeed || "Khách hàng quan tâm khóa học tại T.A Academy",
    careStatus: data.phone ? "uncalled" : "consulting",
    elearningStatus: "not_enrolled",
    receivedAt: "Vừa xong",
    source: data.source || "facebook",
  };

  mockConsultations.unshift(newItem);
  return newItem;
}
