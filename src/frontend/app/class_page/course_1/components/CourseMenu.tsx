'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: '主页', path: '/class_page/course_1' },
  { name: '学习单元', path: '/class_page/course_1/units' },
  { name: '成绩', path: '/class_page/course_1/grades' },
  { name: '作业', path: '/class_page/course_1/assignments' },
  { name: '成员', path: '/class_page/course_1/members' },
  { name: '公告', path: '/class_page/course_1/announcements' },
  // 可扩展更多页面
];

export function CourseMenu() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white rounded-xl shadow flex flex-row items-center px-2 py-2 mb-6 border border-gray-100 justify-center">
      {menuItems.map((item) => {
        const active = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`px-6 py-2 mx-1 rounded-full text-base font-medium transition-all duration-150 select-none
              ${active ? 'bg-blue-500 text-white shadow' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            style={{ boxShadow: active ? '0 2px 8px 0 rgba(56, 189, 248, 0.12)' : undefined }}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

