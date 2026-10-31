/**
 * CONSULTATION & CENTER STUDENT SERVICE
 * T.A Academy CRM - Quản lý Khách hàng (Đang tư vấn & Khách hàng trung tâm)
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
  dob?: string;
}

export interface CenterStudent {
  id: string;
  studentCode: string;    // MÃ HỌC VIÊN: HV-2026-001
  fullName: string;       // HỌ TÊN
  phone: string;          // SỐ ĐIỆN THOẠI
  dob: string;            // NGÀY THÁNG NĂM SINH: 15/06/2018
  courseCode: string;     // MÃ KHÓA HỌC: MK-01, PT-01...
  courseTitle: string;    // TÊN KHÓA HỌC
  sessions: number;       // SỐ BUỔI: 12 buổi, 10 buổi...
  displayCourse: string;  // HIỂN THỊ: Mã Khóa - Số buổi (VD: MK-01 - 12 buổi)
  elearningStatus: "synced";
  elearningClass?: string;
  enrolledAt: string;
  notes?: string;
}

// Map mã khóa học & số buổi chuẩn theo danh mục cài đặt
export const COURSE_CATALOG_MAP: Record<string, { code: string; title: string; sessions: number }> = {
  model_kids: { code: "MK-01", title: "Model Kids (Mẫu Nhí Tài Năng)", sessions: 12 },
  phong_thai: { code: "PT-01", title: "Phong Thái Quý Cô & Doanh Nhân", sessions: 10 },
  catwalk: { code: "CW-01", title: "Catwalk Chuyên Nghiệp", sessions: 12 },
  giao_tiep: { code: "GT-01", title: "Nghệ Thuật Giao Tiếp & Thuyết Trình", sessions: 8 },
};

// 1. DỮ LIỆU KHÁCH HÀNG ĐANG TƯ VẤN (TỪ FANPAGE ĐỔ VỀ)
let mockConsultations: CustomerConsultationRow[] = [
  {
    stt: 1,
    id: "lead-fb-hochaunhuy",
    customerName: "Hồ Châu Như Ý",
    phone: "0945678240",
    phoneAutoExtracted: true,
    courseRef: "model_kids",
    courseRefLabel: "Model Kids",
    aiExtractedNeed: "Bé 4 tuổi, phụ huynh muốn con cải thiện dáng đi và sự tự tin sân khấu",
    careStatus: "uncalled",
    elearningStatus: "not_enrolled",
    receivedAt: "11:55 Hôm nay",
    source: "facebook",
    dob: "Chưa cập nhật",
  },
  {
    stt: 2,
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
    dob: "12/08/2019",
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
    dob: "05/10/1988",
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
    dob: "25/12/2003",
  },
  {
    stt: 4,
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
    dob: "18/02/2021",
  },
  {
    stt: 5,
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
    dob: "30/09/2017",
  },
];

// 2. DỮ LIỆU KHÁCH HÀNG TRUNG TÂM (ĐÃ ĐĂNG KÝ & CẤP ELEARNING)
let mockCenterStudents: CenterStudent[] = [
  {
    id: "student-01",
    studentCode: "HV-2026-001",
    fullName: "Vũ Mai Phương",
    phone: "0934888999",
    dob: "20/04/1996",
    courseCode: "PT-01",
    courseTitle: "Phong Thái Quý Cô & Doanh Nhân",
    sessions: 10,
    displayCourse: "PT-01 - 10 buổi",
    elearningStatus: "synced",
    elearningClass: "Lớp Phong Thái K26 (Đã xếp lớp)",
    enrolledAt: "28/10/2026",
    notes: "Đã nộp đủ học phí, đã kích hoạt E-learning",
  },
  {
    id: "student-02",
    studentCode: "HV-2026-002",
    fullName: "Lê Cẩm Tú",
    phone: "0945112233",
    dob: "15/11/2004",
    courseCode: "CW-01",
    courseTitle: "Catwalk Chuyên Nghiệp",
    sessions: 12,
    displayCourse: "CW-01 - 12 buổi",
    elearningStatus: "synced",
    elearningClass: "Lớp Catwalk Master K12 (Đã xếp lớp)",
    enrolledAt: "25/10/2026",
    notes: "Chuẩn bị tham gia casting Vietnam Junior Fashion Week",
  },
];

let studentCounter = 3;

// --- PHẦN 1: CÁC HÀM CHO KHÁCH HÀNG ĐANG TƯ VẤN ---

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

export function addConsultation(data: {
  customerName: string;
  phone?: string | null;
  courseRef: CustomerConsultationRow["courseRef"];
  aiExtractedNeed?: string;
  source?: string;
  dob?: string;
}) {
  const courseInfo = COURSE_CATALOG_MAP[data.courseRef] || COURSE_CATALOG_MAP.model_kids;

  const existing = mockConsultations.find(
    (c) => c.customerName.toLowerCase() === data.customerName.trim().toLowerCase()
  );
  if (existing) {
    if (data.phone) {
      existing.phone = data.phone.trim();
      existing.phoneAutoExtracted = true;
      existing.careStatus = "uncalled";
    }
    if (data.aiExtractedNeed) existing.aiExtractedNeed = data.aiExtractedNeed.trim();
    if (data.courseRef) {
      existing.courseRef = data.courseRef;
      existing.courseRefLabel = courseInfo.title.split("(")[0].trim();
    }
    return existing;
  }

  const newItem: CustomerConsultationRow = {
    stt: mockConsultations.length + 1,
    id: `lead-${Date.now()}`,
    customerName: data.customerName.trim(),
    phone: data.phone?.trim() || null,
    phoneAutoExtracted: Boolean(data.phone),
    courseRef: data.courseRef,
    courseRefLabel: courseInfo.title.split("(")[0].trim(),
    aiExtractedNeed: data.aiExtractedNeed?.trim() || "Khách hàng quan tâm khóa học tại T.A Academy",
    careStatus: data.phone ? "uncalled" : "consulting",
    elearningStatus: "not_enrolled",
    receivedAt: "Vừa xong",
    source: data.source || "facebook",
    dob: data.dob || "Chưa cập nhật",
  };

  mockConsultations.unshift(newItem);
  return newItem;
}

export function updateConsultation(
  id: string,
  data: Partial<Omit<CustomerConsultationRow, "id" | "stt">>
) {
  const item = mockConsultations.find((c) => c.id === id);
  if (!item) throw new Error("Không tìm thấy khách hàng tư vấn");

  if (data.customerName) item.customerName = data.customerName.trim();
  if (data.phone !== undefined) {
    item.phone = data.phone ? data.phone.trim() : null;
  }
  if (data.courseRef) {
    item.courseRef = data.courseRef;
    const info = COURSE_CATALOG_MAP[data.courseRef];
    if (info) item.courseRefLabel = info.title.split("(")[0].trim();
  }
  if (data.aiExtractedNeed) item.aiExtractedNeed = data.aiExtractedNeed.trim();
  if (data.careStatus) item.careStatus = data.careStatus;
  if (data.dob) item.dob = data.dob;

  // Nếu cập nhật thành registered -> tự động chuyển sang Khách hàng trung tâm
  if (data.careStatus === "registered") {
    syncToCenterStudent(item);
  }

  return item;
}

export function deleteConsultation(id: string) {
  const index = mockConsultations.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Không tìm thấy khách hàng để xóa");
  mockConsultations.splice(index, 1);
  return { success: true };
}

export function updateConsultationStatus(
  id: string,
  newStatus: CustomerConsultationRow["careStatus"]
) {
  const item = mockConsultations.find((c) => c.id === id);
  if (!item) throw new Error("Không tìm thấy khách hàng tư vấn");

  item.careStatus = newStatus;

  // QUY TẮC CỐT LÕI:
  // Khi chuyển sang "registered" (Đã đăng ký) -> Tự động chuyển qua Khách Hàng Trung Tâm & Cấp E-learning!
  if (newStatus === "registered") {
    syncToCenterStudent(item);
  }

  return item;
}

// Chuyển khách hàng tư vấn sang Học viên trung tâm
function syncToCenterStudent(item: CustomerConsultationRow) {
  item.elearningStatus = "synced";
  const courseInfo = COURSE_CATALOG_MAP[item.courseRef] || COURSE_CATALOG_MAP.model_kids;
  item.elearningClass = `Lớp ${item.courseRefLabel} K${Math.floor(Math.random() * 5 + 26)} (Đã xếp lớp)`;

  const existing = mockCenterStudents.find(
    (s) => (item.phone && s.phone === item.phone) || s.fullName.toLowerCase() === item.customerName.toLowerCase()
  );

  if (!existing) {
    const studentCode = `HV-2026-${String(studentCounter++).padStart(3, "0")}`;
    const newStudent: CenterStudent = {
      id: `student-${Date.now()}`,
      studentCode,
      fullName: item.customerName,
      phone: item.phone || "Chưa cập nhật",
      dob: item.dob || "15/06/2018",
      courseCode: courseInfo.code,
      courseTitle: courseInfo.title,
      sessions: courseInfo.sessions,
      displayCourse: `${courseInfo.code} - ${courseInfo.sessions} buổi`,
      elearningStatus: "synced",
      elearningClass: item.elearningClass,
      enrolledAt: "Hôm nay " + new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      notes: "Tự động chuyển từ Hộp thư tư vấn khi hoàn tất đăng ký",
    };
    mockCenterStudents.unshift(newStudent);
  }
}

// --- PHẦN 2: CÁC HÀM CHO KHÁCH HÀNG TRUNG TÂM (HỌC VIÊN CHÍNH THỨC) ---

export function getCenterStudents(search?: string) {
  let result = [...mockCenterStudents];
  if (search) {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.studentCode.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.displayCourse.toLowerCase().includes(q) ||
        s.dob.includes(q)
    );
  }
  return result;
}

export function addCenterStudent(data: {
  fullName: string;
  phone: string;
  dob: string;
  courseCode: string;
  sessions?: number;
  notes?: string;
}) {
  const studentCode = `HV-2026-${String(studentCounter++).padStart(3, "0")}`;
  const sessions = data.sessions || 12;

  const newStudent: CenterStudent = {
    id: `student-${Date.now()}`,
    studentCode,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    dob: data.dob.trim() || "01/01/2018",
    courseCode: data.courseCode.toUpperCase(),
    courseTitle: `Khóa ${data.courseCode.toUpperCase()}`,
    sessions,
    displayCourse: `${data.courseCode.toUpperCase()} - ${sessions} buổi`,
    elearningStatus: "synced",
    elearningClass: `Lớp ${data.courseCode.toUpperCase()} K26 (Đã xếp lớp)`,
    enrolledAt: "Hôm nay " + new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    notes: data.notes || "Thêm trực tiếp vào danh sách khách hàng trung tâm",
  };

  mockCenterStudents.unshift(newStudent);
  return newStudent;
}

export function updateCenterStudent(
  id: string,
  data: {
    fullName: string;
    phone: string;
    dob: string;
    courseCode: string;
    sessions?: number;
    notes?: string;
  }
) {
  const student = mockCenterStudents.find((s) => s.id === id);
  if (!student) throw new Error("Không tìm thấy học viên trung tâm");

  student.fullName = data.fullName.trim();
  student.phone = data.phone.trim();
  student.dob = data.dob.trim();
  student.courseCode = data.courseCode.toUpperCase();
  if (data.sessions) student.sessions = data.sessions;
  student.displayCourse = `${data.courseCode.toUpperCase()} - ${student.sessions} buổi`;
  if (data.notes !== undefined) student.notes = data.notes;

  return student;
}

export function deleteCenterStudent(id: string) {
  const index = mockCenterStudents.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Không tìm thấy học viên để xóa");
  mockCenterStudents.splice(index, 1);
  return { success: true };
}
