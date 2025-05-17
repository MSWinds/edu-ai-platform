import { useState } from 'react';
import type { CourseReference } from '../types/chat';

interface CourseSelectorProps {
  onSelect: (courseRef: CourseReference) => void;
  onClose: () => void;
  position?: 'top' | 'bottom'; // 添加位置属性
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
            { id: 'resource', name: '资源', desc: 'ChatGPT提示词工程指南PDF' }
          ]
        }
      ]
    }
  ];
  
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  
  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const selectedModule = selectedCourse?.modules.find(m => m.id === selectedModuleId);
  
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedModuleId(null);
  };
  
  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };
  
  const handleSelectContent = (contentType: string) => {
    if (!selectedCourse || !selectedModule) return;
    
    const content = selectedModule.contents.find(c => c.id === contentType);
    
    if (content) {
      onSelect({
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        moduleId: selectedModule.id,
        moduleName: selectedModule.name,
        contentType: contentType as 'lecture' | 'assignment' | 'resource',
        contentName: content.desc
      });
      
      onClose();
    }
  };
  
  // 根据position设置定位类
  const positionClass = position === 'top' 
    ? 'bottom-full left-0 mb-2' 
    : 'top-0 left-0 transform -translate-y-full';
  
  // 显示课程列表
  if (!selectedCourseId) {
    return (
      <div className={`absolute ${positionClass} w-80 bg-white rounded-lg shadow-lg border p-4 z-50`}>
        <div className="mb-3">
          <h3 className="font-bold">选择课程</h3>
        </div>
        
        <div className="space-y-2">
          {courses.map(course => (
            <div 
              key={course.id}
              onClick={() => handleSelectCourse(course.id)}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <div className="font-medium">{course.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // 显示模块列表
  if (!selectedModuleId) {
    return (
      <div className={`absolute ${positionClass} w-80 bg-white rounded-lg shadow-lg border p-4 z-50`}>
        <div className="mb-3">
          <button 
            onClick={() => setSelectedCourseId(null)}
            className="text-blue-500 hover:underline text-sm"
          >
            ← 返回课程
          </button>
          <h3 className="font-bold">{selectedCourse?.name}</h3>
          <p className="text-sm text-gray-500">选择模块</p>
        </div>
        
        <div className="space-y-2">
          {selectedCourse?.modules.map(module => (
            <div 
              key={module.id}
              onClick={() => handleSelectModule(module.id)}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <div className="font-medium">{module.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // 显示内容类型
  return (
    <div className={`absolute ${positionClass} w-80 bg-white rounded-lg shadow-lg border p-4 z-50`}>
      <div className="mb-3">
        <button 
          onClick={() => setSelectedModuleId(null)}
          className="text-blue-500 hover:underline text-sm"
        >
          ← 返回模块
        </button>
        <h3 className="font-bold">{selectedCourse?.name}</h3>
        <p className="text-sm text-gray-500">{selectedModule?.name}</p>
      </div>
      
      <div className="space-y-2">
        {selectedModule?.contents.map(content => (
          <div 
            key={content.id}
            onClick={() => handleSelectContent(content.id)}
            className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
          >
            <div>
              <div className="font-medium">{content.name}</div>
              <div className="text-xs text-gray-500">{content.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 