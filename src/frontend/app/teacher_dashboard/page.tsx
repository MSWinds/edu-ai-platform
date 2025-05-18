'use client';

import React from 'react';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';

const TeacherDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar userRole="teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-8 max-w-4xl space-y-6">
            <section className="bg-white rounded-lg shadow p-8 flex flex-col gap-2 mb-4">
              <div className="text-2xl font-bold text-blue-700 mb-2">👩‍🏫 欢迎来到教师工作台</div>
              <div className="text-gray-700 text-base">您可以在这里管理课程、查看学生测评与成绩、发布公告、分析学习数据等。</div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="/teacher/courses" className="bg-blue-50 rounded-lg shadow p-6 flex flex-col hover:bg-blue-100 transition">
                <div className="text-lg font-bold text-blue-700 mb-1">📚 课程管理</div>
                <div className="text-gray-700 text-sm">创建、编辑和管理您的课程内容与教学单元。</div>
              </a>
              <a href="/teacher/students" className="bg-green-50 rounded-lg shadow p-6 flex flex-col hover:bg-green-100 transition">
                <div className="text-lg font-bold text-green-700 mb-1">👩‍🎓 学生测评与成绩</div>
                <div className="text-gray-700 text-sm">查看学生测评结果、成绩分布，支持导出与分析。</div>
              </a>
              <a href="/teacher/announcements" className="bg-yellow-50 rounded-lg shadow p-6 flex flex-col hover:bg-yellow-100 transition">
                <div className="text-lg font-bold text-yellow-700 mb-1">📢 公告管理</div>
                <div className="text-gray-700 text-sm">发布、编辑课程公告，及时通知学生重要信息。</div>
              </a>
              <a href="/teacher/analytics" className="bg-purple-50 rounded-lg shadow p-6 flex flex-col hover:bg-purple-100 transition">
                <div className="text-lg font-bold text-purple-700 mb-1">📊 学习数据分析</div>
                <div className="text-gray-700 text-sm">分析学生学习行为、测评数据，辅助教学决策。</div>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard; 