'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isAuthenticated, getUser } from '../utils/auth';

export default function DebugPage() {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);
  
  useEffect(() => {
    // 检查认证状态
    setAuthStatus(isAuthenticated());
    setUserData(getUser());
    
    // 获取所有localStorage键
    if (typeof window !== 'undefined') {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
      }
      setLocalStorageKeys(keys);
    }
  }, []);
  
  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-primary text-white">
            <h1 className="text-xl font-bold">调试页面</h1>
            <p className="text-sm opacity-80">显示当前登录状态与存储信息</p>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">认证状态</h2>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-mono">isAuthenticated: {authStatus !== null ? authStatus.toString() : '加载中...'}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">用户数据</h2>
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  {userData ? JSON.stringify(userData, null, 2) : '未登录或加载中...'}
                </pre>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">LocalStorage 键</h2>
              <div className="bg-gray-100 p-4 rounded-md">
                <ul className="list-disc list-inside font-mono">
                  {localStorageKeys.length > 0 ? (
                    localStorageKeys.map(key => <li key={key}>{key}</li>)
                  ) : (
                    <li>无数据</li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Link 
                href="/login"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                返回登录
              </Link>
              
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                前往仪表盘
              </Link>
              
              <button
                onClick={clearLocalStorage}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                清除所有存储
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 