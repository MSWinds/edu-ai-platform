"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: '课程管理', path: '/teacher_class_management' },
  { name: '单元管理', path: '/teacher_class_management/units' },
  { name: '成绩管理', path: '/teacher_class_management/grades' },
  { name: '作业管理', path: '/teacher_class_management/assignments' },
  { name: '学生管理', path: '/teacher_class_management/students' },
  { name: '公告管理', path: '/teacher_class_management/announcements' },
];

export function TeacherCourseMenu() {
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