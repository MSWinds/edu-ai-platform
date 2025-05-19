"use client";

import React from "react";
import DashboardSidebar from "../main_sidebar/DashboardSidebar";
import { colors } from "../theme/colors";

const tools = [
  {
    id: 1,
    title: "AI 内容生成",
    description: "使用 AI 快速生成课程内容、练习题和教学材料",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "AI PPT 生成",
    description: "一键生成精美的教学演示文稿，支持多种模板和风格",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 3,
    title: "AI 作业批改",
    description: "智能批改学生作业，提供详细的反馈和建议",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-green-500 to-green-600"
  },
  {
    id: 4,
    title: "AI 课程规划",
    description: "智能规划课程进度，生成教学大纲和学习目标",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: "from-red-500 to-red-600"
  }
];

const TeacherTool = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar userRole="teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>AI 教学工具</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`h-32 bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                  <div className="text-white opacity-90">{tool.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <button
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => console.log(`Clicked ${tool.title}`)}
                  >
                    开始使用
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherTool; 