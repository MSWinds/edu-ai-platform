'use client';

import { useState, useEffect } from 'react';
import { DocReference } from '../types/chat';
import { DocumentTextIcon, XMarkIcon, ClipboardIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

interface ReferenceModalProps {
  reference: DocReference | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReferenceModal({ reference, isOpen, onClose }: ReferenceModalProps) {
  const [copied, setCopied] = useState(false);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    if (reference?.text) {
      try {
        await navigator.clipboard.writeText(reference.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  if (!isOpen || !reference) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] 
                      overflow-hidden transform transition-all">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 
                           rounded-lg text-sm font-semibold">
              {reference.index_id}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{reference.title}</h2>
              {reference.doc_name && (
                <p className="text-sm text-gray-500">来源：{reference.doc_name}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 复制按钮 */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 
                        hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="复制内容"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">已复制</span>
                </>
              ) : (
                <>
                  <ClipboardIcon className="w-4 h-4" />
                  <span>复制</span>
                </>
              )}
            </button>
            
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                        rounded-lg transition-colors"
              title="关闭"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-300">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {reference.text}
            </div>
          </div>
        </div>
        
        {/* 底部信息 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <DocumentTextIcon className="w-4 h-4" />
                文档引用
              </span>
              {reference.biz_id && (
                <span className="text-xs text-gray-500">ID: {reference.biz_id}</span>
              )}
            </div>
            
            {reference.doc_url && (
              <a
                href={reference.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 
                          transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                查看原文
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 