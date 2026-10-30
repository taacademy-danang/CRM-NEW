# SƠ ĐỒ QUAN HỆ THỰC THỂ (DATABASE ERD)
**Hệ thống CRM & AI Tuyển sinh T.A Academy**
*Tài liệu kỹ thuật phiên bản 1.0.0 – Chuẩn Mermaid Entity Relationship Diagram*

---

## 1. BIỂU ĐỒ QUAN HỆ THỰC THỂ (MERMAID ERD)

```mermaid
erDiagram
    %% ==========================================
    %% RBAC & USERS
    %% ==========================================
    roles ||--o{ role_permissions : "gán"
    permissions ||--o{ role_permissions : "chứa"
    roles ||--o{ profiles : "định nghĩa"

    roles {
        varchar id PK
        varchar name
        text description
    }

    permissions {
        varchar id PK
        varchar module
        varchar name
    }

    role_permissions {
        varchar role_id PK,FK
        varchar permission_id PK,FK
    }

    profiles {
        uuid id PK
        varchar email
        varchar full_name
        varchar phone
        varchar role_id FK
        uuid team_id
        boolean is_active
    }

    %% ==========================================
    %% CUSTOMERS & STUDENTS (1 PHỤ HUYNH - NHIỀU HỌC VIÊN)
    %% ==========================================
    profiles ||--o{ customers : "phân công chăm sóc"
    courses ||--o{ customers : "khóa học quan tâm chính"
    customers ||--o{ students : "có học viên (con)"
    customers ||--o{ customer_tags : "gắn"
    tags ||--o{ customer_tags : "thuộc"

    customers {
        uuid id PK
        varchar customer_code UK
        varchar full_name
        varchar phone
        varchar source
        varchar status
        varchar call_status
        timestamptz first_phone_received_at
        varchar sla_alert_level
        uuid assigned_to FK
        uuid interested_course_id FK
    }

    students {
        uuid id PK
        uuid parent_id FK
        varchar full_name
        date dob
        varchar gender
        text hobby_and_traits
        text special_notes
    }

    courses {
        uuid id PK
        varchar code UK
        varchar title
        varchar category
        int min_age
        int max_age
        int duration_weeks
        numeric tuition_fee
        boolean is_active
    }

    students ||--o{ enrollments : "đăng ký khóa học"
    courses ||--o{ enrollments : "được đăng ký"
    profiles ||--o{ enrollments : "nhân viên chốt đơn"

    enrollments {
        uuid id PK
        uuid student_id FK
        uuid course_id FK
        uuid registered_by FK
        date enrollment_date
        numeric fee_agreed
        varchar payment_status
        numeric paid_amount
    }

    tags {
        uuid id PK
        varchar name UK
        varchar color
    }

    customer_tags {
        uuid customer_id PK,FK
        uuid tag_id PK,FK
    }

    %% ==========================================
    %% OMNICHANNEL CONVERSATIONS & CHANNELS
    %% ==========================================
    channels ||--o{ channel_accounts : "có tài khoản"
    channel_accounts ||--o{ conversations : "tiếp nhận"
    customers ||--o{ conversations : "liên kết"
    profiles ||--o{ conversations : "nhân viên tiếp quản"
    conversations ||--o{ messages : "chứa"

    channels {
        varchar id PK
        varchar name
    }

    channel_accounts {
        uuid id PK
        varchar channel_id FK
        varchar external_account_id
        varchar name
        text access_token
        boolean is_active
    }

    conversations {
        uuid id PK
        uuid channel_account_id FK
        uuid customer_id FK
        varchar external_thread_id
        varchar sender_name
        varchar ai_mode
        uuid human_assigned_to FK
        boolean is_ai_reply_allowed
        timestamptz last_message_at
    }

    messages {
        uuid id PK
        uuid conversation_id FK
        varchar external_message_id UK
        varchar sender_type
        uuid sender_id FK
        text content
        jsonb media_urls
        boolean is_internal_note
        text ai_suggested_reply
        varchar status
    }

    %% ==========================================
    %% CALL LOGS & CARE (XÁC THỰC CUỘC GỌI)
    %% ==========================================
    customers ||--o{ call_logs : "lịch sử cuộc gọi"
    profiles ||--o{ call_logs : "nhân viên gọi"
    customers ||--o{ appointments : "lịch hẹn tư vấn"
    customers ||--o{ activity_logs : "nhật ký hoạt động"

    call_logs {
        uuid id PK
        uuid customer_id FK
        uuid agent_id FK
        varchar phone_called
        varchar call_result
        int duration_seconds
        text call_summary
        timestamptz recall_at
    }

    appointments {
        uuid id PK
        uuid customer_id FK
        uuid student_id FK
        uuid course_id FK
        uuid assigned_to FK
        timestamptz appointment_time
        varchar status
    }

    activity_logs {
        uuid id PK
        uuid customer_id FK
        uuid actor_id FK
        varchar actor_type
        varchar activity_type
        text description
    }

    %% ==========================================
    %% AI TRAINING & RAG
    %% ==========================================
    ai_knowledge ||--o{ ai_knowledge_chunks : "phân mảnh chunks"
    profiles ||--o{ ai_knowledge : "người duyệt kiến thức"

    ai_knowledge {
        uuid id PK
        varchar title
        varchar category
        text content_raw
        varchar version
        boolean is_approved
        uuid approved_by FK
    }

    ai_knowledge_chunks {
        uuid id PK
        uuid knowledge_id FK
        text chunk_text
        vector embedding
    }

    ai_personas {
        uuid id PK
        varchar name
        text role_description
        varchar tone_of_voice
        varchar addressing_style
        text system_prompt
        boolean is_active
    }

    ai_scenarios {
        uuid id PK
        varchar code UK
        varchar title
        jsonb trigger_conditions
        jsonb guided_steps
        text handoff_trigger
        boolean is_active
    }

    ai_evaluations {
        uuid id PK
        uuid session_id
        int score_natural_dialogue
        int score_need_discovery
        int score_knowledge_accuracy
        int score_objection_handling
        int score_closing_and_handoff
        int total_score
        boolean has_critical_error
        uuid evaluated_by FK
    }
```

---

## 2. NGUYÊN TẮC QUAN HỆ CỐT LÕI

### 2.1. Quan hệ Khách hàng – Học viên (1 Phụ huynh có Nhiều con)
- Trong mô hình tuyển sinh của T.A Academy (đặc biệt khóa **Model Kids** và **Phong thái nhí**), người liên hệ và thanh toán là **Phụ huynh (Bố/Mẹ)**, nhưng người học là các **Học viên (Bé)**.
- Một phụ huynh có thể đăng ký cho 2–3 con học cùng lúc hoặc học nhiều khóa khác nhau (**Model Kids**, **Catwalk**, **Thuyết trình**).
- Do đó, bảng `customers` đại diện cho Phụ huynh và bảng `students` đại diện cho các bé, liên kết qua khóa ngoại `students.parent_id -> customers.id` (`ON DELETE CASCADE`).

### 2.2. Kiểm soát chặt chẽ Cuộc gọi và Danh sách Khách chưa gọi
- Một khách hàng xuất hiện trong danh sách **Khách chưa gọi** nếu và chỉ nếu:
  - Có số điện thoại (`customers.phone IS NOT NULL`).
  - Chưa tồn tại bản ghi cuộc gọi hợp lệ nào trong bảng `call_logs` được xác nhận bởi nhân viên (`NOT EXISTS (SELECT 1 FROM call_logs WHERE customer_id = customers.id)`).
- Việc bấm số điện thoại, mở xem tin nhắn hoặc xem hồ sơ **không làm thay đổi** trạng thái khách chưa gọi. Chỉ khi nhân viên gửi form xác nhận cuộc gọi (kết quả, thời lượng, ghi chú tóm tắt) và ghi vào `call_logs`, trigger database mới cập nhật `customers.call_status` và loại khách ra khỏi hàng đợi ưu tiên.

### 2.3. Khóa hội thoại và Phân quyền Điều khiển AI (Concurrency Lock)
- Bảng `conversations` có 2 trường quan trọng:
  - `ai_mode`: `ai_auto` (AI tự động trả lời), `human_takeover` (Nhân viên tiếp quản hoàn toàn), `ai_copilot` (AI chỉ gợi ý nháp nội bộ cho nhân viên), `closed` (Đóng hội thoại).
  - `is_ai_reply_allowed`: Cờ boolean kiểm tra ở cấp backend database.
- Khi nhân viên click **Tiếp quản hội thoại**, backend thực thi cập nhật:
  ```sql
  UPDATE conversations 
  SET ai_mode = 'human_takeover', 
      is_ai_reply_allowed = false, 
      human_assigned_to = auth.uid(), 
      takeover_at = now() 
  WHERE id = $conversation_id;
  ```
- Mọi background worker hoặc API AI đang sinh phản hồi khi phát hiện `is_ai_reply_allowed = false` sẽ ngay lập tức hủy gửi tin ra kênh Fanpage/Zalo.
