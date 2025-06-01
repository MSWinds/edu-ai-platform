export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  courseReferences?: CourseReference[];
  docReferences?: DocReference[];
  isStreaming?: boolean;
  error?: string;
  requestId?: string;
  model?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  responseTime?: number; // 响应时间（毫秒）
}

export interface CourseReference {
  courseId?: string;
  courseName?: string;
  moduleId?: string;
  moduleName?: string;
  contentType?: 'lecture' | 'assignment' | 'resource' | 'quiz';
  contentName?: string;
  content?: string; // 用于API传递的内容
  referenceLevel: 'course' | 'module' | 'content' | 'special';
  specialType?: 'learning-tracking' | 'quiz' | 'community';
}

// 文档引用类型（来自DashScope API）
export interface DocReference {
  index_id: string;      // 对应text中的<ref>[n]</ref>
  title: string;         // 文档标题
  doc_id: string;        // 文档ID
  doc_name: string;      // 文档名称
  text: string;          // 引用的具体内容
  doc_url?: string;      // 文档URL（可选）
  biz_id?: string;       // 业务ID（可选）
  images?: string[];     // 图片列表（可选）
  page_number?: number;  // 页码（可选）
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