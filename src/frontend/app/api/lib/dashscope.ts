export interface DashScopeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DashScopeRequest {
  prompt: string;
  stream?: boolean;
  incremental_output?: boolean;
  has_thoughts?: boolean;
  memory_id?: string;
  messages?: DashScopeMessage[];
  rag_options?: {
    pipeline_ids: string[];
  };
  enable_system_time?: boolean;
}

export interface DashScopeResponse {
  output: {
    text?: string;
    thoughts?: Array<{
      action_type: string;
      thought: string;
    }>;
    doc_references?: Array<{
      index_id: string;
      title: string;
      doc_id: string;
      doc_name: string;
      text: string;
      doc_url?: string;
      biz_id?: string;
      images?: string[];
      page_number?: number;
    }>;
  };
  usage?: {
    models?: Array<{
      model_id: string;
      input_tokens: number;
      output_tokens: number;
    }>;
  };
  status_code: number;
  request_id: string;
  message?: string;
}

export class DashScopeAPI {
  private apiKey: string;
  private appId: string;
  private baseUrl: string = 'https://dashscope.aliyuncs.com/api/v1/apps';

  constructor(apiKey: string, appId: string) {
    this.apiKey = apiKey;
    this.appId = appId;
  }

  async callApplication(request: DashScopeRequest): Promise<DashScopeResponse> {
    const requestBody = {
      input: {
        prompt: request.prompt,
        messages: request.messages,
      },
      parameters: {
        stream: request.stream || false,
        incremental_output: request.incremental_output ?? false,
        has_thoughts: request.has_thoughts ?? true,
        enable_system_time: request.enable_system_time !== false,
        ...(request.rag_options && { rag_options: request.rag_options }),
      },
      debug: {},
      ...(request.memory_id && { memory_id: request.memory_id }),
    };

    const response = await fetch(`${this.baseUrl}/${this.appId}/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-DashScope-SSE': request.stream ? 'enable' : 'disable',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`DashScope API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  async *callApplicationStream(request: DashScopeRequest): AsyncGenerator<DashScopeResponse> {
    const requestBody = {
      input: {
        prompt: request.prompt,
        messages: request.messages,
      },
      parameters: {
        stream: true,
        incremental_output: request.incremental_output ?? false,
        has_thoughts: request.has_thoughts ?? true,
        enable_system_time: request.enable_system_time !== false,
        ...(request.rag_options && { rag_options: request.rag_options }),
      },
      debug: {},
      ...(request.memory_id && { memory_id: request.memory_id }),
    };

    const response = await fetch(`${this.baseUrl}/${this.appId}/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-DashScope-SSE': 'enable',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`DashScope API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let totalBytesRead = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        totalBytesRead += value.length;
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5);
            
            if (data === '[DONE]') {
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              
              const transformedChunk: DashScopeResponse = {
                output: {
                  text: parsed.output?.text || '',
                  thoughts: parsed.output?.thoughts || [],
                  doc_references: parsed.output?.doc_references || undefined,
                },
                usage: parsed.usage || undefined,
                status_code: 200,
                request_id: parsed.request_id || '',
                message: ''
              };
              
              yield transformedChunk;
            } catch (e) {
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export function formatCourseReferences(courseRefs?: Array<{
  courseName?: string;
  content?: string;
  type?: string;
  referenceLevel: 'course' | 'module' | 'content' | 'special';
  specialType?: 'learning-tracking' | 'quiz' | 'community';
  moduleName?: string;
  contentType?: 'lecture' | 'assignment' | 'resource' | 'quiz';
  contentName?: string;
}>): string {
  if (!courseRefs?.length) return '';
  
  const contextStr = courseRefs.map(ref => {
    if (ref.referenceLevel === 'special') {
      switch (ref.specialType) {
        case 'learning-tracking':
          return '参考功能：智能学习跟踪 - 用于跟踪学习进度、分析学习效果和提供个性化建议';
        case 'quiz':
          return '参考功能：智能测验 - 用于生成练习题、评估知识掌握程度和提供答案解析';
        case 'community':
          return '参考功能：学习社区 - 用于查看讨论话题、参与学习交流和分享学习心得';
        default:
          return '';
      }
    } else if (ref.referenceLevel === 'course') {
      return `参考课程：${ref.courseName}（整个课程）`;
    } else if (ref.referenceLevel === 'module') {
      return `参考课程：${ref.courseName} - ${ref.moduleName}（整个模块）`;
    } else if (ref.referenceLevel === 'content') {
      const typeMap = {
        'lecture': '课件',
        'assignment': '作业',
        'resource': '资源',
        'quiz': '堂测'
      };
      const typeZh = typeMap[ref.contentType || 'lecture'];
      return `参考课程：${ref.courseName} - ${typeZh}：${ref.contentName}`;
    }
    return '';
  }).filter(Boolean).join('\n');
  
  return `\n\n[课程上下文]\n${contextStr}\n\n`;
}

export function createDashScopeAPI() {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  const appId = process.env.DASHSCOPE_APP_ID;

  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY environment variable is required');
  }
  
  if (!appId) {
    throw new Error('DASHSCOPE_APP_ID environment variable is required');
  }

  return new DashScopeAPI(apiKey, appId);
} 