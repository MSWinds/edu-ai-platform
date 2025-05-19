"use client";
import DashboardSidebar from "../../main_sidebar/DashboardSidebar";
import React from "react";
import { TeacherCourseMenu } from "../components/TeacherCourseMenu";

// 假设有全部学生成绩数据
const mockStudentGrades = [
  { id: 1, student: "张三", type: "作业", title: "人工智能概念理解", week: 1, score: 92 },
  { id: 2, student: "李四", type: "作业", title: "AI发展历史时间线", week: 1, score: 88 },
  { id: 3, student: "王五", type: "作业", title: "机器学习基本流程", week: 2, score: 90 },
  { id: 4, student: "张三", type: "堂测", title: "人工智能的起源与核心概念-第一章节，课堂知识测验", week: 1, score: 95 },
];

export default function TeacherGradesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar userRole="teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherCourseMenu />
        <main className="flex-1 overflow-x-auto bg-gray-100">
          <div className="container mx-auto px-2 py-4 max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">成绩管理</h1>
              <div className="overflow-x-auto">
                <table className="min-w-full text-base border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-gray-500 font-semibold text-base">
                      <th className="px-4 py-2 text-left">学生</th>
                      <th className="px-4 py-2 text-left">名称</th>
                      <th className="px-4 py-2 text-left">类型</th>
                      <th className="px-4 py-2 text-left">周次</th>
                      <th className="px-4 py-2 text-left">得分</th>
                      <th className="px-4 py-2 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudentGrades.map((item) => (
                      <tr key={item.id} className="bg-gray-50 hover:bg-blue-50 rounded-xl">
                        <td className="px-4 py-2 font-medium text-blue-800 whitespace-nowrap">{item.student}</td>
                        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{item.title}</td>
                        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{item.type}</td>
                        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">第{item.week}周</td>
                        <td className="px-4 py-2 text-blue-600 font-bold whitespace-nowrap">{item.score}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition">修改分数</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 