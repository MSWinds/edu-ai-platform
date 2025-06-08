'use client';

import { useState } from 'react';
import { DocReference } from '../types/chat';
import { DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ReferenceModal } from './ReferenceModal';

interface SourcesCollapseProps {
  references?: DocReference[];
  content?: string;
}

export function SourcesCollapse({ references, content }: SourcesCollapseProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedReference, setSelectedReference] = useState<DocReference | null>(null);
  const [showModal, setShowModal] = useState(false);

  // 计算重映射的引用编号
  const remappedReferences = (() => {
    if (!references || references.length === 0) return [];
    
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
      
      usedRefs.sort((a, b) => parseInt(a) - parseInt(b));
      
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
    
    return references;
  })();
  
  if (remappedReferences.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t pt-3">
      {/* 来源 汇总按钮 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 
                     border border-gray-200 hover:border-gray-300 rounded-lg 
                     transition-all duration-200 group"
        >
          <DocumentTextIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            来源 ({remappedReferences.length})
          </span>
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* 展开的引用列表 */}
      {isExpanded && (
        <div className="mt-3 space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
          {remappedReferences.map((ref, index) => (
            <button
              key={ref.index_id}
              onClick={() => {
                setSelectedReference(ref);
                setShowModal(true);
              }}
              className="flex items-start gap-3 w-full text-left p-3 bg-white 
                         hover:bg-blue-50 border border-gray-200 hover:border-blue-200 
                         rounded-lg transition-all duration-200 group"
              title={`点击查看详情：${ref.title}`}
            >
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 
                            group-hover:bg-blue-200 rounded-full flex items-center 
                            justify-center text-xs font-semibold transition-colors">
                {ref.index_id}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-800 
                             line-clamp-1 transition-colors">
                  {ref.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {ref.text.length > 100 ? `${ref.text.substring(0, 100)}...` : ref.text}
                </p>
                {ref.doc_name && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    📄 {ref.doc_name}
                  </p>
                )}
              </div>
              
              <div className="flex-shrink-0 text-xs text-gray-400 group-hover:text-blue-500 
                            opacity-0 group-hover:opacity-100 transition-all">
                点击查看
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* 引用详情弹窗 */}
      <ReferenceModal 
        reference={selectedReference}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedReference(null);
        }}
      />
    </div>
  );
} 