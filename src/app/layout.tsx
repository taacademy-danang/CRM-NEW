import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "T.A ACADEMY - CRM & AI Tuyển Sinh Thông Minh",
  description:
    "Hệ thống quản trị quan hệ khách hàng và tư vấn tuyển sinh tự động thông minh bằng AI cho Học viện T.A Academy (Phong thái, Catwalk, Model Kids)",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
