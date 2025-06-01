import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

// 加载动画组件
const LoadingSpinner = ({ text = "生成中" }: { text?: string }) => (
  <div className="flex items-center gap-2">
    <svg 
      className="animate-spin h-5 w-5 text-blue-800" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
        opacity="0.25"
      />
      <path 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        opacity="0.85"
      />
    </svg>
    <span className="text-blue-800 font-medium">{text}...</span>
  </div>
);

interface ExercisePopupProps {
  isOpen: boolean;
  onClose: () => void;
  weekNumber: number;
  exerciseTitle: string;
}

// 美化的结果展示组件
const ResultDisplay = ({ content, label, variant = 'neutral' }: { 
  content: string; 
  label: string; 
  variant?: 'neutral' | 'first' | 'second' 
}) => {
  const bgColor = variant === 'first' ? 'bg-red-50 border-red-200' : 
                  variant === 'second' ? 'bg-green-50 border-green-200' : 
                  'bg-gray-50 border-gray-200';
  const [expanded, setExpanded] = useState(false);
  // 限制显示长度
  const maxLen = 500;
  const isLong = content.length > maxLen;
  const displayContent = !isLong || expanded ? content : content.slice(0, maxLen) + '...';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className={`relative p-4 border rounded-lg ${bgColor}`}>
        <div className="text-gray-800 prose prose-sm max-w-none
          prose-p:my-2 prose-p:leading-relaxed
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-em:text-gray-700 prose-em:italic
          prose-headings:text-gray-900 prose-headings:font-semibold
          prose-ul:my-2 prose-li:my-1
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic">
          <ReactMarkdown 
            components={{
              // 自定义样式
              p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
            }}
          >
            {displayContent}
          </ReactMarkdown>
        </div>
        {/* 右下角模型角标 */}
        <div className="absolute bottom-2 right-3 flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded shadow text-xs text-gray-500 select-none">
          <Image src="/icons/ds-logo.png" alt="deepseek-v3" width={16} height={16} className="inline-block" />
          <span>deepseek-v3</span>
        </div>
        {/* 展开/收起按钮 */}
        {isLong && (
          <button
            className="absolute right-3 bottom-8 text-xs text-blue-600 hover:underline bg-white/80 px-1 rounded"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? '收起' : '查看更多'}
          </button>
        )}
      </div>
    </div>
  );
};

export default function ExercisePopup({ isOpen, onClose, weekNumber, exerciseTitle }: ExercisePopupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [firstPrompt, setFirstPrompt] = useState("写一段关于气候变化的300字新闻");
  const [secondPrompt, setSecondPrompt] = useState("");
  const [firstResult, setFirstResult] = useState("");
  const [secondResult, setSecondResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reflection, setReflection] = useState({
    improvements: "",
    betterResult: "",
    learnings: ""
  });

  const generateContent = async (prompt: string, isSecond: boolean = false) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/dashscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (data.success) {
        if (isSecond) {
          setSecondResult(data.content);
          setCurrentStep(5);
        } else {
          setFirstResult(data.content);
          setCurrentStep(3);
        }
      } else {
        alert('生成失败：' + data.error);
      }
    } catch (error) {
      alert('网络错误，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFirstGenerate = () => {
    generateContent(firstPrompt, false);
  };

  const handleSecondGenerate = () => {
    if (!secondPrompt.trim()) {
      alert('请先修改提示词');
      return;
    }
    generateContent(secondPrompt, true);
  };

  const resetExercise = () => {
    setCurrentStep(1);
    setFirstPrompt("写一段关于气候变化的新闻");
    setSecondPrompt("");
    setFirstResult("");
    setSecondResult("");
    setReflection({
      improvements: "",
      betterResult: "",
      learnings: ""
    });
  };

  const steps = [
    { num: 1, title: "简单提示", desc: "使用基础提示词生成内容" },
    { num: 2, title: "生成内容", desc: "查看AI生成的结果" },
    { num: 3, title: "改进提示", desc: "优化提示词，让结果更符合需求" },
    { num: 4, title: "再次生成", desc: "用改进的提示词重新生成" },
    { num: 5, title: "对比反思", desc: "比较两次结果，总结经验" }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-6xl h-[85vh] bg-white rounded-xl shadow-lg flex">
          {/* Left sidebar - Steps */}
          <div className="w-1/4 border-r border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center gap-2 mb-6">
              <Image src="/icons/ds-logo.png" alt="DeepSeek" width={24} height={24} />
              <h3 className="text-lg font-semibold text-gray-900">提示词工程实验</h3>
            </div>
            
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.num} className={`p-3 rounded-lg border ${
                  currentStep === step.num 
                    ? 'border-blue-500 bg-blue-50' 
                    : currentStep > step.num 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step.num 
                        ? 'bg-blue-500 text-white' 
                        : currentStep > step.num 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {currentStep > step.num ? '✓' : step.num}
                    </span>
                    <span className="font-medium text-gray-900">{step.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                第 {weekNumber} 周 - {exerciseTitle}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Task Description */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">实验任务</h4>
                <p className="text-blue-800">
                  以"气候变化"为主题，尝试不同的提示词来生成300字新闻。通过对比两次生成的结果，体会提示词工程的重要性。
                </p>
              </div>

              {/* Step 1 & 2: First Prompt and Result */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">第一次尝试：基础提示词</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">提示词：</label>
                    <input
                      type="text"
                      value={firstPrompt}
                      onChange={(e) => setFirstPrompt(e.target.value)}
                      disabled={currentStep > 2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  
                  {currentStep === 1 && (
                    <button
                      onClick={handleFirstGenerate}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? <LoadingSpinner text="生成中" /> : '生成内容'}
                    </button>
                  )}

                  {firstResult && (
                    <ResultDisplay 
                      content={firstResult} 
                      label="生成结果："
                      variant="neutral"
                    />
                  )}
                </div>
              </div>

              {/* Step 3 & 4: Improved Prompt and Result */}
              {currentStep >= 3 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">第二次尝试：改进提示词</h4>
                  <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>改进建议：</strong>尝试添加更具体的要求，比如：
                      <br />• "用新闻报道的语气"
                      <br />• "包含最新统计数据"  
                      <br />• "假设你是央视新闻记者"
                      <br />• "重点关注对人类生活的影响"
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">改进后的提示词：</label>
                      <textarea
                        value={secondPrompt}
                        onChange={(e) => setSecondPrompt(e.target.value)}
                        disabled={currentStep > 4}
                        placeholder="在这里输入你改进后的提示词..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        rows={3}
                      />
                    </div>
                    
                    {currentStep === 3 && (
                      <button
                        onClick={() => setCurrentStep(4)}
                        disabled={!secondPrompt.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        确认修改
                      </button>
                    )}

                    {currentStep === 4 && (
                      <button
                        onClick={handleSecondGenerate}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {isGenerating ? <LoadingSpinner text="生成中" /> : '生成改进后的内容'}
                      </button>
                    )}

                    {secondResult && (
                      <ResultDisplay 
                        content={secondResult} 
                        label="生成结果："
                        variant="neutral"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Comparison and Reflection */}
              {currentStep === 5 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">对比与反思</h4>
                  
                  {/* Results Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <ResultDisplay 
                      content={firstResult} 
                      label="第一次结果"
                      variant="first"
                    />
                    <ResultDisplay 
                      content={secondResult} 
                      label="第二次结果"
                      variant="second"
                    />
                  </div>

                  {/* Reflection Questions */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        1. 你在第二次提示词中做了哪些改进？
                      </label>
                      <textarea
                        value={reflection.improvements}
                        onChange={(e) => setReflection({...reflection, improvements: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="描述你做的具体改进..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        2. 哪个结果更符合需求？为什么？
                      </label>
                      <textarea
                        value={reflection.betterResult}
                        onChange={(e) => setReflection({...reflection, betterResult: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="分析哪个结果更好，说明原因..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        3. 你学到了什么提示词优化的技巧？
                      </label>
                      <textarea
                        value={reflection.learnings}
                        onChange={(e) => setReflection({...reflection, learnings: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="总结你学到的提示词工程技巧..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
              <div className="flex gap-3">
                <button
                  onClick={resetExercise}
                  className="px-6 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  重新开始
                </button>
                {currentStep === 5 && (
                  <button
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    提交练习
                  </button>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 