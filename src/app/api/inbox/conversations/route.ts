import { NextRequest, NextResponse } from "next/server";
import { getInboxConversations } from "@/lib/services/inboxService";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const channel = searchParams.get("channel") || undefined;
    const search = searchParams.get("search") || undefined;
    const mode = searchParams.get("mode") || undefined;

    const data = getInboxConversations({ channel, search, mode });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải danh sách hội thoại" },
      { status: 500 }
    );
  }
}
