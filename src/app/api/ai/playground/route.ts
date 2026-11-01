import { NextRequest, NextResponse } from "next/server";
import { simulatePlaygroundReply } from "@/lib/services/aiTrainingService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userMessage, scenarioCode, course } = body;

    if (!userMessage || !userMessage.trim()) {
      return NextResponse.json(
        { success: false, message: "Tin nhắn không được để trống" },
        { status: 400 }
      );
    }

    const reply = simulatePlaygroundReply({
      userMessage,
      scenarioCode: scenarioCode || undefined,
      course: course || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi mô phỏng AI" },
      { status: 500 }
    );
  }
}
