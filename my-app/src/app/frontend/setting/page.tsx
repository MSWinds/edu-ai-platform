'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { getUser, updateUser, updateUserPreferences, redirectIfNotAuthenticated, User } from '../login/auth';

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    notifications: false,
    theme: 'system',
    weeklyGoal: 5,
    learningStyle: '视觉学习'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    if (!redirectIfNotAuthenticated(router)) {
      const userData = getUser();
      if (userData) {
        setUser(userData);
        
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          notifications: userData.preferences?.notifications || false,
          theme: userData.preferences?.theme || 'system',
          weeklyGoal: userData.preferences?.weeklyGoal || 5,
          learningStyle: userData.preferences?.learningStyle || '视觉学习'
        });
      }
    }
    setIsLoading(false);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const updatedUser = {
      name: formData.name,
      bio: formData.bio
    };
    
    const preferences = {
      notifications: formData.notifications,
      theme: formData.theme,
      weeklyGoal: parseInt(formData.weeklyGoal.toString()),
      learningStyle: formData.learningStyle
    };
    
    const userUpdated = updateUser(updatedUser);
    const preferencesUpdated = updateUserPreferences(preferences);
    
    if (userUpdated && preferencesUpdated) {
      setMessage({ 
        type: 'success', 
        text: '设置已成功更新！' 
      });
      
      // 更新本地状态
      setUser((prev: User | null) => ({
        ...prev,
        ...updatedUser,
        preferences: {
          ...prev?.preferences,
          ...preferences
        }
      }));
      
      // 5秒后清除消息
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    } else {
      setMessage({ 
        type: 'error', 
        text: '更新设置时出错，请重试。' 
      });
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 简单验证
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '请填写所有密码字段' });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '新密码与确认密码不匹配' });
      return;
    }
    
    // 在实际应用中，这里应该调用API来更新密码
    // 这里仅模拟成功
    setMessage({ type: 'success', text: '密码已成功更新！' });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // 5秒后清除消息
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 5000);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">加载中...</div>;
  }

  return (
    <DashboardSidebar>
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">账户设置</h1>
            <p className="mt-1 text-sm text-gray-500">管理您的账户信息和偏好设置</p>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  个人资料
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'preferences'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  学习偏好
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'security'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  安全设置
                </button>
              </nav>
            </div>
            
            {message.text && (
              <div className={`p-4 ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}
            
            <div className="p-6">
              {/* 个人资料表单 */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                          {formData.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-5">
                          <button
                            type="button"
                            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            更改头像
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          姓名
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          邮箱
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          邮箱地址不可更改
                        </p>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          个人简介
                        </label>
                        <textarea
                          name="bio"
                          id="bio"
                          rows={3}
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="简单介绍一下自己..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        保存更改
                      </button>
                    </div>
                  </div>
                </form>
              )}
              
              {/* 学习偏好表单 */}
              {activeTab === 'preferences' && (
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">学习偏好设置</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        这些设置将用于个性化您的学习体验
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700">
                          学习风格
                        </label>
                        <select
                          id="learningStyle"
                          name="learningStyle"
                          value={formData.learningStyle}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="视觉学习">视觉学习</option>
                          <option value="听觉学习">听觉学习</option>
                          <option value="阅读学习">阅读学习</option>
                          <option value="实践学习">实践学习</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="weeklyGoal" className="block text-sm font-medium text-gray-700">
                          每周学习目标（小时）
                        </label>
                        <select
                          id="weeklyGoal"
                          name="weeklyGoal"
                          value={formData.weeklyGoal}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="3">3小时/周</option>
                          <option value="5">5小时/周</option>
                          <option value="8">8小时/周</option>
                          <option value="10">10小时/周</option>
                          <option value="15">15小时/周</option>
                          <option value="20">20小时/周</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                          界面主题
                        </label>
                        <select
                          id="theme"
                          name="theme"
                          value={formData.theme}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="system">跟随系统</option>
                          <option value="light">浅色主题</option>
                          <option value="dark">深色主题</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center h-full">
                        <div className="relative flex items-start pt-6">
                          <div className="flex items-center h-5">
                            <input
                              id="notifications"
                              name="notifications"
                              type="checkbox"
                              checked={formData.notifications}
                              onChange={handleInputChange}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="notifications" className="font-medium text-gray-700">
                              开启通知
                            </label>
                            <p className="text-gray-500">接收学习进度和课程更新的提醒</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        保存更改
                      </button>
                    </div>
                  </div>
                </form>
              )}
              
              {/* 安全设置表单 */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">修改密码</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        确保您的新密码足够强大，建议包含字母、数字和特殊字符
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          当前密码
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          新密码
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          确认新密码
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        更新密码
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">账户安全</h3>
                      
                      <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">危险区域</h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>永久删除您的账户将移除所有数据，此操作不可撤销。</p>
                            </div>
                            <div className="mt-4">
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                删除账户
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </DashboardSidebar>
  );
} 