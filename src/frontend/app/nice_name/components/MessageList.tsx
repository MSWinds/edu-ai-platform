import { ChatMessage } from '../types/chat';

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>欢迎使用AI助教，有任何问题请直接提问</p>
        <p className="text-sm mt-2">提示：使用@引用课程内容可以获得更精准的回答</p>
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
          <div className="font-bold mb-1">
            {message.role === 'user' ? '你' : 'AI助教'}
          </div>
          <div>{message.content}</div>
          
          {message.courseReferences && message.courseReferences.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              引用的课程内容:
              <div className="flex flex-wrap gap-1 mt-1">
                {message.courseReferences.map((ref, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-200 rounded">
                    {ref.courseName} - {ref.moduleName} ({ref.contentType})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 