import { useState } from 'react';
import { ChatInput } from '../../ai_assistant/components/ChatInput';
import { MessageList } from '../../ai_assistant/components/MessageList';
import { useChatStore } from '../../ai_assistant/store/chatStore';
import { PlusIcon, MinusIcon, XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

export function FloatingChat() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullSize, setIsFullSize] = useState(false);
  const { messages, sendMessage, isLoading, clearMessages } = useChatStore();

  // 默认尺寸
  const styles = {
    collapsed: {
      width: '60px',
      height: '60px',
    },
    expanded: {
      width: '380px',
      height: '600px',
    },
    minimized: {
      width: '300px',
      height: '50px',
    },
    fullSize: {
      width: '480px',
      height: '700px',
    }
  };

  const currentStyle = isMinimized 
    ? styles.minimized 
    : !isExpanded
      ? styles.collapsed
      : isFullSize
        ? styles.fullSize
        : styles.expanded;

  const handleNewChat = () => {
    clearMessages();
  };
  
  const handleClose = () => {
    setIsExpanded(false);
    setIsMinimized(false);
    setIsFullSize(false);
    clearMessages();
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col"
      style={currentStyle}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleNewChat}
            className="p-1 hover:bg-gray-100 rounded"
            title="新对话"
          >
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-medium">AI智能助教</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsFullSize(!isFullSize)}
            className="p-1 hover:bg-gray-100 rounded"
            title={isFullSize ? "缩小视图" : "扩大视图"}
          >
            {isFullSize ? (
              <ArrowsPointingInIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <ArrowsPointingOutIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-100 rounded"
            title={isMinimized ? "展开" : "最小化"}
          >
            <MinusIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded"
            title="关闭"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100% - 120px)' }}>
            <MessageList messages={messages} />
          </div>
          <div className="border-t p-4 shrink-0 mt-auto">
            <ChatInput 
              onSend={sendMessage}
              isLoading={isLoading}
              isFloating={true}
            />
          </div>
        </>
      )}
    </div>
  );
} 