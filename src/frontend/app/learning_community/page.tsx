'use client';

import { useState } from 'react';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { colors } from '../theme/colors';
import { mockCourseData } from '../mockdata/courseData';
import { useRouter } from 'next/navigation';

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

interface StudyGroup {
  id: string;
  courseId: number;
  title: string;
  description: string;
  creator: string;
  members: string[];
  maxMembers: number;
  tags: string[];
  meetingTime: string;
  createdAt: Date;
  isActive: boolean;
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

// Mock study groups data
const mockStudyGroups: StudyGroup[] = [
  {
    id: '1',
    courseId: 1,
    title: '机器学习基础小组',
    description: '一起学习机器学习基础知识，互相督促完成作业，每周线上讨论一次。欢迎初学者加入！',
    creator: '王小明',
    members: ['王小明', '李华', '张三'],
    maxMembers: 6,
    tags: ['初学者友好', '作业互助', '线上讨论'],
    meetingTime: '每周三晚上8点',
    createdAt: new Date('2024-03-18T10:00:00'),
    isActive: true
  },
  {
    id: '2',
    courseId: 1,
    title: 'AI项目实践组',
    description: '有一定基础的同学一起做项目，目标是完成一个完整的机器学习项目。需要有Python基础。',
    creator: '陈强',
    members: ['陈强', '刘洋', '赵敏', '孙雅文'],
    maxMembers: 5,
    tags: ['项目导向', '需要基础', '实践为主'],
    meetingTime: '每周六下午2点',
    createdAt: new Date('2024-03-15T14:00:00'),
    isActive: true
  },
  {
    id: '3',
    courseId: 1,
    title: '早起学习打卡群',
    description: '早上6:30-7:30一起学习，互相监督，养成良好的学习习惯。适合想要规律作息的同学。',
    creator: '李晨',
    members: ['李晨', '王芳', '张伟', '林小雨', '周杰'],
    maxMembers: 8,
    tags: ['早起打卡', '习惯养成', '相互监督'],
    meetingTime: '每天早上6:30-7:30',
    createdAt: new Date('2024-03-10T06:00:00'),
    isActive: true
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'discussion' | 'study-buddy'>('discussion');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(mockStudyGroups);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState<{
    courseId: string;
    title: string;
    content: string;
  }>({ courseId: '', title: '', content: '' });
  const [newGroup, setNewGroup] = useState<{
    courseId: string;
    title: string;
    description: string;
    maxMembers: string;
    tags: string[];
    meetingTime: string;
  }>({ 
    courseId: '', 
    title: '', 
    description: '', 
    maxMembers: '6', 
    tags: [],
    meetingTime: ''
  });

  const handleJoinGroup = (groupId: string) => {
    setStudyGroups(groups => 
      groups.map(group => 
        group.id === groupId && group.members.length < group.maxMembers
          ? { ...group, members: [...group.members, '当前用户'] }
          : group
      )
    );
  };

  const handleTagToggle = (tag: string) => {
    setNewGroup(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const commonTags = ['初学者友好', '作业互助', '项目导向', '线上讨论', '相互监督', '习惯养成', '考试复习', '实践为主'];

  return (
    <DashboardSidebar>
      <div className="flex-1 bg-gray-50 min-h-screen">
        <header className="bg-white border-b" style={{ borderColor: colors.border }}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>学习社区</h1>
              <button
                className="px-6 py-2 rounded-lg text-white font-medium shadow transition-colors"
                style={{background: colors.gradient.primary}}
                onClick={() => activeTab === 'discussion' ? setShowNewDiscussion(true) : setShowNewGroup(true)}
              >
                {activeTab === 'discussion' ? '发起讨论' : '创建小组'}
              </button>
            </div>
            
            {/* Tab 切换 */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === 'discussion'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('discussion')}
              >
                讨论区
              </button>
              <button
                className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === 'study-buddy'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('study-buddy')}
              >
                找学习搭子
              </button>
            </div>
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

        {/* 新建学习小组弹窗 */}
        {showNewGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowNewGroup(false)}></div>
            <div 
              className="bg-white rounded-2xl shadow-2xl p-6 relative flex flex-col gap-4 my-auto overflow-auto"
              style={{ 
                width: '600px',
                minWidth: '600px', 
                maxWidth: '90vw', 
                maxHeight: '90vh',
              }}
            >
              <button
                className="absolute right-3 top-3 text-gray-400 hover:text-white hover:bg-blue-500 transition rounded-full w-8 h-8 flex items-center justify-center text-xl"
                onClick={() => setShowNewGroup(false)}
                title="关闭"
                style={{lineHeight: 1}}
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-2 text-gray-900 text-center">创建学习小组</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">选择课程</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={newGroup.courseId}
                    onChange={e => setNewGroup(v => ({...v, courseId: e.target.value}))}
                  >
                    <option value="">请选择课程</option>
                    <option value={mockCourseData.id.toString()}>{mockCourseData.title}</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">小组名称</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="请输入小组名称"
                    value={newGroup.title}
                    onChange={e => setNewGroup(v => ({...v, title: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">小组描述</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 min-h-[120px] text-sm"
                    placeholder="描述小组的学习目标、活动安排等..."
                    value={newGroup.description}
                    onChange={e => setNewGroup(v => ({...v, description: e.target.value}))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-700 text-sm">最大人数</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={newGroup.maxMembers}
                      onChange={e => setNewGroup(v => ({...v, maxMembers: e.target.value}))}
                    >
                      <option value="4">4人</option>
                      <option value="6">6人</option>
                      <option value="8">8人</option>
                      <option value="10">10人</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-700 text-sm">活动时间</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      placeholder="如：每周三晚8点"
                      value={newGroup.meetingTime}
                      onChange={e => setNewGroup(v => ({...v, meetingTime: e.target.value}))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 text-sm">标签</label>
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                          newGroup.tags.includes(tag)
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between gap-2 mt-6">
                  <button
                    className="px-4 py-1.5 rounded-lg text-gray-600 font-medium border border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
                    onClick={() => setShowNewGroup(false)}
                  >
                    取消
                  </button>
                  <button
                    className="px-5 py-1.5 rounded-lg text-white font-medium shadow text-sm bg-blue-600 hover:bg-blue-700 transition"
                    onClick={() => setShowNewGroup(false)}
                  >
                    创建小组
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
                  {activeTab === 'discussion' 
                    ? `共 ${discussions.length} 个讨论`
                    : `共 ${studyGroups.length} 个学习小组`
                  }
                </div>
              </div>
              {activeTab === 'discussion' && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>排序：</span>
                  <button className="px-3 py-1 rounded-lg hover:bg-gray-100">最新发布</button>
                  <button className="px-3 py-1 rounded-lg hover:bg-gray-100">最多回复</button>
                  <button className="px-3 py-1 rounded-lg hover:bg-gray-100">最多浏览</button>
                </div>
              )}
              {activeTab === 'study-buddy' && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>筛选：</span>
                  <button className="px-3 py-1 rounded-lg hover:bg-gray-100">可加入</button>
                  <button className="px-3 py-1 rounded-lg hover:bg-gray-100">最新创建</button>
                  <button className="px-3 py-1 rounded-lg hover:bg-gray-100">人数最少</button>
                </div>
              )}
            </div>
          </div>

          {/* 讨论列表 */}
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              {discussions
                .filter(d => selectedCourse === 'all' || d.courseId.toString() === selectedCourse)
                .map(discussion => (
                  <div
                    key={discussion.id}
                    className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    style={{borderColor: colors.border}}
                    onClick={() => router.push(`/learning_community/discussion/${discussion.id}`)}
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
          )}

          {/* 学习小组列表 */}
          {activeTab === 'study-buddy' && (
            <div className="space-y-4">
              {studyGroups
                .filter(g => selectedCourse === 'all' || g.courseId.toString() === selectedCourse)
                .map(group => (
                  <div
                    key={group.id}
                    className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition-shadow"
                    style={{borderColor: colors.border}}
                  >
                    <div className="flex items-start gap-6">
                      {/* 左侧人数信息 */}
                      <div className="flex flex-col items-center space-y-1 min-w-[80px]">
                        <div className="text-lg font-bold text-gray-900">
                          {group.members.length}/{group.maxMembers}
                        </div>
                        <div className="text-sm text-gray-500">成员</div>
                      </div>
                      
                      {/* 右侧内容 */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {group.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {group.members.length < group.maxMembers ? (
                              <button
                                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => handleJoinGroup(group.id)}
                              >
                                加入小组
                              </button>
                            ) : (
                              <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-sm rounded-lg">
                                已满员
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-gray-600 mb-3">
                          {group.description}
                        </div>
                        
                        {/* 标签 */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {group.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-500">创建者：{group.creator}</span>
                            <span className="text-gray-500">活动时间：{group.meetingTime}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-500">创建于：{group.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* 空状态 */}
          {activeTab === 'discussion' && discussions.filter(d => selectedCourse === 'all' || d.courseId.toString() === selectedCourse).length === 0 && (
            <div className="bg-white rounded-2xl shadow-md border p-12 text-center" style={{borderColor: colors.border}}>
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无讨论</h3>
              <p className="text-gray-500 mb-4">成为第一个发起讨论的人吧！</p>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowNewDiscussion(true)}
              >
                发起讨论
              </button>
            </div>
          )}

          {activeTab === 'study-buddy' && studyGroups.filter(g => selectedCourse === 'all' || g.courseId.toString() === selectedCourse).length === 0 && (
            <div className="bg-white rounded-2xl shadow-md border p-12 text-center" style={{borderColor: colors.border}}>
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无学习小组</h3>
              <p className="text-gray-500 mb-4">创建一个学习小组，找到志同道合的学习伙伴！</p>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowNewGroup(true)}
              >
                创建小组
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardSidebar>
  );
}
