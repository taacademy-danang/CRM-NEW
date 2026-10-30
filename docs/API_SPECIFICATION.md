# ĐẶC TẢ GIAO DIỆN LẬP TRÌNH ỨNG DỤNG (API SPECIFICATION)
**Hệ thống CRM & AI Tuyển sinh T.A Academy**
*Tài liệu kỹ thuật phiên bản 1.0.0 – Chuẩn RESTful API & Next.js Server Actions*

---

## 1. NGUYÊN TẮC THIẾT KẾ API

1. **Chuẩn dữ liệu & Mã hóa**: Toàn bộ payload đầu vào và đầu ra sử dụng định dạng JSON UTF-8 (`application/json`).
2. **Xác thực**:
   - Internal Web App: Sử dụng Supabase Auth Bearer JWT hoặc HTTP-Only Secure Cookies.
   - External Webhooks: Meta sử dụng `X-Hub-Signature-256`, Zalo sử dụng `X-Zalo-Signature`.
3. **Cấu trúc phản hồi chuẩn**:
   ```json
   {
     "success": true,
     "data": { ... },
     "meta": {
       "page": 1,
       "limit": 20,
       "total": 128
     },
     "error": null
   }
   ```
4. **Xử lý lỗi**:
   - `400 Bad Request`: Dữ liệu đầu vào sai định dạng (kèm chi tiết lỗi từ Zod).
   - `401 Unauthorized`: Chưa đăng nhập hoặc token hết hạn.
   - `403 Forbidden`: Người dùng không có quyền thực hiện thao tác (RBAC).
   - `404 Not Found`: Không tìm thấy tài nguyên.
   - `409 Conflict`: Trùng lặp dữ liệu (Idempotency key webhook hoặc trùng số điện thoại).
   - `429 Too Many Requests`: Vượt quá giới hạn tần suất (Rate Limit).
   - `500 Internal Server Error`: Lỗi hệ thống có ghi vết (Log ID).

---

## 2. DANH MỤC API CHI TIẾT THEO PHÂN HỆ

### 2.1. Phân hệ Xác thực & Quản lý Phiên (Authentication & Profile)

#### `GET /api/auth/me`
- **Mục đích**: Lấy thông tin tài khoản hiện tại, vai trò (`role`) và danh sách quyền chi tiết (`permissions`).
- **Phân quyền**: Tất cả người dùng đã đăng nhập.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "c1f8a84e-3759-4fba-bb73-9a48be1cb792",
      "email": "lan.nguyen@taacademy.vn",
      "full_name": "Nguyễn Thị Lan",
      "role": "admin",
      "permissions": ["lead:view_all", "lead:edit", "call:create", "ai:manage", "settings:manage"]
    }
  }
  ```

---

### 2.2. Phân hệ Dashboard & Hàng đợi Khách chưa gọi (Priority Queue)

#### `GET /api/dashboard/stats`
- **Mục đích**: Lấy 6 chỉ số thẻ thống kê thời gian thực từ database.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "total_customers": 1280,
      "new_today": 42,
      "uncalled_count": 18,
      "uncalled_warning_count": 5,
      "uncalled_danger_count": 2,
      "consulting_count": 96,
      "need_care_count": 34,
      "registered_count": 145
    }
  }
  ```

#### `GET /api/dashboard/uncalled-leads`
- **Mục đích**: Lấy danh sách khách hàng có số điện thoại nhưng chưa có cuộc gọi xác nhận hợp lệ. Sắp xếp theo mức độ ưu tiên: Đỏ (>60 phút) -> Vàng (>15 phút) -> Mới tiếp nhận.
- **Query Params**: `page=1&limit=20&assigned_to=uuid`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "8f309927-4638-4e89-9a29-2ec81dcf3511",
        "customer_code": "TA-2026-0891",
        "parent_name": "Phạm Thu Hương",
        "student_name": "Bé Gia Hân (7 tuổi)",
        "phone": "0988123456",
        "interested_course": "Model Kids Nâng Cao",
        "source": "Facebook Fanpage T.A Academy",
        "first_phone_received_at": "2026-10-30T07:10:00Z",
        "waiting_minutes": 26,
        "sla_alert_level": "warning_15m",
        "assigned_to_name": "Trần Văn Bình"
      }
    ]
  }
  ```

---

### 2.3. Phân hệ Cuộc gọi & Xác nhận kết quả (Call Logs)

#### `POST /api/calls/log`
- **Mục đích**: Ghi nhận cuộc gọi của nhân viên. Khi cuộc gọi hợp lệ được tạo, hệ thống tự động:
  1. Thêm bản ghi vào `call_logs`.
  2. Cập nhật `customers.call_status` thành `contacted` / `unreachable` / `need_recall`.
  3. Cập nhật `customers.last_called_at = now()`.
  4. Đưa khách ra khỏi danh sách **Khách chưa gọi** trên Dashboard.
  5. Thêm bản ghi vào `activity_logs`.
- **Payload**:
  ```json
  {
    "customer_id": "8f309927-4638-4e89-9a29-2ec81dcf3511",
    "phone_called": "0988123456",
    "call_result": "connected",
    "duration_seconds": 185,
    "call_summary": "Phụ huynh quan tâm khóa Model Kids cho bé 7 tuổi. Bé nhút nhát, muốn rèn sự tự tin. Hẹn 9h sáng thứ 7 tuần này đến tham quan học thử.",
    "recall_at": null,
    "next_status": "trial_scheduled"
  }
  ```

---

### 2.4. Phân hệ Hộp thư Tư vấn & Webhook Đa kênh (Omnichannel & AI Control)

#### `POST /api/conversations/[id]/messages`
- **Mục đích**: Gửi tin nhắn từ nhân viên hoặc hệ thống đến khách hàng qua Meta/Zalo.
- **Kiểm soát bảo mật**: Kiểm tra quyền tiếp quản. Nếu ở chế độ `ai_auto` mà nhân viên gửi tin, hệ thống tự động chuyển `ai_mode = 'human_takeover'`.
- **Payload**:
  ```json
  {
    "content": "Chào Chị Hương ạ, em là Bình phụ trách tuyển sinh khóa Model Kids tại T.A Academy...",
    "media_urls": [],
    "is_internal_note": false
  }
  ```

#### `POST /api/conversations/[id]/mode`
- **Mục đích**: Điều khiển 5 chế độ hoạt động của AI và Nhân viên:
  - `ai_auto`: AI tự động tư vấn 24/7.
  - `human_takeover`: Nhân viên tiếp quản (Backend khóa hoàn toàn AI gửi tin).
  - `ai_copilot`: AI chỉ gợi ý nháp nội bộ, nhân viên duyệt gửi.
  - `return_to_ai`: Trả lại quyền tư vấn tự động cho AI.
  - `closed`: Kết thúc hội thoại.
- **Payload**:
  ```json
  {
    "mode": "human_takeover",
    "reason": "Phụ huynh hỏi sâu về lịch học linh hoạt và xin giảm học phí"
  }
  ```

#### `GET /api/webhooks/meta`
- **Mục đích**: Xác thực Webhook với Meta Developer (`hub.mode`, `hub.challenge`, `hub.verify_token`).
- **Response**: Trả về `hub.challenge` dạng plain-text khi token trùng khớp với `system_settings.meta_verify_token`.

#### `POST /api/webhooks/meta`
- **Mục đích**: Tiếp nhận tin nhắn từ Facebook Messenger.
- **Xử lý nghiệp vụ**:
  1. Kiểm tra chữ ký `X-Hub-Signature-256` với `META_APP_SECRET`.
  2. Kiểm tra `entry[].messaging[].message.mid` trong bảng `webhook_events` (chống xử lý trùng lặp).
  3. Tìm kiếm hoặc khởi tạo `conversations` và `customers`.
  4. Nếu `conversation.is_ai_reply_allowed == true`, đẩy tác vụ sinh phản hồi vào AI Orchestrator.
  5. Phát sự kiện Supabase Realtime để UI tự động cập nhật tin nhắn mới không cần reload.

---

### 2.5. Phân hệ Quản lý Khách hàng & Học viên (Customers & Students)

#### `GET /api/customers`
- **Mục đích**: Tìm kiếm, lọc và phân trang danh sách khách hàng.
- **Query Params**: `search=Hương&status=consulting&course_id=uuid&assigned_to=uuid&source=facebook&page=1&limit=20`

#### `POST /api/customers`
- **Mục đích**: Tạo mới hồ sơ khách hàng và học viên kèm theo.
- **Payload**:
  ```json
  {
    "full_name": "Lê Mai Phương",
    "phone": "0912345678",
    "email": "maiphuong@gmail.com",
    "address": "Cầu Giấy, Hà Nội",
    "source": "facebook",
    "interested_course_id": "9a7f3411-...",
    "students": [
      {
        "full_name": "Bé Tuệ Nhi",
        "dob": "2018-05-12",
        "gender": "female",
        "hobby_and_traits": "Thích múa, chụp ảnh, tự tin"
      }
    ],
    "notes": "Phụ huynh muốn cho bé học để sửa dáng đi gù lưng"
  }
  ```

---

### 2.6. Phân hệ Trung tâm Đào tạo AI (AI Studio)

#### `POST /api/ai/knowledge/upload`
- **Mục đích**: Tải lên tài liệu nghiệp vụ (PDF, DOCX, XLSX), trích xuất văn bản và băm thành các chunks (300-500 tokens).
- **Trạng thái ban đầu**: `is_approved = false`. Chỉ khi Quản trị viên duyệt, các chunks mới được tạo Vector Embeddings và kích hoạt vào cơ sở RAG.

#### `POST /api/ai/test-run` (Phòng thực hành AI Playground)
- **Mục đích**: Giả lập cuộc trò chuyện thử nghiệm giữa Admin (đóng vai Phụ huynh) và AI tư vấn.
- **Payload**:
  ```json
  {
    "scenario_code": "ASK_TUITION",
    "course_id": "9a7f3411-...",
    "user_message": "Học phí khóa Phong thái quý cô bên mình bao nhiêu vậy em? Có giảm giá cho nhóm 2 người không?"
  }
  ```
- **Response**: Trả về câu trả lời của AI kèm danh sách các tài liệu kiến thức (RAG chunks) được AI tham chiếu và nhận diện intent.

#### `POST /api/ai/evaluate`
- **Mục đích**: Chấm điểm năng lực tư vấn của AI theo thang điểm 100 dựa trên 5 tiêu chuẩn nghiệp vụ.
- **Payload**:
  ```json
  {
    "session_id": "6d9b4f12-...",
    "score_natural_dialogue": 19,
    "score_need_discovery": 18,
    "score_knowledge_accuracy": 20,
    "score_objection_handling": 17,
    "score_closing_and_handoff": 18,
    "has_critical_error": false,
    "evaluator_notes": "Tư vấn rất tự nhiên, biết hỏi độ tuổi và mục tiêu học của khách trước khi báo giá chi tiết."
  }
  ```

---

### 2.7. Phân hệ Báo cáo & Xuất dữ liệu (Reports)

#### `GET /api/reports/admissions`
- **Mục đích**: Thống kê số lượng tiếp nhận, tỷ lệ gọi thành công, số lịch hẹn học thử và tỷ lệ chốt đơn theo thời gian, theo nhân viên và theo nguồn khách hàng.
