"use client";
import DashboardSidebar from "../../main_sidebar/DashboardSidebar";
import React, { useState } from "react";
import { TeacherCourseMenu } from "../components/TeacherCourseMenu";

const mockAnnouncements = [
  {
    id: 1,
    title: '欢迎加入本课程！',
    content: '大家好，欢迎加入《人工智能基础导论》课程。本周请完成自我介绍和课程导学视频的学习。',
    author: '李教授',
    date: '2024-07-01 09:00',
    isNew: true
  },
  {
    id: 2,
    title: '第一次作业已发布',
    content: '第一次作业已在作业区发布，截止日期为7月8日。如有疑问请在讨论区留言。',
    author: '李教授',
    date: '2024-07-03 14:30',
    isNew: false
  },
  {
    id: 3,
    title: '本周线上答疑安排',
    content: '本周五晚8点将在Zoom进行线上答疑，欢迎大家提前准备问题。',
    author: '助教小王',
    date: '2024-07-05 10:00',
    isNew: false
  },
  {
    id: 4,
    title: '课程资料已更新',
    content: '课程资料区已上传最新PPT和参考文献，请及时下载学习。',
    author: '李教授',
    date: '2024-07-06 16:20',
    isNew: true
  }
];

export default function TeacherAnnouncementsPage() {
  const [announcements] = useState(mockAnnouncements);

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar userRole="teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherCourseMenu />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">公告管理</h1>
            <div className="mb-4 flex justify-end">
              <button className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition">发布新公告</button>
            </div>
            <div className="space-y-4">
              {announcements.map(a => (
                <div key={a.id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-2 border-l-4" style={{ borderColor: a.isNew ? '#2563eb' : '#e5e7eb' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-semibold text-gray-900">{a.title}</span>
                    {a.isNew && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">新公告</span>}
                  </div>
                  <div className="text-gray-700 text-base line-clamp-2">{a.content}</div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>发布人：{a.author}</span>
                    <span>{a.date}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition">编辑</button>
                    <button className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition">删除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 