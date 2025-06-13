"use client";

import React, { useState } from "react";
import DashboardSidebar from "../main_sidebar/DashboardSidebar";
import { colors } from "../theme/colors";
import { mockUserData } from "../mockdata/courseData";
import PageHeader from "../components/PageHeader";

const TeacherDashboard = () => {
  // 假数据
  const courseCount = 3;
  const pendingAssignments = 8;
  const newSubmissions = 5;
  const activeStudents = 27;
  const latestAnnouncement = "下周三将进行AI项目实战分享，请同学们提前准备。";
  const gradeStats = [80, 85, 90, 95, 100];
  const [activeTab, setActiveTab] = useState('courses');
  const course = mockUserData.course;

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar userRole="teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <PageHeader
              title="教师智能仪表"
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              actions={
                <div className="flex items-center space-x-3">
                  <span style={{ color: colors.text.secondary }}>欢迎回来，李老师</span>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}>
                    李
                  </div>
                </div>
              }
            />
          </div>
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-[98%] mx-auto px-4 py-4">
            {/* 热门问题卡片 */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <div className="font-bold text-lg text-gray-800">学生热门问题</div>
                <div className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">AI基础课程</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
                  <div>
                    <div className="font-medium text-gray-800">如何理解神经网络的基本原理？</div>
                    <div className="text-sm text-gray-600 mt-1">已有23名学生提问</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
                  <div>
                    <div className="font-medium text-gray-800">深度学习中的反向传播算法详解</div>
                    <div className="text-sm text-gray-600 mt-1">已有18名学生提问</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">3</div>
                  <div>
                    <div className="font-medium text-gray-800">卷积神经网络的实际应用场景</div>
                    <div className="text-sm text-gray-600 mt-1">已有15名学生提问</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 标签页导航 */}
            <div className="border-b mb-4" style={{ borderColor: colors.border }}>
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`pb-4 px-1 ${
                    activeTab === 'courses'
                      ? `border-b-2 font-medium`
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: activeTab === 'courses' ? colors.primary : 'transparent',
                    color: activeTab === 'courses' ? colors.primary : colors.text.secondary
                  }}
                >
                  课程管理
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`pb-4 px-1 ${
                    activeTab === 'students'
                      ? `border-b-2 font-medium`
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: activeTab === 'students' ? colors.primary : 'transparent',
                    color: activeTab === 'students' ? colors.primary : colors.text.secondary
                  }}
                >
                  学生动态
                </button>
              </nav>
            </div>

            {/* 标签页内容 */}
            {activeTab === 'courses' && (
              <div className="space-y-4">
                {/* 课程数据总览 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
                    <div className="text-blue-600 text-2xl font-bold mb-1">1</div>
                    <div className="text-gray-700 text-sm">开设课程</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
                    <div className="text-green-600 text-2xl font-bold mb-1">{pendingAssignments}</div>
                    <div className="text-gray-700 text-sm">待批作业</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
                    <div className="text-yellow-600 text-2xl font-bold mb-1">{newSubmissions}</div>
                    <div className="text-gray-700 text-sm">最新提交</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
                    <div className="text-purple-600 text-2xl font-bold mb-1">{activeStudents}</div>
                    <div className="text-gray-700 text-sm">活跃学生</div>
                  </div>
                </div>

                {/* 只显示一门课 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="font-bold text-lg mb-4">我的课程</div>
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{course.title}</div>
                      <div className="text-sm text-gray-600">{course.totalWeeks}个课时</div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">进入课程</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-4">
                {/* 学生动态 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="font-bold text-lg mb-4">学生动态</div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">张</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">张三</div>
                        <div className="text-sm text-gray-600">完成了"神经网络基础"作业</div>
                      </div>
                      <div className="text-sm text-gray-500">10分钟前</div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">李</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">李四</div>
                        <div className="text-sm text-gray-600">提交了"深度学习实践"项目</div>
                      </div>
                      <div className="text-sm text-gray-500">30分钟前</div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">王</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">王五</div>
                        <div className="text-sm text-gray-600">在讨论区提出了新问题</div>
                      </div>
                      <div className="text-sm text-gray-500">1小时前</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard; 