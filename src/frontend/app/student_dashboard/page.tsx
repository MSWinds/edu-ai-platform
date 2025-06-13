'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { redirectIfNotAuthenticated, getUser } from '../login/auth';
import { colors } from '../theme/colors';
import { mockUserData } from '../mockdata/courseData';
import PageHeader from '../components/PageHeader';

export default function Dashboard() {
  const [userData, setUserData] = useState(mockUserData);
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
    <DashboardSidebar 
      userRole="student" 
      userName={userData.name}
      userEmail={userData.email}
      onCollapsedChange={(collapsed) => setSidebarCollapsed(collapsed)}
    >
      <div className="flex-1">
        <div className="bg-white shadow" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <PageHeader
              title="学生仪表盘"
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              actions={
                <div className="flex items-center space-x-4">
                  <span style={{ color: colors.text.secondary }}>欢迎回来，{userData.name}</span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}>
                    {userData.name.charAt(0)}
                  </div>
                </div>
              }
            />
          </div>
        </div>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 统计数据卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-md" 
              style={{ border: `1px solid ${colors.border}`, borderTop: `3px solid ${colors.secondary}` }}>
              <h3 className="text-sm font-medium" style={{ color: colors.text.secondary }}>总学习时间</h3>
              <p className="text-3xl font-bold mt-2" style={{ color: colors.text.primary }}>42小时</p>
            </div>
            <div className="bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-md" 
              style={{ border: `1px solid ${colors.border}`, borderTop: `3px solid ${colors.secondary}` }}>
              <h3 className="text-sm font-medium" style={{ color: colors.text.secondary }}>已完成作业</h3>
              <p className="text-3xl font-bold mt-2" style={{ color: colors.text.primary }}>8/12</p>
            </div>
            <div className="bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-md" 
              style={{ border: `1px solid ${colors.border}`, borderTop: `3px solid ${colors.secondary}` }}>
              <h3 className="text-sm font-medium" style={{ color: colors.text.secondary }}>连续学习天数</h3>
              <p className="text-3xl font-bold mt-2" style={{ color: colors.text.primary }}>7</p>
            </div>
            <div className="bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-md" 
              style={{ border: `1px solid ${colors.border}`, borderTop: `3px solid ${colors.secondary}` }}>
              <h3 className="text-sm font-medium" style={{ color: colors.text.secondary }}>待完成任务</h3>
              <p className="text-3xl font-bold mt-2" style={{ color: colors.text.primary }}>4</p>
            </div>
          </div>

          {/* 标签页 */}
          <div className="border-b mb-6" style={{ borderColor: colors.border }}>
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 ${
                  activeTab === 'overview'
                    ? `border-b-2 font-medium`
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  borderColor: activeTab === 'overview' ? colors.primary : 'transparent',
                  color: activeTab === 'overview' ? colors.primary : colors.text.secondary
                }}
              >
                课程概览
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`pb-4 px-1 ${
                  activeTab === 'tasks'
                    ? `border-b-2 font-medium`
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  borderColor: activeTab === 'tasks' ? colors.primary : 'transparent',
                  color: activeTab === 'tasks' ? colors.primary : colors.text.secondary
                }}
              >
                待办任务
              </button>
              {/* <button
                onClick={() => setActiveTab('resources')}
                className={`pb-4 px-1 ${
                  activeTab === 'resources'
                    ? `border-b-2 font-medium`
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  borderColor: activeTab === 'resources' ? colors.primary : 'transparent',
                  color: activeTab === 'resources' ? colors.primary : colors.text.secondary
                }}
              >
                学习资源
              </button> */}
            </nav>
          </div>

          {/* 课程概览 */}
          {activeTab === 'overview' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>我的课程</h2>
                {/* <Link 
                  href={`/courses/${userData.course.id}`}
                  className="px-4 py-2 rounded-md shadow-sm flex items-center"
                  style={{ 
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                    color: 'white'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  进入课程学习
                </Link> */}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="rounded-lg overflow-hidden" 
                  style={{ 
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`
                  }}>
                  <div className="h-40 flex items-center justify-center"
                    style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2" style={{ color: colors.text.primary }}>{userData.course.title}</h3>
                    <p className="mb-4 line-clamp-2" style={{ color: colors.text.secondary }}>{userData.course.description}</p>
                    
                    <div className="flex items-center text-sm mb-4" style={{ color: colors.text.secondary }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      讲师: {userData.course.instructor}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: colors.text.secondary }}>完成度</span>
                        <span style={{ color: colors.text.secondary }}>{userData.course.overallProgress}%</span>
                      </div>
                      <div className="w-full rounded-full h-2.5" style={{ backgroundColor: colors.border }}>
                        <div className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${userData.course.overallProgress}%`,
                            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
                          }}></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Link 
                        href={`/class_page/course_1/units`}
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

          {/* 待办任务 */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {userData.course.weeks.flatMap(week => [
                ...week.videos.filter(v => !v.completed).map(v => ({
                  type: 'video',
                  ...v,
                  week: week.weekNumber
                })),
                ...week.assignments.filter(a => !a.completed).map(a => ({
                  type: 'assignment',
                  ...a,
                  week: week.weekNumber
                })),
                ...(week.quiz && !week.quiz.completed ? [{
                  type: 'quiz',
                  ...week.quiz,
                  week: week.weekNumber
                }] : [])
              ]).map((task, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        第{task.week}周 · {task.type === 'video' ? '视频' : task.type === 'assignment' ? '作业' : '测验'}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      开始学习
                    </button>
                  </div>
                </div>
              ))}
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
      </div>
    </DashboardSidebar>
  );
} 