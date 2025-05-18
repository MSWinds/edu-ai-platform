import { useState, useCallback } from 'react';
import type { ChatMessage, CourseReference } from '../types/chat';
import { getMockResponse } from '../mock/responses';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string, courseRefs?: CourseReference[]) => {
    setIsLoading(true);
    try {
      // 模拟API调用延迟
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
      
      setMessages(prev => [...prev, userMessage, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages
  };
} 