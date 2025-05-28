'use client';

import { usePathname } from 'next/navigation';
import { FloatingChat } from './FloatingChat';

// 允许显示AI智能助教的页面白名单
const ALLOWED_PAGES = [
  '/student',
  '/class_page',
  '/custom_report'
];

export function AIAssistantProvider() {
  const pathname = usePathname();
  
  // 检查当前页面是否允许显示AI智能助教
  const shouldShowAssistant = ALLOWED_PAGES.some(page => 
    pathname.startsWith(page)
  );

  if (!shouldShowAssistant) {
    return null;
  }

  return <FloatingChat />;
} 