'use client';

import Link from 'next/link';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { colors } from '../theme/colors';
import { mockCourseData } from '../mockdata/courseData';

export default function ClassPage() {
  return (
    <DashboardSidebar>
      <div className="flex-1">
        <header className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">课程列表</h1>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-lg overflow-hidden" 
              style={{ 
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`
              }}>
              <div className="h-40 flex items-center justify-center"
                style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2" style={{ color: colors.text.primary }}>{mockCourseData.title}</h3>
                <p className="mb-4 line-clamp-2" style={{ color: colors.text.secondary }}>{mockCourseData.description}</p>
                
                <div className="flex items-center text-sm mb-4" style={{ color: colors.text.secondary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  讲师: {mockCourseData.instructor}
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    href={`/courses/${mockCourseData.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    查看课程
                  </Link>
                  <span className="text-sm text-gray-500">共{mockCourseData.totalWeeks}周</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardSidebar>
  );
}
