'use client';

import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { ChatInput } from './components/ChatInput';
import { MessageList } from './components/MessageList';
import type { CourseReference } from './types/chat';

export default function AIAssistantPage() {
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">AI助教</h1>
        <p className="text-sm text-gray-500">智能解答课程问题，提供学习支持</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>
      
      <div className="border-t p-4">
        <ChatInput 
          onSend={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
