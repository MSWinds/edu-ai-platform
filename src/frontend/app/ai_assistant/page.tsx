'use client';

import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { ChatInput } from './components/ChatInput';
import { MessageList } from './components/MessageList';
import type { CourseReference } from './types/chat';
import { PlusIcon } from '@heroicons/react/24/outline';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import PageHeader from '../components/PageHeader';

export default function AIAssistantPage() {
  const { messages, sendMessage, isLoading, clearMessages, retryLastMessage } = useChat();

  const handleNewChat = () => {
    clearMessages();
  };

  return (
    <DashboardSidebar>
      <div className="flex flex-col h-screen bg-white">
        <div className="p-4 border-b">
          <PageHeader
            title="AI智能助教"
            subtitle="智能解答课程问题，提供学习支持"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
            actions={
              <button
                onClick={handleNewChat}
                className="p-2 hover:bg-gray-100 rounded flex items-center gap-2"
                title="新对话"
              >
                <PlusIcon className="w-5 h-5 text-gray-600" />
                <span>新对话</span>
              </button>
            }
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList 
            messages={messages} 
            onRetry={retryLastMessage}
          />
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
