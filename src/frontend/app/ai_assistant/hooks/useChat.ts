import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, CourseReference, AIAssistantRequest, StreamChunk, DocReference } from '../types/chat';
import { getUser } from '../../login/auth';

// 更新StreamChunk类型定义
interface ExtendedStreamChunk extends StreamChunk {
  type: 'text' | 'thought' | 'error' | 'metadata';
  doc_references?: DocReference[];
  model?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 非流式API调用
  const callAIAPI = async (request: AIAssistantRequest): Promise<{
    content: string;
    docReferences?: DocReference[];
    model?: string;
    usage?: { inputTokens: number; outputTokens: number };
  }> => {
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: abortControllerRef.current?.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API请求失败: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    // 添加调试日志
    console.log('🔍 API返回的原始数据:', data);
    console.log('🔍 文档引用数据:', data.doc_references);

    return {
      content: data.content,
      docReferences: data.doc_references,
      model: data.model,
      usage: data.usage,
    };
  };

  // 流式API调用
  const callStreamAPI = async (
    request: AIAssistantRequest,
    onChunk: (chunk: ExtendedStreamChunk) => void
  ): Promise<void> => {
    const response = await fetch('/api/ai-assistant-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: abortControllerRef.current?.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API请求失败: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let chunkCount = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // 处理SSE数据
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            
            try {
              const chunk: ExtendedStreamChunk = JSON.parse(data);
              chunkCount++;
              console.log(`🌊 收到流式chunk #${chunkCount}:`, chunk);
              onChunk(chunk);
            } catch (e) {
              console.warn('⚠️ 解析SSE数据失败:', data, e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  const sendMessage = useCallback(async (
    content: string, 
    courseRefs?: CourseReference[],
    useStream: boolean = true,
    memoryId?: string
  ) => {
    // 如果没有传入memoryId，尝试从用户信息中获取
    const user = getUser();
    const finalMemoryId = memoryId || user?.memoryId;
    
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);

    // 记录开始时间
    const startTime = Date.now();

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
      courseReferences: courseRefs
    };

    setMessages(prev => [...prev, userMessage]);

    // 准备AI消息（流式时会逐步更新）
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: useStream,
    };

    if (useStream) {
      setMessages(prev => [...prev, aiMessage]);
    }

    try {
      const request: AIAssistantRequest = {
        message: content,
        courseReferences: courseRefs?.map(ref => ({
          ...ref,
          content: ref.contentName || ref.moduleName // 提供内容给API
        })),
        memoryId: finalMemoryId,
        useStream,
      };

      if (useStream) {
        // 流式响应处理
        let fullContent = '';
        let docReferences: DocReference[] | undefined;
        let model: string | undefined;
        let usage: { inputTokens: number; outputTokens: number } | undefined;
        
        await callStreamAPI(request, (chunk) => {
          if (chunk.error) {
            throw new Error(chunk.error);
          }

          if (chunk.type === 'text' && chunk.content) {
            fullContent += chunk.content;
            
            setMessages(prev => 
              prev.map(msg => 
                msg.id === aiMessageId 
                  ? { 
                      ...msg, 
                      content: fullContent,
                      requestId: chunk.request_id,
                    }
                  : msg
              )
            );
          } else if (chunk.type === 'metadata') {
            // 保存元数据
            console.log('📦 收到metadata chunk:', chunk);
            docReferences = chunk.doc_references;
            model = chunk.model;
            usage = chunk.usage;
          }
        });

        // 完成流式响应，更新文档引用和元数据
        console.log('✅ 流式响应完成，文档引用:', docReferences);
        const responseTime = Date.now() - startTime;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { 
                  ...msg, 
                  isStreaming: false,
                  docReferences,
                  model,
                  usage,
                  responseTime,
                }
              : msg
          )
        );

      } else {
        // 非流式响应
        const response = await callAIAPI(request);
        
        const finalAiMessage: ChatMessage = {
          ...aiMessage,
          content: response.content,
          docReferences: response.docReferences,
          model: response.model,
          usage: response.usage,
          isStreaming: false,
          responseTime: Date.now() - startTime,
        };

        setMessages(prev => [...prev, finalAiMessage]);
      }

    } catch (error) {
      console.error('❌ 发送消息失败:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '发送消息失败，请稍后重试';

      if (useStream) {
        // 更新流式消息为错误状态
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { 
                  ...msg, 
                  content: errorMessage,
                  error: errorMessage,
                  isStreaming: false,
                }
              : msg
          )
        );
      } else {
        // 添加错误消息
        const errorAiMessage: ChatMessage = {
          ...aiMessage,
          content: errorMessage,
          error: errorMessage,
          isStreaming: false,
        };
        setMessages(prev => [...prev, errorAiMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const clearMessages = useCallback(() => {
    // 取消当前请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
  }, []);

  const retryLastMessage = useCallback(() => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages[messages.length - 2];
    if (lastUserMessage.role !== 'user') return;

    // 移除最后的AI回复，重新发送用户消息
    setMessages(prev => prev.slice(0, -1));
    sendMessage(
      lastUserMessage.content, 
      lastUserMessage.courseReferences
    );
  }, [messages, sendMessage]);

  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    retryLastMessage,
  };
} 