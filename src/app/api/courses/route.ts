import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCourses, addCourse, updateCourse, deleteCourse } from "@/lib/services/courseService";

export async function GET() {
  try {
    const data = getCourses();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải danh mục khóa học" },
      { status: 500 }
    );
  }
}

const courseSchema = z.object({
  code: z.string().min(2, "Mã khóa học tối thiểu 2 ký tự"),
  title: z.string().min(2, "Tên khóa học tối thiểu 2 ký tự"),
  totalSessions: z.number().min(1, "Số buổi học tối thiểu 1 buổi"),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = courseSchema.parse(body);
    const created = addCourse(validated);

    return NextResponse.json({
      success: true,
      message: `Đã thêm khóa học "${created.title}" (${created.code}) thành công!`,
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi thêm khóa học" },
      { status: 400 }
    );
  }
}

const updateCourseSchema = courseSchema.extend({
  id: z.string().min(1),
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = updateCourseSchema.parse(body);
    const updated = updateCourse(id, data);

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật khóa học "${updated.title}" (${updated.code}) thành công!`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật khóa học" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) throw new Error("Thiếu ID khóa học cần xóa");

    deleteCourse(id);
    return NextResponse.json({
      success: true,
      message: "Đã xóa khóa học thành công!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xóa khóa học" },
      { status: 400 }
    );
  }
}
