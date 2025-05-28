import { useEffect, useRef } from 'react';
import { ChatMessage } from '../types/chat';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { MessageContent } from './MessageContent';
import { MessageReferences } from './MessageReferences';
import Image from 'next/image';

interface MessageListProps {
  messages: ChatMessage[];
  onRetry?: () => void;
}

export function MessageList({ messages, onRetry }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="mb-4 relative w-37 h-35">
          <video 
            src="/icons/AI-Animation2.webm" 
            width={150} 
            height={150}
            autoPlay
            loop
            muted
            className="rounded-full"
          />
        </div>
        <p className="text-lg font-medium">欢迎使用AI智能助教</p>
        <p className="text-sm mt-2 text-center max-w-md">
          我是您的专属学习助手，可以回答课程相关问题、提供学习建议。
          <br />
          使用 <span className="bg-gray-200 px-1 rounded">@</span> 引用课程内容可以获得更精准的回答
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`p-4 rounded-lg ${
            message.role === 'user' 
              ? 'bg-blue-50 ml-12' 
              : 'bg-gray-50 mr-12'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold flex items-center gap-2">
              {message.role === 'user' ? (
                <>
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  你
                </>
              ) : (
                <>
                  <span className={`w-2 h-2 rounded-full ${
                    message.error ? 'bg-red-500' : 
                    message.isStreaming ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                  }`}></span>
                  <span className="flex items-center gap-1">
                    <video 
                      src="/icons/AI-Animation2.webm" 
                      width={16} 
                      height={16}
                      autoPlay
                      loop
                      muted
                      className="inline-block rounded-full"
                    />
                    AI智能助教
                  </span>
                  {message.isStreaming && (
                    <span className="text-xs text-gray-500 animate-pulse">正在思考...</span>
                  )}
                </>
              )}
            </div>
            
            {/* 错误状态和重试按钮 */}
            {message.error && onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 
                          bg-red-50 hover:bg-red-100 px-2 py-1 rounded border border-red-200"
                title="重新发送消息"
              >
                <ArrowPathIcon className="w-3 h-3" />
                重试
              </button>
            )}
          </div>

          {/* 消息内容 */}
          <div className="relative">
            {message.error ? (
              <div className="flex items-start gap-2 text-red-600">
                <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">发送失败</div>
                  <div className="text-sm">{message.content}</div>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap break-words">
                  <MessageContent 
                    content={message.content} 
                    docReferences={message.docReferences}
                  />
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse ml-1"></span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* 文档引用列表 */}
          {message.role === 'assistant' && !message.error && (
            <MessageReferences 
              references={message.docReferences} 
              content={message.content}
            />
          )}
          
          {/* 课程引用（原有功能保留） */}
          {message.courseReferences && message.courseReferences.length > 0 && (
            <div className="mt-3 text-xs text-gray-600">
              <div className="font-medium mb-1">📚 引用的课程内容:</div>
              <div className="flex flex-wrap gap-1">
                {message.courseReferences.map((ref, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md border"
                  >
                    {ref.courseName} - {ref.moduleName}
                    {ref.contentType && (
                      <span className="ml-1 text-blue-600">({ref.contentType})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 消息元数据 */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
            <span>{message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
            {message.role === 'assistant' && !message.error && (
              <div className="flex items-center gap-3 text-[10px]">
                {message.model && (
                  <span className="flex items-center gap-1" title="使用的模型">
                    <Image 
                      src="/icons/tongyi_model.jpg" 
                      alt="通义" 
                      width={14} 
                      height={14}
                      className="rounded"
                      unoptimized
                    />
                    {message.model}
                  </span>
                )}
                {message.responseTime && (
                  <span title="响应时间">
                    {(message.responseTime / 1000).toFixed(1)}s
                  </span>
                )}
                {message.requestId && (
                  <span className="opacity-50" title={`请求ID: ${message.requestId}`}>
                    #{message.requestId.slice(-6)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* 滚动锚点 */}
      <div ref={messagesEndRef} />
    </div>
  );
} 