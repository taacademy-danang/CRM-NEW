# MA TRẬN PHÂN QUYỀN TRUY CẬP (ROLE-BASED ACCESS CONTROL - RBAC)
**Hệ thống CRM & AI Tuyển sinh T.A Academy**
*Tài liệu kỹ thuật phiên bản 1.0.0 – Cơ chế thực thi: Supabase RLS & Backend API Middleware*

---

## 1. DANH SÁCH VAI TRÒ HỆ THỐNG (SYSTEM ROLES)

| Mã vai trò (`role_id`) | Tên vai trò | Mô tả phạm vi trách nhiệm |
|---|---|---|
| `admin` | **Quản trị hệ thống** | Toàn quyền kiểm soát hệ thống, cấu hình API, quản trị tài khoản, kiểm toán audit log và sao lưu. |
| `manager` | **Quản lý học viện** | Quản lý toàn bộ quy trình tuyển sinh, xem tất cả báo cáo tài chính/chuyển đổi, duyệt kiến thức AI và phê duyệt kịch bản. |
| `team_lead` | **Trưởng nhóm tuyển sinh**| Phân bổ leads trong nhóm, giám sát hàng đợi khách chưa gọi, hỗ trợ nhân viên tiếp quản hội thoại khó, xem báo cáo nhóm. |
| `consultant` | **Nhân viên tư vấn** | Tiếp nhận cuộc gọi, chat với khách hàng được giao, cập nhật hồ sơ phụ huynh/học viên, tạo lịch hẹn học thử. |
| `teacher` | **Giáo viên** | Xem danh sách học viên trong các lớp sắp khai giảng, xem ghi chú đặc biệt về tính cách/sở thích của bé. |

---

## 2. MA TRẬN QUYỀN HẠN CHI TIẾT (PERMISSION MATRIX)

Ký hiệu:
- ✅ : Toàn quyền (Tất cả dữ liệu)
- 👥 : Quyền giới hạn trong phạm vi Nhóm phụ trách (Team scope)
- 👤 : Quyền giới hạn với dữ liệu được phân công trực tiếp (Assigned scope)
- 👁️ : Chỉ đọc (Read-only)
- ❌ : Không có quyền truy cập (Bị chặn ở cấp Backend & RLS)

| Nhóm chức năng | Mã quyền cụ thể | Quản trị (`admin`) | Quản lý (`manager`) | Trưởng nhóm (`team_lead`) | Tư vấn viên (`consultant`) | Giáo viên (`teacher`) |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | `dashboard:view_overview` | ✅ | ✅ | 👥 | 👤 | ❌ |
| | `dashboard:uncalled_queue` | ✅ | ✅ | 👥 | 👤 | ❌ |
| | `dashboard:reassign_lead` | ✅ | ✅ | 👥 | ❌ | ❌ |
| **Hộp thư tư vấn** | `inbox:view_all` | ✅ | ✅ | 👥 | ❌ | ❌ |
| | `inbox:view_assigned` | ✅ | ✅ | ✅ | 👤 | ❌ |
| | `inbox:send_message` | ✅ | ✅ | ✅ | 👤 | ❌ |
| | `inbox:takeover_ai` | ✅ | ✅ | ✅ | 👤 | ❌ |
| | `inbox:internal_note` | ✅ | ✅ | ✅ | 👤 | ❌ |
| **Khách hàng & Học viên** | `customer:view_all` | ✅ | ✅ | 👥 | ❌ | ❌ |
| | `customer:view_assigned` | ✅ | ✅ | ✅ | 👤 | 👁️ (Chỉ xem học viên) |
| | `customer:create` | ✅ | ✅ | ✅ | ✅ | ❌ |
| | `customer:edit` | ✅ | ✅ | 👥 | 👤 | ❌ |
| | `customer:delete_soft` | ✅ | ✅ | ❌ | ❌ | ❌ |
| | `customer:export_excel` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Cuộc gọi (Call Logs)** | `call:view_all` | ✅ | ✅ | 👥 | ❌ | ❌ |
| | `call:create_log` | ✅ | ✅ | ✅ | 👤 | ❌ |
| | `call:edit_history` | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Trung tâm AI** | `ai:view_center` | ✅ | ✅ | 👁️ | 👁️ | ❌ |
| | `ai:manage_persona` | ✅ | ✅ | ❌ | ❌ | ❌ |
| | `ai:upload_knowledge`| ✅ | ✅ | ❌ | ❌ | ❌ |
| | `ai:approve_knowledge`| ✅ | ✅ | ❌ | ❌ | ❌ |
| | `ai:manage_scenarios`| ✅ | ✅ | ❌ | ❌ | ❌ |
| | `ai:playground_test` | ✅ | ✅ | ✅ | ✅ | ❌ |
| | `ai:evaluate_score` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `ai:deploy_version` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Quy trình & Automation**| `workflow:manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| | `workflow:view_logs` | ✅ | ✅ | 👥 | ❌ | ❌ |
| **Báo cáo thống kê** | `report:view_academy`| ✅ | ✅ | ❌ | ❌ | ❌ |
| | `report:view_team` | ✅ | ✅ | 👥 | ❌ | ❌ |
| | `report:view_personal`| ✅ | ✅ | ✅ | 👤 | ❌ |
| | `report:export` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Cài đặt hệ thống** | `settings:users_rbac` | ✅ | ❌ | ❌ | ❌ | ❌ |
| | `settings:channels` | ✅ | ✅ | ❌ | ❌ | ❌ |
| | `settings:courses` | ✅ | ✅ | ❌ | ❌ | ❌ |
| | `settings:audit_logs` | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 3. CƠ CHẾ THỰC THI BẢO MẬT PHÍA SERVER (SERVER-SIDE ENFORCEMENT)

### 3.1. Supabase Row Level Security (RLS) Policy Mẫu
Toàn bộ truy vấn SQL từ frontend hoặc backend đều tự động tuân thủ ngữ cảnh người dùng đang đăng nhập `auth.uid()`.

```sql
-- Chính sách truy cập bảng customers cho Tư vấn viên (consultant)
CREATE POLICY "consultant_access_customers_policy"
ON public.customers
FOR ALL
USING (
    -- Admin & Manager xem tất cả
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role_id IN ('admin', 'manager')
    )
    OR
    -- Team Lead xem khách trong nhóm
    EXISTS (
        SELECT 1 FROM profiles lead_p
        JOIN profiles member_p ON lead_p.team_id = member_p.team_id
        WHERE lead_p.id = auth.uid() 
        AND lead_p.role_id = 'team_lead'
        AND member_p.id = customers.assigned_to
    )
    OR
    -- Tư vấn viên chỉ xem khách được giao trực tiếp hoặc khách chưa phân công
    (
        customers.assigned_to = auth.uid() 
        OR (customers.assigned_to IS NULL AND customers.status = 'uncalled')
    )
);
```

### 3.2. Kiểm tra quyền tầng API Route Handlers / Server Actions
Không phụ thuộc vào việc ẩn/hiện nút trên giao diện. Trước khi thực thi bất kỳ mutation nào, Backend luôn gọi hàm tiện ích `verifyUserPermission(userId, requiredPermission)`. Nếu không hợp lệ, trả về ngay HTTP `403 Forbidden` và ghi nhật ký vào `audit_logs`.
