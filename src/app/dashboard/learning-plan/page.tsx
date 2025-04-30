'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../components/DashboardSidebar';
import { redirectIfNotAuthenticated, getUser } from '../../utils/auth';

// 模拟学习计划数据
const INITIAL_LEARNING_PLAN = {
  courseName: 'AI与机器学习基础',
  duration: '8周',
  completedWeeks: 2,
  nextMilestone: '决策树与随机森林',
  customization: '注重实践项目',
  learningStyle: '视觉学习',
  weeklyHours: 8,
  startDate: '2023-11-01',
  endDate: '2023-12-27',
  weeks: [
    {
      weekNumber: 1,
      title: '人工智能导论',
      status: 'completed',
      topics: [
        { id: 1, name: '人工智能的历史与发展', status: 'completed', type: 'video', duration: '45分钟' },
        { id: 2, name: '人工智能的核心概念', status: 'completed', type: 'reading', duration: '30分钟' },
        { id: 3, name: '人工智能应用案例分析', status: 'completed', type: 'exercise', duration: '1小时' },
        { id: 4, name: '周测验', status: 'completed', type: 'quiz', duration: '20分钟' }
      ]
    },
    {
      weekNumber: 2,
      title: '机器学习基础',
      status: 'completed',
      topics: [
        { id: 5, name: '机器学习概述', status: 'completed', type: 'video', duration: '50分钟' },
        { id: 6, name: '监督学习与非监督学习', status: 'completed', type: 'reading', duration: '40分钟' },
        { id: 7, name: '简单回归模型实践', status: 'completed', type: 'lab', duration: '1.5小时' },
        { id: 8, name: '周测验', status: 'completed', type: 'quiz', duration: '25分钟' }
      ]
    },
    {
      weekNumber: 3,
      title: '监督学习算法',
      status: 'in-progress',
      topics: [
        { id: 9, name: '决策树原理', status: 'completed', type: 'video', duration: '40分钟' },
        { id: 10, name: '决策树实现与优化', status: 'in-progress', type: 'lab', duration: '1.5小时' },
        { id: 11, name: 'KNN算法详解', status: 'not-started', type: 'reading', duration: '45分钟' },
        { id: 12, name: '周测验', status: 'not-started', type: 'quiz', duration: '30分钟' }
      ]
    },
    {
      weekNumber: 4,
      title: '无监督学习',
      status: 'upcoming',
      topics: [
        { id: 13, name: '聚类算法简介', status: 'not-started', type: 'video', duration: '55分钟' },
        { id: 14, name: 'K-Means算法详解', status: 'not-started', type: 'reading', duration: '40分钟' },
        { id: 15, name: '聚类分析实践', status: 'not-started', type: 'lab', duration: '2小时' },
        { id: 16, name: '周测验', status: 'not-started', type: 'quiz', duration: '25分钟' }
      ]
    },
    {
      weekNumber: 5,
      title: '神经网络入门',
      status: 'upcoming',
      topics: [
        { id: 17, name: '神经网络基础概念', status: 'not-started', type: 'video', duration: '60分钟' },
        { id: 18, name: '前向与反向传播', status: 'not-started', type: 'reading', duration: '50分钟' },
        { id: 19, name: '简单神经网络实现', status: 'not-started', type: 'lab', duration: '2.5小时' },
        { id: 20, name: '周测验', status: 'not-started', type: 'quiz', duration: '30分钟' }
      ]
    },
    {
      weekNumber: 6,
      title: '深度学习基础',
      status: 'upcoming',
      topics: [
        { id: 21, name: 'CNN原理与架构', status: 'not-started', type: 'video', duration: '65分钟' },
        { id: 22, name: 'CNN实现与应用', status: 'not-started', type: 'lab', duration: '3小时' },
        { id: 23, name: 'RNN与序列建模', status: 'not-started', type: 'reading', duration: '55分钟' },
        { id: 24, name: '周测验', status: 'not-started', type: 'quiz', duration: '35分钟' }
      ]
    },
    {
      weekNumber: 7,
      title: '强化学习',
      status: 'upcoming',
      topics: [
        { id: 25, name: '强化学习入门', status: 'not-started', type: 'video', duration: '50分钟' },
        { id: 26, name: 'Q-learning算法详解', status: 'not-started', type: 'reading', duration: '45分钟' },
        { id: 27, name: '强化学习实践', status: 'not-started', type: 'lab', duration: '2.5小时' },
        { id: 28, name: '周测验', status: 'not-started', type: 'quiz', duration: '30分钟' }
      ]
    },
    {
      weekNumber: 8,
      title: 'AI项目实践',
      status: 'upcoming',
      topics: [
        { id: 29, name: '项目规划与设计', status: 'not-started', type: 'video', duration: '40分钟' },
        { id: 30, name: '最终项目开发', status: 'not-started', type: 'project', duration: '4小时' },
        { id: 31, name: '项目展示与汇报', status: 'not-started', type: 'presentation', duration: '1小时' },
        { id: 32, name: '期末综合测验', status: 'not-started', type: 'exam', duration: '90分钟' }
      ]
    }
  ]
};

// 模拟学习建议数据
const LEARNING_RECOMMENDATIONS = [
  { id: 1, text: '根据你的进度，建议增加决策树算法的实践训练', priority: 'high' },
  { id: 2, text: '你在监督学习部分的测验成绩较低，建议重温相关概念', priority: 'medium' },
  { id: 3, text: '即将学习的KNN算法与之前学习的决策树有关联，注意对比', priority: 'medium' },
  { id: 4, text: '考虑参加本周五的AI学习小组讨论，主题与你当前学习内容相关', priority: 'low' }
];

export default function LearningPlan() {
  const [learningPlan, setLearningPlan] = useState(INITIAL_LEARNING_PLAN);
  const [editMode, setEditMode] = useState(false);
  const [editWeeklyHours, setEditWeeklyHours] = useState(learningPlan.weeklyHours);
  const [editLearningStyle, setEditLearningStyle] = useState(learningPlan.learningStyle);
  const [user, setUser] = useState({ name: '', email: '', role: 'student' });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    if (!redirectIfNotAuthenticated(router)) {
      const userData = getUser();
      if (userData) {
        setUser({
          name: userData.name || '学生用户',
          email: userData.email || 'student@example.com',
          role: userData.role || 'student'
        });
      }
    }
    setIsLoading(false);
  }, [router]);

  const handleSaveChanges = () => {
    setLearningPlan({
      ...learningPlan,
      weeklyHours: editWeeklyHours,
      learningStyle: editLearningStyle
    });
    setEditMode(false);
  };

  const getTopicIcon = (type) => {
    switch (type) {
      case 'video':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'reading':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'lab':
      case 'exercise':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'quiz':
      case 'exam':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'project':
      case 'presentation':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">已完成</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">进行中</span>;
      case 'upcoming':
      case 'not-started':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">待开始</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">加载中...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 pl-64">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">个性化学习计划</h1>
              <div className="flex items-center">
                {!editMode ? (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm"
                  >
                    调整学习计划
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditMode(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md shadow-sm"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleSaveChanges}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm"
                    >
                      保存更改
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 计划概览 */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">学习计划概览</h2>
              <p className="mt-1 text-sm text-gray-500">根据您的学习风格和进度自动调整的个性化学习路径</p>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">课程名称</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{learningPlan.courseName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">学习周期</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{learningPlan.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">已完成</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{learningPlan.completedWeeks} 周 / {learningPlan.weeks.length} 周</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">下一个里程碑</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{learningPlan.nextMilestone}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">开始日期</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{learningPlan.startDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">预计结束</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{learningPlan.endDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">每周学习时间</h3>
                  {editMode ? (
                    <div className="mt-1">
                      <select 
                        value={editWeeklyHours} 
                        onChange={(e) => setEditWeeklyHours(parseInt(e.target.value))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value={5}>5小时/周</option>
                        <option value={8}>8小时/周</option>
                        <option value={10}>10小时/周</option>
                        <option value={15}>15小时/周</option>
                        <option value={20}>20小时/周</option>
                      </select>
                    </div>
                  ) : (
                    <p className="mt-1 text-lg font-semibold text-gray-900">{learningPlan.weeklyHours} 小时/周</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">学习风格</h3>
                  {editMode ? (
                    <div className="mt-1">
                      <select 
                        value={editLearningStyle} 
                        onChange={(e) => setEditLearningStyle(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="视觉学习">视觉学习</option>
                        <option value="听觉学习">听觉学习</option>
                        <option value="实践学习">实践学习</option>
                        <option value="阅读学习">阅读学习</option>
                      </select>
                    </div>
                  ) : (
                    <p className="mt-1 text-lg font-semibold text-gray-900">{learningPlan.learningStyle}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">总体进度</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(learningPlan.completedWeeks / learningPlan.weeks.length) * 100}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 text-right">{Math.round((learningPlan.completedWeeks / learningPlan.weeks.length) * 100)}% 完成</p>
              </div>
            </div>
          </div>
          
          {/* AI学习建议 */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">AI学习建议</h2>
              <p className="mt-1 text-sm text-gray-500">基于您的学习情况，AI为您提供的个性化学习建议</p>
            </div>
            <div className="px-6 py-5">
              <ul className="space-y-4">
                {LEARNING_RECOMMENDATIONS.map(rec => (
                  <li key={rec.id} className="flex items-start">
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full mt-1 ${
                      rec.priority === 'high' ? 'bg-red-100' : 
                      rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <div className={`h-3 w-3 rounded-full m-1 ${
                        rec.priority === 'high' ? 'bg-red-600' : 
                        rec.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}></div>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{rec.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* 周计划详情 */}
          <div className="space-y-6">
            {learningPlan.weeks.map((week) => (
              <div key={week.weekNumber} className={`bg-white shadow rounded-lg overflow-hidden ${
                week.status === 'completed' ? 'border-l-4 border-green-500' :
                week.status === 'in-progress' ? 'border-l-4 border-blue-500' : ''
              }`}>
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">第 {week.weekNumber} 周: {week.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {week.status === 'completed' && '已完成'}
                      {week.status === 'in-progress' && '正在进行中'}
                      {week.status === 'upcoming' && '即将开始'}
                    </p>
                  </div>
                  {getStatusBadge(week.status)}
                </div>
                <div className="px-6 py-5">
                  <ul className="divide-y divide-gray-200">
                    {week.topics.map(topic => (
                      <li key={topic.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 text-gray-500">
                            {getTopicIcon(topic.type)}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${
                              topic.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}>
                              {topic.name}
                            </p>
                            <p className="text-xs text-gray-500">{topic.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {getStatusBadge(topic.status)}
                          {topic.status !== 'completed' && (
                            <button className="ml-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                              开始学习
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
} 