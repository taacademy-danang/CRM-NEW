import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCallLog } from "@/lib/services/leadService";

const callLogSchema = z.object({
  customer_id: z.string().min(1, "Thiếu ID khách hàng"),
  phone_called: z.string().min(8, "Số điện thoại không hợp lệ"),
  call_result: z.enum(["connected", "unreachable", "busy", "wrong_number", "recall_requested"], {
    errorMap: () => ({ message: "Kết quả cuộc gọi không hợp lệ" }),
  }),
  duration_seconds: z.number().min(0, "Thời lượng cuộc gọi không hợp lệ"),
  call_summary: z.string().min(3, "Vui lòng nhập tóm tắt cuộc gọi (tối thiểu 3 ký tự)"),
  recall_at: z.string().nullable().optional(),
  next_status: z.string().min(1, "Vui lòng chọn trạng thái tiếp theo"),
  agent_name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = callLogSchema.parse(body);

    const result = createCallLog({
      customer_id: validatedData.customer_id,
      phone_called: validatedData.phone_called,
      call_result: validatedData.call_result,
      duration_seconds: validatedData.duration_seconds,
      call_summary: validatedData.call_summary,
      recall_at: validatedData.recall_at,
      next_status: validatedData.next_status,
      agent_name: validatedData.agent_name,
    });

    return NextResponse.json({
      success: true,
      message: "Ghi nhận kết quả cuộc gọi thành công",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Dữ liệu xác nhận cuộc gọi không hợp lệ",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xử lý cuộc gọi" },
      { status: 500 }
    );
  }
}
