-- ==============================================================================
-- T.A ACADEMY CRM - MIGRATION 01: INITIAL SCHEMA
-- PostgreSQL 15+ / Supabase
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

-- 2. BẢNG PROFILES (NGƯỜI DÙNG)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role_id VARCHAR(32) NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    team_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_sign_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. BẢNG COURSES (KHÓA HỌC CHUẨN)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'phong_thai', 'catwalk', 'model_kids', 'giao_tiep'
    target_audience TEXT NOT NULL,
    min_age INT,
    max_age INT,
    duration_weeks INT NOT NULL,
    total_sessions INT NOT NULL,
    tuition_fee NUMERIC(12, 2) NOT NULL,
    discount_policy TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. BẢNG CUSTOMERS (PHỤ HUYNH / KHÁCH HÀNG)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    secondary_phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    source VARCHAR(50) NOT NULL DEFAULT 'facebook',
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    call_status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'unreachable', 'contacted', 'need_recall'
    first_phone_received_at TIMESTAMPTZ,
    last_called_at TIMESTAMPTZ,
    sla_alert_level VARCHAR(20) NOT NULL DEFAULT 'none', -- 'none', 'warning_15m', 'danger_60m'
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    interested_course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    notes TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. BẢNG STUDENTS (HỌC VIÊN - 1 PHỤ HUYNH NHIỀU CON)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    dob DATE,
    gender VARCHAR(10),
    current_school VARCHAR(255),
    hobby_and_traits TEXT,
    special_notes TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. BẢNG CALL_LOGS (XÁC THỰC CUỘC GỌI HỢP LỆ)
CREATE TABLE IF NOT EXISTS public.call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    phone_called VARCHAR(20) NOT NULL,
    call_result VARCHAR(50) NOT NULL,
    duration_seconds INT NOT NULL DEFAULT 0,
    call_summary TEXT NOT NULL,
    recall_at TIMESTAMPTZ,
    audio_recording_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. BẢNG CONVERSATIONS & MESSAGES (ĐA KÊNH)
CREATE TABLE IF NOT EXISTS public.channel_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id VARCHAR(30) NOT NULL, -- 'facebook', 'zalo'
    external_account_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    webhook_verify_token VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_account_id UUID NOT NULL REFERENCES public.channel_accounts(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    external_thread_id VARCHAR(150) NOT NULL,
    sender_external_id VARCHAR(150) NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    sender_avatar_url TEXT,
    last_message_content TEXT,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unread_count INT NOT NULL DEFAULT 0,
    ai_mode VARCHAR(30) NOT NULL DEFAULT 'ai_auto', -- 'ai_auto', 'human_takeover', 'ai_copilot', 'closed'
    human_assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    takeover_at TIMESTAMPTZ,
    is_ai_reply_allowed BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    external_message_id VARCHAR(150) UNIQUE,
    sender_type VARCHAR(20) NOT NULL, -- 'customer', 'ai', 'human_agent', 'system'
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    media_urls JSONB NOT NULL DEFAULT '[]',
    is_internal_note BOOLEAN NOT NULL DEFAULT false,
    ai_suggested_reply TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'sent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CHỐNG TRÙNG LẶP WEBHOOK (IDEMPOTENCY KEY)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel VARCHAR(30) NOT NULL,
    event_id VARCHAR(150) UNIQUE NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES CHO TRA CỨU HIỆU NĂNG CAO
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_uncalled ON public.customers(call_status, first_phone_received_at);
CREATE INDEX IF NOT EXISTS idx_conversations_mode ON public.conversations(ai_mode, is_ai_reply_allowed);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
