import { useState, useRef } from 'react';
import { CourseSelector } from './CourseSelector';
import type { CourseReference } from '../types/chat';

interface ChatInputProps {
  onSend: (message: string, courseRefs: CourseReference[]) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<CourseReference[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCourseSelect = (course: CourseReference) => {
    setSelectedCourses(prev => [...prev, course]);
    setMessage(prev => prev + ` @${course.contentType}:${course.contentName}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message, selectedCourses);
      setMessage('');
      setSelectedCourses([]);
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
            placeholder="输入你的问题... (使用@引用课程内容)"
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
        />
      )}

      {/* 显示已选择的课程内容 */}
      {selectedCourses.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedCourses.map((course, index) => (
            <div
              key={index}
              className="inline-flex items-center px-2 py-1 bg-gray-100 rounded"
            >
              <span className="text-sm">@{course.contentType}: {course.contentName}</span>
              <button
                onClick={() => {
                  setSelectedCourses(prev => prev.filter((_, i) => i !== index));
                  setMessage(prev => 
                    prev.replace(` @${course.contentType}:${course.contentName}`, '')
                  );
                }}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 