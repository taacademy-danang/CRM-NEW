import { NextRequest, NextResponse } from "next/server";
import { getInboxConversations, clearAllInboxData } from "@/lib/services/inboxService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const channel = searchParams.get("channel") || undefined;
    const search = searchParams.get("search") || undefined;
    const mode = searchParams.get("mode") || undefined;
    const sync = searchParams.get("sync") === "true";

    const data = await getInboxConversations({ channel, search, mode, sync });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải danh sách hội thoại" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    clearAllInboxData();
    return NextResponse.json({
      success: true,
      message: "Đã xóa sạch toàn bộ hội thoại và tin nhắn trong hộp thư!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xóa dữ liệu hộp thư" },
      { status: 500 }
    );
  }
}
