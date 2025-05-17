import { useState } from 'react';
import type { CourseReference } from '../types/chat';

interface CourseSelectorProps {
  onSelect: (courseRef: CourseReference) => void;
  onClose: () => void;
}

export function CourseSelector({ onSelect, onClose }: CourseSelectorProps) {
  // 硬编码课程结构
  const course = {
    id: 'ai-intro',
    name: '人工智能基础导论'
  };
  
  const module = {
    id: 'week7',
    name: '第7周：提示词工程'
  };
  
  const contentTypes = [
    { id: 'lecture', name: '课件', desc: '第7周：提示词工程设计方法与技巧' },
    { id: 'assignment', name: '作业', desc: '提示词优化实战练习' },
    { id: 'resource', name: '资源', desc: 'ChatGPT提示词工程指南PDF' }
  ];
  
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    const type = contentTypes.find(t => t.id === typeId);
    
    if (type) {
      onSelect({
        courseId: course.id,
        courseName: course.name,
        moduleId: module.id,
        moduleName: module.name,
        contentType: typeId as 'lecture' | 'assignment' | 'resource',
        contentName: type.desc
      });
      
      onClose();
    }
  };

  return (
    <div className="absolute bottom-full left-0 w-80 bg-white rounded-lg shadow-lg border p-4">
      <div className="mb-3">
        <h3 className="font-bold">{course.name}</h3>
        <p className="text-sm text-gray-500">{module.name}</p>
      </div>
      
      <div className="space-y-2">
        {contentTypes.map(type => (
          <div 
            key={type.id}
            onClick={() => handleSelectType(type.id)}
            className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
          >
            <div>
              <div className="font-medium">{type.name}</div>
              <div className="text-xs text-gray-500">{type.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 