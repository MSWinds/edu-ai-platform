'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { DocReference } from '../types/chat';
import { RefBadge } from './RefBadge';

interface StreamingMessageContentProps {
  content: string;
  docReferences?: DocReference[];
  isStreaming?: boolean;
}

export function StreamingMessageContent({ 
  content, 
  docReferences, 
  isStreaming = false 
}: StreamingMessageContentProps) {

  // 预处理内容，清理多余的换行和空白
  const cleanContent = content
    .replace(/\n\s*\n\s*\n/g, '\n\n') // 将多个连续空行合并为一个空行
    .trim();

  // 流式传输时，实时渲染简化的Markdown，保持格式一致
  if (isStreaming) {
    return (
      <div className="text-gray-800 leading-relaxed">
        <ReactMarkdown
          components={{
            // 统一使用 p 标签，保持一致性
            p: ({ children }) => <p className="mb-2 first:mt-0 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-100 p-3 rounded my-3 overflow-x-auto text-sm">
                {children}
              </pre>
            ),
            ul: ({ children }) => <ul className="list-disc ml-4 my-2 space-y-0.5">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-4 my-2 space-y-0.5">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            h1: ({ children }) => <h1 className="text-lg font-bold my-3 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-bold my-3 first:mt-0">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-bold my-2 first:mt-0">{children}</h3>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-gray-300 pl-3 my-2 text-gray-600">
                {children}
              </blockquote>
            ),
            // 保持换行
            br: () => <br />,
          }}
        >
          {cleanContent}
        </ReactMarkdown>
        <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse ml-1"></span>
      </div>
    );
  }

  // 流式完成后，渲染完整的Markdown
  if (!docReferences || docReferences.length === 0) {
    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 first:mt-0 last:mb-0">{children}</p>,
          pre: ({ children }) => <pre className="my-3 overflow-x-auto bg-gray-100 p-3 rounded">{children}</pre>,
          code: ({ children }) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
              {children}
            </code>
          ),
          br: () => <br />,
          // 控制列表间距
          ul: ({ children }) => <ul className="my-2 ml-4 space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 ml-4 space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          // 控制标题间距
          h1: ({ children }) => <h1 className="text-lg font-bold my-3 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold my-3 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold my-2 first:mt-0">{children}</h3>,
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    );
  }

  // 处理带引用的内容（仅在流式完成后）
  const renderContentWithRefs = () => {
    const refMap = new Map<string, DocReference>();
    const numberMapping = new Map<string, string>();
    
    // 找出文本中实际使用的所有引用
    const usedRefs: string[] = [];
    const refRegex = /<ref>\[(\d+)\]<\/ref>/g;
    let match;
    
    const tempContent = cleanContent;
    while ((match = refRegex.exec(tempContent)) !== null) {
      const refId = match[1];
      if (!usedRefs.includes(refId)) {
        usedRefs.push(refId);
      }
    }
    
    usedRefs.sort((a, b) => parseInt(a) - parseInt(b));
    
    usedRefs.forEach((originalId, index) => {
      numberMapping.set(originalId, (index + 1).toString());
    });
    
    docReferences.forEach(ref => {
      const newNumber = numberMapping.get(ref.index_id);
      if (newNumber) {
        refMap.set(ref.index_id, ref);
      }
    });
    
    // 分割文本，识别引用标记
    const parts: Array<{ type: 'text' | 'ref'; content: string; ref?: DocReference; displayNumber?: string }> = [];
    let lastIndex = 0;
    
    refRegex.lastIndex = 0;

    while ((match = refRegex.exec(cleanContent)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: cleanContent.slice(lastIndex, match.index)
        });
      }

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
        parts.push({
          type: 'text',
          content: match[0]
        });
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < cleanContent.length) {
      parts.push({
        type: 'text',
        content: cleanContent.slice(lastIndex)
      });
    }

    return parts.map((part, index) => {
      if (part.type === 'ref' && part.ref && part.displayNumber) {
        const displayRef = {
          ...part.ref,
          index_id: part.displayNumber
        };
        return <RefBadge key={index} reference={displayRef} inline={true} />;
      } else {
        return (
          <ReactMarkdown
            key={index}
            components={{
              p: ({ children }) => <span className="inline">{children}</span>,
              pre: ({ children }) => <pre className="my-3 overflow-x-auto bg-gray-100 p-3 rounded">{children}</pre>,
              code: ({ children }) => (
                <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              ),
              br: () => <br />,
            }}
          >
            {part.content}
          </ReactMarkdown>
        );
      }
    });
  };

  return (
    <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
      {renderContentWithRefs()}
    </div>
  );
} 