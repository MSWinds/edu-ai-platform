export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  courseReferences?: CourseReference[];
  isStreaming?: boolean;
  error?: string;
  requestId?: string;
}

export interface CourseReference {
  courseId: string;
  courseName: string;
  moduleId: string;
  moduleName: string;
  contentType: 'lecture' | 'assignment' | 'resource';
  contentName?: string;
  content?: string; // 用于API传递的内容
}

// API请求类型
export interface AIAssistantRequest {
  message: string;
  courseReferences?: CourseReference[];
  memoryId?: string;
  useStream?: boolean;
}

// API响应类型
export interface AIAssistantResponse {
  content: string;
  request_id?: string;
  error?: string;
}

// 流式响应数据类型
export interface StreamChunk {
  type: 'text' | 'thought' | 'error';
  content: string;
  fullContent?: string;
  action_type?: string;
  request_id?: string;
  error?: string;
}

// 错误类型
export interface ChatError {
  message: string;
  code?: string;
  retryable?: boolean;
} 