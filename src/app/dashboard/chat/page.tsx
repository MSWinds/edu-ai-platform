'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../components/DashboardSidebar';
import { redirectIfNotAuthenticated, getUser } from '../../utils/auth';

// 模拟历史消息数据
const INITIAL_MESSAGES = [
  { id: 1, role: 'ai', content: '你好！我是你的AI学习助手。有任何关于课程内容的问题，都可以随时向我提问。', timestamp: '9:30 AM' },
  { id: 2, role: 'user', content: '我对决策树算法有点疑惑，能解释一下它的基本原理吗？', timestamp: '9:32 AM' },
  { id: 3, role: 'ai', content: '当然可以！决策树是一种基本的分类与回归方法，模型结构类似一棵树，其中每个内部节点表示对某个属性的测试，每个分支代表测试的输出，而每个叶节点代表分类或预测结果。\n\n决策树通过将数据集不断分割成子集来工作，每次分割基于一个特征的值，目标是创建的子集的纯度最高（即子集中的样本都属于同一类别）。\n\n决策树的核心优势在于其可解释性强，算法直观，易于理解和实现。你目前在学习的ID3、C4.5和CART都是常见的决策树算法。', timestamp: '9:33 AM' },
  { id: 4, role: 'user', content: 'ID3和C4.5算法的主要区别是什么？', timestamp: '9:35 AM' },
  { id: 5, role: 'ai', content: 'ID3和C4.5算法的主要区别包括：\n\n1. 分裂标准：ID3使用信息增益作为分裂标准，而C4.5使用信息增益比率，这有助于克服ID3偏向于多值属性的缺点。\n\n2. 处理连续值：ID3不能处理连续的特征值，而C4.5可以通过将连续值离散化来处理。\n\n3. 处理缺失值：C4.5可以处理训练数据中的缺失值，而ID3不能。\n\n4. 剪枝：C4.5实现了后剪枝技术，这可以减少过拟合，而ID3没有内置剪枝。\n\n总的来说，C4.5是ID3的改进版本，解决了ID3的一些局限性，因此在实际应用中更为常用。', timestamp: '9:36 AM' }
];

// 模拟相关课程资料
const RELATED_RESOURCES = [
  { id: 1, title: '决策树：从理论到实践', type: 'video', duration: '45分钟' },
  { id: 2, title: 'ID3、C4.5与CART算法对比', type: 'article', readTime: '15分钟' },
  { id: 3, title: '使用scikit-learn实现决策树', type: 'tutorial', difficulty: '中级' },
  { id: 4, title: '决策树的优缺点与适用场景', type: 'quiz', questions: 10 }
];

// 模拟可能的问题建议
const SUGGESTED_QUESTIONS = [
  '决策树如何处理连续型变量？',
  '决策树容易过拟合的原因是什么？',
  '如何评估决策树模型的性能？',
  '随机森林与决策树的关系是什么？'
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState({ name: '', role: 'student' });
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    if (!redirectIfNotAuthenticated(router)) {
      const userData = getUser();
      if (userData) {
        setUser({
          name: userData.name || '学生',
          role: userData.role || 'student'
        });
      }
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // 添加用户消息
    const newUserMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // 模拟AI响应延迟
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 随机1-3秒延迟，模拟思考
  };

  const generateAIResponse = (question) => {
    // 这里简单模拟AI响应，实际项目中应该调用后端API
    const responses = [
      "基于你的问题，我建议你查看课程第三章节关于决策树的内容，特别是关于信息增益的计算部分。",
      "这是一个很好的问题！决策树的核心优势在于其可解释性和直观性。在实际应用中，它通常用于分类任务，比如风险评估、医疗诊断等领域。",
      "你提到的问题涉及机器学习的基础概念。在决策树算法中，我们通过选择最佳特征来分割数据，目标是最大化信息增益或最小化基尼不纯度。",
      "根据你当前的学习进度，我建议你先完成本周的实践练习，这将帮助你更好地理解理论知识并获得实际应用经验。",
      "对于你提出的问题，有多种解决方法。一种常见的方法是使用交叉验证来评估模型的性能，并通过调整参数来优化结果。你可以尝试在下一次实验中应用这个方法。"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">加载中...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 pl-64">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">AI学习助手</h1>
            <p className="mt-1 text-sm text-gray-500">随时提问，获取个性化学习支持和解答</p>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 聊天区域 */}
            <div className="lg:col-span-3">
              <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[75vh]">
                {/* 聊天消息区域 */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            message.role === 'user' 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div 
                            className={`text-xs mt-1 ${
                              message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg px-4 py-3 bg-gray-100 text-gray-800">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* 输入区域 */}
                <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="输入你的问题..."
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className={`px-4 py-2 rounded-md text-white ${
                        inputMessage.trim() 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'bg-indigo-400 cursor-not-allowed'
                      }`}
                    >
                      发送
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 可能的问题 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">你可能想问</h2>
                </div>
                <div className="px-4 py-3">
                  <ul className="space-y-2">
                    {SUGGESTED_QUESTIONS.map((question, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleSuggestedQuestion(question)}
                          className="w-full text-left text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1.5 rounded-md"
                        >
                          {question}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* 相关资料 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">相关学习资料</h2>
                </div>
                <div className="px-4 py-3">
                  <ul className="divide-y divide-gray-200">
                    {RELATED_RESOURCES.map(resource => (
                      <li key={resource.id} className="py-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-8 w-8 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
                            {resource.type === 'video' && (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {resource.type === 'article' && (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 01-2-2v0a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14z" />
                              </svg>
                            )}
                            {resource.type === 'tutorial' && (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            )}
                            {resource.type === 'quiz' && (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">{resource.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {resource.type === 'video' && `视频 · ${resource.duration}`}
                              {resource.type === 'article' && `文章 · ${resource.readTime}阅读`}
                              {resource.type === 'tutorial' && `教程 · ${resource.difficulty}`}
                              {resource.type === 'quiz' && `测验 · ${resource.questions}题`}
                            </p>
                            <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 inline-block">
                              查看资料
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    查看更多资料
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 