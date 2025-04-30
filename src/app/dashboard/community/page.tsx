'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../components/DashboardSidebar';
import { redirectIfNotAuthenticated, getUser } from '../../utils/auth';

// 模拟讨论数据
const DISCUSSIONS = [
  {
    id: 1,
    title: '如何理解反向传播算法中的链式法则？',
    author: '李明',
    authorAvatar: '/images/avatar1.jpg',
    date: '2023-11-12',
    tags: ['神经网络', '反向传播', '数学原理'],
    likes: 24,
    comments: 8,
    excerpt: '在学习反向传播算法时，对链式法则的应用感到困惑。特别是对于多层网络，如何有效地计算梯度...'
  },
  {
    id: 2,
    title: '分享一个可视化决策树的Python工具',
    author: '张伟',
    authorAvatar: '/images/avatar2.jpg',
    date: '2023-11-11',
    tags: ['决策树', 'Python', '工具分享'],
    likes: 42,
    comments: 15,
    excerpt: '最近发现了一个非常好用的决策树可视化工具，可以直观地展示特征重要性和分割点...'
  },
  {
    id: 3,
    title: '请教：在NLP项目中如何处理中文分词问题？',
    author: '王芳',
    authorAvatar: '/images/avatar3.jpg',
    date: '2023-11-10',
    tags: ['自然语言处理', '中文分词', 'BERT'],
    likes: 18,
    comments: 23,
    excerpt: '正在做一个中文情感分析项目，遇到了分词问题。传统的jieba似乎效果不太理想，有没有更好的方法...'
  },
  {
    id: 4,
    title: '学习小组：每周五晚讨论CNN架构演进',
    author: '刘洋',
    authorAvatar: '/images/avatar4.jpg',
    date: '2023-11-09',
    tags: ['学习小组', 'CNN', '深度学习'],
    likes: 35,
    comments: 12,
    excerpt: '组建了一个线上学习小组，每周五晚8点讨论CNN架构的演进，从LeNet到最新的网络架构，欢迎感兴趣的同学加入...'
  },
  {
    id: 5,
    title: '总结：机器学习中的正则化方法比较',
    author: '赵静',
    authorAvatar: '/images/avatar5.jpg',
    date: '2023-11-08',
    tags: ['正则化', 'L1L2正则', '过拟合'],
    likes: 56,
    comments: 19,
    excerpt: '这篇文章总结了几种常见的正则化方法，包括L1、L2正则化、Dropout和早停法，并通过实验比较了它们在不同数据集上的效果...'
  }
];

// 模拟热门话题
const HOT_TOPICS = [
  { id: 1, name: '深度学习', count: 128 },
  { id: 2, name: '神经网络', count: 96 },
  { id: 3, name: '计算机视觉', count: 85 },
  { id: 4, name: '自然语言处理', count: 72 },
  { id: 5, name: '强化学习', count: 65 },
  { id: 6, name: 'AI应用', count: 54 },
  { id: 7, name: '数学基础', count: 48 },
  { id: 8, name: '学习方法', count: 39 }
];

// 模拟活跃用户
const ACTIVE_USERS = [
  { id: 1, name: '张伟', posts: 26, avatar: '/images/avatar2.jpg' },
  { id: 2, name: '李明', posts: 24, avatar: '/images/avatar1.jpg' },
  { id: 3, name: '王芳', posts: 19, avatar: '/images/avatar3.jpg' },
  { id: 4, name: '刘洋', posts: 17, avatar: '/images/avatar4.jpg' },
  { id: 5, name: '赵静', posts: 15, avatar: '/images/avatar5.jpg' }
];

export default function Community() {
  const [filter, setFilter] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiscussions, setFilteredDiscussions] = useState(DISCUSSIONS);
  const [selectedTags, setSelectedTags] = useState([]);
  const [user, setUser] = useState({ name: '', email: '', role: 'student' });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    if (!redirectIfNotAuthenticated(router)) {
      const userData = getUser();
      if (userData) {
        setUser({
          name: userData.name || '学生用户',
          email: userData.email || 'student@example.com',
          role: userData.role || 'student'
        });
      }
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    // 根据筛选条件过滤讨论
    let results = [...DISCUSSIONS];
    
    // 搜索词过滤
    if (searchTerm) {
      results = results.filter(
        discussion => 
          discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discussion.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 标签过滤
    if (selectedTags.length > 0) {
      results = results.filter(discussion => 
        selectedTags.some(tag => discussion.tags.includes(tag))
      );
    }
    
    // 排序
    if (filter === 'latest') {
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filter === 'popular') {
      results.sort((a, b) => b.likes - a.likes);
    } else if (filter === 'most-comments') {
      results.sort((a, b) => b.comments - a.comments);
    }
    
    setFilteredDiscussions(results);
  }, [filter, searchTerm, selectedTags]);

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setFilter('latest');
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">学习社区</h1>
                <p className="mt-1 text-sm text-gray-500">与其他学生交流、分享学习心得和资源</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm">
                  发布新话题
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 主要内容区 */}
            <div className="lg:col-span-3">
              {/* 搜索和筛选 */}
              <div className="bg-white shadow rounded-lg mb-8">
                <div className="p-4">
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="搜索讨论..."
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="latest">最新</option>
                        <option value="popular">最热门</option>
                        <option value="most-comments">评论最多</option>
                      </select>
                    </div>
                    {(searchTerm || selectedTags.length > 0 || filter !== 'latest') && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        清除筛选
                      </button>
                    )}
                  </div>
                  
                  {/* 已选标签 */}
                  {selectedTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagSelect(tag)}
                            className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                          >
                            <span className="sr-only">移除标签 {tag}</span>
                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                              <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* 讨论列表 */}
              {filteredDiscussions.length > 0 ? (
                <div className="space-y-6">
                  {filteredDiscussions.map(discussion => (
                    <div key={discussion.id} className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h2 className="text-lg font-medium text-gray-900">
                                <Link href={`/dashboard/community/discussion/${discussion.id}`} className="hover:text-indigo-600">
                                  {discussion.title}
                                </Link>
                              </h2>
                              <div className="ml-2 flex-shrink-0 flex">
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  {discussion.comments} 评论
                                </span>
                              </div>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <span>{discussion.author}</span>
                              <span className="mx-1">&middot;</span>
                              <span>{discussion.date}</span>
                            </div>
                            <p className="mt-3 text-gray-600">
                              {discussion.excerpt}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {discussion.tags.map(tag => (
                                <button
                                  key={tag}
                                  onClick={() => handleTagSelect(tag)}
                                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                                    selectedTags.includes(tag)
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  }`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="inline-flex items-center text-gray-400 hover:text-indigo-600">
                                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  <span>{discussion.likes}</span>
                                </button>
                                <button className="inline-flex items-center text-gray-400 hover:text-indigo-600">
                                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  <span>{discussion.comments}</span>
                                </button>
                              </div>
                              <Link
                                href={`/dashboard/community/discussion/${discussion.id}`}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                查看详情
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">未找到讨论</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    没有符合当前筛选条件的讨论。尝试不同的搜索词或删除筛选条件。
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      清除所有筛选
                    </button>
                  </div>
                </div>
              )}
              
              {/* 分页 */}
              {filteredDiscussions.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">上一页</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                    >
                      2
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      3
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      8
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      9
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      10
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">下一页</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              )}
            </div>
            
            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 热门话题 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">热门话题</h2>
                </div>
                <div className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {HOT_TOPICS.map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => handleTagSelect(topic.name)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedTags.includes(topic.name)
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {topic.name}
                        <span className="ml-1 text-xs font-normal text-gray-500">({topic.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 活跃用户 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">活跃用户</h2>
                </div>
                <div className="px-4 py-3">
                  <ul className="divide-y divide-gray-200">
                    {ACTIVE_USERS.map(user => (
                      <li key={user.id} className="py-3 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.posts} 篇讨论</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* 社区指南 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">社区指南</h2>
                </div>
                <div className="px-4 py-3">
                  <div className="space-y-4 text-sm text-gray-600">
                    <p>
                      欢迎加入AI知行学堂学习社区！请遵守以下准则：
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>尊重他人观点，保持友善交流</li>
                      <li>避免发布与学习无关的内容</li>
                      <li>分享时请注明参考来源</li>
                      <li>禁止任何形式的商业广告</li>
                      <li>违反规则的内容将被移除</li>
                    </ul>
                    <p>
                      如有问题，请联系社区管理员。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 