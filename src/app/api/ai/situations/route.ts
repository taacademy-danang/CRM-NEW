import { NextRequest, NextResponse } from "next/server";
import { getSituations, addSituation } from "@/lib/services/aiTrainingService";

export async function GET() {
  try {
    const situations = getSituations();
    return NextResponse.json({ success: true, data: situations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải thư viện tình huống" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = addSituation({
      title: body.title,
      category: body.category || "Tâm lý học viên",
      idealResponse: body.idealResponse,
      mistakeAvoid: body.mistakeAvoid,
      isApproved: true,
    });

    return NextResponse.json({
      success: true,
      message: "Đã thêm tình huống thực tế và câu trả lời mẫu vào thư viện!",
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi thêm tình huống" },
      { status: 400 }
    );
  }
}
