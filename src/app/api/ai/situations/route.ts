import { NextRequest, NextResponse } from "next/server";
import {
  getSituations,
  addSituation,
  updateSituation,
  deleteSituation,
} from "@/lib/services/aiTrainingService";

export const dynamic = "force-dynamic";

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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID tình huống cần sửa" },
        { status: 400 }
      );
    }
    const updated = updateSituation(body.id, {
      title: body.title,
      category: body.category,
      idealResponse: body.idealResponse,
      mistakeAvoid: body.mistakeAvoid,
    });
    return NextResponse.json({
      success: true,
      message: "Cập nhật tình huống thành công!",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật tình huống" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID tình huống cần xóa" },
        { status: 400 }
      );
    }
    deleteSituation(id);
    return NextResponse.json({
      success: true,
      message: "Xóa tình huống thành công!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xóa tình huống" },
      { status: 400 }
    );
  }
}
