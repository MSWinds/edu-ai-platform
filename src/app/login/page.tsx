'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../utils/auth';

// Define UserRole type
type UserRole = 'student' | 'teacher' | 'admin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }
    
    // For testing purposes, we'll use simple role-based authentication
    let role: UserRole = 'student';
    let name = '测试学生';
    
    if (email.includes('teacher')) {
      role = 'teacher';
      name = '测试教师';
    } else if (email.includes('admin')) {
      role = 'admin';
      name = '测试管理员';
    }
    
    // Create user data
    const userData = {
      id: '1',
      name: name,
      email: email,
      role: role,
      hasCompletedAssessment: role !== 'student' // Teachers and admins don't need assessment
    };
    
    // Login and redirect
    login(userData);
    
    // Redirect based on role
    if (role === 'teacher' || role === 'admin') {
      router.push('/dashboard/teacher');
    } else {
      // For students, check if they've completed assessment
      if (userData.hasCompletedAssessment) {
        router.push('/dashboard');
      } else {
        router.push('/assessment');
      }
    }
  };

  // Quick login buttons for testing
  const handleQuickLogin = (userType: string) => {
    if (userType === 'student') {
      setEmail('student@example.com');
      setPassword('password123');
    } else if (userType === 'teacher') {
      setEmail('teacher@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-full p-3 shadow-lg">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI知行学堂</h1>
            <p className="mt-2 text-gray-600">
              智能驱动个性化学习体验
              <br /><br />
              产品功能展示版本
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                登录
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  快速测试登录
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                学生账号
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                教师账号
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 