import { useState } from 'react';
import type { CourseReference } from '../types/chat';

interface CourseSelectorProps {
  onSelect: (courseRef: CourseReference) => void;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

export function CourseSelector({ onSelect, onClose, position = 'bottom' }: CourseSelectorProps) {
  // 硬编码课程结构
  const courses = [
    {
      id: 'ai-intro',
      name: '人工智能基础导论',
      modules: [
        {
          id: 'week7',
          name: '第7周：提示词工程',
          contents: [
            { id: 'lecture', name: '课件', desc: '提示词工程设计方法与技巧' },
            { id: 'assignment', name: '作业', desc: '提示词优化实战练习' },
            { id: 'resource', name: '资源', desc: 'ChatGPT提示词工程指南PDF' },
            { id: 'quiz', name: '堂测', desc: '提示词工程实践测试' }
          ]
        }
      ]
    }
  ];

  // 特殊功能入口
  const specialEntries = [
    { 
      id: 'learning-tracking', 
      label: '智能学习跟踪', 
      specialType: 'learning-tracking',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      desc: '跟踪学习进度和效果分析'
    },
    { 
      id: 'quiz', 
      label: '智能测验', 
      specialType: 'quiz',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      desc: '生成练习题和知识测评'
    },
    { 
      id: 'community', 
      label: '学习社区', 
      specialType: 'community',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      desc: '参与讨论和学习交流'
    },
  ];

  // 状态管理
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedSpecialId, setSelectedSpecialId] = useState<string | null>(null);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const selectedModule = selectedCourse?.modules.find(m => m.id === selectedModuleId);
  const selectedSpecial = specialEntries.find(s => s.id === selectedSpecialId);

  // 处理选择课程
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedModuleId(null);
    setSelectedSpecialId(null);
  };

  // 处理选择模块
  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  // 处理选择内容
  const handleSelectContent = (contentType: string) => {
    if (!selectedCourse || !selectedModule) return;
    const content = selectedModule.contents.find(c => c.id === contentType);
    if (content) {
      onSelect({
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        moduleId: selectedModule.id,
        moduleName: selectedModule.name,
        contentType: contentType as 'lecture' | 'assignment' | 'resource' | 'quiz',
        contentName: content.desc,
        referenceLevel: 'content',
      });
      onClose();
    }
  };

  // 处理选择特殊功能
  const handleSelectSpecial = (specialId: string) => {
    setSelectedSpecialId(specialId);
    setSelectedCourseId(null);
    setSelectedModuleId(null);
  };

  // 处理@整个课程
  const handleSelectWholeCourse = () => {
    if (!selectedCourse) return;
    onSelect({
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      referenceLevel: 'course',
    });
    onClose();
  };

  // 处理@整个模块
  const handleSelectWholeModule = () => {
    if (!selectedCourse || !selectedModule) return;
    onSelect({
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      moduleId: selectedModule.id,
      moduleName: selectedModule.name,
      referenceLevel: 'module',
    });
    onClose();
  };

  // 处理@整个特殊功能
  const handleSelectWholeSpecial = () => {
    if (!selectedSpecial) return;
    onSelect({
      referenceLevel: 'special',
      specialType: selectedSpecial.specialType as 'learning-tracking' | 'quiz' | 'community',
    });
    onClose();
  };

  // 根据position设置定位类
  const positionClass = position === 'top' 
    ? 'bottom-full left-0 mb-2' 
    : 'top-0 left-0 transform -translate-y-full';

  // 第一层：特殊功能 + 课程
  if (!selectedCourseId && !selectedSpecialId) {
    return (
      <div className={`absolute ${positionClass} w-80 bg-white rounded-lg shadow-lg border p-4 z-50`}>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">选择功能或课程</h3>
        </div>
        
        {/* 特殊功能区域 */}
        <div className="space-y-2 mb-4">
          {specialEntries.map(entry => (
            <div
              key={entry.id}
              onClick={() => handleSelectSpecial(entry.id)}
              className="group p-3 hover:bg-blue-50 rounded-lg cursor-pointer border border-transparent hover:border-blue-200 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="text-blue-600 group-hover:text-blue-700">
                  {entry.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-blue-700 group-hover:text-blue-800">
                    {entry.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {entry.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 分割线 */}
        <div className="border-t border-gray-200 my-3"></div>
        
        {/* 课程区域 */}
        <div className="space-y-2">
          <div 
            onClick={() => handleSelectCourse('ai-intro')}
            className="group p-3 hover:bg-green-50 rounded-lg cursor-pointer border border-transparent hover:border-green-200 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="text-green-600 group-hover:text-green-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-green-700 group-hover:text-green-800">
                  课程
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  浏览课程内容和资料
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 特殊功能的第二层
  if (selectedSpecialId) {
    return (
      <div className={`absolute ${positionClass} w-80 bg-white rounded-lg shadow-lg border p-4 z-50`}>
        <div className="mb-3">
          <button 
            onClick={() => setSelectedSpecialId(null)}
            className="text-blue-500 hover:text-blue-700 text-sm mb-2 flex items-center space-x-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-blue-600">
              {selectedSpecial?.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{selectedSpecial?.label}</h3>
              <p className="text-xs text-gray-500">{selectedSpecial?.desc}</p>
            </div>
          </div>
          
          <button
            onClick={handleSelectWholeSpecial}
            className="w-full mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>@整体功能</span>
          </button>
        </div>
      </div>
    );
  }

  // 课程的第二层
  if (!selectedModuleId) {
    return (
      <div className={`absolute ${positionClass} w-80 bg-white rounded-lg shadow-lg border p-4 z-50`}>
        <div className="mb-3">
          <button 
            onClick={() => setSelectedCourseId(null)}
            className="text-green-500 hover:text-green-700 text-sm mb-2 flex items-center space-x-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-green-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{selectedCourse?.name}</h3>
              <p className="text-xs text-gray-500">选择模块或引用整个课程</p>
            </div>
          </div>
          
          <button
            onClick={handleSelectWholeCourse}
            className="w-full mb-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>@整个课程</span>
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600 mb-2">课程模块：</div>
          {selectedCourse?.modules.map(module => (
            <div 
              key={module.id}
              onClick={() => handleSelectModule(module.id)}
              className="group p-3 hover:bg-green-50 rounded-lg cursor-pointer border border-transparent hover:border-green-200 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="text-green-600 group-hover:text-green-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="font-medium text-gray-700 group-hover:text-green-800">
                  {module.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 模块的第三层
  return (
    <div className={`absolute ${positionClass} w-80 bg-white rounded-lg shadow-lg border p-4 z-50`}>
      <div className="mb-3">
        <button 
          onClick={() => setSelectedModuleId(null)}
          className="text-green-500 hover:text-green-700 text-sm mb-2 flex items-center space-x-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回模块</span>
        </button>
        
        <div className="flex items-center space-x-3 mb-3">
          <div className="text-green-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{selectedCourse?.name}</h3>
            <p className="text-sm text-gray-600">{selectedModule?.name}</p>
          </div>
        </div>
        
        <button
          onClick={handleSelectWholeModule}
          className="w-full mb-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span>@整个模块</span>
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-600 mb-2">模块内容：</div>
        {selectedModule?.contents.map(content => {
          const getContentIcon = (contentId: string) => {
            switch (contentId) {
              case 'lecture':
                return (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                );
              case 'assignment':
                return (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                );
              case 'resource':
                return (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                );
              case 'quiz':
                return (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                );
              default:
                return (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                );
            }
          };
          
          return (
            <div 
              key={content.id}
              onClick={() => handleSelectContent(content.id)}
              className="group p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-600 group-hover:text-gray-700">
                  {getContentIcon(content.id)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-700 group-hover:text-gray-800">
                    {content.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {content.desc}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 