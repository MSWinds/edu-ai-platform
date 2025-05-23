import { create } from 'zustand';
import type { ChatMessage, CourseReference, AIAssistantRequest, StreamChunk } from '../types/chat';
import { getUser } from '../../login/auth';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  abortController: AbortController | null;
  sendMessage: (
    content: string, 
    courseRefs?: CourseReference[], 
    useStream?: boolean, 
    memoryId?: string
  ) => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  messages: [],
  isLoading: false,
  abortController: null,

  sendMessage: async (
    content: string, 
    courseRefs?: CourseReference[], 
    useStream: boolean = true,
    memoryId?: string
  ) => {
    const state = get();
    
    // 如果没有传入memoryId，尝试从用户信息中获取
    const user = getUser();
    const finalMemoryId = memoryId || user?.memoryId;
    
    // 取消之前的请求
    if (state.abortController) {
      state.abortController.abort();
    }
    const newAbortController = new AbortController();
    set({ abortController: newAbortController });

    set({ isLoading: true });

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
      courseReferences: courseRefs
    };

    set((state) => ({
      messages: [...state.messages, userMessage]
    }));

    // 准备AI消息
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: useStream,
    };

    if (useStream) {
      set((state) => ({
        messages: [...state.messages, aiMessage]
      }));
    }

    try {
      const request: AIAssistantRequest = {
        message: content,
        courseReferences: courseRefs?.map(ref => ({
          ...ref,
          content: ref.contentName || ref.moduleName
        })),
        memoryId: finalMemoryId,
        useStream,
      };

      if (useStream) {
        // 流式响应
        let fullContent = '';
        
        const response = await fetch('/api/ai-assistant-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
          signal: newAbortController.signal,
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

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // 完成流式响应
                  set((state) => ({
                    messages: state.messages.map(msg => 
                      msg.id === aiMessageId 
                        ? { ...msg, isStreaming: false }
                        : msg
                    )
                  }));
                  return;
                }
                
                try {
                  const chunk: StreamChunk = JSON.parse(data);
                  
                  if (chunk.error) {
                    throw new Error(chunk.error);
                  }

                  if (chunk.type === 'text' && chunk.content) {
                    fullContent += chunk.content;
                    
                    set((state) => ({
                      messages: state.messages.map(msg => 
                        msg.id === aiMessageId 
                          ? { 
                              ...msg, 
                              content: fullContent,
                              requestId: chunk.request_id,
                            }
                          : msg
                      )
                    }));
                  }
                } catch (e) {
                  console.warn('解析SSE数据失败:', data);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

      } else {
        // 非流式响应
        const response = await fetch('/api/ai-assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
          signal: newAbortController.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API请求失败: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        const finalAiMessage: ChatMessage = {
          ...aiMessage,
          content: data.content,
          isStreaming: false,
          requestId: data.request_id,
        };

        set((state) => ({
          messages: [...state.messages, finalAiMessage]
        }));
      }

    } catch (error) {
      console.error('发送消息失败:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '发送消息失败，请稍后重试';

      if (useStream) {
        // 更新流式消息为错误状态
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === aiMessageId 
              ? { 
                  ...msg, 
                  content: errorMessage,
                  error: errorMessage,
                  isStreaming: false,
                }
              : msg
          )
        }));
      } else {
        // 添加错误消息
        const errorAiMessage: ChatMessage = {
          ...aiMessage,
          content: errorMessage,
          error: errorMessage,
          isStreaming: false,
        };
        set((state) => ({
          messages: [...state.messages, errorAiMessage]
        }));
      }
    } finally {
      set({ isLoading: false, abortController: null });
    }
  },

  clearMessages: () => {
    const state = get();
    if (state.abortController) {
      state.abortController.abort();
    }
    set({ messages: [], abortController: null });
  },

  retryLastMessage: () => {
    const state = get();
    if (state.messages.length < 2) return;
    
    const lastUserMessage = state.messages[state.messages.length - 2];
    if (lastUserMessage.role !== 'user') return;

    // 移除最后的AI回复，重新发送用户消息
    set((state) => ({
      messages: state.messages.slice(0, -1)
    }));
    
    // 重新发送消息
    state.sendMessage(
      lastUserMessage.content, 
      lastUserMessage.courseReferences
    );
  },
})); 