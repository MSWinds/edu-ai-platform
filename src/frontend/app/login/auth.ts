/**
 * 用户认证工具模块
 * 
 * 本模块提供了用户认证相关的工具函数，包括：
 * - 用户登录/登出功能
 * - 用户信息获取与存储
 * - 基于角色的页面重定向
 * - 用户角色验证
 * 
 * 使用sessionStorage存储用户信息，适用于客户端渲染的Next.js应用
 */

import { useRouter } from 'next/navigation';

/**
 * 路由器实例类型
 * 定义Next.js路由器实例的类型，用于类型检查
 */
type AppRouterInstance = ReturnType<typeof useRouter>;

/**
 * 用户角色类型
 * 系统中用户只能是以下两种角色之一：
 * - 'student': 学生用户
 * - 'teacher': 教师用户
 */
export type UserRole = 'student' | 'teacher';

/**
 * 用户结构类型
 * 定义了系统中用户对象的数据结构
 */
export interface User {
  id: string; // 用户唯一标识符
  name: string; // 用户姓名
  email: string; // 用户电子邮箱
  role: UserRole; // 用户角色（'student'或'teacher'）
  bio?: string; // 用户简介
  memoryId?: string; // AI助手的记忆体ID，用于个性化对话
  preferences?: {
    notifications: boolean;
    theme: string;
    weeklyGoal: number;
    learningStyle: string;
  };
}

/**
 * 测试账号配置
 * 包含不同学习水平的学生账号，用于演示AI助手的个性化回复
 */
export const TEST_ACCOUNTS = {
  beginner: {
    id: '1',
    name: '初学者学生',
    email: 'beginner@test.com',
    role: 'student' as UserRole,
    memoryId: '748182d5281c4032a10e70085ce6aea0', // 初学者记忆体ID
    bio: '编程初学者，刚开始接触编程'
  },
  advanced: {
    id: '2',
    name: '进阶学生',
    email: 'advanced@test.com',
    role: 'student' as UserRole,
    memoryId: '5e4ed1246f524fd4a7f56eb2a4120906', // 进阶学生记忆体ID
    bio: '有一定编程基础，正在深入学习'
  },
  teacher: {
    id: '3',
    name: '测试教师',
    email: 'teacher@test.com',
    role: 'teacher' as UserRole,
    bio: '资深教师'
  }
};

/**
 * 检查用户是否已登录
 * 
 * 通过检查sessionStorage中是否存在用户信息来判断登录状态
 * 
 * @returns {boolean} 如果用户已登录返回true，否则返回false
 */
export function isAuthenticated(): boolean {
  return !!sessionStorage.getItem('user');
}

/**
 * 从sessionStorage获取用户信息
 * 
 * 尝试从sessionStorage中读取并解析用户数据
 * 
 * @returns {User|null} 返回用户对象，如果不存在或解析失败则返回null
 */
export function getUser(): User | null {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return null;
  }
}

/**
 * 登录并保存用户信息到sessionStorage
 * 
 * 将用户对象序列化为JSON字符串并存储到sessionStorage中
 * 
 * @param {User} user - 要存储的用户对象
 */

export function login(user: User): void {
  sessionStorage.setItem('user', JSON.stringify(user));
}

/**
 * 登出并从sessionStorage移除用户信息
 * 
 * 清除sessionStorage中的用户数据，实现用户登出
 */

export function logout(): void {
  sessionStorage.removeItem('user');
}

/**
 * 检查是否未登录，如果未登录则重定向到登录页
 * 
 * 用于保护需要身份验证的页面，防止未登录用户访问
 * 
 * @param {AppRouterInstance} router - Next.js路由器实例
 * @returns {boolean} 如果重定向发生返回true，否则返回false
 */

export function redirectIfNotAuthenticated(router: AppRouterInstance): boolean {
  try {
    const user = getUser();
    if (!user) {
      console.log('未登录，重定向到登录页');
      router.push('/login');
      return true; // 表示重定向已发生
    }
    return false; // 表示用户已登录，无需重定向
  } catch (error) {
    console.error('检查认证状态时出错:', error);
    router.push('/login');
    return true; // 发生错误时也重定向到登录页
  }
}

/**
 * 检查是否已登录，如果已登录则重定向到仪表盘
 * 
 * 用于登录页面等，防止已登录用户再次访问这些页面
 * 
 * @param {AppRouterInstance} router - Next.js路由器实例
 * @returns {boolean} 如果重定向发生返回true，否则返回false
 */
export function redirectIfAuthenticated(router: AppRouterInstance): boolean {
  try {
    const user = getUser();
    if (user) {
      console.log('已登录，重定向到仪表盘');
      // 根据用户角色重定向到相应页面
      if (user.role === 'teacher') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard');
      }
      return true; // 表示重定向已发生
    }
    return false; // 表示用户未登录，无需重定向
  } catch (error) {
    console.error('检查认证状态时出错:', error);
    return false; // 发生错误时不进行重定向
  }
}

/**
 * 根据用户角色重定向到相应的仪表盘
 * 
 * 在登录成功后或需要返回仪表盘时使用
 * 
 * @param {AppRouterInstance} router - Next.js路由器实例
 * @param {User} user - 用户对象
 */
export function redirectToDashboard(router: AppRouterInstance, user: User): void {
  try {
    if (user.role === 'teacher') {
      router.push('/teacher_dashboard'); // Updated to match the actual teacher dashboard path
    } else {
      router.push('/student_dashboard'); // Updated to match the actual student dashboard path
    }
  } catch (error) {
    console.error('重定向到仪表盘时出错:', error);
    router.push('/'); // 发生错误时重定向到首页
  }
}

/**
 * 检查当前登录用户是否是教师
 * 
 * 用于判断用户权限，控制功能访问
 * 
 * @returns {boolean} 如果当前用户是教师返回true，否则返回false
 */
export function isTeacher(): boolean {
  const user = getUser();
  return user?.role === 'teacher';
}

/**
 * 检查当前登录用户是否是学生
 * 
 * 用于判断用户权限，控制功能访问
 * 
 * @returns {boolean} 如果当前用户是学生返回true，否则返回false
 */
export function isStudent(): boolean {
  const user = getUser();
  return user?.role === 'student';
}

/**
 * 更新用户信息
 * @param {Partial<User>} userData - 要更新的用户数据
 * @returns {boolean} 更新是否成功
 */
export function updateUser(userData: Partial<User>): boolean {
  try {
    const currentUser = getUser();
    if (!currentUser) return false;
    
    const updatedUser = { ...currentUser, ...userData };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    return true;
  } catch (error) {
    console.error('更新用户数据失败:', error);
    return false;
  }
}

/**
 * 更新用户偏好设置
 * @param {any} preferences - 用户偏好设置
 * @returns {boolean} 更新是否成功
 */
export function updateUserPreferences(preferences: any): boolean {
  try {
    const currentUser = getUser();
    if (!currentUser) return false;
    
    const updatedUser = { 
      ...currentUser, 
      preferences: { ...currentUser.preferences, ...preferences } 
    };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    return true;
  } catch (error) {
    console.error('更新用户偏好设置失败:', error);
    return false;
  }
}