'use client';

import { useState } from 'react';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { colors } from '../theme/colors';
import { mockCourseData } from '../mockdata/courseData';

interface Discussion {
  id: string;
  courseId: number;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  replies: number;
  lastReply: Date;
  views: number;
  likes: number;
}

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

// Mock discussions data
const mockDiscussions: Discussion[] = [
  {
    id: '1',
    courseId: 1,
    title: '关于机器学习基础概念的讨论',
    content: '在学习监督学习和无监督学习时遇到了一些困惑，想请教大家...',
    author: '张三',
    timestamp: new Date('2024-03-20T10:00:00'),
    replies: 5,
    lastReply: new Date('2024-03-20T15:30:00'),
    views: 91,
    likes: 12
  },
  {
    id: '2',
    courseId: 1,
    title: '本周作业讨论',
    content: '关于第三章的练习题，大家有什么想法？',
    author: '李四',
    timestamp: new Date('2024-03-19T14:20:00'),
    replies: 3,
    lastReply: new Date('2024-03-20T09:15:00'),
    views: 51,
    likes: 7
  }
];

// Mock replies data
const mockReplies: Record<string, Reply[]> = {
  '1': [
    {
      id: 'r1',
      author: '王老师',
      content: '监督学习需要标记数据，而无监督学习则从未标记的数据中发现模式。举个例子，图像分类是监督学习，而聚类分析是无监督学习。',
      timestamp: new Date('2024-03-20T10:30:00')
    },
    {
      id: 'r2',
      author: '李明',
      content: '我补充一下，监督学习就像有老师指导，而无监督学习则是自己探索。',
      timestamp: new Date('2024-03-20T11:15:00')
    }
  ],
  '2': [
    {
      id: 'r3',
      author: '赵四',
      content: '我觉得第三题比较难，需要用到贝叶斯定理。',
      timestamp: new Date('2024-03-19T15:00:00')
    }
  ]
};

export default function LearningCommunity() {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState<{
    courseId: string;
    title: string;
    content: string;
  }>({ courseId: '', title: '', content: '' });

  return (
    <DashboardSidebar>
      <div className="flex-1 bg-gray-50 min-h-screen">
        <header className="bg-white border-b" style={{ borderColor: colors.border }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>学习社区</h1>
            <button
              className="px-6 py-2 rounded-lg text-white font-medium shadow transition-colors"
              style={{background: colors.gradient.primary}}
              onClick={() => setShowNewDiscussion(true)}
            >
              发起讨论
            </button>
          </div>
        </header>

        {/* 新建讨论弹窗 */}
        {showNewDiscussion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowNewDiscussion(false)}></div>
            <div 
              className="bg-white rounded-2xl shadow-2xl p-6 relative flex flex-col gap-4 my-auto overflow-auto"
              style={{ 
                width: '500px',
                minWidth: '500px', 
                maxWidth: '90vw', 
                maxHeight: '90vh',
              }}
            >
              <button
                className="absolute right-3 top-3 text-gray-400 hover:text-white hover:bg-blue-500 transition rounded-full w-8 h-8 flex items-center justify-center text-xl"
                onClick={() => setShowNewDiscussion(false)}
                title="关闭"
                style={{lineHeight: 1}}
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-2 text-gray-900 text-center">发起新讨论</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">选择课程</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={newDiscussion.courseId}
                    onChange={e => setNewDiscussion(v => ({...v, courseId: e.target.value}))}
                  >
                    <option value="">请选择课程</option>
                    <option value={mockCourseData.id.toString()}>{mockCourseData.title}</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">标题</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="请输入讨论标题"
                    value={newDiscussion.title}
                    onChange={e => setNewDiscussion(v => ({...v, title: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">内容</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 min-h-[200px] text-sm"
                    placeholder="请输入讨论内容..."
                    value={newDiscussion.content}
                    onChange={e => setNewDiscussion(v => ({...v, content: e.target.value}))}
                  />
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button
                    className="px-4 py-1.5 rounded-lg text-gray-600 font-medium border border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
                    onClick={() => setShowNewDiscussion(false)}
                  >
                    取消
                  </button>
                  <button
                    className="px-5 py-1.5 rounded-lg text-white font-medium shadow text-sm bg-blue-600 hover:bg-blue-700 transition"
                    onClick={() => setShowNewDiscussion(false)}
                  >
                    发布
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 主内容区 */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* 筛选和统计区域 */}
          <div className="bg-white rounded-2xl shadow-md border p-6 mb-6" style={{borderColor: colors.border}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  className="rounded-lg border px-3 py-2 text-sm bg-white"
                  style={{borderColor: colors.border, color: colors.text.primary}}
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                >
                  <option value="all">所有课程</option>
                  <option value={mockCourseData.id.toString()}>{mockCourseData.title}</option>
                </select>
                <div className="text-sm text-gray-600">
                  共 {discussions.length} 个讨论
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>排序：</span>
                <button className="px-3 py-1 rounded-lg hover:bg-gray-100">最新发布</button>
                <button className="px-3 py-1 rounded-lg hover:bg-gray-100">最多回复</button>
                <button className="px-3 py-1 rounded-lg hover:bg-gray-100">最多浏览</button>
              </div>
            </div>
          </div>

          {/* 讨论列表 */}
          <div className="space-y-4">
            {discussions
              .filter(d => selectedCourse === 'all' || d.courseId.toString() === selectedCourse)
              .map(discussion => (
                <div
                  key={discussion.id}
                  className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  style={{borderColor: colors.border}}
                  onClick={() => window.location.href = `/learning_community/discussion/${discussion.id}`}
                >
                  <div className="flex items-start gap-6">
                    {/* 左侧统计信息 */}
                    <div className="flex flex-col items-center space-y-1 min-w-[80px]">
                      <div className="text-lg font-bold text-gray-900">{discussion.replies}</div>
                      <div className="text-sm text-gray-500">回复</div>
                    </div>
                    
                    {/* 右侧内容 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                          {discussion.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {discussion.lastReply.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-gray-600 mb-3 line-clamp-2">
                        {discussion.content}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500">作者：{discussion.author}</span>
                          <span className="text-gray-500">发布于：{discussion.timestamp.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500">浏览：{discussion.views}</span>
                          <span className="text-gray-500">点赞：{discussion.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
}
