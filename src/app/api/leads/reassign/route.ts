import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { reassignLead } from "@/lib/services/leadService";

const reassignSchema = z.object({
  customerId: z.string().min(1, "Thiếu ID khách hàng"),
  newStaffId: z.string().min(1, "Thiếu ID nhân viên nhận bàn giao"),
  newStaffName: z.string().min(1, "Thiếu tên nhân viên nhận bàn giao"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, newStaffId, newStaffName } = reassignSchema.parse(body);

    const updatedCustomer = reassignLead(customerId, newStaffId, newStaffName);

    return NextResponse.json({
      success: true,
      message: `Đã chuyển quyền phụ trách sang ${newStaffName}`,
      data: updatedCustomer,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Dữ liệu chuyển giao không hợp lệ",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Lỗi chuyển nhân viên phụ trách" },
      { status: 500 }
    );
  }
}
