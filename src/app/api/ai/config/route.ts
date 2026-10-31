import { NextRequest, NextResponse } from "next/server";
import { getAiConfig, updateAiConfig } from "@/lib/services/aiTrainingService";

export async function GET() {
  try {
    const config = getAiConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải cấu hình AI" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateAiConfig(body);
    return NextResponse.json({
      success: true,
      message: "Đã lưu và đồng bộ cấu hình AI Fanpage thành công!",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật cấu hình" },
      { status: 400 }
    );
  }
}
