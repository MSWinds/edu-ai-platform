'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { redirectIfNotAuthenticated, redirectIfAuthenticated, login } from '../utils/auth';

// Define UserRole type
type UserRole = 'student' | 'teacher' | 'admin';

// 模拟用户数据
const USERS = [
  {
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    hasCompletedAssessment: false,
    name: '张三'
  },
  {
    email: 'teacher@example.com',
    password: 'teacher123',
    role: 'teacher',
    hasCompletedAssessment: true,
    name: '李教授'
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    hasCompletedAssessment: true,
    name: '管理员'
  }
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // 检查是否已经登录，如果是则跳转到dashboard
  useEffect(() => {
    redirectIfAuthenticated(router);
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单的验证
    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }
    
    // 查找用户
    const user = USERS.find(user => user.email === email && user.password === password);
    
    if (!user) {
      setError('邮箱或密码错误');
      return;
    }
    
    // 模拟登录成功 - 存储用户信息到 localStorage
    const userData = {
      id: '1',
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      hasCompletedAssessment: user.hasCompletedAssessment
    };
    
    // 调用登录函数
    login(userData);
    
    // 根据角色和评估状态重定向到不同页面
    if (user.role === 'teacher' || user.role === 'admin') {
      // 教师或管理员跳转到教师仪表盘
      router.push('/dashboard/teacher');
    } else if (user.role === 'student' && !user.hasCompletedAssessment) {
      // 学生且尚未完成测评，重定向到测评页面
      router.push('/assessment');
    } else {
      // 否则前往学生仪表盘
      router.push('/dashboard');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = (userType: string) => {
    let demoUser;
    
    if (userType === 'student') {
      demoUser = USERS.find(user => user.role === 'student');
    } else if (userType === 'teacher') {
      demoUser = USERS.find(user => user.role === 'teacher');
    }
    
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword(demoUser.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI知行学堂</h1>
            <p className="mt-2 text-gray-dark">
              智能驱动个性化学习体验123
            </p>
            <p className="mt-2 text-gray-dark">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-dark">
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
                  className="appearance-none block w-full px-3 py-3 border border-gray rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-dark">
                密码
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="请输入密码"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-dark"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-dark">
                  记住我
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  忘记密码?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                登录
              </button>
            </div>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-dark">
                  或使用演示账号
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                学生账号
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
               jia 
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-dark">
              还没有账号?{' '}
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                立即注册
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 