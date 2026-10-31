import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getCenterStudents,
  addCenterStudent,
  updateCenterStudent,
  deleteCenterStudent,
  clearAllCenterStudents,
} from "@/lib/services/consultationService";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;

    const data = getCenterStudents(search);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải danh sách học viên trung tâm" },
      { status: 500 }
    );
  }
}

const studentSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  dob: z.string().min(4, "Vui lòng nhập ngày tháng năm sinh"),
  courseCode: z.string().min(2, "Vui lòng chọn hoặc nhập mã khóa học"),
  sessions: z.number().min(1).optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = studentSchema.parse(body);

    const created = addCenterStudent(validated);
    return NextResponse.json({
      success: true,
      message: `Đã thêm học viên "${created.fullName}" (Mã: ${created.studentCode}) thành công!`,
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi thêm học viên" },
      { status: 400 }
    );
  }
}

const updateStudentSchema = studentSchema.extend({
  id: z.string().min(1),
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = updateStudentSchema.parse(body);

    const updated = updateCenterStudent(id, data);
    return NextResponse.json({
      success: true,
      message: `Đã cập nhật thông tin học viên "${updated.fullName}" (${updated.studentCode})!`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật học viên" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const clearAll = searchParams.get("all") === "true";

    if (clearAll) {
      clearAllCenterStudents();
      return NextResponse.json({
        success: true,
        message: "Đã xóa sạch toàn bộ danh sách học viên trung tâm!",
      });
    }

    if (!id) throw new Error("Thiếu ID học viên");

    deleteCenterStudent(id);
    return NextResponse.json({
      success: true,
      message: "Đã xóa học viên khỏi danh sách khách hàng trung tâm thành công!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xóa học viên" },
      { status: 400 }
    );
  }
}
