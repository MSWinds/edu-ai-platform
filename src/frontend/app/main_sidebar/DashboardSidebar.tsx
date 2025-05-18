'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout, getUser, User } from '../login/auth';
import { colors } from '../theme/colors';
import { JSX } from 'react';

interface DashboardSidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
  children?: React.ReactNode;
}

export default function DashboardSidebar({ userRole, userName, userEmail, onCollapsedChange, children }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // 修改 active 状态判断逻辑
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };
  
  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const role = userRole || user?.role || 'student';
  const name = userName || user?.name || '用户';
  const email = userEmail || user?.email || 'user@example.com';
  
  // 当collapsed状态改变时，调用父组件的回调
  useEffect(() => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    }
  }, [collapsed, onCollapsedChange]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // 学生菜单项导航链接
  const studentMenuItems = [
    {
      href: "/student_dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: "学生仪表盘"
    },
    {
      href: "/class_page",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      label: "课程列表"
    },
    {
      href: "/custom_report",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      label: "智能学习跟踪"
    },
    {
      href: "/custom_assignment",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      label: "智能测验"
    },
    // {
    //   href: "/dashboard/grading",
    //   icon: (
    //     <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    //     </svg>
    //   ),
    //   label: "成绩分析"
    // },
    {
      href: "/ai_assistant",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      label: "AI助教"
    },
    {
      href: "/learning_community",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: "学习社区"
    }
    ,
    {
      href: "/messages",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 11h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      label: "消息"
    }
  ];
  
  // 教师菜单项导航链接
  const teacherMenuItems = [
    {
      href: "/teacher_dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: "教师智能仪表"
    },
    {
      href: "/dashboard/teacher/courses",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      label: "课程管理"
    },
    {
      href: "/dashboard/teacher/students",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      label: "学生管理"
    },
    {
      href: "/dashboard/teacher/content",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label: "AI智能建课"
    },
    {
      href: "/dashboard/teacher/analytics",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: "教学资源"
    },
    {
      href: "/dashboard/teacher/mail",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 11h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      label: "消息"
    }
  ];
  
  // 根据角色选择菜单项
  const menuItems = role === 'teacher' || role === 'admin' ? teacherMenuItems : studentMenuItems;

  return (
    <div className="flex min-h-screen">
      <div className={`fixed left-0 top-0 h-screen border-r z-20 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
        style={{ 
          backgroundColor: colors.background,
          borderColor: colors.border,
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)'
        }}>
        <div className="flex flex-col h-full">
          {/* Logo 和折叠按钮 */}
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}` }}>
            {!collapsed ? (
              <div className="flex items-center space-x-3 min-w-[40px]">
                <div className="h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ background: colors.gradient.primary }}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="font-bold text-xl" style={{ color: colors.text.primary }}>
                  AI知行学堂
                </span>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <button
                  onClick={() => setCollapsed(false)}
                  className="p-1.5 rounded-lg transition-all duration-200"
                  style={{ 
                    color: colors.text.secondary,
                    backgroundColor: colors.background
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.cardBg;
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background;
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
            
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg transition-all duration-200"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cardBg;
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.text.secondary;
                }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
          
          {/* 用户信息 */}
          <div className={`${collapsed ? 'py-4' : 'p-4'}`} 
            style={{ backgroundColor: colors.cardBg, borderBottom: `1px solid ${colors.border}` }}>
            <div className={`flex ${collapsed ? 'justify-center' : 'items-center'}`}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-medium text-lg shadow-lg"
                style={{ background: colors.gradient.primary }}>
                {name.charAt(0)}
              </div>
              {!collapsed && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium truncate" style={{ color: colors.text.primary }}>{name}</p>
                  <p className="text-xs truncate" style={{ color: colors.text.secondary }}>{email}</p>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 text-xs rounded-full capitalize text-white"
                      style={{ background: colors.gradient.primary }}>
                      {role === 'teacher' ? '教师' : role === 'admin' ? '管理员' : '学生'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 导航菜单 */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const isItemActive = isActive(item.href);
                return (
                  <li key={index}>
                    <Link 
                      href={item.href} 
                      className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2.5 
                        rounded-xl transition-all duration-200`}
                      style={{ 
                        background: isItemActive ? colors.gradient.primary : 'transparent',
                        color: isItemActive ? '#ffffff' : colors.text.secondary,
                        boxShadow: isItemActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isItemActive) {
                          e.currentTarget.style.backgroundColor = colors.cardBg;
                          e.currentTarget.style.color = colors.primary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isItemActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.text.secondary;
                        }
                      }}
                    >
                      <div style={{ color: isItemActive ? '#ffffff' : 'inherit' }}>
                        {item.icon}
                      </div>
                      {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* 底部菜单 */}
          <div className="p-3" style={{ borderTop: `1px solid ${colors.border}` }}>
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/setting" 
                  className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2.5 
                    rounded-xl transition-all duration-200`}
                  style={{ 
                    background: isActive('/setting') ? colors.gradient.primary : 'transparent',
                    color: isActive('/setting') ? '#ffffff' : colors.text.secondary,
                    boxShadow: isActive('/setting') ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('/setting')) {
                      e.currentTarget.style.backgroundColor = colors.cardBg;
                      e.currentTarget.style.color = colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/setting')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  <div style={{ color: isActive('/setting') ? '#ffffff' : 'inherit' }}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  {!collapsed && <span className="ml-3 text-sm font-medium">设置</span>}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2.5 
                    w-full rounded-xl transition-all duration-200 cursor-pointer`}
                  style={{ 
                    background: isActive('/logout') ? colors.gradient.primary : 'transparent',
                    color: isActive('/logout') ? '#ffffff' : colors.text.secondary,
                    boxShadow: isActive('/logout') ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('/logout')) {
                      e.currentTarget.style.backgroundColor = colors.cardBg;
                      e.currentTarget.style.color = colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/logout')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {!collapsed && <span className="ml-3 text-sm font-medium">退出登录</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Main content wrapper */}
      <div 
        className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </div>
    </div>
  );
}