'use client';

import React, { useState } from 'react';
import DashboardSidebar from '../DashboardSidebar';
import { colors } from '../../theme/colors';

const CustomReportPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);

  // 模拟数据
  const weeklyData = {
    currentWeek: 1,
    courseName: "人工智能导论",
    progress: 75,
    timeSpent: "12小时",
    nextClass: "机器学习基础",
    nextClassTime: "2024-03-20 14:00",
    recommendations: [
      "完成第三章的练习题",
      "复习机器学习基础概念",
      "参与本周的在线讨论"
    ],
    insights: [
      "对基础概念掌握良好",
      "需要加强实践练习",
      "课堂参与度较高"
    ],
    weeklyStats: {
      assignmentsCompleted: 3,
      totalAssignments: 4,
      quizScore: 85,
      participationScore: 90,
      timeDistribution: {
        lectures: 40,
        practice: 35,
        discussion: 25
      }
    },
    learningPath: [
      {
        week: 1,
        title: "人工智能基础",
        status: "completed",
        score: 85
      },
      {
        week: 2,
        title: "机器学习入门",
        status: "current",
        score: null
      },
      {
        week: 3,
        title: "深度学习基础",
        status: "upcoming",
        score: null
      }
    ],
    strengths: [
      "概念理解能力强",
      "积极参与讨论",
      "按时完成作业"
    ],
    areasForImprovement: [
      "编程实践需要加强",
      "算法实现能力待提升",
      "需要更多项目经验"
    ]
  };

  return (
    <DashboardSidebar>
      <div className="flex-1">
        <header className="bg-white shadow" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>AI学习周报</h1>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((week) => (
                  <button
                    key={week}
                    onClick={() => setSelectedWeek(week)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedWeek === week
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    第{week}周
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：课程进度和学习路径 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 课程信息卡片 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{weeklyData.courseName}</h2>
                    <p className="text-gray-500 mt-1">第{weeklyData.currentWeek}周</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">学习时长</p>
                    <p className="text-lg font-semibold text-blue-600">{weeklyData.timeSpent}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">总体进度</span>
                      <span className="text-sm font-medium text-gray-800">{weeklyData.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${weeklyData.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-500">作业完成</p>
                      <p className="text-lg font-semibold">{weeklyData.weeklyStats.assignmentsCompleted}/{weeklyData.weeklyStats.totalAssignments}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-500">测验得分</p>
                      <p className="text-lg font-semibold">{weeklyData.weeklyStats.quizScore}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-500">参与度</p>
                      <p className="text-lg font-semibold">{weeklyData.weeklyStats.participationScore}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 学习路径 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">学习路径</h3>
                <div className="space-y-4">
                  {weeklyData.learningPath.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        item.status === 'completed' ? 'bg-green-100 text-green-600' :
                        item.status === 'current' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {item.status === 'completed' ? '✓' : item.week}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.title}</span>
                          {item.score && <span className="text-sm text-gray-500">{item.score}分</span>}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div 
                            className={`h-1 rounded-full ${
                              item.status === 'completed' ? 'bg-green-500' :
                              item.status === 'current' ? 'bg-blue-500' :
                              'bg-gray-300'
                            }`}
                            style={{ width: item.status === 'completed' ? '100%' : '0%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：AI建议和洞察 */}
            <div className="space-y-6">
              {/* AI学习建议 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">AI学习建议</h3>
                <ul className="space-y-3">
                  {weeklyData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 学习洞察 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">学习洞察</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">优势</h4>
                    <ul className="space-y-2">
                      {weeklyData.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center text-green-600">
                          <span className="mr-2">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">待提升</h4>
                    <ul className="space-y-2">
                      {weeklyData.areasForImprovement.map((area, index) => (
                        <li key={index} className="flex items-center text-orange-600">
                          <span className="mr-2">!</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 时间分配 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">时间分配</h3>
                <div className="space-y-3">
                  {Object.entries(weeklyData.weeklyStats.timeDistribution).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          {key === 'lectures' ? '课程学习' :
                           key === 'practice' ? '实践练习' :
                           '讨论交流'}
                        </span>
                        <span className="text-sm text-gray-600">{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardSidebar>
  );
};

export default CustomReportPage;