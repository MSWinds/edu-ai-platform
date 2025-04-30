'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../components/DashboardSidebar';
import { redirectIfNotAuthenticated, getUser } from '../../utils/auth';

// 模拟教师课程数据
const TEACHER_COURSES = [
  {
    id: 1,
    title: 'AI与机器学习基础',
    students: 42,
    lastUpdated: '2023-11-10',
    progress: 75,
    thumbnail: '/images/course1.jpg',
    description: '全面介绍人工智能和机器学习的基础概念、算法和应用'
  },
  {
    id: 2,
    title: '自然语言处理实战',
    students: 28,
    lastUpdated: '2023-11-05',
    progress: 60,
    thumbnail: '/images/course2.jpg',
    description: '从基础到高级的NLP技术和应用'
  },
  {
    id: 3,
    title: '计算机视觉入门',
    students: 35,
    lastUpdated: '2023-10-28',
    progress: 40,
    thumbnail: '/images/course3.jpg',
    description: '图像处理与计算机视觉基础技术'
  }
];

// 模拟课程学生统计数据
const COURSE_STATS = {
  totalStudents: 105,
  activeLastWeek: 87,
  averageCompletion: 64,
  studentQuestions: 156,
  averageScore: 82
};

// 模拟最近学生活动
const STUDENT_ACTIVITIES = [
  { id: 1, student: '李明', activity: '提交了作业', course: 'AI与机器学习基础', time: '2小时前' },
  { id: 2, student: '王芳', activity: '完成了测验', course: '自然语言处理实战', time: '4小时前' },
  { id: 3, student: '张伟', activity: '提了3个问题', course: 'AI与机器学习基础', time: '昨天' },
  { id: 4, student: '刘洋', activity: '完成了第5周内容', course: '计算机视觉入门', time: '昨天' },
  { id: 5, student: '赵静', activity: '开始了课程', course: '自然语言处理实战', time: '2天前' }
];

export default function TeacherDashboard() {
  const [userData, setUserData] = useState({ name: '', email: '', role: 'teacher' });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // 检查是否已登录且为教师角色
    if (!redirectIfNotAuthenticated(router)) {
      const user = getUser();
      if (user) {
        if (user.role !== 'teacher' && user.role !== 'admin') {
          // 如果不是教师或管理员，重定向到学生仪表盘
          router.push('/dashboard');
          return;
        }
        
        setUserData({
          name: user.name || '教师用户',
          email: user.email || 'teacher@example.com',
          role: user.role
        });
      }
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">加载中...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar 
        userRole="teacher" 
        userName={userData.name}
        userEmail={userData.email}
        onCollapsedChange={(collapsed) => setSidebarCollapsed(collapsed)}
      />
      
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">教师仪表盘</h1>
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
              <h3 className="text-gray-500 text-sm font-medium">总学生数</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{COURSE_STATS.totalStudents}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">上周活跃学生</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{COURSE_STATS.activeLastWeek}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">平均完成率</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{COURSE_STATS.averageCompletion}%</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">学生提问次数</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{COURSE_STATS.studentQuestions}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">平均分数</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{COURSE_STATS.averageScore}</p>
            </div>
          </div>

          {/* 标签页 */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-4 px-1 ${
                  activeTab === 'courses'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                我的课程
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`pb-4 px-1 ${
                  activeTab === 'students'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                学生活动
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`pb-4 px-1 ${
                  activeTab === 'create'
                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                创建内容
              </button>
            </nav>
          </div>

          {/* 课程列表 */}
          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">我的课程</h2>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  创建新课程
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEACHER_COURSES.map(course => (
                  <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="h-40 bg-gray-300" style={{ backgroundColor: '#e5e7eb' }}>
                      {/* 课程缩略图占位符 */}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        {course.students} 名学生
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>完成度</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium">管理课程</button>
                        <span className="text-sm text-gray-500">更新于 {course.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 学生活动 */}
          {activeTab === 'students' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">最近学生活动</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {STUDENT_ACTIVITIES.map(activity => (
                    <li key={activity.id}>
                      <div className="px-6 py-4 flex items-center">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                              {activity.student.charAt(0)}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 px-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {activity.student} <span className="text-gray-600">{activity.activity}</span>
                              </p>
                              <p className="text-sm text-gray-500 truncate">{activity.course}</p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 创建内容 */}
          {activeTab === 'create' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">创建教学内容</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-600">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">创建课程大纲</h3>
                  <p className="text-gray-600 mb-4">使用AI智能分析生成全面的课程大纲和学习路径</p>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md shadow-sm">开始创建</button>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-600">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">创建教学PPT</h3>
                  <p className="text-gray-600 mb-4">输入主题和关键内容，AI自动生成教学幻灯片</p>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md shadow-sm">开始创建</button>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-600">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">创建测验与作业</h3>
                  <p className="text-gray-600 mb-4">自动生成各种类型的测试题和作业，支持自动评分</p>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md shadow-sm">开始创建</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 