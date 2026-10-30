# ĐẶC TẢ LƯỢC ĐỒ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA SPECIFICATION)
**Hệ thống CRM & AI Tuyển sinh T.A Academy**
*Tài liệu kỹ thuật phiên bản 1.0.0 – Hệ quản trị: PostgreSQL 15+ (Supabase)*

---

## 1. NGUYÊN TẮC THIẾT KẾ DỮ LIỆU

1. **Khóa chính**: 100% bảng sử dụng kiểu `UUID` với giá trị mặc định `gen_random_uuid()` để chống suy đoán ID và hỗ trợ phân tán.
2. **Khóa ngoại & Toàn vẹn tham chiếu**: Mọi liên kết đều có ràng buộc `FOREIGN KEY` với hành vi rõ ràng (`ON DELETE RESTRICT` cho dữ liệu nghiệp vụ quan trọng, `ON DELETE CASCADE` cho các bảng phụ thuộc trực tiếp).
3. **Audit Trails**: Mọi bảng đều có `created_at TIMESTAMPTZ DEFAULT now()` và `updated_at TIMESTAMPTZ DEFAULT now()`. Có trigger tự động cập nhật `updated_at`.
4. **Xóa mềm (Soft Delete)**: Các bảng thực thể chính (`customers`, `students`, `courses`, `workflows`) có trường `deleted_at TIMESTAMPTZ NULL`.
5. **Đánh chỉ mục (Indexing)**: Thiết lập B-Tree index cho các trường lọc (`status`, `assigned_to`, `created_at`, `phone`), Hash/B-Tree index cho khóa ngoại, và HNSW/IVFFlat index cho trường vector embeddings (`pgvector`).
6. **Bảo mật dữ liệu cấp dòng (Row Level Security - RLS)**: Kích hoạt `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` trên tất cả các bảng.

---

## 2. DANH MỤC CÁC BẢNG & ĐẶC TẢ DDL CHI TIẾT

### 2.1. Phân hệ Người dùng & Phân quyền (Users & RBAC)

#### Bảng `roles` (Vai trò)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | VARCHAR(32) | PRIMARY KEY | Mã vai trò (`admin`, `manager`, `team_lead`, `consultant`, `teacher`) |
| `name` | VARCHAR(100) | NOT NULL | Tên hiển thị (Quản trị hệ thống, Quản lý học viện, ...) |
| `description` | TEXT | NULL | Mô tả quyền hạn của vai trò |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm tạo |

#### Bảng `permissions` (Danh mục quyền hạn chi tiết)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | VARCHAR(64) | PRIMARY KEY | Mã quyền (vd: `lead:view_all`, `lead:call_create`, `ai:approve`) |
| `module` | VARCHAR(50) | NOT NULL | Nhóm chức năng (`leads`, `inbox`, `ai`, `reports`, `settings`) |
| `name` | VARCHAR(100) | NOT NULL | Tên quyền thân thiện |
| `description` | TEXT | NULL | Mô tả chi tiết |

#### Bảng `role_permissions` (Bảng trung gian Vai trò - Quyền)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `role_id` | VARCHAR(32) | REFERENCES roles(id) ON DELETE CASCADE | Mã vai trò |
| `permission_id` | VARCHAR(64) | REFERENCES permissions(id) ON DELETE CASCADE | Mã quyền |
| PRIMARY KEY (`role_id`, `permission_id`) |

#### Bảng `profiles` (Hồ sơ người dùng liên kết Supabase Auth)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE | ID người dùng |
| `email` | VARCHAR(255) | UNIQUE NOT NULL | Email đăng nhập |
| `full_name` | VARCHAR(150) | NOT NULL | Họ và tên nhân viên |
| `phone` | VARCHAR(20) | NULL | Số điện thoại nội bộ |
| `avatar_url` | TEXT | NULL | Ảnh đại diện |
| `role_id` | VARCHAR(32) | NOT NULL REFERENCES roles(id) ON DELETE RESTRICT | Vai trò |
| `team_id` | UUID | NULL | Nhóm tuyển sinh phụ trách (nếu có) |
| `is_active` | BOOLEAN | NOT NULL DEFAULT true | Trạng thái hoạt động |
| `last_sign_in_at` | TIMESTAMPTZ | NULL | Lần đăng nhập cuối |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm cập nhật |

---

### 2.2. Phân hệ Khách hàng & Học viên (Customers & Students)

#### Bảng `courses` (Danh mục khóa học T.A Academy)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã khóa học |
| `code` | VARCHAR(50) | UNIQUE NOT NULL | Mã hiệu (vd: `CATWALK-PRO`, `MODEL-KIDS-01`, `PHONG-THAI-01`) |
| `title` | VARCHAR(255) | NOT NULL | Tên khóa học |
| `category` | VARCHAR(50) | NOT NULL | Phân loại (`phong_thai`, `catwalk`, `model_kids`, `giao_tiep`) |
| `target_audience`| TEXT | NOT NULL | Đối tượng học viên phù hợp |
| `min_age` | INT | NULL | Độ tuổi tối thiểu |
| `max_age` | INT | NULL | Độ tuổi tối đa |
| `duration_weeks` | INT | NOT NULL | Thời lượng khóa học (tuần) |
| `total_sessions` | INT | NOT NULL | Tổng số buổi học |
| `tuition_fee` | NUMERIC(12, 2) | NOT NULL | Học phí niêm yết chính thức (VNĐ) |
| `discount_policy`| TEXT | NULL | Chính sách ưu đãi chuẩn |
| `is_active` | BOOLEAN | NOT NULL DEFAULT true | Đang tuyển sinh |
| `deleted_at` | TIMESTAMPTZ | NULL | Đánh dấu xóa mềm |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm cập nhật |

#### Bảng `customers` (Thông tin Phụ huynh / Khách hàng liên hệ)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã định danh khách hàng |
| `customer_code` | VARCHAR(30) | UNIQUE NOT NULL | Mã khách hàng (vd: `TA-2026-0001`) |
| `full_name` | VARCHAR(150) | NOT NULL | Họ tên phụ huynh / khách hàng |
| `phone` | VARCHAR(20) | NULL | Số điện thoại liên hệ chính |
| `secondary_phone`| VARCHAR(20) | NULL | Số điện thoại dự phòng |
| `email` | VARCHAR(255) | NULL | Địa chỉ email |
| `address` | TEXT | NULL | Địa chỉ cư trú / khu vực (Quận/Huyện/Tỉnh) |
| `source` | VARCHAR(50) | NOT NULL DEFAULT 'facebook' | Nguồn tiếp nhận (`facebook`, `zalo`, `hotline`, `referral`, `website`) |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'new' | Trạng thái tuyển sinh: `new`, `uncalled`, `called_unreachable`, `contacted`, `consulting`, `trial_scheduled`, `considering`, `enrolling`, `registered`, `lost` |
| `call_status` | VARCHAR(30) | NOT NULL DEFAULT 'pending' | Trạng thái cuộc gọi: `pending` (chưa gọi), `unreachable`, `contacted`, `need_recall` |
| `first_phone_received_at` | TIMESTAMPTZ | NULL | Thời điểm tiếp nhận số điện thoại |
| `last_called_at` | TIMESTAMPTZ | NULL | Thời điểm thực hiện cuộc gọi gần nhất |
| `sla_alert_level` | VARCHAR(20) | NOT NULL DEFAULT 'none' | Mức độ cảnh báo SLA: `none`, `warning_15m`, `danger_60m` |
| `assigned_to` | UUID | NULL REFERENCES profiles(id) ON DELETE SET NULL | Nhân viên tư vấn phụ trách |
| `interested_course_id` | UUID | NULL REFERENCES courses(id) ON DELETE SET NULL | Khóa học khách đang quan tâm chính |
| `notes` | TEXT | NULL | Ghi chú nhu cầu, mục tiêu học tập |
| `deleted_at` | TIMESTAMPTZ | NULL | Đánh dấu xóa mềm |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm cập nhật |

#### Bảng `students` (Thông tin Học viên - Quan hệ 1 Phụ huynh có Nhiều Học viên)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã định danh học viên |
| `parent_id` | UUID | NOT NULL REFERENCES customers(id) ON DELETE CASCADE | Khóa ngoại trỏ về Phụ huynh |
| `full_name` | VARCHAR(150) | NOT NULL | Họ tên học viên |
| `dob` | DATE | NULL | Ngày tháng năm sinh |
| `gender` | VARCHAR(10) | NULL | Giới tính (`male`, `female`, `other`) |
| `current_school`| VARCHAR(255) | NULL | Trường lớp đang theo học |
| `hobby_and_traits` | TEXT | NULL | Sở thích, tính cách (vd: nhút nhát, yêu thích thời trang) |
| `special_notes` | TEXT | NULL | Lưu ý sức khỏe, lịch trình |
| `deleted_at` | TIMESTAMPTZ | NULL | Xóa mềm |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm cập nhật |

#### Bảng `enrollments` (Lịch sử Đăng ký / Ghi danh khóa học)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã bản ghi đăng ký |
| `student_id` | UUID | NOT NULL REFERENCES students(id) ON DELETE RESTRICT | Mã học viên |
| `course_id` | UUID | NOT NULL REFERENCES courses(id) ON DELETE RESTRICT | Mã khóa học |
| `registered_by` | UUID | NULL REFERENCES profiles(id) ON DELETE SET NULL | Nhân viên chốt đơn |
| `enrollment_date` | DATE | NOT NULL DEFAULT CURRENT_DATE | Ngày đăng ký |
| `fee_agreed` | NUMERIC(12, 2) | NOT NULL | Học phí thực tế chốt |
| `payment_status` | VARCHAR(30) | NOT NULL DEFAULT 'unpaid' | `unpaid`, `partially_paid`, `fully_paid`, `refunded` |
| `paid_amount` | NUMERIC(12, 2) | NOT NULL DEFAULT 0 | Số tiền đã thanh toán |
| `payment_notes` | TEXT | NULL | Ghi chú giao dịch chuyển khoản |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm cập nhật |

#### Bảng `tags` và `customer_tags`
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `tags.id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã thẻ nhãn |
| `tags.name` | VARCHAR(50) | UNIQUE NOT NULL | Tên nhãn (vd: `VIP`, `Khách khó tính`, `Hẹn học thử T7`) |
| `tags.color` | VARCHAR(20) | NOT NULL DEFAULT '#8B1D2C' | Mã màu HEX hiển thị nhãn |
| `customer_tags.customer_id` | UUID | REFERENCES customers(id) ON DELETE CASCADE | Khách hàng |
| `customer_tags.tag_id` | UUID | REFERENCES tags(id) ON DELETE CASCADE | Thẻ nhãn |

---

### 2.3. Phân hệ Hộp thư Tư vấn Đa kênh (Omnichannel Conversations)

#### Bảng `channels` và `channel_accounts` (Kênh và Tài khoản Fanpage/Zalo)
| Bảng | Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|---|
| `channels` | `id` | VARCHAR(30) | PRIMARY KEY | Mã loại kênh (`facebook`, `zalo`, `website`) |
| `channels` | `name` | VARCHAR(100) | NOT NULL | Tên kênh |
| `channel_accounts` | `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã tài khoản kết nối |
| `channel_accounts` | `channel_id` | VARCHAR(30) | REFERENCES channels(id) | Kênh kết nối |
| `channel_accounts` | `external_account_id` | VARCHAR(100) | NOT NULL | Page ID (Facebook) / OA ID (Zalo) |
| `channel_accounts` | `name` | VARCHAR(255) | NOT NULL | Tên Fanpage / Zalo OA hiển thị |
| `channel_accounts` | `access_token` | TEXT | NOT NULL | Token API được mã hóa bảo mật |
| `channel_accounts` | `webhook_verify_token`| VARCHAR(100) | NULL | Verify token cho Meta Webhook |
| `channel_accounts` | `is_active` | BOOLEAN | NOT NULL DEFAULT true | Trạng thái hoạt động |
| `channel_accounts` | `last_sync_at` | TIMESTAMPTZ | NULL | Thời điểm đồng bộ gần nhất |

#### Bảng `conversations` (Cuộc hội thoại)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã cuộc hội thoại |
| `channel_account_id` | UUID | NOT NULL REFERENCES channel_accounts(id) ON DELETE RESTRICT | Fanpage hoặc OA tiếp nhận |
| `customer_id` | UUID | NULL REFERENCES customers(id) ON DELETE SET NULL | Khách hàng liên kết |
| `external_thread_id` | VARCHAR(150) | NOT NULL | Thread ID trên Facebook / Zalo |
| `sender_external_id` | VARCHAR(150) | NOT NULL | PSID (Facebook) hoặc User ID (Zalo) |
| `sender_name` | VARCHAR(150) | NOT NULL | Tên người gửi trên mạng xã hội |
| `sender_avatar_url` | TEXT | NULL | Avatar người gửi |
| `last_message_content`| TEXT | NULL | Bản xem trước tin nhắn cuối |
| `last_message_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm tin nhắn cuối |
| `unread_count` | INT | NOT NULL DEFAULT 0 | Số tin chưa đọc bởi nhân viên |
| `ai_mode` | VARCHAR(30) | NOT NULL DEFAULT 'ai_auto' | Chế độ AI: `ai_auto`, `human_takeover`, `ai_copilot`, `closed` |
| `human_assigned_to` | UUID | NULL REFERENCES profiles(id) ON DELETE SET NULL | Nhân viên đang tiếp quản |
| `takeover_at` | TIMESTAMPTZ | NULL | Thời điểm nhân viên bấm tiếp quản |
| `is_ai_reply_allowed`| BOOLEAN | NOT NULL DEFAULT true | Cờ kiểm soát backend: cho phép AI gửi tự động |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm bắt đầu |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm cập nhật |

#### Bảng `messages` (Chi tiết tin nhắn trong hội thoại)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã tin nhắn |
| `conversation_id` | UUID | NOT NULL REFERENCES conversations(id) ON DELETE CASCADE | Hội thoại trực thuộc |
| `external_message_id`| VARCHAR(150) | UNIQUE NULL | Message ID từ Meta/Zalo (Chống trùng lặp) |
| `sender_type` | VARCHAR(20) | NOT NULL | Người gửi: `customer`, `ai`, `human_agent`, `system` |
| `sender_id` | UUID | NULL REFERENCES profiles(id) ON DELETE SET NULL | ID nhân viên nếu `sender_type = human_agent` |
| `content` | TEXT | NOT NULL | Nội dung tin nhắn văn bản |
| `media_urls` | JSONB | NOT NULL DEFAULT '[]' | Danh sách file đính kèm/ảnh/video |
| `is_internal_note` | BOOLEAN | NOT NULL DEFAULT false | Ghi chú nội bộ giữa nhân viên (khách không thấy) |
| `ai_suggested_reply` | TEXT | NULL | Câu trả lời AI gợi ý nội bộ khi ở chế độ `ai_copilot` |
| `metadata` | JSONB | NOT NULL DEFAULT '{}' | Thông tin đính kèm (tokens sử dụng, intent detect...) |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'sent' | `pending`, `sent`, `delivered`, `failed` |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm gửi |

#### Bảng `webhook_events` (Quản lý sự kiện Webhook và Chống trùng lặp)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã bản ghi |
| `channel` | VARCHAR(30) | NOT NULL | `facebook` hoặc `zalo` |
| `event_id` | VARCHAR(150) | UNIQUE NOT NULL | Idempotency Key (chống xử lý trùng lặp) |
| `payload` | JSONB | NOT NULL | Dữ liệu thô từ webhook |
| `processed` | BOOLEAN | NOT NULL DEFAULT false | Trạng thái xử lý |
| `error_log` | TEXT | NULL | Ghi nhận lỗi nếu xử lý thất bại |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm nhận |

---

### 2.4. Phân hệ Chăm sóc & Cuộc gọi (Care & Call Management)

#### Bảng `call_logs` (Nhật ký cuộc gọi xác thực – Chức năng ưu tiên cao)
> [!IMPORTANT]
> Chỉ khi bản ghi hợp lệ được tạo trong bảng `call_logs`, khách hàng mới được chuyển khỏi danh sách **Khách chưa gọi** trên Dashboard.
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã bản ghi cuộc gọi |
| `customer_id` | UUID | NOT NULL REFERENCES customers(id) ON DELETE CASCADE | Khách hàng được gọi |
| `agent_id` | UUID | NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT | Nhân viên thực hiện cuộc gọi |
| `phone_called` | VARCHAR(20) | NOT NULL | Số điện thoại được gọi |
| `call_result` | VARCHAR(50) | NOT NULL | Kết quả: `connected` (đã liên hệ), `unreachable` (không nghe máy), `busy` (máy bận), `wrong_number` (sai số), `recall_requested` (hẹn gọi lại) |
| `duration_seconds` | INT | NOT NULL DEFAULT 0 | Thời lượng cuộc gọi (giây) |
| `call_summary` | TEXT | NOT NULL | Tóm tắt nội dung trao đổi và phản hồi của phụ huynh |
| `recall_at` | TIMESTAMPTZ | NULL | Thời điểm hẹn gọi lại nếu có |
| `audio_recording_url` | TEXT | NULL | File ghi âm cuộc gọi (nếu tích hợp tổng đài ảo VoIP) |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm ghi nhận |

#### Bảng `appointments` (Lịch hẹn học thử & Tư vấn trực tiếp)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã lịch hẹn |
| `customer_id` | UUID | NOT NULL REFERENCES customers(id) ON DELETE CASCADE | Phụ huynh |
| `student_id` | UUID | NULL REFERENCES students(id) ON DELETE SET NULL | Học viên tham gia |
| `course_id` | UUID | NOT NULL REFERENCES courses(id) ON DELETE RESTRICT | Khóa học hẹn trải nghiệm |
| `assigned_to` | UUID | NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT | Nhân viên đón tiếp |
| `appointment_time` | TIMESTAMPTZ | NOT NULL | Thời gian hẹn |
| `status` | VARCHAR(30) | NOT NULL DEFAULT 'scheduled' | `scheduled`, `attended`, `no_show`, `cancelled` |
| `result_notes` | TEXT | NULL | Đánh giá sau buổi học thử |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm tạo |

#### Bảng `activity_logs` (Nhật ký mọi hoạt động trên hồ sơ)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã bản ghi hoạt động |
| `customer_id` | UUID | NOT NULL REFERENCES customers(id) ON DELETE CASCADE | Khách hàng liên quan |
| `actor_id` | UUID | NULL REFERENCES profiles(id) ON DELETE SET NULL | Người thực hiện (NULL nếu là AI/Hệ thống) |
| `actor_type` | VARCHAR(20) | NOT NULL | `human`, `ai`, `system` |
| `activity_type` | VARCHAR(50) | NOT NULL | `call_logged`, `message_sent`, `status_changed`, `ai_takeover`, `note_added` |
| `description` | TEXT | NOT NULL | Diễn giải chi tiết hoạt động |
| `metadata` | JSONB | NOT NULL DEFAULT '{}' | Dữ liệu cũ/mới (old_val, new_val) |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm xảy ra |

---

### 2.5. Phân hệ Trung tâm Đào tạo AI (AI Center & RAG)

#### Bảng `ai_personas` (Nhân cách & Cấu hình Persona AI)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã cấu hình Persona |
| `name` | VARCHAR(100) | NOT NULL | Tên định danh (vd: Trợ lý Tuyển sinh An An) |
| `role_description` | TEXT | NOT NULL | Định nghĩa vai trò của AI |
| `tone_of_voice` | VARCHAR(100) | NOT NULL | Phong cách giao tiếp (Lịch thiệp, ân cần, quý phái, chuyên nghiệp) |
| `addressing_style` | VARCHAR(100) | NOT NULL | Cách xưng hô (Em - Chị/Anh, Em - Mẹ bé/Ba bé) |
| `system_prompt` | TEXT | NOT NULL | Prompt lõi kiểm soát hành vi và ranh giới nghiệp vụ |
| `max_response_tokens`| INT | NOT NULL DEFAULT 400 | Giới hạn độ dài câu trả lời |
| `temperature` | NUMERIC(3, 2) | NOT NULL DEFAULT 0.40 | Nhiệt độ sáng tạo (0.3-0.5 cho tư vấn chuẩn xác) |
| `is_active` | BOOLEAN | NOT NULL DEFAULT false | Phiên bản đang chạy production |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm cập nhật |

#### Bảng `ai_knowledge` và `ai_knowledge_chunks` (Kho kiến thức RAG)
| Bảng | Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|---|
| `ai_knowledge` | `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã tài liệu kiến thức |
| `ai_knowledge` | `title` | VARCHAR(255) | NOT NULL | Tiêu đề tài liệu |
| `ai_knowledge` | `category` | VARCHAR(50) | NOT NULL | `phong_thai`, `catwalk`, `model_kids`, `tuition`, `policy`, `faq` |
| `ai_knowledge` | `file_url` | TEXT | NULL | File gốc tải lên (PDF, DOCX, XLSX) |
| `ai_knowledge` | `content_raw` | TEXT | NOT NULL | Văn bản đầy đủ được trích xuất |
| `ai_knowledge` | `version` | VARCHAR(20) | NOT NULL DEFAULT '1.0' | Phiên bản tài liệu |
| `ai_knowledge` | `is_approved` | BOOLEAN | NOT NULL DEFAULT false | Chỉ tài liệu ĐÃ DUYỆT mới đưa vào RAG |
| `ai_knowledge` | `approved_by` | UUID | NULL REFERENCES profiles(id) | Quản trị viên phê duyệt |
| `ai_knowledge_chunks` | `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã đoạn trích kiến thức |
| `ai_knowledge_chunks` | `knowledge_id` | UUID | REFERENCES ai_knowledge(id) ON DELETE CASCADE | Tài liệu gốc |
| `ai_knowledge_chunks` | `chunk_text` | TEXT | NOT NULL | Nội dung đoạn trích ngắn (300-500 tokens) |
| `ai_knowledge_chunks` | `embedding` | VECTOR(1536) | NOT NULL | Vector nhúng (OpenAI text-embedding-3-small) |

#### Bảng `ai_scenarios` (Kịch bản tư vấn chuẩn)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã kịch bản |
| `code` | VARCHAR(50) | UNIQUE NOT NULL | Mã hiệu (`NEW_LEAD`, `ASK_TUITION`, `HIGH_PRICE_OBJECTION`, `HANDOFF_HUMAN`) |
| `title` | VARCHAR(255) | NOT NULL | Tên kịch bản |
| `trigger_conditions`| JSONB | NOT NULL | Điều kiện kích hoạt (từ khóa, intent, bối cảnh) |
| `guided_steps` | JSONB | NOT NULL | Các bước dẫn dắt tư vấn |
| `handoff_trigger` | TEXT | NOT NULL | Tiêu chuẩn bắt buộc phải bàn giao cho nhân viên thật |
| `is_active` | BOOLEAN | NOT NULL DEFAULT true | Trạng thái kích hoạt |

#### Bảng `ai_training_examples` (Thư viện tình huống & Đào tạo từ thực tế)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã tình huống ví dụ |
| `situation_title` | VARCHAR(255) | NOT NULL | Tên tình huống (vd: Khách chê học phí cao, Bé nhút nhát sợ không theo được) |
| `customer_query` | TEXT | NOT NULL | Câu hỏi/thắc mắc của phụ huynh |
| `ideal_response` | TEXT | NOT NULL | Câu trả lời chuẩn mẫu đã được phê duyệt |
| `explanation` | TEXT | NULL | Phân tích tâm lý và nguyên tắc tư vấn |
| `mistakes_to_avoid`| TEXT | NULL | Những điều tối kỵ không được nói |
| `is_approved` | BOOLEAN | NOT NULL DEFAULT false | Trạng thái phê duyệt vào bộ quy tắc AI |

#### Bảng `ai_evaluations` (Đánh giá năng lực AI – Thang điểm 100)
| Cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Mã bài chấm điểm |
| `session_id` | UUID | NOT NULL | Phiên thực hành hoặc hội thoại thực tế |
| `score_natural_dialogue` | INT | NOT NULL CHECK (score_natural_dialogue BETWEEN 0 AND 20) | Giao tiếp tự nhiên (tối đa 20) |
| `score_need_discovery` | INT | NOT NULL CHECK (score_need_discovery BETWEEN 0 AND 20) | Khai thác nhu cầu (tối đa 20) |
| `score_knowledge_accuracy` | INT | NOT NULL CHECK (score_knowledge_accuracy BETWEEN 0 AND 20) | Độ chính xác kiến thức (tối đa 20) |
| `score_objection_handling` | INT | NOT NULL CHECK (score_objection_handling BETWEEN 0 AND 20) | Xử lý từ chối (tối đa 20) |
| `score_closing_and_handoff`| INT | NOT NULL CHECK (score_closing_and_handoff BETWEEN 0 AND 20) | Dẫn dắt tư vấn & Chốt lịch (tối đa 20) |
| `total_score` | INT | NOT NULL | Tổng điểm (0-100) |
| `has_critical_error` | BOOLEAN | NOT NULL DEFAULT false | Lỗi nghiêm trọng (Bịa giá, sai chính sách) -> Đánh rớt ngay |
| `evaluator_notes` | TEXT | NULL | Nhận xét chi tiết |
| `evaluated_by` | UUID | NOT NULL REFERENCES profiles(id) | Quản trị viên đánh giá |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Thời điểm chấm |

---

### 2.6. Phân hệ Quy trình & Automation (Workflows)

#### Bảng `workflows`, `workflow_steps`, `workflow_executions`
- `workflows`: Quản lý các luồng tự động (Tiếp nhận lead, Cảnh báo chưa gọi sau 15m/60m, Phân công xoay vòng nhân viên, Bàn giao AI sang Người).
- `workflow_steps`: Định nghĩa các node: `Trigger`, `Condition`, `Action`, `Wait`, `Notify`.
- `workflow_executions`: Lưu vết nhật ký chạy workflow, thời gian thực thi, input payload, kết quả, mã lỗi và retry count.

---

### 2.7. Phân hệ Cài đặt Hệ thống & Bảo mật (Settings & Audit Logs)

#### Bảng `system_settings`
Lưu trữ cấu hình toàn hệ thống dưới dạng key-value JSONB:
- `sla_uncalled_warning_minutes`: 15
- `sla_uncalled_danger_minutes`: 60
- `active_ai_provider`: "gemini" hoặc "openai"
- `active_ai_model`: "gemini-1.5-flash" hoặc "gpt-4o-mini"
- `auto_distribution_rule`: "round_robin" hoặc "least_busy"

#### Bảng `audit_logs` (Nhật ký truy vết bảo mật)
Ghi nhận toàn bộ thao tác nhạy cảm: Đăng nhập, Xuất dữ liệu, Phê duyệt tài liệu AI, Thay đổi học phí, Thay đổi phân quyền, Can thiệp hội thoại.
