'use client';

import { useState } from 'react';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { colors } from '../theme/colors';
import { mockCourseData } from '../mockdata/courseData';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  course: string;
  type: string;
  lastUpdated: Date;
}

export default function AIAssistant() {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: '关于人工智能基础概念',
      messages: [
        {
          id: '1',
          type: 'user',
          content: '什么是机器学习？',
          timestamp: new Date('2024-03-15T10:00:00'),
        },
        {
          id: '2',
          type: 'assistant',
          content: '机器学习是人工智能的一个分支，它使计算机系统能够从数据中学习和改进，而无需明确编程。',
          timestamp: new Date('2024-03-15T10:00:05'),
        },
        {
          id: '3',
          type: 'user',
          content: '能详细解释一下监督学习和无监督学习的区别吗？',
          timestamp: new Date('2024-03-15T10:01:00'),
        },
        {
          id: '4',
          type: 'assistant',
          content: '监督学习使用标记数据进行训练，而无监督学习则从未标记的数据中发现模式。',
          timestamp: new Date('2024-03-15T10:01:10'),
        },
      ],
      course: mockCourseData.id.toString(),
      type: 'lecture',
      lastUpdated: new Date('2024-03-15T10:01:10'),
    },
    {
      id: '2',
      title: '作业问题讨论',
      messages: [
        {
          id: '1',
          type: 'user',
          content: '关于第三章的作业，我不太理解梯度下降的概念',
          timestamp: new Date('2024-03-14T15:30:00'),
        },
        {
          id: '2',
          type: 'assistant',
          content: '梯度下降是一种优化算法，用于最小化损失函数。它通过计算损失函数对参数的梯度，然后沿着梯度的反方向更新参数。',
          timestamp: new Date('2024-03-14T15:30:10'),
        },
      ],
      course: mockCourseData.id.toString(),
      type: 'assignment',
      lastUpdated: new Date('2024-03-14T15:30:10'),
    },
    {
      id: '3',
      title: '堂测复习',
      messages: [
        {
          id: '1',
          type: 'user',
          content: '下周的堂测会考哪些内容？',
          timestamp: new Date('2024-03-13T09:00:00'),
        },
        {
          id: '2',
          type: 'assistant',
          content: '堂测将覆盖第1-3章的内容，重点包括：机器学习基础概念、监督学习算法、以及简单的神经网络原理。',
          timestamp: new Date('2024-03-13T09:00:15'),
        },
      ],
      course: mockCourseData.id.toString(),
      type: 'quiz',
      lastUpdated: new Date('2024-03-13T09:00:15'),
    },
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const chatTypes = [
    { id: 'general', name: '通用问题', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'lecture', name: '课程内容', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'assignment', name: '作业相关', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'quiz', name: '堂测相关', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  ];

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `新对话 ${conversations.length + 1}`,
      messages: [],
      course: selectedCourse,
      type: selectedType,
      lastUpdated: new Date(),
    };
    setConversations([...conversations, newConversation]);
    setActiveConversationId(newConversation.id);
  };
    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        // 如果没有活动对话，创建一个新的
        if (!activeConversationId) {
        const newId = Date.now().toString();
        const newConversation: Conversation = {
            id: newId,
            title: `新对话 ${conversations.length + 1}`,
            messages: [{
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date(),
            }],
            course: selectedCourse,
            type: selectedType,
            lastUpdated: new Date(),
        };

        setConversations(prevConversations => [...prevConversations, newConversation]);
        setActiveConversationId(newId);
        setInputMessage('');

        // 模拟AI回复
        setTimeout(() => {
            const aiResponse: Message = {
            id: Date.now().toString(),
            type: 'assistant',
            content: '这是一个模拟的AI回复。在实际应用中，这里会连接到真实的AI服务。',
            timestamp: new Date(),
            };

            setConversations(prevConversations => 
            prevConversations.map(conv => 
                conv.id === newId 
                ? { ...conv, messages: [...conv.messages, aiResponse], lastUpdated: new Date() }
                : conv
            )
            );
        }, 1000);
        return;
        }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, newMessage], lastUpdated: new Date() }
          : conv
      )
    );

    setInputMessage('');

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: '这是一个模拟的AI回复。在实际应用中，这里会连接到真实的AI服务。',
        timestamp: new Date(),
      };

      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages: [...conv.messages, aiResponse], lastUpdated: new Date() }
            : conv
        )
      );
    }, 1000);
  };


  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  return (
    <DashboardSidebar>
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <header className="py-4 border-b backdrop-blur-sm bg-white/80 flex-shrink-0" style={{ borderColor: colors.border }}>
          <div className="px-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                style={{ background: colors.gradient.primary }}>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold truncate" style={{ color: colors.text.primary }}>AI 助教</h1>
                <p className="text-xs mt-0.5 truncate" style={{ color: colors.text.secondary }}>智能学习助手，随时为您解答问题</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* 左侧选择面板 */}
          <div className="w-72 border-r p-4 backdrop-blur-sm bg-white/80 flex-shrink-0" style={{ borderColor: colors.border }}>
            <button
              onClick={createNewConversation}
              className="w-full mb-8 p-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              style={{ background: colors.gradient.primary }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>新建对话</span>
            </button>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-3" style={{ color: colors.text.primary }}>
                选择课程
              </label>
              <select
                className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="all">所有课程</option>
                <option value={mockCourseData.id}>{mockCourseData.title}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.text.primary }}>
                对话类型
              </label>
              <div className="space-y-3">
                {chatTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`w-full p-3 text-left rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                      selectedType === type.id ? 'shadow-lg' : 'hover:bg-gray-50'
                    }`}
                    style={{
                      color: selectedType === type.id ? colors.primary : colors.text.secondary,
                      backgroundColor: selectedType === type.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    }}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className={`p-2 rounded-lg ${selectedType === type.id ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                      </svg>
                    </div>
                    <span className="font-medium">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 中间聊天区域 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 聊天消息区域 */}
            <div className="flex-1 p-6 overflow-y-auto">
              {!activeConversation || (activeConversation && activeConversation.messages.length === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center shadow-lg"
                    style={{ background: colors.gradient.primary }}>
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>开始对话</h3>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>
                    从右侧选择一个历史对话，或点击"新建对话"开始新的对话
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl p-4 flex items-start space-x-4 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg'
                            : 'bg-white shadow-md'
                        }`}
                        style={{
                          color: message.type === 'user' ? 'white' : colors.text.primary,
                        }}
                      >
                        {message.type === 'assistant' && (
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        {message.type === 'user' && (
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 输入区域 */}
            <div className="border-t p-6 backdrop-blur-sm bg-white/80" style={{ borderColor: colors.border }}>
              <div className="max-w-4xl mx-auto">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="输入您的问题..."
                    className="flex-1 p-4 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-8 py-4 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-2"
                    style={{ background: colors.gradient.primary }}
                  >
                    <span>发送</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧历史对话面板 */}
          <div className="w-80 border-l p-6 backdrop-blur-sm bg-white/80 flex flex-col flex-shrink-0" style={{ borderColor: colors.border }}>
            <div className="mb-6 flex-shrink-0">
              <h2 className="text-lg font-semibold" style={{ color: colors.text.primary }}>历史对话</h2>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1">
              {conversations.map((conv, index) => (
                <div key={conv.id} className="relative">
                  {index > 0 && (
                    <div className="absolute -top-2 left-0 right-0 h-px bg-gray-200" />
                  )}
                  <button
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-4 text-left rounded-xl transition-all duration-200 border ${
                      activeConversationId === conv.id ? 'shadow-lg' : 'hover:bg-gray-50'
                    }`}
                    style={{
                      color: activeConversationId === conv.id ? colors.primary : colors.text.primary,
                      backgroundColor: activeConversationId === conv.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      borderColor: activeConversationId === conv.id ? colors.primary : colors.border,
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${activeConversationId === conv.id ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <span className="font-medium truncate">{conv.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ color: colors.text.secondary }}>
                      <span>{conv.type === 'lecture' ? '课程内容' : conv.type === 'assignment' ? '作业相关' : conv.type === 'quiz' ? '堂测相关' : '通用问题'}</span>
                      <span>{conv.lastUpdated.toLocaleString()}</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
}
