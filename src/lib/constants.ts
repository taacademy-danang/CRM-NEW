/**
 * T.A ACADEMY CRM CONSTANTS & NAVIGATION DEFINITIONS
 * Đỏ tươi hiện đại, chuyên sâu nghiệp vụ tiếp nhận và tư vấn tuyển sinh
 */

export const BRAND_CONFIG = {
  name: "T.A ACADEMY",
  tagline: "PHONG THÁI - CATWALK - MODEL KIDS",
  quote: "Tỏa sáng Phong thái Việt",
  logoInitials: "TA",
  primaryColor: "#DC2626", // Màu đỏ tươi chuẩn
};

export const SLA_CONFIG = {
  warningMinutes: 15,
  dangerMinutes: 60,
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
    name: "Tiếp nhận tư vấn",
    href: "/consultations",
    iconName: "UserCheck",
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
      { name: "Quản lý phiên bản", href: "/ai-training/versions" },
    ],
  },
  {
    name: "Quy trình tư vấn (Workflow)",
    href: "/workflows",
    iconName: "GitFork",
  },
  {
    name: "Cài đặt hệ thống",
    href: "/settings",
    iconName: "Settings",
  },
];

export const COURSE_OPTIONS = [
  { id: "all", label: "Tất cả khóa học" },
  { id: "model_kids", label: "Model Kids (Mẫu Nhí Tài Năng)" },
  { id: "phong_thai_quy_co", label: "Phong Thái Quý Cô" },
  { id: "phong_thai_doanh_nhan", label: "Phong Thái Doanh Nhân" },
  { id: "catwalk_pro", label: "Catwalk Chuyên Nghiệp" },
  { id: "giao_tiep", label: "Nghệ Thuật Giao Tiếp & Thuyết Trình" },
];

export const SOURCE_OPTIONS = [
  { id: "all", label: "Tất cả nguồn" },
  { id: "facebook", label: "Facebook Fanpage" },
  { id: "zalo", label: "Zalo Official Account" },
  { id: "hotline", label: "Hotline Trực Tiếp" },
  { id: "website", label: "Website T.A Academy" },
  { id: "referral", label: "Khách giới thiệu" },
];

export const STATUS_OPTIONS = [
  { id: "all", label: "Tất cả trạng thái" },
  { id: "new", label: "Khách mới" },
  { id: "uncalled", label: "Chưa gọi (SLA)" },
  { id: "called_unreachable", label: "Không nghe máy" },
  { id: "contacted", label: "Đã liên hệ" },
  { id: "consulting", label: "Đang tư vấn" },
  { id: "trial_scheduled", label: "Hẹn học thử" },
  { id: "considering", label: "Đang cân nhắc" },
  { id: "registered", label: "Đã chốt đăng ký" },
  { id: "lost", label: "Không tiếp tục" },
];
