-- ==============================================================================
-- T.A ACADEMY CRM - MIGRATION 03: PGVECTOR & AI KNOWLEDGE RAG
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- 1. BẢNG PERSONA AI
CREATE TABLE IF NOT EXISTS public.ai_personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    role_description TEXT NOT NULL,
    tone_of_voice VARCHAR(100) NOT NULL,
    addressing_style VARCHAR(100) NOT NULL,
    system_prompt TEXT NOT NULL,
    max_response_tokens INT NOT NULL DEFAULT 400,
    temperature NUMERIC(3, 2) NOT NULL DEFAULT 0.40,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. BẢNG KHO KIẾN THỨC & CHUNKS VECTOR
CREATE TABLE IF NOT EXISTS public.ai_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    file_url TEXT,
    content_raw TEXT NOT NULL,
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    is_approved BOOLEAN NOT NULL DEFAULT false,
    approved_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_id UUID NOT NULL REFERENCES public.ai_knowledge(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(1536) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEX TÌM KIẾM VECTOR NHANH (HNSW INDEX)
CREATE INDEX IF NOT EXISTS idx_ai_chunks_embedding 
ON public.ai_knowledge_chunks 
USING hnsw (embedding vector_cosine_ops);

-- 3. BẢNG KỊCH BẢN TƯ VẤN (SCENARIOS)
CREATE TABLE IF NOT EXISTS public.ai_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    trigger_conditions JSONB NOT NULL,
    guided_steps JSONB NOT NULL,
    handoff_trigger TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. BẢNG THƯ VIỆN TÌNH HUỐNG (SITUATIONS)
CREATE TABLE IF NOT EXISTS public.ai_training_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    situation_title VARCHAR(255) NOT NULL,
    customer_query TEXT NOT NULL,
    ideal_response TEXT NOT NULL,
    explanation TEXT,
    mistakes_to_avoid TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. BẢNG ĐÁNH GIÁ NĂNG LỰC AI (EVALUATION - THANG ĐIỂM 100)
CREATE TABLE IF NOT EXISTS public.ai_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    score_natural_dialogue INT NOT NULL CHECK (score_natural_dialogue BETWEEN 0 AND 20),
    score_need_discovery INT NOT NULL CHECK (score_need_discovery BETWEEN 0 AND 20),
    score_knowledge_accuracy INT NOT NULL CHECK (score_knowledge_accuracy BETWEEN 0 AND 20),
    score_objection_handling INT NOT NULL CHECK (score_objection_handling BETWEEN 0 AND 20),
    score_closing_and_handoff INT NOT NULL CHECK (score_closing_and_handoff BETWEEN 0 AND 20),
    total_score INT NOT NULL,
    has_critical_error BOOLEAN NOT NULL DEFAULT false,
    evaluator_notes TEXT,
    evaluated_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
