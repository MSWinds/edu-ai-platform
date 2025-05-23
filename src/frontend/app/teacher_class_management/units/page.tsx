"use client";
import DashboardSidebar from "../../main_sidebar/DashboardSidebar";
import { mockUserData } from "../../mockdata/courseData";
import React from "react";
import { TeacherCourseMenu } from "../components/TeacherCourseMenu";

export default function TeacherUnitsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar userRole="teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherCourseMenu />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-4 max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">单元管理</h1>
              <div className="space-y-8">
                {mockUserData.course.weeks.map((week) => (
                  <div key={week.weekNumber} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xl font-semibold text-gray-900">第 {week.weekNumber} 周：{week.title}</div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition">编辑周</button>
                        <button className="px-3 py-1 rounded bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition">删除周</button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-2">
                      {/* 课程内容 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-lg font-medium text-gray-700">课程内容</div>
                          <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition">添加视频</button>
                        </div>
                        <ul className="space-y-2">
                          {week.videos.length === 0 ? <li className="text-gray-400 text-base">暂无视频</li> : week.videos.map(video => (
                            <li key={video.id} className="flex items-center justify-between text-base bg-white rounded px-4 py-2">
                              <span>{video.title}</span>
                              <div className="flex items-center gap-2">
                                <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition">编辑</button>
                                <button className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition">删除</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* 作业 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-lg font-medium text-gray-700">作业</div>
                          <button className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition">添加作业</button>
                        </div>
                        <ul className="space-y-2">
                          {week.assignments.length === 0 ? <li className="text-gray-400 text-base">暂无作业</li> : week.assignments.map(ass => (
                            <li key={ass.id} className="flex items-center justify-between text-base bg-white rounded px-4 py-2">
                              <span>{ass.title}</span>
                              <div className="flex items-center gap-2">
                                <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition">编辑</button>
                                <button className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition">删除</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* 堂测 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-lg font-medium text-gray-700">堂测</div>
                          <button className="px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-medium hover:bg-purple-100 transition">添加堂测</button>
                        </div>
                        <ul className="space-y-2">
                          {week.quiz ? (
                            <li className="flex items-center justify-between text-base bg-white rounded px-4 py-2">
                              <span>{week.quiz.title}</span>
                              <div className="flex items-center gap-2">
                                <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition">编辑</button>
                                <button className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition">删除</button>
                              </div>
                            </li>
                          ) : <li className="text-gray-400 text-base">暂无堂测</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
                {/* 添加新周按钮 */}
                <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition">添加新单元/周</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 