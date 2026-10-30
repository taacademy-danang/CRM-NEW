import { NextRequest, NextResponse } from "next/server";
import { getUncalledLeads } from "@/lib/services/leadService";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const staff = searchParams.get("staff") || undefined;
    const leads = getUncalledLeads(staff);
    return NextResponse.json({ success: true, data: leads });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải danh sách khách chưa gọi" },
      { status: 500 }
    );
  }
}
