import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AIAssistantProvider } from "./components/ai_assistant/AIAssistantProvider";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "AI学习平台 - 智能驱动个性化学习",
  description: "使用AI技术打造个性化学习体验，包括智能能力评估、定制化学习路径和24小时AI助教",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${geistSans.className} ${geistMono.className}`}>
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
        <AIAssistantProvider />
      </body>
    </html>
  );
}