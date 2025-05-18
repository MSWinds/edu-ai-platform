export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  courseReferences?: CourseReference[];
}

export interface CourseReference {
  courseId: string;
  courseName: string;
  moduleId: string;
  moduleName: string;
  contentType: 'lecture' | 'assignment' | 'resource';
  contentName?: string;
} 