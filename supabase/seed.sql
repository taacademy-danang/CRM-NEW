-- ==============================================================================
-- T.A ACADEMY CRM - SEED DATA
-- Khởi tạo Vai trò, Khóa học chuẩn & Cấu hình hệ thống ban đầu
-- ==============================================================================

-- 1. VAI TRÒ
INSERT INTO public.roles (id, name, description) VALUES
('admin', 'Quản trị hệ thống', 'Toàn quyền cấu hình, tài khoản và audit logs'),
('manager', 'Quản lý học viện', 'Quản lý tuyển sinh, duyệt kiến thức AI và báo cáo'),
('team_lead', 'Trưởng nhóm tuyển sinh', 'Quản lý khách và nhân viên nhóm phụ trách'),
('consultant', 'Nhân viên tư vấn', 'Tiếp nhận cuộc gọi và chat với khách được giao'),
('teacher', 'Giáo viên', 'Xem danh sách học viên trong các lớp sắp mở')
ON CONFLICT (id) DO NOTHING;

-- 2. KHÓA HỌC CHUẨN T.A ACADEMY
INSERT INTO public.courses (code, title, category, target_audience, min_age, max_age, duration_weeks, total_sessions, tuition_fee, discount_policy) VALUES
('MODEL-KIDS-01', 'Model Kids (Mẫu Nhí Tài Năng)', 'model_kids', 'Các bé muốn rèn dáng đi chuẩn, giải phóng hình thể và tự tin ống kính', 4, 12, 6, 12, 6800000, 'Tặng kèm 1 bộ trang phục trình diễn trị giá 1.500.000đ khi đăng ký sớm'),
('PHONG-THAI-01', 'Phong Thái Quý Cô & Doanh Nhân', 'phong_thai', 'Nữ doanh nhân, quản lý và quý cô muốn nâng tầm phong thái giao tiếp, dáng đứng và sự tự tin', 18, 65, 4, 8, 12500000, 'Ưu đãi 10% khi đăng ký theo nhóm 2 người'),
('CATWALK-PRO-01', 'Catwalk Chuyên Nghiệp', 'catwalk', 'Học viên đam mê thời trang, rèn luyện kỹ năng sân khấu và biểu cảm trình diễn', 14, 30, 5, 10, 8500000, 'Cơ hội casting Tuần lễ thời trang Việt Nam'),
('GIAO-TIEP-01', 'Nghệ Thuật Giao Tiếp & Thuyết Trình', 'giao_tiep', 'Học viên muốn làm chủ giọng nói, rèn luyện kỹ năng truyền cảm hứng trước đám đông', 10, 50, 4, 8, 5500000, 'Tài liệu độc quyền từ chuyên gia T.A Academy')
ON CONFLICT (code) DO NOTHING;
