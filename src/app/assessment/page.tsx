'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 模拟测评问题
const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: '你对AI和机器学习的了解程度如何？',
    options: [
      { value: 'beginner', label: '初学者 - 几乎没有相关知识' },
      { value: 'intermediate', label: '中级 - 有一定基础但不深入' },
      { value: 'advanced', label: '高级 - 有较深入的理解' },
      { value: 'expert', label: '专家 - 专业领域工作者' }
    ]
  },
  {
    id: 2,
    question: '你希望通过学习AI获得什么？',
    options: [
      { value: 'career', label: '职业发展 - 找到AI相关工作' },
      { value: 'project', label: '项目需求 - 应用于具体项目' },
      { value: 'knowledge', label: '知识拓展 - 了解AI技术' },
      { value: 'research', label: '研究目的 - 进行学术研究' }
    ]
  },
  {
    id: 3,
    question: '你每周可以投入多少时间学习AI？',
    options: [
      { value: 'little', label: '少于5小时' },
      { value: 'moderate', label: '5-10小时' },
      { value: 'significant', label: '10-20小时' },
      { value: 'full', label: '20小时以上' }
    ]
  },
  {
    id: 4,
    question: '你的编程经验如何？',
    options: [
      { value: 'none', label: '无经验' },
      { value: 'basic', label: '基础水平 - 了解基本概念' },
      { value: 'intermediate', label: '中级水平 - 能开发小型项目' },
      { value: 'advanced', label: '高级水平 - 有丰富的项目经验' }
    ]
  },
  {
    id: 5,
    question: '你对以下哪个AI领域最感兴趣？',
    options: [
      { value: 'ml', label: '机器学习基础' },
      { value: 'nlp', label: '自然语言处理' },
      { value: 'cv', label: '计算机视觉' },
      { value: 'rl', label: '强化学习' }
    ]
  }
];

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({...answers, [questionId]: answer});
  };

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 最后一个问题完成，显示结果
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    // 在实际应用中，这里会发送数据到服务器
    console.log('测评完成，结果:', answers);
    // 重定向到仪表盘或课程页面
    router.push('/dashboard');
  };

  const handleSkip = () => {
    // 用户跳过测评，直接跳转到仪表盘
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-400 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-white hover:text-blue-100">
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回主页
          </Link>
        </div>
        
        {/* Logo和标题 */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">AI知行学堂 - 个性化测评</h1>
        </div>
        
        {/* 测评内容 */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {!isComplete ? (
            <div>
              <div className="p-6 pb-0">
                <h2 className="text-xl font-bold text-gray-900 mb-2">发现你的AI学习之路</h2>
                <p className="text-gray-600 mb-6">
                  通过完成以下测评问题，我们将为您创建个性化的学习路径。
                </p>
                
                <div className="relative pt-1 mb-6">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                        问题 {currentQuestion + 1} / {ASSESSMENT_QUESTIONS.length}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {Math.round(((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                    <div style={{ width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-0">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-6">
                    {ASSESSMENT_QUESTIONS[currentQuestion].question}
                  </h3>
                  
                  <div className="space-y-4">
                    {ASSESSMENT_QUESTIONS[currentQuestion].options.map((option) => (
                      <div 
                        key={option.value} 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          answers[ASSESSMENT_QUESTIONS[currentQuestion].id] === option.value 
                            ? 'border-blue-600 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                        onClick={() => handleAnswer(ASSESSMENT_QUESTIONS[currentQuestion].id, option.value)}
                      >
                        <div className="flex items-center">
                          <div className={`h-5 w-5 mr-3 rounded-full border-2 flex items-center justify-center ${
                            answers[ASSESSMENT_QUESTIONS[currentQuestion].id] === option.value 
                              ? 'border-blue-600' 
                              : 'border-gray-300'
                          }`}>
                            {answers[ASSESSMENT_QUESTIONS[currentQuestion].id] === option.value && (
                              <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                            )}
                          </div>
                          <span className={`${
                            answers[ASSESSMENT_QUESTIONS[currentQuestion].id] === option.value 
                              ? 'text-blue-800 font-medium' 
                              : 'text-gray-700'
                          }`}>{option.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className={`px-4 py-2 rounded-lg ${
                        currentQuestion === 0 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      上一题
                    </button>
                    
                    <button
                      onClick={handleSkip}
                      className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      跳过测评
                    </button>
                    
                    <button
                      onClick={handleNext}
                      disabled={!answers[ASSESSMENT_QUESTIONS[currentQuestion].id]}
                      className={`px-4 py-2 rounded-lg ${
                        !answers[ASSESSMENT_QUESTIONS[currentQuestion].id]
                          ? 'bg-blue-300 text-white cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? '完成' : '下一题'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">测评完成!</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  基于您的回答，我们已为您创建个性化学习路径。以下是您的测评结果概览：
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">知识水平</div>
                  <div className="font-medium text-gray-900 text-lg">{
                    answers[1] === 'beginner' ? '初学者' : 
                    answers[1] === 'intermediate' ? '中级' : 
                    answers[1] === 'advanced' ? '高级' : '专家'
                  }</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">学习目标</div>
                  <div className="font-medium text-gray-900 text-lg">{
                    answers[2] === 'career' ? '职业发展' : 
                    answers[2] === 'project' ? '项目应用' : 
                    answers[2] === 'knowledge' ? '知识拓展' : '学术研究'
                  }</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">推荐学习领域</div>
                  <div className="font-medium text-gray-900 text-lg">{
                    answers[5] === 'ml' ? '机器学习基础' : 
                    answers[5] === 'nlp' ? '自然语言处理' : 
                    answers[5] === 'cv' ? '计算机视觉' : '强化学习'
                  }</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="font-medium text-gray-900 mb-4 text-lg">您的学习计划建议</h3>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700"><span className="font-medium">学习重点：</span> 根据您的背景，我们建议您从{answers[1] === 'beginner' ? '基础概念' : '进阶技术'}开始，重点关注{answers[5] === 'ml' ? '机器学习基础算法' : answers[5] === 'nlp' ? '文本处理技术' : answers[5] === 'cv' ? '图像识别方法' : '强化学习算法'}。</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700"><span className="font-medium">学习时间：</span> 考虑到您的时间安排，建议您{answers[3] === 'little' ? '每周安排3-5个小时，分散在多个时间段' : answers[3] === 'moderate' ? '每周保持5-8个小时的学习时间' : '充分利用您的时间，每周进行深度学习'}。</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700"><span className="font-medium">实践建议：</span> 为达到您的{answers[2] === 'career' ? '职业发展' : answers[2] === 'project' ? '项目应用' : answers[2] === 'knowledge' ? '知识拓展' : '研究'}目标，建议多参与{answers[2] === 'career' ? '实际项目' : answers[2] === 'project' ? '动手实践' : answers[2] === 'knowledge' ? '理论学习' : '学术讨论'}。</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleComplete}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
                  开始您的学习之旅
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  您的学习计划已根据测评结果定制完成，随时可以调整。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 