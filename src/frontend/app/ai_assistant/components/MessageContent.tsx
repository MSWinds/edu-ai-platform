'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { DocReference } from '../types/chat';
import { RefBadge } from './RefBadge';

interface MessageContentProps {
  content: string;
  docReferences?: DocReference[];
}

export function MessageContent({ content, docReferences }: MessageContentProps) {
  // 添加调试日志
  console.log('📋 MessageContent收到的内容:', content);
  console.log('📋 MessageContent收到的文档引用:', docReferences);

  // 如果没有文档引用，直接渲染Markdown
  if (!docReferences || docReferences.length === 0) {
    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="my-1">{children}</p>,
          pre: ({ children }) => <pre className="my-2 overflow-x-auto">{children}</pre>,
          code: ({ children }) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }

  // 处理带引用的内容
  const renderContentWithRefs = () => {
    // 创建引用映射和编号重映射
    const refMap = new Map<string, DocReference>();
    const numberMapping = new Map<string, string>(); // 原始编号 -> 新编号
    
    // 先找出文本中实际使用的所有引用
    const usedRefs: string[] = [];
    const refRegex = /<ref>\[(\d+)\]<\/ref>/g;
    let match;
    
    // 收集所有使用的引用编号
    const tempContent = content;
    while ((match = refRegex.exec(tempContent)) !== null) {
      const refId = match[1];
      if (!usedRefs.includes(refId)) {
        usedRefs.push(refId);
      }
    }
    
    // 按数字顺序排序
    usedRefs.sort((a, b) => parseInt(a) - parseInt(b));
    
    // 创建编号映射（从1开始）
    usedRefs.forEach((originalId, index) => {
      numberMapping.set(originalId, (index + 1).toString());
    });
    
    // 创建引用映射，使用新编号
    docReferences.forEach(ref => {
      const newNumber = numberMapping.get(ref.index_id);
      if (newNumber) {
        refMap.set(ref.index_id, ref);
      }
    });

    // 调试：检查映射情况
    console.log('📌 原始引用编号:', usedRefs);
    console.log('🔄 编号映射:', Array.from(numberMapping.entries()));
    
    // 分割文本，识别引用标记
    const parts: Array<{ type: 'text' | 'ref'; content: string; ref?: DocReference; displayNumber?: string }> = [];
    let lastIndex = 0;
    
    // 重置正则表达式
    refRegex.lastIndex = 0;

    while ((match = refRegex.exec(content)) !== null) {
      // 添加引用前的文本
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // 添加引用
      const refId = match[1];
      const ref = refMap.get(refId);
      const displayNumber = numberMapping.get(refId);
      
      if (ref && displayNumber) {
        parts.push({
          type: 'ref',
          content: match[0],
          ref,
          displayNumber
        });
      } else {
        // 如果找不到对应的引用，作为普通文本处理
        console.warn(`⚠️ 未找到引用 [${refId}] 的文档信息`);
        parts.push({
          type: 'text',
          content: match[0]
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // 调试：检查是否有未使用的引用
    const unusedRefs = Array.from(docReferences).filter(
      ref => !usedRefs.includes(ref.index_id)
    );
    if (unusedRefs.length > 0) {
      console.warn('⚠️ 未在文本中使用的引用:', unusedRefs.map(r => r.index_id));
    }

    // 添加最后剩余的文本
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    // 渲染各个部分
    return parts.map((part, index) => {
      if (part.type === 'ref' && part.ref && part.displayNumber) {
        // 创建一个带有重映射编号的引用对象
        const displayRef = {
          ...part.ref,
          index_id: part.displayNumber
        };
        return <RefBadge key={index} reference={displayRef} inline={true} />;
      } else {
        // 对文本部分应用Markdown渲染
        return (
          <ReactMarkdown
            key={index}
            components={{
              p: ({ children }) => <span>{children}</span>,
              pre: ({ children }) => <pre className="my-2 overflow-x-auto">{children}</pre>,
              code: ({ children }) => (
                <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">
                  {children}
                </code>
              ),
            }}
          >
            {part.content}
          </ReactMarkdown>
        );
      }
    });
  };

  return <div className="prose prose-sm max-w-none inline">{renderContentWithRefs()}</div>;
} 