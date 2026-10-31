import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getConsultations,
  updateConsultationStatus,
  addConsultation,
  updateConsultation,
  deleteConsultation,
} from "@/lib/services/consultationService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const course = searchParams.get("course") || undefined;
    const status = searchParams.get("status") || undefined;

    const data = getConsultations({ search, course, status });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải danh sách tư vấn" },
      { status: 500 }
    );
  }
}

const updateStatusSchema = z.object({
  id: z.string().min(1),
  careStatus: z.enum([
    "consulting",
    "called",
    "uncalled",
    "trial_scheduled",
    "registered",
    "lost",
  ]),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, careStatus } = updateStatusSchema.parse(body);

    const updated = updateConsultationStatus(id, careStatus);

    return NextResponse.json({
      success: true,
      message:
        careStatus === "registered"
          ? "Đã chuyển trạng thái Đã đăng ký & Tự động đồng bộ E-learning sang Khách Hàng Trung Tâm!"
          : "Đã cập nhật tình trạng chăm sóc thành công",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật trạng thái" },
      { status: 400 }
    );
  }
}

const createConsultationSchema = z.object({
  customerName: z.string().min(2, "Tên khách hàng tối thiểu 2 ký tự"),
  phone: z.string().nullable().optional(),
  courseRef: z.enum(["model_kids", "phong_thai", "catwalk", "giao_tiep"]),
  aiExtractedNeed: z.string().optional(),
  source: z.string().optional(),
  dob: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createConsultationSchema.parse(body);

    const created = addConsultation(validated);

    return NextResponse.json({
      success: true,
      message: "Tiếp nhận khách hàng tư vấn mới thành công",
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tạo hồ sơ tư vấn" },
      { status: 400 }
    );
  }
}

const editConsultationSchema = z.object({
  id: z.string().min(1),
  customerName: z.string().min(2).optional(),
  phone: z.string().nullable().optional(),
  courseRef: z.enum(["model_kids", "phong_thai", "catwalk", "giao_tiep"]).optional(),
  aiExtractedNeed: z.string().optional(),
  careStatus: z.enum(["consulting", "called", "uncalled", "trial_scheduled", "registered", "lost"]).optional(),
  dob: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = editConsultationSchema.parse(body);

    const updated = updateConsultation(id, data);
    return NextResponse.json({
      success: true,
      message: "Đã cập nhật thông tin khách hàng tư vấn thành công!",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi chỉnh sửa thông tin" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) throw new Error("Thiếu ID khách hàng");

    deleteConsultation(id);
    return NextResponse.json({
      success: true,
      message: "Đã xóa khách hàng tư vấn thành công!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xóa khách hàng" },
      { status: 400 }
    );
  }
}
