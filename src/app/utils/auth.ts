import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from './localStorage';

// 用户角色类型
export type UserRole = 'student' | 'teacher' | 'admin';

// 用户结构类型
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hasCompletedAssessment?: boolean;
}

// 检查用户是否已登录
export function isAuthenticated(): boolean {
  const user = getUser();
  return !!user;
}

// 从本地存储获取用户信息
export function getUser(): User | null {
  try {
    const userData = getLocalStorage('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return null;
  }
}

// 登录并保存用户信息到本地存储
export function login(user: User): void {
  setLocalStorage('user', JSON.stringify(user));
}

// 登出并从本地存储移除用户信息
export function logout(): void {
  removeLocalStorage('user');
}

// 检查是否未登录，如果未登录则重定向到登录页
export function redirectIfNotAuthenticated(router: AppRouterInstance): boolean {
  try {
    const user = getUser();
    if (!user) {
      console.log('未登录，重定向到登录页');
      router.push('/login');
      return true;
    }
    return false;
  } catch (error) {
    console.error('检查认证状态时出错:', error);
    router.push('/login');
    return true;
  }
}

// 检查是否已登录，如果已登录则重定向到仪表盘
export function redirectIfAuthenticated(router: AppRouterInstance): boolean {
  try {
    const user = getUser();
    if (user) {
      console.log('已登录，重定向到仪表盘');
      // 根据用户角色重定向到相应页面
      if (user.role === 'teacher' || user.role === 'admin') {
        router.push('/dashboard/teacher');
      } else if (user.role === 'student' && !user.hasCompletedAssessment) {
        router.push('/assessment');
      } else {
        router.push('/dashboard');
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('检查认证状态时出错:', error);
    return false;
  }
}

// 根据用户角色重定向到相应的仪表盘
export function redirectToDashboard(router: AppRouterInstance, user: User): void {
  try {
    if (user.role === 'teacher') {
      router.push('/dashboard/teacher');
    } else if (user.role === 'admin') {
      router.push('/dashboard/admin');
    } else if (user.role === 'student') {
      // 先检查学生是否已完成评估
      if (user.hasCompletedAssessment) {
        router.push('/dashboard');
      } else {
        router.push('/assessment');
      }
    } else {
      // 未知角色，默认到学生仪表盘
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('重定向到仪表盘时出错:', error);
    // 发生错误时默认重定向到主仪表盘
    router.push('/dashboard');
  }
}

export interface UserPreferences {
  theme?: string;
  notifications?: boolean;
  weeklyGoal?: number;
  learningStyle?: string;
}

export const updateUser = (updatedData: Partial<User>): boolean => {
  const currentUser = getUser();
  if (!currentUser) return false;
  
  const updatedUser = {
    ...currentUser,
    ...updatedData
  };
  
  return setLocalStorage('user', JSON.stringify(updatedUser));
};

export const updateUserPreferences = (preferences: Partial<UserPreferences>): boolean => {
  const currentUser = getUser();
  if (!currentUser) return false;
  
  const updatedUser = {
    ...currentUser,
    preferences: {
      ...currentUser.preferences,
      ...preferences
    }
  };
  
  return setLocalStorage('user', JSON.stringify(updatedUser));
};

export const completeAssessment = (): boolean => {
  const currentUser = getUser();
  if (!currentUser) return false;
  
  const updatedUser = {
    ...currentUser,
    hasCompletedAssessment: true
  };
  
  return setLocalStorage('user', JSON.stringify(updatedUser));
};

export const isTeacher = (): boolean => {
  const user = getUser();
  return user !== null && (user.role === 'teacher' || user.role === 'admin');
};

export const isStudent = (): boolean => {
  const user = getUser();
  return user !== null && user.role === 'student';
};

export const hasCompletedAssessment = (): boolean => {
  const user = getUser();
  return user !== null && user.hasCompletedAssessment;
}; 