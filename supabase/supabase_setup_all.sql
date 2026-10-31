-- ==============================================================================
-- T.A ACADEMY CRM - SUPABASE ALL-IN-ONE SETUP SCRIPT
-- Copy và dán toàn bộ đoạn mã này vào Supabase -> SQL Editor -> Nhấn RUN
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG ROLES & PERMISSIONS
CREATE TABLE IF NOT EXISTS public.roles (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id VARCHAR(64) PRIMARY KEY,
    module VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id VARCHAR(32) REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(64) REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 2. BẢNG PROFILES (NGƯỜI DÙNG / TƯ VẤN VIÊN)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role_id VARCHAR(32) NOT NULL DEFAULT 'telesale',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. BẢNG COURSES (DANH MỤC KHÓA HỌC CHUẨN)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    tuition_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_sessions INT NOT NULL DEFAULT 12,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. BẢNG CUSTOMERS / LEADS (KHÁCH HÀNG TƯ VẤN TỪ FANPAGE/ZALO)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code VARCHAR(50),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    source VARCHAR(50) NOT NULL DEFAULT 'facebook',
    status VARCHAR(50) NOT NULL DEFAULT 'consulting',
    call_status VARCHAR(30) NOT NULL DEFAULT 'uncalled',
    course_ref VARCHAR(50) DEFAULT 'model_kids',
    ai_extracted_need TEXT,
    dob VARCHAR(100),
    elearning_status VARCHAR(50) DEFAULT 'not_enrolled',
    elearning_class TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. BẢNG CENTER_STUDENTS (HỌC VIÊN TRUNG TÂM CHUẨN E-LEARNING: TA - STD - 001)
CREATE TABLE IF NOT EXISTS public.center_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_code VARCHAR(50) UNIQUE NOT NULL, -- Ví dụ: TA - STD - 001
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dob VARCHAR(50),
    course_code VARCHAR(50) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    sessions INT NOT NULL DEFAULT 12,
    display_course VARCHAR(150) NOT NULL,
    elearning_status VARCHAR(50) DEFAULT 'synced',
    elearning_class VARCHAR(150),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. BẢNG HỘI THOẠI & TIN NHẮN (CHATS)
CREATE TABLE IF NOT EXISTS public.conversations (
    id VARCHAR(150) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    avatar VARCHAR(10),
    channel VARCHAR(30) NOT NULL DEFAULT 'facebook',
    last_message TEXT,
    time VARCHAR(50),
    unread INT NOT NULL DEFAULT 0,
    ai_mode VARCHAR(30) NOT NULL DEFAULT 'ai_auto',
    agent_name VARCHAR(100),
    phone VARCHAR(20),
    phone_auto_extracted BOOLEAN DEFAULT false,
    course VARCHAR(150),
    course_category VARCHAR(50),
    status VARCHAR(50) DEFAULT 'consulting',
    ai_extracted_need TEXT,
    elearning_status VARCHAR(50) DEFAULT 'not_enrolled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id VARCHAR(150) PRIMARY KEY,
    conversation_id VARCHAR(150) NOT NULL,
    sender_type VARCHAR(30) NOT NULL, -- 'customer', 'ai', 'human_agent'
    sender_name VARCHAR(150),
    content TEXT NOT NULL,
    is_internal_note BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(30) NOT NULL DEFAULT 'delivered',
    created_at VARCHAR(50) NOT NULL
);

-- 7. BẢNG TRUNG TÂM ĐÀO TẠO AI (KHO KIẾN THỨC, KỊCH BẢN, TÌNH HUỐNG)
CREATE TABLE IF NOT EXISTS public.ai_knowledge (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    content_summary TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT true,
    approved_by VARCHAR(150),
    chunks_count INT NOT NULL DEFAULT 10,
    updated_at VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ai_scenarios (
    code VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course VARCHAR(150) NOT NULL,
    goal TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Đang hoạt động',
    steps JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_situations (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    ideal_response TEXT NOT NULL,
    mistake_avoid TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- KHỞI TẠO CÁC ROLE CƠ BẢN
INSERT INTO public.roles (id, name, description) VALUES
('admin', 'Quản Trị Viên', 'Toàn quyền điều hành học viện và cấu hình AI'),
('manager', 'Trưởng Phòng Tuyển Sinh', 'Quản lý Telesale và duyệt học viên'),
('telesale', 'Chuyên Viên Tư Vấn', 'Tiếp nhận cuộc gọi và chăm sóc phụ huynh')
ON CONFLICT (id) DO NOTHING;
