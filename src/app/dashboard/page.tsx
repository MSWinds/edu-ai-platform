'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChatAssistant from '../components/ChatAssistant';
import DashboardSidebar from '../components/DashboardSidebar';
import { redirectIfNotAuthenticated, getUser } from '../utils/auth';

// 模拟用户数据 - 在实际应用中，这会从API或会话中获取
const mockUserData = {
  name: '张三',
  email: 'student@example.com',
  role: 'student',
  profileImage: '/images/profile.jpg',
  progress: 35,
  // 单个课程，分为8周学习内容
  course: {
    id: 1,
    title: 'AI与机器学习基础',
    description: '全面介绍人工智能和机器学习的基础概念、算法和应用',
    totalWeeks: 8,
    currentWeek: 3,
    overallProgress: 35,
    instructor: '李教授',
    weeks: [
      {
        weekNumber: 1,
        title: '人工智能导论',
        completed: true,
        progress: 100,
        videos: [
          { id: 301, title: '人工智能的历史与发展', duration: '32:15', completed: true },
          { id: 302, title: '人工智能的核心概念', duration: '28:45', completed: true }
        ],
        assignments: [
          { id: 101, title: '人工智能概念理解', completed: true, score: 92 },
          { id: 102, title: 'AI发展历史时间线', completed: true, score: 88 }
        ],
        quiz: { id: 201, title: '人工智能基础概念测验', completed: true, score: 95 }
      },
      {
        weekNumber: 2,
        title: '机器学习基础',
        completed: true,
        progress: 100,
        videos: [
          { id: 303, title: '机器学习概述', duration: '45:10', completed: true },
          { id: 304, title: '监督学习与非监督学习', duration: '38:20', completed: true }
        ],
        assignments: [
          { id: 103, title: '机器学习算法分类', completed: true, score: 90 },
          { id: 104, title: '简单线性回归实现', completed: true, score: 85 }
        ],
        quiz: { id: 202, title: '机器学习基础测验', completed: true, score: 88 }
      },
      {
        weekNumber: 3,
        title: '监督学习算法',
        completed: false,
        progress: 65,
        videos: [
          { id: 305, title: '决策树原理', duration: '36:45', completed: true },
          { id: 306, title: 'KNN算法详解', duration: '42:18', completed: false }
        ],
        assignments: [
          { id: 105, title: '决策树实现', completed: true, score: 82 },
          { id: 106, title: 'KNN算法应用', completed: false, dueDate: '2023-11-25' }
        ],
        quiz: { id: 203, title: '监督学习算法测验', completed: false, dueDate: '2023-11-23' }
      },
      {
        weekNumber: 4,
        title: '无监督学习',
        completed: false,
        progress: 0,
        videos: [
          { id: 307, title: '聚类算法简介', duration: '38:55', completed: false },
          { id: 308, title: '降维技术与PCA', duration: '41:30', completed: false }
        ],
        assignments: [
          { id: 107, title: '聚类算法实现', completed: false, dueDate: '2023-12-02' },
          { id: 108, title: '降维技术应用', completed: false, dueDate: '2023-12-05' }
        ],
        quiz: { id: 204, title: '无监督学习测验', completed: false, dueDate: '2023-12-07' }
      },
      {
        weekNumber: 5,
        title: '神经网络入门',
        completed: false,
        progress: 0,
        videos: [
          { id: 309, title: '神经网络基础', duration: '44:25', completed: false },
          { id: 310, title: '前向与反向传播', duration: '47:15', completed: false }
        ],
        assignments: [
          { id: 109, title: '简单神经网络实现', completed: false },
          { id: 110, title: '前向传播与反向传播', completed: false }
        ],
        quiz: { id: 205, title: '神经网络基础测验', completed: false }
      },
      {
        weekNumber: 6,
        title: '深度学习基础',
        completed: false,
        progress: 0,
        videos: [
          { id: 311, title: 'CNN原理与架构', duration: '51:30', completed: false },
          { id: 312, title: 'RNN与序列建模', duration: '48:20', completed: false }
        ],
        assignments: [
          { id: 111, title: 'CNN实现与应用', completed: false },
          { id: 112, title: 'RNN与序列数据', completed: false }
        ],
        quiz: { id: 206, title: '深度学习基础测验', completed: false }
      },
      {
        weekNumber: 7,
        title: '强化学习',
        completed: false,
        progress: 0,
        videos: [
          { id: 313, title: '强化学习入门', duration: '39:45', completed: false },
          { id: 314, title: 'Q-learning算法详解', duration: '42:50', completed: false }
        ],
        assignments: [
          { id: 113, title: 'Q-learning算法实现', completed: false },
          { id: 114, title: '策略梯度方法', completed: false }
        ],
        quiz: { id: 207, title: '强化学习测验', completed: false }
      },
      {
        weekNumber: 8,
        title: 'AI项目实践',
        completed: false,
        progress: 0,
        videos: [
          { id: 315, title: '项目规划与设计', duration: '45:15', completed: false },
          { id: 316, title: '项目实现与展示', duration: '53:40', completed: false }
        ],
        assignments: [
          { id: 115, title: '综合AI项目', completed: false },
          { id: 116, title: '项目展示与汇报', completed: false }
        ],
        quiz: { id: 208, title: '期末综合测验', completed: false }
      }
    ]
  },
  assessmentResults: {
    knowledgeLevel: '初级',
    recommendedArea: '机器学习基础',
    studyTime: '5-8小时/周',
    completedOn: '2023-11-01'
  }
};

export default function Dashboard() {
  const [userData, setUserData] = useState(mockUserData);
  const [activeWeek, setActiveWeek] = useState(userData.course.currentWeek);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  
  useEffect(() => {
    // 检查是否已登录并加载用户数据
    const checkAuth = async () => {
      try {
        if (!redirectIfNotAuthenticated(router)) {
          const user = getUser();
          if (user) {
            console.log('已登录用户:', user);
            
            // 合并保存的用户数据与模拟课程数据
            setUserData(prev => ({
              ...prev,
              name: user.name || prev.name,
              email: user.email || prev.email,
              role: user.role || prev.role
            }));
            
            setIsAuthenticated(true);
          } else {
            // 没有找到用户数据，重定向到登录页
            console.error('未找到用户数据');
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('加载用户数据时出错:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-semibold">加载中...</div>
      </div>
    );
  }
  
  // 如果未认证，不渲染页面内容
  if (!isAuthenticated) {
    return null;
  }
  
  // 计算未完成的任务
  const upcomingTasks = userData.course.weeks
    .flatMap(week => [
      ...week.assignments.map(assignment => ({
        id: assignment.id,
        weekNumber: week.weekNumber,
        title: assignment.title,
        type: '作业',
        dueDate: 'dueDate' in assignment ? assignment.dueDate : '',
        completed: assignment.completed
      })),
      {
        id: week.quiz.id,
        weekNumber: week.weekNumber,
        title: week.quiz.title,
        type: '测验',
        dueDate: week.quiz.dueDate || '',
        completed: week.quiz.completed
      }
    ])
    .filter(task => !task.completed && task.dueDate)
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 3);
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar 
        userRole="student" 
        userName={userData.name}
        userEmail={userData.email}
        onCollapsedChange={(collapsed) => setSidebarCollapsed(collapsed)}
      />
      
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">学生仪表盘</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">欢迎回来，{userData.name}</span>
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {userData.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 统计数据卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">总学习时长</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">24小时</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">已完成作业</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">平均分数</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">连续学习天数</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">5天</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">下一个里程碑</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">完成第3周内容</p>
            </div>
          </div>

          {/* 标签页 */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                课程概览
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`pb-4 px-1 ${
                  activeTab === 'progress'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                学习进度
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`pb-4 px-1 ${
                  activeTab === 'tasks'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                待办任务
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-4 px-1 ${
                  activeTab === 'resources'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                学习资源
              </button>
            </nav>
          </div>

          {/* 课程概览 */}
          {activeTab === 'overview' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">我的课程</h2>
                <Link 
                  href={`/courses/${userData.course.id}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  进入课程学习
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-40 bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{userData.course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{userData.course.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      讲师: {userData.course.instructor}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>完成度</span>
                        <span>{userData.course.overallProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${userData.course.overallProgress}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Link 
                        href={`/courses/${userData.course.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        继续学习
                      </Link>
                      <span className="text-sm text-gray-500">第{userData.course.currentWeek}周 / 共{userData.course.totalWeeks}周</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 学习进度 */}
          {activeTab === 'progress' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">周进度跟踪</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border-b border-gray-200">
                  <nav className="flex overflow-x-auto py-4 px-6">
                    {userData.course.weeks.map((week) => (
                      <button
                        key={week.weekNumber}
                        onClick={() => setActiveWeek(week.weekNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-md mr-2 ${
                          activeWeek === week.weekNumber
                            ? 'bg-indigo-600 text-white'
                            : week.completed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        第{week.weekNumber}周{week.completed && ' ✓'}
                      </button>
                    ))}
                  </nav>
                </div>
                
                <div className="p-6">
                  {userData.course.weeks.map((week) => (
                    week.weekNumber === activeWeek && (
                      <div key={week.weekNumber}>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold">{week.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            week.completed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {week.completed ? '已完成' : '进行中'} ({week.progress}%)
                          </span>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">本周视频课程</h4>
                          <div className="space-y-3">
                            {week.videos.map((video) => (
                              <div key={video.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <div className={`h-4 w-4 rounded-full mr-3 ${
                                    video.completed ? 'bg-green-500' : 'bg-yellow-500'
                                  }`}></div>
                                  <span>{video.title}</span>
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-3">时长: {video.duration}</span>
                                    <Link
                                      href={`/courses/${userData.course.id}/week/${week.weekNumber}/video/${video.id}`}
                                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                                    >
                                      {video.completed ? '重新观看' : '开始学习'}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">本周作业</h4>
                          <div className="space-y-3">
                            {week.assignments.map((assignment) => (
                              <div key={assignment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <div className={`h-4 w-4 rounded-full mr-3 ${
                                    assignment.completed ? 'bg-green-500' : 'bg-yellow-500'
                                  }`}></div>
                                  <span>{assignment.title}</span>
                                </div>
                                <div>
                                  {assignment.completed ? (
                                    <span className="text-green-600 font-medium">得分: {'score' in assignment ? assignment.score : 'N/A'}</span>
                                  ) : (
                                    <div className="flex items-center">
                                      {'dueDate' in assignment && assignment.dueDate && (
                                        <span className="text-sm text-gray-500 mr-3">截止日期: {assignment.dueDate}</span>
                                      )}
                                      <Link
                                        href={`/courses/${userData.course.id}/week/${week.weekNumber}/assignment/${assignment.id}`}
                                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                                      >
                                        开始
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">本周测验</h4>
                          <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`h-4 w-4 rounded-full mr-3 ${
                                week.quiz.completed ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></div>
                              <span>{week.quiz.title}</span>
                            </div>
                            <div>
                              {week.quiz.completed ? (
                                <span className="text-green-600 font-medium">得分: {week.quiz.score}</span>
                              ) : (
                                <div className="flex items-center">
                                  {week.quiz.dueDate && (
                                    <span className="text-sm text-gray-500 mr-3">截止日期: {week.quiz.dueDate}</span>
                                  )}
                                  <Link
                                    href={`/courses/${userData.course.id}/week/${week.weekNumber}/quiz/${week.quiz.id}`}
                                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                                  >
                                    开始
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 待办任务 */}
          {activeTab === 'tasks' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">即将到期任务</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {upcomingTasks.length > 0 ? (
                    upcomingTasks.map((task) => (
                      <li key={task.id}>
                        <div className="px-6 py-4 flex items-center">
                          <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                task.type === '作业' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {task.type === '作业' ? (
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1 px-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {task.title}
                                </p>
                                <p className="text-sm text-gray-500 truncate">第{task.weekNumber}周 · 截止日期: {task.dueDate}</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <Link
                              href={`/courses/${userData.course.id}/week/${task.weekNumber}/${task.type === '作业' ? 'assignment' : 'quiz'}/${task.id}`}
                              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                            >
                              立即完成
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>
                      <div className="px-6 py-4 text-center text-gray-500">
                        暂无即将到期的任务
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* 学习资源 */}
          {activeTab === 'resources' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">学习资源</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-600">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">推荐阅读</h3>
                  <p className="text-gray-600 mb-4">精选AI与机器学习相关书籍和文章</p>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md shadow-sm">查看资源</button>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-600">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">实践项目</h3>
                  <p className="text-gray-600 mb-4">动手实践项目，巩固所学知识</p>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md shadow-sm">开始项目</button>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-600">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">学习社区</h3>
                  <p className="text-gray-600 mb-4">与其他学习者交流讨论，分享经验</p>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md shadow-sm">加入社区</button>
                </div>
              </div>
            </div>
          )}
        </main>
        <ChatAssistant />
      </div>
    </div>
  );
} 