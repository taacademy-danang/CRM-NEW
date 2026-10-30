/**
 * T.A ACADEMY CRM CONSTANTS & NAVIGATION DEFINITIONS
 * Thiết lập các hằng số nhận diện thương hiệu, menu điều hướng và phân loại nghiệp vụ
 */

export const BRAND_CONFIG = {
  name: "T.A ACADEMY",
  tagline: "PHONG THÁI - CATWALK - MODEL KIDS",
  quote: "Tỏa sáng Phong thái Việt",
  logoInitials: "TA",
  primaryColor: "#8B1D2C", // Đỏ rượu vang
  accentColor: "#D4AF37",  // Vàng champagne
};

export const SLA_CONFIG = {
  warningMinutes: 15, // Cảnh báo vàng sau 15 phút
  dangerMinutes: 60,  // Cảnh báo đỏ ưu tiên cao sau 60 phút
};

export interface NavigationItem {
  name: string;
  href: string;
  iconName: string;
  badge?: number;
  subItems?: {
    name: string;
    href: string;
  }[];
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    name: "Tổng quan",
    href: "/",
    iconName: "LayoutDashboard",
  },
  {
    name: "Hộp thư tư vấn",
    href: "/inbox",
    iconName: "Mail",
    badge: 12,
  },
  {
    name: "Khách hàng - Học viên",
    href: "/customers",
    iconName: "Users",
  },
  {
    name: "Trung tâm đào tạo AI",
    href: "/ai-training",
    iconName: "Bot",
    subItems: [
      { name: "Tổng quan AI", href: "/ai-training" },
      { name: "Cấu hình AI Fanpage", href: "/ai-training/config" },
      { name: "Nhân cách AI", href: "/ai-training/persona" },
      { name: "Kho kiến thức", href: "/ai-training/knowledge" },
      { name: "Kịch bản tư vấn", href: "/ai-training/scenarios" },
      { name: "Thư viện tình huống", href: "/ai-training/situations" },
      { name: "Đào tạo từ hội thoại", href: "/ai-training/conversation-training" },
      { name: "Phòng thực hành AI", href: "/ai-training/playground" },
      { name: "Đánh giá AI", href: "/ai-training/evaluation" },
      { name: "Quản lý phiên bản", href: "/ai-training/versions" },
    ],
  },
  {
    name: "Quy trình tư vấn",
    href: "/workflows",
    iconName: "GitFork",
  },
  {
    name: "Báo cáo thống kê",
    href: "/reports",
    iconName: "BarChart3",
  },
  {
    name: "Cài đặt hệ thống",
    href: "/settings",
    iconName: "Settings",
  },
];

export const COURSE_CATEGORIES = [
  { id: "phong_thai", name: "Phong thái", description: "Phong thái Nữ hoàng & Doanh nhân" },
  { id: "catwalk", name: "Catwalk", description: "Catwalk chuyên nghiệp & Sân khấu" },
  { id: "model_kids", name: "Model Kids", description: "Mẫu nhí tài năng & Tự tin ống kính" },
  { id: "giao_tiep", name: "Giao tiếp - Thuyết trình", description: "Nghệ thuật truyền cảm hứng" },
] as const;

export const CUSTOMER_STATUSES = [
  { id: "new", name: "Khách mới", color: "bg-blue-100 text-blue-800" },
  { id: "uncalled", name: "Chưa gọi", color: "bg-red-100 text-red-800 font-semibold" },
  { id: "called_unreachable", name: "Không nghe máy", color: "bg-amber-100 text-amber-800" },
  { id: "contacted", name: "Đã liên hệ", color: "bg-teal-100 text-teal-800" },
  { id: "consulting", name: "Đang tư vấn", color: "bg-purple-100 text-purple-800" },
  { id: "trial_scheduled", name: "Hẹn học thử", color: "bg-indigo-100 text-indigo-800" },
  { id: "considering", name: "Đang cân nhắc", color: "bg-yellow-100 text-yellow-800" },
  { id: "enrolling", name: "Chờ ghi danh", color: "bg-orange-100 text-orange-800" },
  { id: "registered", name: "Đã đăng ký", color: "bg-emerald-100 text-emerald-800" },
  { id: "lost", name: "Không tiếp tục", color: "bg-gray-100 text-gray-700" },
] as const;
