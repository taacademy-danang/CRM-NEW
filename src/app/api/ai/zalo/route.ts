import { NextRequest, NextResponse } from "next/server";
import { getAiZaloConfig, updateAiZaloConfig } from "@/lib/services/aiTrainingService";

export async function GET() {
  try {
    const config = getAiZaloConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải cấu hình Zalo AI" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateAiZaloConfig(body);
    return NextResponse.json({
      success: true,
      message: "Đã lưu và đồng bộ cấu hình Zalo Official Account thành công!",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật cấu hình Zalo" },
      { status: 400 }
    );
  }
}
