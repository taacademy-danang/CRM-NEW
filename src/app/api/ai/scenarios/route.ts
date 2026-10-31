import { NextRequest, NextResponse } from "next/server";
import {
  getGuidedScenarios,
  addGuidedScenario,
  updateGuidedScenario,
  deleteGuidedScenario,
} from "@/lib/services/aiTrainingService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const scenarios = getGuidedScenarios();
    return NextResponse.json({ success: true, data: scenarios });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải danh sách kịch bản" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = addGuidedScenario({
      code: body.code || `SCENARIO_${Date.now()}`,
      title: body.title,
      course: body.course || "Đa khóa học",
      goal: body.goal,
      status: body.status || "Đang hoạt động",
      steps: body.steps || ["Bước 1: Tiếp nhận", "Bước 2: Tư vấn", "Bước 3: Chốt lịch"],
    });

    return NextResponse.json({
      success: true,
      message: "Tạo kịch bản tư vấn mới thành công!",
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tạo kịch bản" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code) {
      return NextResponse.json(
        { success: false, message: "Thiếu mã kịch bản (code)" },
        { status: 400 }
      );
    }
    const updated = updateGuidedScenario(body.code, {
      title: body.title,
      course: body.course,
      goal: body.goal,
      status: body.status,
      steps: body.steps,
    });
    return NextResponse.json({
      success: true,
      message: "Cập nhật kịch bản thành công!",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật kịch bản" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code) {
      return NextResponse.json(
        { success: false, message: "Thiếu mã kịch bản cần xóa" },
        { status: 400 }
      );
    }
    deleteGuidedScenario(code);
    return NextResponse.json({
      success: true,
      message: "Xóa kịch bản thành công!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xóa kịch bản" },
      { status: 400 }
    );
  }
}
