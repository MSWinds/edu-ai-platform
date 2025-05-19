"use client";
import DashboardSidebar from "../../main_sidebar/DashboardSidebar";
import React from "react";
import { TeacherCourseMenu } from "../components/TeacherCourseMenu";

const mockMembers = [
  { id: 1, name: '李教授', role: '教师', email: 'professor@example.com' },
  { id: 2, name: '张三', role: '学生', email: 'student1@example.com' },
  { id: 3, name: '李四', role: '学生', email: 'student2@example.com' },
  { id: 4, name: '王五', role: '学生', email: 'student3@example.com' },
];

export default function TeacherStudentsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar userRole="teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherCourseMenu />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-4 max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">学生管理</h1>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition">添加学生</button>
                  <button className="px-4 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition">导出名单</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockMembers.filter(m => m.role === '学生').map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-6 p-6 border rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex-shrink-0">
                      <svg className="h-16 w-16 rounded-full bg-blue-100 text-blue-400 border-2 border-blue-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xl font-medium text-gray-900 truncate mb-1">
                        {member.name}
                      </p>
                      <p className="text-base text-gray-500 truncate mb-1">{member.email}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition">编辑</button>
                      <button className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition">移除</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 