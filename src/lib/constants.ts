/**
 * T.A ACADEMY CRM CONSTANTS & NAVIGATION DEFINITIONS
 * Tone Đỏ tươi hiện đại, Quản lý khách hàng tư vấn & Tác vụ AI tự động
 */

export const BRAND_CONFIG = {
  name: "T.A ACADEMY",
  tagline: "PHONG THÁI - CATWALK - MODEL KIDS",
  quote: "Tỏa sáng Phong thái Việt",
  logoInitials: "TA",
  primaryColor: "#DC2626", // Đỏ tươi chuẩn
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
    name: "Quản lý khách hàng",
    href: "/consultations",
    iconName: "Users",
  },
  {
    name: "AI Tự động hóa tác vụ lặp lại",
    href: "/ai-tasks",
    iconName: "Cpu",
  },
  {
    name: "Trung tâm đào tạo AI",
    href: "/ai-training",
    iconName: "Bot",
    subItems: [
      { name: "Tổng quan AI", href: "/ai-training" },
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
    name: "Cài đặt hệ thống",
    href: "/settings",
    iconName: "Settings",
  },
];

export const COURSE_OPTIONS = [
  { id: "all", label: "Tất cả khóa học" },
  { id: "model_kids", label: "Model Kids (Mẫu Nhí)" },
  { id: "phong_thai", label: "Phong Thái" },
  { id: "catwalk", label: "Catwalk" },
  { id: "giao_tiep", label: "Giao Tiếp & Thuyết Trình" },
];

export const SOURCE_OPTIONS = [
  { id: "all", label: "Tất cả nguồn" },
  { id: "facebook", label: "Facebook Fanpage" },
  { id: "zalo", label: "Zalo Official Account" },
  { id: "hotline", label: "Hotline Trực Tiếp" },
  { id: "website", label: "Website T.A Academy" },
];

export const STATUS_OPTIONS = [
  { id: "all", label: "Tất cả tình trạng" },
  { id: "consulting", label: "Đang tư vấn" },
  { id: "called", label: "Đã gọi tư vấn" },
  { id: "uncalled", label: "Chưa gọi (Cần liên hệ)" },
  { id: "trial_scheduled", label: "Hẹn học thử" },
  { id: "registered", label: "Đã đăng ký (Chuyển E-learning)" },
  { id: "lost", label: "Không tiếp tục" },
];
