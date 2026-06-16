import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Site Manager - 网站地址管理面板",
  description: "统一管理你的网站书签，卡片式展示，分类筛选",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}