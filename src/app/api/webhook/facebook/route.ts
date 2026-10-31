import { NextRequest, NextResponse } from "next/server";
import { getAiConfig } from "@/lib/services/aiTrainingService";
import { handleIncomingFacebookMessage } from "@/lib/services/inboxService";

/**
 * FACEBOOK MESSENGER WEBHOOK ENDPOINT
 * Xử lý xác thực Meta (GET) và tiếp nhận tin nhắn từ Fanpage (POST)
 */

// 1. GET: Xác thực Webhook với Meta (Hub Challenge Verification)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const config = getAiConfig();
    const expectedToken = config.verifyToken || "ta_academy_meta_verify_token_2026";

    if (mode === "subscribe" && token === expectedToken) {
      console.log("[Facebook Webhook] Xác thực thành công với Meta:", challenge);
      return new NextResponse(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    console.warn("[Facebook Webhook] Xác thực thất bại: Token không khớp");
    return NextResponse.json({ error: "Xác thực token thất bại" }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi xác thực webhook" },
      { status: 500 }
    );
  }
}

// 2. POST: Tiếp nhận tin nhắn từ Facebook Messenger Webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[Facebook Webhook Received]:", JSON.stringify(body, null, 2));

    const config = getAiConfig();

    // Hỗ trợ 2 định dạng:
    // A) Định dạng chuẩn Meta Graph API Webhook:
    //    body.object === "page" && body.entry[0].messaging[0]
    // B) Định dạng Thử nghiệm trực tiếp từ giao diện CRM:
    //    body.messageText && body.senderName

    let senderId = "fb_user_demo";
    let senderName = "Khách Facebook";
    let messageText = "";

    if (body.entry && Array.isArray(body.entry) && body.entry[0]?.messaging) {
      const messagingEvent = body.entry[0].messaging[0];
      senderId = messagingEvent.sender?.id || "fb_user_unknown";
      messageText = messagingEvent.message?.text || "";
      senderName = body.senderName || `Khách Facebook (${senderId.slice(-4)})`;
    } else if (body.messageText) {
      // Test mode từ giao diện CRM
      senderId = body.senderId || `fb_test_${Date.now().toString().slice(-4)}`;
      senderName = body.senderName || "Nguyễn Mai Anh (Fanpage Test)";
      messageText = body.messageText;
    }

    if (!messageText.trim()) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy nội dung tin nhắn" },
        { status: 400 }
      );
    }

    // 1. Xử lý tin nhắn trong CRM & AI Tư Vấn
    const result = handleIncomingFacebookMessage({
      senderId,
      senderName,
      messageText,
    });

    // 2. Nếu có Page Access Token thật và người dùng bật bot, gọi Meta Graph API gửi trả lời trực tiếp về Messenger
    let fbApiResponse = null;
    const replyContent = result.aiReply?.content;
    if (replyContent && config.fbToken && config.fbToken.startsWith("EA") && config.isBotActive) {
      try {
        const fbRes = await fetch(
          `https://graph.facebook.com/v19.0/me/messages?access_token=${config.fbToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipient: { id: senderId },
              messaging_type: "RESPONSE",
              message: { text: replyContent },
            }),
          }
        );
        fbApiResponse = await fbRes.json();
        console.log("[Facebook Graph API Response]:", fbApiResponse);
      } catch (fbErr) {
        console.error("[Facebook Graph API Send Error]:", fbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Tiếp nhận và xử lý tin nhắn Fanpage thành công",
      data: {
        senderId,
        senderName,
        messageText,
        aiReply: result.aiReply?.content || null,
        extractedPhone: result.conversation.phone || null,
        extractedNeed: result.conversation.aiExtractedNeed,
        conversationId: result.conversation.id,
        fbApiResponse,
      },
    });
  } catch (error: any) {
    console.error("[Facebook Webhook Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xử lý webhook Facebook" },
      { status: 500 }
    );
  }
}
