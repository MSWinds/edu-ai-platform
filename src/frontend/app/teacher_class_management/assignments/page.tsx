"use client";
import DashboardSidebar from "../../main_sidebar/DashboardSidebar";
import { mockUserData } from "../../mockdata/courseData";
import React from "react";
import { TeacherCourseMenu } from "../components/TeacherCourseMenu";

// 假设有学生作业提交数据
const mockStudentAssignments = [
  { id: 1, student: "张三", title: "人工智能概念理解", week: 1, submitted: true, score: 92 },
  { id: 2, student: "李四", title: "AI发展历史时间线", week: 1, submitted: true, score: 88 },
  { id: 3, student: "王五", title: "机器学习基本流程", week: 2, submitted: false, score: null },
];

export default function TeacherAssignmentsPage() {
  // 获取所有作业并按周数分组
  const assignmentsByWeek = mockUserData.course.weeks.map((week) => ({
    weekNumber: week.weekNumber,
    title: week.title,
    assignments: week.assignments,
  }));

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar userRole="teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherCourseMenu />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-4 max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">作业管理</h1>
              <div className="space-y-8">
                {assignmentsByWeek.map((week) => (
                  <div key={week.weekNumber} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xl font-semibold text-gray-900">第 {week.weekNumber} 周：{week.title}</div>
                      <button className="px-3 py-1 rounded bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition">发布作业</button>
                    </div>
                    <ul className="space-y-2">
                      {week.assignments.length === 0 ? <li className="text-gray-400 text-base">暂无作业</li> : week.assignments.map((assignment) => (
                        <li key={assignment.id} className="flex flex-col md:flex-row md:items-center md:justify-between text-base bg-white rounded px-4 py-2">
                          <span>{assignment.title}</span>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition">编辑</button>
                            <button className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition">删除</button>
                            <button className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition">批改</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {/* 展示所有学生作业批改入口 */}
                <div className="bg-white rounded-lg shadow p-4 mt-6">
                  <h2 className="text-lg font-bold mb-4">学生作业批改入口（示例）</h2>
                  <table className="min-w-full text-base border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-gray-500 font-semibold text-base">
                        <th className="px-4 py-2 text-left">学生</th>
                        <th className="px-4 py-2 text-left">作业</th>
                        <th className="px-4 py-2 text-left">周次</th>
                        <th className="px-4 py-2 text-left">提交</th>
                        <th className="px-4 py-2 text-left">得分</th>
                        <th className="px-4 py-2 text-left">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockStudentAssignments.map((item) => (
                        <tr key={item.id} className="bg-gray-50 hover:bg-blue-50 rounded-xl">
                          <td className="px-4 py-2 font-medium text-blue-800 whitespace-nowrap">{item.student}</td>
                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{item.title}</td>
                          <td className="px-4 py-2 text-gray-700 whitespace-nowrap">第{item.week}周</td>
                          <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{item.submitted ? '已提交' : '-'}</td>
                          <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{item.score !== null ? item.score : '-'}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition">批改</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 