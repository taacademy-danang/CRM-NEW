import { NextRequest, NextResponse } from "next/server";
import { getAiPersona, updateAiPersona } from "@/lib/services/aiTrainingService";

export async function GET() {
  try {
    const persona = getAiPersona();
    return NextResponse.json({ success: true, data: persona });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải nhân cách AI" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateAiPersona(body);
    return NextResponse.json({
      success: true,
      message: "Đã lưu nhân cách & System Prompt cho AI An An thành công!",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật nhân cách AI" },
      { status: 400 }
    );
  }
}
