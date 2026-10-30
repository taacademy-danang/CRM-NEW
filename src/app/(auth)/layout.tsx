import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-red-500 selection:text-white">
      {children}
    </div>
  );
}
