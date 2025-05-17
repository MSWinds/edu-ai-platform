'use client';

import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { ChatInput } from './components/ChatInput';
import { MessageList } from './components/MessageList';
import type { CourseReference } from './types/chat';
import { PlusIcon } from '@heroicons/react/24/outline';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';

export default function AIAssistantPage() {
  const { messages, sendMessage, isLoading, clearMessages } = useChat();

  const handleNewChat = () => {
    clearMessages();
  };

  return (
    <DashboardSidebar>
      <div className="flex flex-col h-screen bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">AI助教</h1>
            <p className="text-sm text-gray-500">智能解答课程问题，提供学习支持</p>
          </div>
          <button
            onClick={handleNewChat}
            className="p-2 hover:bg-gray-100 rounded flex items-center gap-2"
            title="新对话"
          >
            <PlusIcon className="w-5 h-5 text-gray-600" />
            <span>新对话</span>
          </button>
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
    </DashboardSidebar>
  );
}
