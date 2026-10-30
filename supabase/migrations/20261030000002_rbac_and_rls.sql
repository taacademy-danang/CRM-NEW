-- ==============================================================================
-- T.A ACADEMY CRM - MIGRATION 02: ROW LEVEL SECURITY & RBAC
-- ==============================================================================

-- Kích hoạt RLS trên toàn bộ bảng
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 1. CHÍNH SÁCH XEM HỒ SƠ KHÁCH HÀNG (CUSTOMERS RLS)
CREATE POLICY "admin_and_manager_all_customers"
ON public.customers
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role_id IN ('admin', 'manager')
    )
);

CREATE POLICY "consultant_assigned_customers"
ON public.customers
FOR SELECT
USING (
    customers.assigned_to = auth.uid() 
    OR (customers.assigned_to IS NULL AND customers.call_status = 'pending')
);

CREATE POLICY "consultant_update_assigned_customers"
ON public.customers
FOR UPDATE
USING (
    customers.assigned_to = auth.uid()
);

-- 2. CHÍNH SÁCH CUỘC GỌI (CALL LOGS RLS)
CREATE POLICY "staff_create_call_log"
ON public.call_logs
FOR INSERT
WITH CHECK (
    auth.uid() = agent_id
);

CREATE POLICY "staff_view_call_logs"
ON public.call_logs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role_id IN ('admin', 'manager')
    )
    OR agent_id = auth.uid()
);

-- 3. CHÍNH SÁCH XEM KHÓA HỌC (COURSES RLS - TẤT CẢ NHÂN VIÊN ĐƯỢC XEM)
CREATE POLICY "all_authenticated_users_read_courses"
ON public.courses
FOR SELECT
USING (auth.role() = 'authenticated');
