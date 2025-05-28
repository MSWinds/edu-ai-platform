'use client';

import { useState, useRef, useEffect } from 'react';
import { DocReference } from '../types/chat';
import { DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface RefBadgeProps {
  reference: DocReference;
  inline?: boolean;  // 是否内联显示
}

export function RefBadge({ reference, inline = true }: RefBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const badgeRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // 计算弹出框位置
  useEffect(() => {
    if (isExpanded && badgeRef.current && popupRef.current) {
      const badgeRect = badgeRef.current.getBoundingClientRect();
      const popupHeight = popupRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - badgeRect.bottom;
      
      // 如果下方空间不足，显示在上方
      if (spaceBelow < popupHeight + 20) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [isExpanded]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        badgeRef.current &&
        popupRef.current &&
        !badgeRef.current.contains(event.target as Node) &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  if (!inline) {
    // 非内联显示（用于引用列表）
    return (
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <span className="flex-shrink-0 inline-flex items-center justify-center 
                       w-6 h-6 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
          {reference.index_id}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <DocumentTextIcon className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-900 truncate">{reference.title}</h4>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{reference.text}</p>
          {reference.doc_name && (
            <p className="text-xs text-gray-400 mt-1">来源：{reference.doc_name}</p>
          )}
        </div>
      </div>
    );
  }

  // 内联显示
  return (
    <span ref={badgeRef} className="relative inline-block align-baseline">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-block align-baseline text-[10px] font-medium
                   text-blue-600 hover:text-blue-700 transition-colors 
                   cursor-pointer relative -top-[0.5em] ml-0.5"
        title={`查看引用：${reference.title}`}
      >
        {reference.index_id}
      </button>
      
      {isExpanded && (
        <div
          ref={popupRef}
          className={`absolute z-50 w-80 mt-1 bg-white rounded-lg shadow-lg 
                      border border-gray-200 transform transition-all duration-200
                      ${position === 'top' ? 'bottom-full mb-1' : 'top-full'}`}
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          {/* 小三角指示器 */}
          <div className={`absolute w-2.5 h-2.5 bg-white border-gray-200 transform rotate-45
                          ${position === 'top' 
                            ? 'bottom-[-5px] border-b border-r' 
                            : 'top-[-5px] border-t border-l'}`}
               style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}
          />
          
          {/* 内容 */}
          <div className="relative p-3">
            {/* 头部 */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <DocumentTextIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <h4 className="font-medium text-sm text-gray-800 truncate">
                  {reference.title}
                </h4>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="flex-shrink-0 p-0.5 text-gray-400 hover:text-gray-600 
                          hover:bg-gray-100 rounded transition-colors"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* 引用内容 */}
            <div className="text-xs text-gray-600 max-h-48 overflow-y-auto 
                          scrollbar-thin scrollbar-thumb-gray-300 leading-relaxed">
              <p className="whitespace-pre-wrap">{reference.text}</p>
            </div>
            
            {/* 底部信息 */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span className="truncate">来源：{reference.doc_name}</span>
                <span className="inline-flex items-center px-1.5 py-0.5 bg-blue-50 
                               text-blue-500 rounded text-[10px] font-medium">
                  [{reference.index_id}]
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
} 