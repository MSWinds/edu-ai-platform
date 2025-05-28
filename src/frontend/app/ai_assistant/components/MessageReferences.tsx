'use client';

import { DocReference } from '../types/chat';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface MessageReferencesProps {
  references?: DocReference[];
  content?: string; // 添加内容参数以识别实际使用的引用
}

export function MessageReferences({ references, content }: MessageReferencesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 计算重映射的引用编号
  const remappedReferences = useMemo(() => {
    if (!references || references.length === 0) return [];
    
    // 如果有内容，找出实际使用的引用并重新编号
    if (content) {
      const usedRefs: string[] = [];
      const refRegex = /<ref>\[(\d+)\]<\/ref>/g;
      let match;
      
      while ((match = refRegex.exec(content)) !== null) {
        const refId = match[1];
        if (!usedRefs.includes(refId)) {
          usedRefs.push(refId);
        }
      }
      
      // 按数字顺序排序
      usedRefs.sort((a, b) => parseInt(a) - parseInt(b));
      
      // 创建映射并返回重映射的引用
      return usedRefs
        .map((originalId, index) => {
          const ref = references.find(r => r.index_id === originalId);
          if (ref) {
            return {
              ...ref,
              index_id: (index + 1).toString()
            };
          }
          return null;
        })
        .filter((ref): ref is DocReference => ref !== null);
    }
    
    // 如果没有内容，直接返回原始引用
    return references;
  }, [references, content]);
  
  if (remappedReferences.length === 0) {
    return null;
  }

  // 默认显示前3个引用，展开后显示全部
  const displayedRefs = isExpanded ? remappedReferences : remappedReferences.slice(0, 3);
  const hasMore = remappedReferences.length > 3;

  return (
    <div className="mt-4 border-t pt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-gray-600 flex items-center gap-1">
          <DocumentTextIcon className="w-3.5 h-3.5" />
          参考资料 ({remappedReferences.length})
        </h4>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
          >
            {isExpanded ? (
              <>
                收起 <ChevronUpIcon className="w-3 h-3" />
              </>
            ) : (
              <>
                查看全部 <ChevronDownIcon className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="space-y-1">
        {displayedRefs.map((ref) => (
          <div 
            key={ref.index_id} 
            className="flex items-center gap-2 text-xs text-gray-600 py-1"
          >
            <span className="flex-shrink-0 inline-flex items-center justify-center 
                           w-5 h-5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">
              {ref.index_id}
            </span>
            <DocumentTextIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{ref.title}</span>
          </div>
        ))}
      </div>
      
      {!isExpanded && hasMore && (
        <p className="text-xs text-gray-400 mt-1 text-center">
          还有 {remappedReferences.length - 3} 个引用
        </p>
      )}
    </div>
  );
} 