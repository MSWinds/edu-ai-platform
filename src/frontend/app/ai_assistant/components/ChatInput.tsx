import { useState, useRef } from 'react';
import { CourseSelector } from './CourseSelector';
import type { CourseReference } from '../types/chat';

interface ChatInputProps {
  onSend: (message: string, courseRefs: CourseReference[]) => void;
  isLoading: boolean;
  isFloating?: boolean;
}

export function ChatInput({ onSend, isLoading, isFloating = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<CourseReference[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCourseSelect = (course: CourseReference) => {
    setSelectedCourses(prev => [...prev, course]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedCourses.length > 0) {
      if (!isLoading) {
        onSend(message, selectedCourses);
        setMessage('');
        setSelectedCourses([]);
      }
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入你的问题...(使用@引用)"
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowCourseSelector(prev => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
          >
            @
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>

      {showCourseSelector && (
        <CourseSelector
          onSelect={handleCourseSelect}
          onClose={() => setShowCourseSelector(false)}
          position={isFloating ? 'top' : 'bottom'}
        />
      )}

      {/* 显示已选择的课程内容 */}
      {selectedCourses.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedCourses.map((course, index) => {
            let label = '';
            if (course.referenceLevel === 'special') {
              if (course.specialType === 'learning-tracking') label = '智能学习跟踪';
              else if (course.specialType === 'quiz') label = '智能测验';
              else if (course.specialType === 'community') label = '学习社区';
            } else if (course.referenceLevel === 'course') {
              label = `${course.courseName}（整个课程）`;
            } else if (course.referenceLevel === 'module') {
              label = `${course.courseName} - ${course.moduleName}（整个模块）`;
            } else if (course.referenceLevel === 'content') {
              let typeZh = course.contentType === 'lecture' ? '课件' : course.contentType === 'assignment' ? '作业' : '资源';
              label = `${typeZh}: ${course.contentName}`;
            }
            return (
              <div
                key={index}
                className="inline-flex items-center px-2 py-1 bg-gray-100 rounded"
              >
                <span className="text-sm">{label}</span>
                <button
                  onClick={() => {
                    setSelectedCourses(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 