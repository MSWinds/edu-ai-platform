'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthBackground from '../components/AuthBackground';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('请输入邮箱地址');
      return;
    }

    // 这里添加实际的密码重置逻辑
    setSuccess(true);
  };

  return (
    <AuthBackground>
      {/* 品牌标识区域 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI知行学堂
        </h1>
        <p className="text-gray-600">
          AI+X 智学引擎，培养实战型复合人才
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">找回密码</h2>
          <p className="mt-2 text-gray-600">
            请输入您的注册邮箱，我们将向您发送密码重置链接
          </p>
        </div>

        {success ? (
          <div className="text-center mt-6">
            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
              密码重置链接已发送到您的邮箱，请查收
            </div>
            <Link
              href="/frontend/login"
              className="text-indigo-600 hover:text-indigo-500"
            >
              返回登录
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="请输入注册邮箱"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
              发送重置链接
            </button>

            <div className="text-center">
              <Link
                href="/frontend/login"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                返回登录
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthBackground>
  );
} 