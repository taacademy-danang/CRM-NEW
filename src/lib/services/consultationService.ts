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
  studentCode: string;    // MÃ HỌC VIÊN: TA - STD - 001
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

// 1. DỮ LIỆU KHÁCH HÀNG ĐANG TƯ VẤN (ĐỒNG BỘ THỰC TẾ TỪ FANPAGE/ZALO - KHÔNG DÙNG DỮ LIỆU GIẢ)
let mockConsultations: CustomerConsultationRow[] = [];

// 2. DỮ LIỆU KHÁCH HÀNG TRUNG TÂM (HỌC VIÊN CHÍNH THỨC - KHÔNG DÙNG DỮ LIỆU GIẢ)
let mockCenterStudents: CenterStudent[] = [];

// Biến đếm mã học viên theo chuẩn E-learning: TA - STD - 001, TA - STD - 002...
export let studentCounter = 1;

export function setStudentCounter(num: number) {
  studentCounter = num;
}

export function getNextStudentCode() {
  const code = `TA - STD - ${String(studentCounter++).padStart(3, "0")}`;
  return code;
}

// --- PHẦN 1: CÁC HÀM CHO KHÁCH HÀNG ĐANG TƯ VẤN ---

export function getConsultations(params?: {
  search?: string;
  careStatus?: string;
  courseRef?: string;
  elearningStatus?: string;
}) {
  let result = [...mockConsultations];

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        c.aiExtractedNeed.toLowerCase().includes(q) ||
        c.courseRefLabel.toLowerCase().includes(q)
    );
  }

  if (params?.careStatus && params.careStatus !== "all") {
    result = result.filter((c) => c.careStatus === params.careStatus);
  }

  if (params?.courseRef && params.courseRef !== "all") {
    result = result.filter((c) => c.courseRef === params.courseRef);
  }

  if (params?.elearningStatus && params.elearningStatus !== "all") {
    result = result.filter((c) => c.elearningStatus === params.elearningStatus);
  }

  return result;
}

export function addConsultation(data: {
  customerName: string;
  phone?: string | null;
  courseRef: "model_kids" | "phong_thai" | "catwalk" | "giao_tiep";
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
      if (existing.careStatus === "consulting") {
        existing.careStatus = "uncalled";
      }
    }
    if (data.aiExtractedNeed) existing.aiExtractedNeed = data.aiExtractedNeed.trim();
    if (data.dob && data.dob !== "Chưa cập nhật") existing.dob = data.dob;
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
    item.phoneAutoExtracted = Boolean(data.phone);
  }
  if (data.courseRef) {
    item.courseRef = data.courseRef;
    const courseInfo = COURSE_CATALOG_MAP[data.courseRef] || COURSE_CATALOG_MAP.model_kids;
    item.courseRefLabel = courseInfo.title.split("(")[0].trim();
  }
  if (data.aiExtractedNeed) item.aiExtractedNeed = data.aiExtractedNeed.trim();
  if (data.careStatus) {
    item.careStatus = data.careStatus;
    // Nếu chuyển sang trạng thái "registered" (Đã đăng ký) -> Tự động tạo học viên chính thức
    if (data.careStatus === "registered") {
      syncToCenterStudent(item);
    }
  }
  if (data.dob) item.dob = data.dob.trim();

  return item;
}

export function updateConsultationStatus(
  id: string,
  careStatus: CustomerConsultationRow["careStatus"]
) {
  return updateConsultation(id, { careStatus });
}

export function deleteConsultation(id: string) {
  const index = mockConsultations.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Không tìm thấy khách hàng để xóa");
  mockConsultations.splice(index, 1);
  return { success: true };
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
    const studentCode = getNextStudentCode();
    const newStudent: CenterStudent = {
      id: `student-${Date.now()}`,
      studentCode,
      fullName: item.customerName,
      phone: item.phone || "Chưa cập nhật",
      dob: item.dob || "Chưa cập nhật",
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
  const studentCode = getNextStudentCode();
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

export function clearAllConsultations() {
  mockConsultations = [];
}

export function clearAllCenterStudents() {
  mockCenterStudents = [];
  studentCounter = 1;
}
