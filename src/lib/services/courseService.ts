/**
 * COURSE SERVICE - QUẢN LÝ DANH MỤC KHÓA HỌC CHUẨN T.A ACADEMY
 * T.A Academy CRM - Cài Đặt Hệ Thống
 */

export interface CourseItem {
  id: string;
  code: string;         // Mã khóa: MK-01, PT-01, CW-01, GT-01...
  title: string;        // Tên khóa học
  totalSessions: number; // Số buổi
  tuitionFee?: number;
  description?: string;
  isActive: boolean;
}

let mockCourses: CourseItem[] = [
  {
    id: "course-1",
    code: "MK-01",
    title: "Model Kids (Mẫu Nhí Tài Năng)",
    totalSessions: 12,
    tuitionFee: 6800000,
    description: "Khóa đào tạo mẫu nhí, chỉnh dáng đi và thần thái sân khấu cho bé 4-12 tuổi",
    isActive: true,
  },
  {
    id: "course-2",
    code: "PT-01",
    title: "Phong Thái Quý Cô & Doanh Nhân",
    totalSessions: 10,
    tuitionFee: 7500000,
    description: "Định hình dáng đứng, ngồi, thần thái đàm phán và giao tiếp thanh lịch chuẩn quốc tế",
    isActive: true,
  },
  {
    id: "course-3",
    code: "CW-01",
    title: "Catwalk Chuyên Nghiệp",
    totalSessions: 12,
    tuitionFee: 8500000,
    description: "Kỹ năng catwalk chuẩn sân khấu, giải phóng hình thể cùng Siêu mẫu hàng đầu",
    isActive: true,
  },
  {
    id: "course-4",
    code: "GT-01",
    title: "Nghệ Thuật Giao Tiếp & Thuyết Trình",
    totalSessions: 8,
    tuitionFee: 5500000,
    description: "Tự tin nói trước đám đông, làm chủ giọng nói và truyền cảm hứng",
    isActive: true,
  },
];

export function getCourses() {
  return [...mockCourses];
}

export function addCourse(data: { code: string; title: string; totalSessions: number; description?: string }) {
  const existing = mockCourses.find((c) => c.code.toLowerCase() === data.code.toLowerCase().trim());
  if (existing) {
    throw new Error(`Mã khóa học "${data.code}" đã tồn tại trên hệ thống.`);
  }

  const newCourse: CourseItem = {
    id: `course-${Date.now()}`,
    code: data.code.trim().toUpperCase(),
    title: data.title.trim(),
    totalSessions: Number(data.totalSessions) || 10,
    description: data.description,
    isActive: true,
  };

  mockCourses.push(newCourse);
  return newCourse;
}

export function updateCourse(id: string, data: { code: string; title: string; totalSessions: number; description?: string }) {
  const course = mockCourses.find((c) => c.id === id);
  if (!course) throw new Error("Không tìm thấy khóa học cần cập nhật");

  const duplicateCode = mockCourses.find(
    (c) => c.id !== id && c.code.toLowerCase() === data.code.toLowerCase().trim()
  );
  if (duplicateCode) {
    throw new Error(`Mã khóa học "${data.code}" đã bị trùng với khóa học khác.`);
  }

  course.code = data.code.trim().toUpperCase();
  course.title = data.title.trim();
  course.totalSessions = Number(data.totalSessions) || 10;
  if (data.description !== undefined) course.description = data.description;

  return course;
}

export function deleteCourse(id: string) {
  const index = mockCourses.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Không tìm thấy khóa học để xóa");
  mockCourses.splice(index, 1);
  return { success: true };
}
