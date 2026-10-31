import { NextRequest, NextResponse } from "next/server";
import { getGuidedScenarios, addGuidedScenario } from "@/lib/services/aiTrainingService";

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
