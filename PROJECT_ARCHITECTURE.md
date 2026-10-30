# KIẾN TRÚC TỔNG THỂ DỰ ÁN CRM & AI TUYỂN SINH T.A ACADEMY
**T.A Academy CRM & AI Admission Consulting Platform**
*Tài liệu kỹ thuật phiên bản 1.0.0 – Ngày phê duyệt: 2026-10-30*

---

## 1. TỔNG QUAN HỆ THỐNG

Hệ thống **T.A Academy CRM & AI** là nền tảng quản trị tuyển sinh và chăm sóc khách hàng toàn diện, tập trung đa kênh (Facebook Fanpage, Zalo OA), tích hợp trí tuệ nhân tạo (AI Orchestrator với OpenAI / Google Gemini) nhằm tối ưu hóa quy trình tư vấn tuyển sinh cho các khóa đào tạo:
- **Phong thái** (Nữ hoàng phong thái, Phong thái doanh nhân, Phong thái quý cô)
- **Catwalk** (Catwalk chuyên nghiệp, Tự tin trình diễn)
- **Model Kids** (Mẫu nhí tài năng, Giải phóng hình thể, Tự tin ống kính)
- **Giao tiếp – Thuyết trình** (Nghệ thuật giao tiếp, Thuyết trình truyền cảm hứng)

Hệ thống được thiết kế theo chuẩn phần mềm cấp doanh nghiệp (Enterprise-grade), đáp ứng quy mô ban đầu từ 5–10 nhân viên tư vấn, 500–2.000+ khách hàng/học viên, sẵn sàng mở rộng đa Fanpage và chịu tải cao.

---

## 2. NGĂN XẾP CÔNG NGHỆ (TECH STACK)

### 2.1. Frontend & Client Layer
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org) – Server Components & Server Actions, React 19.
- **Ngôn ngữ**: TypeScript 5.x – Strict Type Safety.
- **Styling & UI Design System**: Tailwind CSS v4, Lucide React Icons, Radix UI Primitives.
- **Bộ nhận diện thương hiệu T.A Academy**:
  - *Màu chủ đạo (Primary)*: Đỏ rượu vang hoàng gia (Wine Red / Burgundy: `#8B1D2C`, `#721422`, gradient `#991B1B`).
  - *Màu điểm nhấn (Accent)*: Vàng champagne sang trọng (Champagne Gold: `#D4AF37`, `#C5A059`, `#F3E5AB`).
  - *Nền chính (Background)*: Trắng tinh khiết `#FFFFFF` và Xám ngọc trai dịu `#F8FAFC`.
  - *Màu trạng thái*: Xanh ngọc lục bảo (Success: `#10B981`), Vàng hổ phách (Warning: `#F59E0B`), Đỏ san hô (Danger: `#EF4444`).
- **Quản lý Client/Server State**: TanStack Query (React Query v5) kết hợp Zustand cho UI state cục bộ.
- **Form & Validation**: React Hook Form kết hợp Zod schema validation.
- **Realtime UI Sync**: Supabase Realtime Client (WebSockets) với cơ chế tự động reconnect và optimistic updates.

### 2.2. Backend & Server Layer
- **Runtime**: Next.js Serverless Route Handlers & Server Actions, Node.js v24 LTS.
- **API Architecture**: RESTful API endpoints chuẩn OpenAPI 3.0 kết hợp Next.js Server Actions cho internal mutations.
- **Security & Authorization**: Middleware bảo vệ route, Supabase RLS (Row Level Security), RBAC validation ở tầng API.
- **Webhook Handling**: Webhook Ingestion Engine chuyên dụng chống trùng lặp (Idempotency Key), xác thực HMAC SHA256 (Meta X-Hub-Signature-256, Zalo Signature).
- **Task Scheduling & Cron**: Supabase pg_cron kết hợp Vercel Cron Jobs cho các tác vụ kiểm tra SLA khách chưa gọi (15 phút / 60 phút) và báo cáo định kỳ.

### 2.3. Database & Storage Layer
- **Cơ sở dữ liệu**: PostgreSQL 15+ trên hạ tầng Supabase Cloud.
- **Bảo mật dữ liệu**: Row Level Security (RLS) bắt buộc cho 100% các bảng.
- **Vector Database**: Extension `pgvector` phục vụ lưu trữ vector embeddings cho tài liệu RAG trong Kho kiến thức AI.
- **Lưu trữ tệp (File Storage)**: Supabase Storage với Bucket phân quyền (avatars, attachments, ai-documents).
- **Xử lý toàn vẹn**: Database Triggers, Foreign Keys có ràng buộc cascade / restrict phù hợp, Indexes cho các trường tra cứu tần suất cao.

### 2.4. Trí tuệ nhân tạo (AI Engine)
- **AI Orchestrator**: Hỗ trợ linh hoạt OpenAI API (GPT-4o, GPT-4o-mini, text-embedding-3-small) và Google Gemini API (Gemini 1.5 Flash / 2.0 Flash) như trong giao diện điều khiển cấu hình thực tế.
- **Kỹ thuật AI**: Retrieval-Augmented Generation (RAG) kết hợp HyDE (Hypothetical Document Embeddings) và Semantic Re-ranking.
- **Kiểm soát nghiệp vụ**: Tách biệt rõ ràng Persona, System Prompt, Approved Knowledge Chunks, và Hard Guardrails (Quy tắc không bịa giá, không hứa hẹn ngoài thẩm quyền).
- **Cơ chế Khóa can thiệp (Human Takeover Concurrency Lock)**: Khi nhân viên bật tiếp quản, backend ngay lập tức thu hồi cờ `ai_can_reply`, hủy bỏ mọi tiến trình sinh câu trả lời đang chờ của AI.

---

## 3. KIẾN TRÚC PHÂN TẦNG (TIERED ARCHITECTURE)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / PRESENTATION LAYER                     │
│  Next.js 15 App Router | Responsive (Desktop, Tablet, Mobile)          │
│  ├── Dashboard (Thống kê, Hàng đợi khách chưa gọi SLA 15m/60m)         │
│  ├── Hộp thư tư vấn đa kênh (3 cột: Danh sách, Chat, Hồ sơ đồng bộ)    │
│  ├── Quản lý Khách hàng - Học viên (Quan hệ 1 Phụ huynh - Nhiều con)   │
│  ├── Trung tâm đào tạo AI (9 phân hệ: Persona, RAG, Scenarios, Eval)   │
│  ├── Quy trình tư vấn & Workflow Automation                            │
│  ├── Báo cáo phân tích tuyển sinh & KPI nhân viên/AI                   │
│  └── Cài đặt hệ thống (RBAC, Fanpage, Zalo OA, Khóa học, Audit Logs)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / WSS (Supabase Realtime)
┌───────────────────────────────────▼────────────────────────────────────┐
│                  SECURITY & ROUTING MIDDLEWARE LAYER                   │
│  - Session Validation (Supabase Auth JWT)                              │
│  - RBAC Role Inspection (Admin, Manager, TeamLead, Consultant, Teacher)│
│  - Rate Limiting (Upstash / In-memory sliding window)                  │
│  - Audit Logging Middleware                                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    BUSINESS LOGIC & APPLICATION LAYER                  │
│  ├── Omnichannel Service (Meta Graph API v21+, Zalo Official Account)  │
│  ├── Lead Lifecycle Service (Phân bổ leads, SLA 15/60 phút, Call logs) │
│  ├── AI Orchestration Service                                          │
│  │    ├── Intent Detector & Need Discovery Engine                      │
│  │    ├── Knowledge Retrieval Engine (pgvector RAG)                    │
│  │    ├── Scenario Runner & Objection Handler                          │
│  │    ├── Safety & Anti-Hallucination Guardrails                       │
│  │    └── Human Handoff Dispatcher & Concurrency Lock                  │
│  ├── Workflow Automation Engine (Trigger -> Condition -> Action)       │
│  └── Analytics & Reporting Aggregator                                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                     DATABASE & STORAGE LAYER (Supabase)                │
│  - PostgreSQL 15+ with Row Level Security (RLS)                        │
│  - pgvector (Vector Embeddings cho RAG)                                │
│  - Realtime Publications (conversations, messages, uncalled leads)     │
│  - Supabase Storage (Audio call logs, Chat media, Training documents)  │
│  - Database Triggers (Activity log generator, SLA timer tracking)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. CẤU TRÚC THƯ MỤC DỰ ÁN CHI TIẾT (PROJECT STRUCTURE)

```
d:\CRM NEW/
├── docs/                                  # Tài liệu kiến trúc & đặc tả kỹ thuật
│   ├── PROJECT_ARCHITECTURE.md            # Tài liệu này
│   ├── DATABASE_SCHEMA.md                 # Đặc tả lược đồ CSDL chi tiết
│   ├── DATABASE_ERD.md                    # Sơ đồ quan hệ thực thể (ERD) Mermaid
│   ├── API_SPECIFICATION.md               # Đặc tả toàn bộ API endpoints
│   ├── ROLE_PERMISSION_MATRIX.md          # Ma trận phân quyền RBAC
│   ├── AI_ARCHITECTURE.md                 # Kiến trúc AI Orchestrator & RAG
│   ├── IMPLEMENTATION_ROADMAP.md          # Lộ trình 9 giai đoạn triển khai
│   └── TESTING_PLAN.md                    # Kế hoạch kiểm thử & nghiệm thu
├── supabase/
│   ├── migrations/                        # Các file SQL migration tuần tự
│   │   ├── 20261030000001_initial_schema.sql
│   │   ├── 20261030000002_rbac_and_rls.sql
│   │   ├── 20261030000003_pgvector_and_ai.sql
│   │   └── 20261030000004_triggers_and_functions.sql
│   └── seed.sql                           # Dữ liệu ban đầu (Khóa học, Roles, System Settings)
├── src/
│   ├── app/                               # Next.js 15 App Router
│   │   ├── (auth)/                        # Nhóm giao diện xác thực
│   │   │   ├── login/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/                   # Nhóm giao diện chính CRM
│   │   │   ├── layout.tsx                 # Master layout (Sidebar Đỏ rượu vang, Topbar, Alerts)
│   │   │   ├── page.tsx                   # Màn hình Dashboard tổng quan & Hàng đợi chưa gọi
│   │   │   ├── inbox/                     # Hộp thư tư vấn đa kênh 3 cột
│   │   │   │   ├── page.tsx
│   │   │   │   └── [conversationId]/page.tsx
│   │   │   ├── customers/                 # Quản lý Khách hàng - Phụ huynh - Học viên
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx          # Hồ sơ chi tiết 6 khu vực
│   │   │   ├── ai-training/               # Trung tâm đào tạo AI (9 phân hệ)
│   │   │   │   ├── page.tsx               # Tổng quan AI
│   │   │   │   ├── config/page.tsx        # Cấu hình AI Fanpage & API Keys
│   │   │   │   ├── persona/page.tsx       # Nhân cách AI
│   │   │   │   ├── knowledge/page.tsx     # Kho kiến thức & RAG
│   │   │   │   ├── scenarios/page.tsx     # Kịch bản tư vấn
│   │   │   │   ├── situations/page.tsx    # Thư viện tình huống
│   │   │   │   ├── conversation-training/ # Đào tạo từ hội thoại thực tế
│   │   │   │   ├── playground/page.tsx    # Phòng thực hành AI
│   │   │   │   ├── evaluation/page.tsx    # Đánh giá năng lực AI (Thang điểm 100)
│   │   │   │   └── versions/page.tsx      # Quản lý phiên bản AI
│   │   │   ├── workflows/                 # Quy trình tư vấn & Automation
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx          # Workflow visual builder
│   │   │   │   └── logs/page.tsx          # Lịch sử thực thi workflow
│   │   │   ├── reports/                   # Báo cáo thống kê
│   │   │   │   ├── page.tsx               # Báo cáo tổng thể
│   │   │   │   ├── staff/page.tsx         # Báo cáo hiệu quả nhân viên
│   │   │   │   └── ai/page.tsx            # Báo cáo hiệu quả tư vấn AI
│   │   │   └── settings/                  # Cài đặt hệ thống
│   │   │       ├── page.tsx
│   │   │       ├── users/page.tsx         # Quản lý tài khoản & phân quyền
│   │   │       ├── channels/page.tsx      # Kết nối Facebook & Zalo
│   │   │       ├── courses/page.tsx       # Danh mục khóa học (Chuẩn kiến thức AI)
│   │   │       └── audit-logs/page.tsx    # Nhật ký truy vết bảo mật
│   │   └── api/                           # API Route Handlers
│   │       ├── webhooks/
│   │       │   ├── meta/route.ts          # Meta Graph API Messenger Webhook
│   │       │   └── zalo/route.ts          # Zalo OA Webhook
│   │       ├── ai/
│   │       │   ├── chat/route.ts          # AI response generation
│   │       │   ├── test-run/route.ts      # Chạy thử nghiệm trong Playground
│   │       │   └── evaluate/route.ts      # Chấm điểm tự động
│   │       ├── calls/
│   │       │   └── log/route.ts           # Ghi nhận cuộc gọi hợp lệ
│   │       ├── conversations/
│   │       │   └── [id]/takeover/route.ts # Khóa can thiệp nhân viên
│   │       └── cron/
│   │           └── sla-check/route.ts     # Kiểm tra SLA khách chưa gọi
│   ├── components/                        # UI Components tái sử dụng
│   │   ├── ui/                            # Atomic primitives (Button, Modal, Input, Badge, Table...)
│   │   ├── layout/                        # Sidebar, Topbar, Breadcrumb, PageHeader
│   │   ├── dashboard/                     # MetricsCard, UncalledQueueTable, QuickReportChart
│   │   ├── inbox/                         # ConversationList, ChatWindow, CustomerProfileSidebar
│   │   ├── customers/                     # CustomerFilter, StudentModal, CallLogModal
│   │   ├── ai-training/                   # PersonaForm, DocumentUploader, ScenarioEditor, ScoreCard
│   │   └── workflows/                     # NodeCanvas, TriggerConfig, ActionConfig
│   ├── lib/                               # Core libraries & Utilities
│   │   ├── supabase/
│   │   │   ├── client.ts                  # Supabase browser client
│   │   │   ├── server.ts                  # Supabase server client (với cookie auth)
│   │   │   ├── admin.ts                   # Supabase service-role client (Backend-only)
│   │   │   └── middleware.ts              # Session refresher & Route protection
│   │   ├── ai/
│   │   │   ├── orchestrator.ts            # Trung tâm điều phối AI
│   │   │   ├── providers/                 # Adapters cho OpenAI & Gemini
│   │   │   ├── rag.ts                     # Vector search & Chunk retrieval
│   │   │   ├── guardrails.ts              # Bộ lọc chống sai giá & sai cam kết
│   │   │   └── evaluator.ts               # Chấm điểm 5 tiêu chí năng lực
│   │   ├── meta/                          # Facebook Graph API client & verify token
│   │   ├── zalo/                          # Zalo OA API client
│   │   ├── utils.ts                       # Formatters, Date helpers, Color tokens
│   │   └── constants.ts                   # SLA limits, Status enums, Course categories
│   ├── types/                             # TypeScript Type Definitions
│   │   ├── database.types.ts              # Auto-generated Supabase types
│   │   ├── crm.ts                         # Customer, Student, CallLog interfaces
│   │   ├── inbox.ts                       # Channel, Conversation, Message interfaces
│   │   ├── ai.ts                          # Persona, Scenario, Evaluation interfaces
│   │   └── workflow.ts                    # Workflow, Step, Execution interfaces
│   └── hooks/                             # Custom React Hooks
│       ├── useRealtimeQueue.ts            # Lắng nghe cập nhật hàng đợi khách chưa gọi
│       ├── useRealtimeChat.ts             # Lắng nghe tin nhắn mới & trạng thái khóa
│       └── useCurrentUser.ts              # Thông tin user & quyền truy cập hiện tại
├── public/                                # Static assets (Logos, Icons, Brand graphics)
├── .env.example                           # Mẫu biến môi trường bảo mật
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 5. NGUYÊN TẮC BẢO MẬT & VẬN HÀNH

1. **Tuyệt đối không lưu khóa bí mật ở Client**: `SUPABASE_SERVICE_ROLE_KEY`, `META_APP_SECRET`, `OPENAI_API_KEY`, `GEMINI_API_KEY` chỉ được lưu trong biến môi trường Server và truy cập qua Server Actions / Route Handlers.
2. **Xác thực đa tầng**: Mọi thao tác ghi dữ liệu nhạy cảm (Tạo hồ sơ, Ghi nhận cuộc gọi, Khóa hội thoại, Duyệt kiến thức AI) đều phải đi qua kiểm tra quyền (RBAC) ở Backend kết hợp Supabase RLS.
3. **Chống trùng lặp Webhook**: Mọi sự kiện từ Meta và Zalo phải lưu `message_id` hoặc `event_id` với chỉ mục `UNIQUE` trong bảng `webhook_events`. Sự kiện đến sau sẽ bị từ chối (Idempotent response) để ngăn chặn gửi tin lặp cho khách hàng.
4. **Sẵn sàng triển khai 3 môi trường tách biệt**:
   - `Development`: Local environment kết hợp Supabase local/dev project.
   - `Staging`: Vercel preview kết hợp Staging Supabase DB (dữ liệu mock kiểm thử tải).
   - `Production`: Vercel production deployment kết hợp Production Supabase DB (chỉ chứa dữ liệu thực của học viện T.A Academy).
