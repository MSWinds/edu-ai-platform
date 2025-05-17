'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardSidebar from '../../../main_sidebar/DashboardSidebar';
import { colors } from '../../../theme/colors';

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

export default function DiscussionDetail() {
  const params = useParams();
  const discussionId = params.id as string;
  const discussion = mockDiscussions.find(d => d.id === discussionId);
  const replies = mockReplies[discussionId] || [];
  const [newReply, setNewReply] = useState('');

  if (!discussion) {
    return (
      <DashboardSidebar>
        <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-gray-500">讨论不存在或已被删除</div>
        </div>
      </DashboardSidebar>
    );
  }

  return (
    <DashboardSidebar>
      <div className="flex-1 bg-gray-50 min-h-screen">
        <header className="bg-white border-b" style={{ borderColor: colors.border }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => window.history.back()}
              >
                ← 返回
              </button>
              <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>讨论详情</h1>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* 主贴内容 */}
          <div className="bg-white rounded-2xl shadow-md border p-6 mb-6" style={{borderColor: colors.border}}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{discussion.title}</h2>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-4">
                <span>作者：{discussion.author}</span>
                <span>发布于：{discussion.timestamp.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>浏览：{discussion.views}</span>
                <span>点赞：{discussion.likes}</span>
              </div>
            </div>
            <div className="prose max-w-none">
              <div className="text-gray-800 whitespace-pre-line">{discussion.content}</div>
            </div>
          </div>

          {/* 回复列表 */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">全部回复 ({replies.length})</h3>
            {replies.map(reply => (
              <div key={reply.id} className="bg-white rounded-2xl shadow-md border p-6" style={{borderColor: colors.border}}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{reply.author}</span>
                    <span className="text-sm text-gray-500">{reply.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-gray-800">{reply.content}</div>
              </div>
            ))}
          </div>

          {/* 回复框 */}
          <div className="bg-white rounded-2xl shadow-md border p-6" style={{borderColor: colors.border}}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">发表回复</h3>
            <textarea
              className="w-full border rounded-lg px-4 py-3 text-sm mb-4 min-h-[120px]"
              placeholder="写下你的回复..."
              value={newReply}
              onChange={e => setNewReply(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="px-6 py-2 rounded-lg text-white font-medium shadow transition-colors"
                style={{background: colors.gradient.primary}}
                onClick={() => {
                  // TODO: 处理回复提交
                  setNewReply('');
                }}
              >
                发表回复
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
} 