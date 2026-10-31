import { NextRequest, NextResponse } from "next/server";
import {
  getKnowledgeDocs,
  addKnowledgeDoc,
  updateKnowledgeDoc,
  deleteKnowledgeDoc,
  approveKnowledgeDoc,
} from "@/lib/services/aiTrainingService";

export async function GET() {
  try {
    const docs = getKnowledgeDocs();
    return NextResponse.json({ success: true, data: docs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải kho kiến thức" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newDoc = addKnowledgeDoc({
      title: body.title,
      category: body.category || "Model Kids",
      version: body.version || "1.0 (Draft)",
      isApproved: false,
      chunksCount: body.chunksCount || Math.floor(Math.random() * 15 + 10),
      contentSummary: body.contentSummary || "Tài liệu đào tạo tuyển sinh mới tải lên.",
    });

    return NextResponse.json({
      success: true,
      message: "Tải lên tài liệu kiến thức thành công. Đang chờ Admin phê duyệt trước khi lập chỉ mục RAG.",
      data: newDoc,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi thêm tài liệu" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, category, contentSummary, version } = body;
    if (!id) throw new Error("Thiếu ID tài liệu kiến thức");

    const updated = updateKnowledgeDoc(id, {
      title,
      category,
      contentSummary,
      version,
    });

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật tài liệu "${updated.title}" thành công!`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật tài liệu" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) throw new Error("Thiếu ID tài liệu cần xóa");

    const deleted = deleteKnowledgeDoc(id);
    return NextResponse.json({
      success: true,
      message: `Đã xóa tài liệu "${deleted.title}" khỏi kho kiến thức!`,
      data: deleted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xóa tài liệu" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, approverName } = body;
    if (!id) throw new Error("Thiếu ID tài liệu");

    const approvedDoc = approveKnowledgeDoc(id, approverName || "Nguyễn Thị Lan (Admin)");
    return NextResponse.json({
      success: true,
      message: `Đã phê duyệt tài liệu "${approvedDoc.title}" vào chỉ mục RAG chính thức!`,
      data: approvedDoc,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi phê duyệt tài liệu" },
      { status: 400 }
    );
  }
}
