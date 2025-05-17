import { create } from 'zustand';
import type { ChatMessage, CourseReference } from '../types/chat';
import { getMockResponse } from '../mock/responses';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string, courseRefs?: CourseReference[]) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isLoading: false,

  sendMessage: async (content: string, courseRefs?: CourseReference[]) => {
    set({ isLoading: true });
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 用户消息
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content,
        role: 'user',
        timestamp: new Date(),
        courseReferences: courseRefs
      };
      
      // 获取模拟的AI回复
      const mockResponse = getMockResponse(courseRefs);
      
      // AI回复消息
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: mockResponse.content,
        role: 'assistant',
        timestamp: new Date(),
        courseReferences: mockResponse.courseRefs
      };
      
      set((state) => ({
        messages: [...state.messages, userMessage, aiMessage]
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  clearMessages: () => set({ messages: [] })
})); 