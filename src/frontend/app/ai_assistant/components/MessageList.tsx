import { useEffect, useRef } from 'react';
import { ChatMessage } from '../types/chat';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

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

  function stripRefs(text: string): string {
    // 去除所有 <ref>[...]</ref> 标记
    return text.replace(/<ref>\[[^\]]*\]<\/ref>/g, '');
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="text-6xl mb-4">🤖</div>
        <p className="text-lg font-medium">欢迎使用AI助教</p>
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
                  AI助教
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
                  <div className="text-sm">{stripRefs(message.content)}</div>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap break-words">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="my-1">{children}</p>,
                      pre: ({ children }) => <pre className="my-2">{children}</pre>,
                      code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{children}</code>,
                    }}
                  >
                    {stripRefs(message.content)}
                  </ReactMarkdown>
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse ml-1"></span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* 课程引用 */}
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
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {message.requestId && (
              <span title={`Request ID: ${message.requestId}`}>
                ID: {message.requestId.slice(-8)}
              </span>
            )}
          </div>
        </div>
      ))}
      
      {/* 滚动锚点 */}
      <div ref={messagesEndRef} />
    </div>
  );
} 