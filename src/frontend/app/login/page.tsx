/**
 * 登录页面组件
 * 
 * 本组件实现了一个完整的登录页面，具有以下功能：
 * 1. 支持学生和教师两种角色的登录入口切换
 * 2. 提供邮箱和密码的输入验证
 * 3. 实现"记住我"选项和"忘记密码"链接
 * 4. 提供测试账号快速填充功能
 * 5. 基于用户角色的智能重定向
 * 6. 美观的UI设计，包括渐变背景和响应式布局
 * 
 * 技术实现：
 * - 使用React useState进行状态管理
 * - 使用Next.js的客户端组件和路由功能
 * - 应用Tailwind CSS进行样式设计
 * - 集成自定义身份验证逻辑
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './auth';
import Link from 'next/link';
import { UserRole } from './auth';
import AuthBackground from '../components/AuthBackground';

/**
 * 登录页面组件
 * 
 * 该组件是整个系统的入口点之一，负责用户认证流程
 * 内部逻辑处理用户提交的凭证并进行适当的路由导航
 * 
 * @returns {JSX.Element} 渲染完整的登录界面，包含表单和视觉元素
 */
export default function LoginPage() {
  // 状态管理区域
  /**
   * email - 存储用户输入的电子邮箱地址
   * 用于表单提交和后端验证，同时用于测试环境下判断用户角色
   */
  const [email, setEmail] = useState('');
  
  /**
   * password - 存储用户输入的密码
   * 用于表单提交和身份验证，实际项目中应加密处理
   */
  const [password, setPassword] = useState('');
  
  /**
   * userType - 控制当前选择的用户类型（学生/教师）
   * 影响UI显示状态和测试账号填充行为
   */
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  
  /**
   * error - 存储表单验证错误信息
   * 当验证失败时显示给用户，成功时为空字符串
   */
  const [error, setError] = useState('');
  
  /**
   * router - Next.js路由实例
   * 用于登录成功后页面导航和重定向
   */
  const router = useRouter();

  /**
   * 处理登录表单提交
   * 
   * 该函数是登录流程的核心，执行以下步骤：
   * 1. 阻止表单默认提交行为，避免页面刷新
   * 2. 验证用户输入的邮箱和密码是否为空
   * 3. 基于邮箱内容判断用户角色（仅测试环境使用）
   * 4. 构建用户数据对象，包含ID、姓名、邮箱、角色等信息
   * 5. 调用auth模块的login函数，将用户数据存入sessionStorage
   * 6. 根据用户角色和评估状态，重定向到相应的仪表盘页面
   * 
   * 注意：实际生产环境中，该函数应连接到后端API进行真实的身份验证
   * 
   * @param {React.FormEvent} e - 表单提交事件对象，用于阻止默认提交行为
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // 阻止表单默认提交行为
    
    // 简单的输入验证
    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }
    
    // 测试环境下基于邮箱判断用户角色
    // 注意：生产环境应从服务器获取实际角色
    let role: UserRole = 'student'; // 默认为学生角色
    let name = '测试学生';
    
    if (email.includes('teacher')) {
      role = 'teacher'; // 如果邮箱包含"teacher"，设为教师角色
      name = '测试教师';
    }
    
    // 创建用户数据对象
    const userData = {
      id: '1', // 测试用户ID
      name: name, // 用户姓名
      email: email, // 用户邮箱
      role: role // 用户角色
    };
    
    // 执行登录操作，保存用户数据到sessionStorage
    login(userData);
    
    // 基于用户角色进行页面重定向
    if (role === 'teacher') {
      router.push('/teacher'); // 教师重定向到教师仪表盘
    } else {
      router.push('/student'); // 学生重定向到学生仪表盘
    }
  };

  /**
   * 填充测试账号信息
   * 
   * 该功能为开发和演示环境提供便利，具体操作：
   * 1. 根据当前选择的用户类型（学生/教师）填充对应的测试邮箱
   * 2. 为两种类型的用户提供相同的测试密码
   * 3. 清除之前可能存在的错误信息，保证良好的用户体验
   * 
   * 在生产环境中可以禁用或移除此功能，避免安全隐患
   * 
   * @param {'student' | 'teacher'} type - 用户选择的账号类型，决定填充哪种测试账号
   */
  const handleTestAccount = (type: 'student' | 'teacher') => {
    if (type === 'student') {
      setEmail('student@example.com'); // 填充学生测试邮箱
      setPassword('password123'); // 填充测试密码
    } else {
      setEmail('teacher@example.com'); // 填充教师测试邮箱
      setPassword('password123'); // 填充测试密码
    }
    setError(''); // 清除可能存在的错误信息
  };

  // 页面UI渲染
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
        {/* 
          用户类型选择按钮组 - 切换学生/教师登录模式
          功能与设计：
          1. 水平排列的两个按钮，居中对齐
          2. 动态样式：选中状态使用渐变背景和阴影
          3. 点击按钮时更新userType状态
          4. 状态变化触发视觉反馈，提升用户体验
          5. 影响后续测试账号填充行为和登录后的重定向逻辑
        */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setUserType('student')}
            className={`px-4 py-2 rounded-lg transition-all ${
              userType === 'student'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md' // 选中状态样式
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // 未选中状态样式
            }`}
          >
            学生登录
          </button>
          <button
            onClick={() => setUserType('teacher')}
            className={`px-4 py-2 rounded-lg transition-all ${
              userType === 'teacher'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md' // 选中状态样式
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // 未选中状态样式
            }`}
          >
            教师登录
          </button>
        </div>

        {/* 
          错误信息显示区域 - 条件渲染组件
          特点：
          1. 仅在error状态非空时显示
          2. 使用红色背景和边框提示警告性质
          3. 内部显示具体错误消息
          4. 圆角设计与整体UI风格一致
          常见错误包括：空字段验证失败、登录凭证无效等
        */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* 
            邮箱输入字段 - 用户标识符输入
            特点与交互：
            1. 包含描述性标签和输入框
            2. 使用email类型输入，启用浏览器内置验证
            3. 实时更新email状态变量
            4. 聚焦时显示蓝色轮廓，提升可访问性
            5. 包含描述性占位符文本
            6. 设置为必填字段，触发浏览器验证
          */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
              placeholder="请输入邮箱"
              required
            />
          </div>

          {/* 
            密码输入字段 - 安全凭证输入
            特点与交互：
            1. 包含描述性标签和密码类型输入框
            2. 密码内容自动隐藏为小圆点
            3. 实时更新password状态变量
            4. 聚焦时显示蓝色轮廓，提升可访问性
            5. 包含描述性占位符文本
            6. 设置为必填字段，触发浏览器验证
            注意：生产环境应实施密码强度检查和安全存储
          */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
              placeholder="请输入密码"
              required
            />
          </div>

          {/* 
            额外选项区域 - 包含两个辅助功能
            1. 左侧：记住我复选框
               - 允许用户选择是否在设备上保持登录状态
               - 包含复选框和描述性标签
               - 注意：功能实现需要在handleLogin中添加逻辑
            2. 右侧：忘记密码链接
               - 提供密码找回功能入口
               - 使用Next.js Link组件实现导航
               - 鼠标悬停时颜色变化提供反馈
            两个元素使用space-between布局实现两端对齐
          */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                记住我
              </label>
            </div>

            <Link href="/forgot-password" className="text-sm bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent hover:from-indigo-600 hover:to-blue-600 underline">
              忘记密码?
            </Link>
          </div>

          {/* 
            登录按钮 - 表单提交控件
            设计与功能：
            1. 全宽按钮，使用从靛蓝到蓝色的渐变背景
            2. 鼠标悬停时颜色加深，提供视觉反馈
            3. 点击时触发handleLogin函数，提交表单数据
            4. 包含焦点状态样式，提升键盘可访问性
            5. 应用阴影效果增强立体感，悬停时阴影加深
            按钮样式与品牌标识保持一致，强化视觉识别
          */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
          >
            登录
          </button>

          {/* 
            注册链接区域 - 新用户入口
            设计与功能：
            1. 居中对齐的提示文字
            2. 使用Next.js Link组件链接到注册页面
            3. 链接使用品牌色，悬停时颜色变化提供反馈
            4. 为新用户提供明确的注册路径
            位置放置在登录按钮下方，作为次要操作选项
          */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              还没有账号？{' '}
              <Link href="/register" className="text-sm bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent hover:from-indigo-600 hover:to-blue-600 underline">
                立即注册
              </Link>
            </p>
          </div>

          {/* 
            测试账号按钮 - 开发/演示便利功能
            设计与功能：
            1. 居中对齐的文本按钮
            2. 点击时调用handleTestAccount函数
            3. 根据当前选择的userType填充不同的测试账号
            4. 悬停时显示品牌色，提供视觉反馈
            5. 使用动态文本显示当前选定的用户类型
            该功能适用于开发环境和演示环境，生产环境可考虑移除
          */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => handleTestAccount(userType)}
              className="text-sm bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent hover:from-indigo-600 hover:to-blue-600 underline"
            >
              使用{userType === 'student' ? '学生' : '教师'}测试账户
            </button>

          </div>
          <p className="text-red-600 text-center">
              系统演示版本
            </p>
        </form>
      </div>
    </AuthBackground>
  );
}