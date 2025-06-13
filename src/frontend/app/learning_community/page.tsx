'use client';

import { useState } from 'react';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { colors } from '../theme/colors';
import { mockCourseData } from '../mockdata/courseData';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';
import { 
  majorCategories, 
  majorPreferences, 
  studyLevels, 
  collaborationTypes, 
  getMajorById,
  getRelatedMajors,
  type Major 
} from '../mockdata/majorData';

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
  type: 'question' | 'share'; // 添加帖子类型
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
  meetingTime: string;
  createdAt: Date;
  isActive: boolean;
  // 新增专业相关字段
  targetMajors: string[];
  majorPreference: keyof typeof majorPreferences;
  studyLevel: keyof typeof studyLevels;
  collaborationType: keyof typeof collaborationTypes;
}

// Mock discussions data
const mockDiscussions: Discussion[] = [
  {
    id: '1',
    courseId: 1,
    title: '关于机器学习基础概念的讨论',
    content: '在学习监督学习和无监督学习时遇到了一些困惑，想请教大家...',
    author: '张三',
    timestamp: new Date('2025-03-20T10:00:00'),
    replies: 15,
    lastReply: new Date('2025-03-20T15:30:00'),
    views: 280,
    likes: 35,
    type: 'question'
  },
  {
    id: '2',
    courseId: 1,
    title: '本周作业讨论',
    content: '关于第三章的练习题，大家有什么想法？',
    author: '李四',
    timestamp: new Date('2025-03-19T14:20:00'),
    replies: 3,
    lastReply: new Date('2025-03-20T09:15:00'),
    views: 51,
    likes: 7,
    type: 'question'
  },
  {
    id: '3',
    courseId: 1,
    title: '分享一个超好用的AI画图工具！',
    content: '最近发现了一个特别棒的AI画图工具，想和大家分享一下！工具名称是Midjourney，操作超级简单，只需要输入文字描述就能生成图片，画质非常高，生成的图片很有艺术感。可以用来做课程作业的配图，或者制作PPT。在Discord上添加Midjourney机器人，输入/imagine + 你想要的图片描述，等几分钟就能看到4张不同的图片...',
    author: '设计小白',
    timestamp: new Date('2025-03-20T08:00:00'),
    replies: 8,
    lastReply: new Date('2025-03-20T15:45:00'),
    views: 680,
    likes: 89,
    type: 'share'
  },
  {
    id: '4',
    courseId: 1,
    title: '推荐一个AI润色英文论文的神器！',
    content: '写英文论文总是头疼语法和表达？给大家推荐一个超实用的AI工具！工具名称是Grammarly + ChatGPT组合，Grammarly负责基础语法检查，ChatGPT负责润色表达，可以让你的英文论文更地道、更学术。操作简单，复制粘贴就能用。第一步用Grammarly检查语法，第二步用ChatGPT润色表达...',
    author: '论文小助手',
    timestamp: new Date('2025-03-18T16:30:00'),
    replies: 6,
    lastReply: new Date('2025-03-20T17:30:00'),
    views: 234,
    likes: 31,
    type: 'share'
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
    meetingTime: '每周三晚上8点',
    createdAt: new Date('2025-03-18T10:00:00'),
    isActive: true,
    targetMajors: ['computer_science', 'artificial_intelligence', 'software_engineering'],
    majorPreference: 'related',
    studyLevel: 'beginner',
    collaborationType: 'homework'
  },
  {
    id: '2',
    courseId: 1,
    title: 'AI项目实践组',
    description: '有一定基础的同学一起做项目，目标是完成一个完整的机器学习项目。需要有Python基础。',
    creator: '陈强',
    members: ['陈强', '刘洋', '赵敏', '孙雅文'],
    maxMembers: 5,
    meetingTime: '每周六下午2点',
    createdAt: new Date('2025-03-15T14:00:00'),
    isActive: true,
    targetMajors: ['artificial_intelligence', 'computer_science'],
    majorPreference: 'same',
    studyLevel: 'intermediate',
    collaborationType: 'project'
  },
  {
    id: '3',
    courseId: 1,
    title: '早起学习打卡群',
    description: '早上6:30-7:30一起学习，互相监督，养成良好的学习习惯。适合想要规律作息的同学。',
    creator: '李晨',
    members: ['李晨', '王芳', '张伟', '林小雨', '周杰'],
    maxMembers: 8,
    meetingTime: '每天早上6:30-7:30',
    createdAt: new Date('2025-03-10T06:00:00'),
    isActive: true,
    targetMajors: [],
    majorPreference: 'any',
    studyLevel: 'beginner',
    collaborationType: 'discussion'
  }
];

// Mock replies data
const mockReplies: Record<string, Reply[]> = {
  '1': [
    {
      id: 'r1',
      author: '王老师',
      content: '监督学习需要标记数据，而无监督学习则从未标记的数据中发现模式。举个例子，图像分类是监督学习，而聚类分析是无监督学习。',
      timestamp: new Date('2025-03-20T10:30:00')
    },
    {
      id: 'r2',
      author: '李明',
      content: '我补充一下，监督学习就像有老师指导，而无监督学习则是自己探索。',
      timestamp: new Date('2025-03-20T11:15:00')
    }
  ],
  '2': [
    {
      id: 'r3',
      author: '赵四',
      content: '我觉得第三题比较难，需要用到贝叶斯定理。',
      timestamp: new Date('2025-03-19T15:00:00')
    }
  ],
  '3': [
    {
      id: 'r4',
      author: '刘工程师',
      content: '我在实际项目中两个框架都用过。TensorFlow的生产部署确实更成熟，特别是TensorFlow Serving和TFX工具链。但PyTorch的动态图机制在研究阶段真的很方便调试。',
      timestamp: new Date('2025-03-20T09:15:00')
    },
    {
      id: 'r5',
      author: '小白同学',
      content: '作为初学者，我觉得PyTorch更容易上手，语法更像原生Python。TensorFlow 2.0之后也改善了很多，但还是觉得PyTorch更直观。',
      timestamp: new Date('2025-03-20T10:45:00')
    },
    {
      id: 'r6',
      author: '数据科学家Alex',
      content: '从性能角度讲，TensorFlow在大规模分布式训练上有优势，Google的TPU支持也更好。但如果是学术研究或者快速原型开发，PyTorch确实更灵活。',
      timestamp: new Date('2025-03-20T12:20:00')
    },
    {
      id: 'r7',
      author: '深度学习爱好者',
      content: '补充一点：TensorFlow的可视化工具TensorBoard很强大，而PyTorch现在也可以用TensorBoard了。另外，PyTorch Lightning框架让PyTorch的工程化也变得很简单。',
      timestamp: new Date('2025-03-20T14:30:00')
    },
    {
      id: 'r8',
      author: '产品经理小张',
      content: '从部署角度考虑，TensorFlow Lite在移动端部署确实有优势。但最近PyTorch Mobile也在快速发展，差距在缩小。',
      timestamp: new Date('2025-03-20T15:45:00')
    }
  ],
  '4': [
    {
      id: 'r9',
      author: '机器学习新手',
      content: '太有用了！我正在调参阶段，经常遇到过拟合问题。请问学习率衰减策略您推荐哪种？',
      timestamp: new Date('2025-03-20T13:15:00')
    },
    {
      id: 'r10',
      author: '算法工程师Tom',
      content: '非常实用的分享！我想补充一点：Batch Size的选择也很重要。小batch size有正则化效果但训练不稳定，大batch size训练稳定但可能陷入局部最优。',
      timestamp: new Date('2025-03-20T14:20:00')
    },
    {
      id: 'r11',
      author: '博士生小李',
      content: '关于激活函数的选择，我发现ReLU在深层网络中确实容易出现梯度消失，现在更多使用Leaky ReLU或者Swish。楼主有什么经验分享吗？',
      timestamp: new Date('2025-03-20T16:00:00')
    },
    {
      id: 'r12',
      author: '资深调参师',
      content: '很棒的总结！我再补充几个技巧：1)使用学习率查找器确定初始学习率 2)梯度裁剪防止梯度爆炸 3)权重初始化很重要，Xavier和He初始化在不同情况下效果不同。',
      timestamp: new Date('2025-03-20T17:30:00')
    }
  ]
};

export default function LearningCommunity() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'discussion' | 'study-buddy'>('discussion');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<string>('all');
  const [majorPreferenceFilter, setMajorPreferenceFilter] = useState<string>('all');
  const [studyLevelFilter, setStudyLevelFilter] = useState<string>('all');
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
    meetingTime: string;
    targetMajors: string[];
    majorPreference: keyof typeof majorPreferences;
    studyLevel: keyof typeof studyLevels;
    collaborationType: keyof typeof collaborationTypes;
  }>({ 
    courseId: '', 
    title: '', 
    description: '', 
    maxMembers: '6', 
    meetingTime: '',
    targetMajors: [],
    majorPreference: 'any',
    studyLevel: 'beginner',
    collaborationType: 'discussion'
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

  const handleMajorToggle = (majorId: string) => {
    setNewGroup(prev => ({
      ...prev,
      targetMajors: prev.targetMajors.includes(majorId)
        ? prev.targetMajors.filter(m => m !== majorId)
        : [...prev.targetMajors, majorId]
    }));
  };

  // 筛选学习小组
  const filteredStudyGroups = studyGroups.filter(group => {
    // 课程筛选
    if (selectedCourse !== 'all' && group.courseId.toString() !== selectedCourse) {
      return false;
    }
    
    // 专业筛选
    if (selectedMajorFilter !== 'all') {
      if (!group.targetMajors.includes(selectedMajorFilter) && group.targetMajors.length > 0) {
        return false;
      }
    }
    
    // 专业偏好筛选
    if (majorPreferenceFilter !== 'all' && group.majorPreference !== majorPreferenceFilter) {
      return false;
    }
    
    // 学习水平筛选
    if (studyLevelFilter !== 'all' && group.studyLevel !== studyLevelFilter) {
      return false;
    }
    
    return true;
  });

  // 计算帖子热度
  const calculateHotness = (discussion: Discussion) => {
    const now = new Date();
    const hoursAgo = (now.getTime() - discussion.timestamp.getTime()) / (1000 * 60 * 60);
    // 热度计算：回复数 + 点赞数 + 浏览数/10 - 时间衰减
    const hotness = discussion.replies * 5 + discussion.likes * 2 + discussion.views * 0.1 - hoursAgo * 0.1;
    return Math.max(0, hotness);
  };

  // 判断是否为热门帖子
  const isHotPost = (discussion: Discussion) => {
    const hotness = calculateHotness(discussion);
    return hotness > 50; // 热度阈值
  };

  // 筛选讨论 - 简化版，只按课程筛选
  const filteredDiscussions = discussions
    .filter(discussion => {
      return selectedCourse === 'all' || discussion.courseId.toString() === selectedCourse;
    })
    .sort((a, b) => {
      // 默认按热度排序，热门帖子在前面
      return calculateHotness(b) - calculateHotness(a);
    });

  return (
    <DashboardSidebar>
      <div className="flex-1 bg-gray-50 min-h-screen">
        <div className="bg-white border-b" style={{ borderColor: colors.border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <PageHeader
              title="学习社区"
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              actions={
                <button
                  className="px-6 py-2 rounded-lg text-white font-medium shadow transition-colors"
                  style={{background: colors.gradient.primary}}
                  onClick={() => activeTab === 'discussion' ? setShowNewDiscussion(true) : setShowNewGroup(true)}
                >
                  {activeTab === 'discussion' ? '发起讨论' : '创建小组'}
                </button>
              }
                         />
            
            {/* Tab 切换 */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit mt-4">
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
        </div>

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
                  <label className="block mb-1 text-gray-700 text-sm">讨论类型</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    style={{borderColor: colors.border}}
                    defaultValue="discussion"
                  >
                    <option value="question">提问求助</option>
                    <option value="discussion">学习讨论</option>
                    <option value="share">知识分享</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">内容</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 min-h-[200px] text-sm"
                    style={{borderColor: colors.border}}
                    placeholder="请详细描述您的问题或想要讨论的内容..."
                    value={newDiscussion.content}
                    onChange={e => setNewDiscussion(v => ({...v, content: e.target.value}))}
                  />
                </div>
                <div className="flex justify-between gap-2 mt-6">
                  <button
                    className="px-4 py-1.5 rounded-lg text-gray-600 font-medium border hover:bg-gray-100 transition"
                    style={{borderColor: colors.border}}
                    onClick={() => setShowNewDiscussion(false)}
                  >
                    取消
                  </button>
                  <button
                    className="px-5 py-1.5 rounded-lg text-white font-medium shadow text-sm transition"
                    style={{background: colors.gradient.primary}}
                    onClick={() => {
                      // 这里可以添加发布讨论的逻辑
                      console.log('发布讨论:', newDiscussion);
                      setShowNewDiscussion(false);
                    }}
                  >
                    发布讨论
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
                width: '700px',
                minWidth: '700px', 
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
              <div className="space-y-6">
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">选择课程</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    style={{borderColor: colors.border}}
                    value={newGroup.courseId}
                    onChange={e => setNewGroup(v => ({...v, courseId: e.target.value}))}
                  >
                    <option value="">请选择课程</option>
                    <option value={mockCourseData.id.toString()}>{mockCourseData.title}</option>
                  </select>
                </div>

                {/* 专业选择区域 */}
                <div>
                  <label className="block mb-2 text-gray-700 text-sm font-medium">
                    目标专业 <span className="text-gray-500">(选择希望加入的专业背景)</span>
                  </label>
                  
                  <div className="space-y-4">
                    {/* 专业类别快速选择 */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(majorCategories).map(([categoryKey, category]) => (
                        <button
                          key={categoryKey}
                          type="button"
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm transition-colors hover:bg-gray-50"
                          style={{borderColor: colors.border}}
                          onClick={() => {
                            const categoryMajorIds = category.majors.map(m => m.id);
                            const hasAllSelected = categoryMajorIds.every(id => newGroup.targetMajors.includes(id));
                            
                            if (hasAllSelected) {
                              // 取消选择该类别的所有专业
                              setNewGroup(prev => ({
                                ...prev,
                                targetMajors: prev.targetMajors.filter(id => !categoryMajorIds.includes(id))
                              }));
                            } else {
                              // 选择该类别的所有专业
                              setNewGroup(prev => ({
                                ...prev,
                                targetMajors: Array.from(new Set([...prev.targetMajors, ...categoryMajorIds]))
                              }));
                            }
                          }}
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* 专业详细选择 */}
                    <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-2 border rounded-lg bg-gray-50" style={{borderColor: colors.border}}>
                      {Object.entries(majorCategories).map(([categoryKey, category]) => 
                        category.majors.map(major => (
                          <label
                            key={major.id}
                            className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                              newGroup.targetMajors.includes(major.id)
                                ? 'bg-white border-blue-300 shadow-sm'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={newGroup.targetMajors.includes(major.id)}
                              onChange={() => handleMajorToggle(major.id)}
                              className="mt-1 text-blue-600"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: category.color }}
                                />
                                <span className="text-sm font-medium text-gray-900 truncate">{major.name}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{major.description}</p>
                              <div className="text-xs text-gray-400 mt-1">{category.name}</div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">小组名称</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    style={{borderColor: colors.border}}
                    placeholder="请输入小组名称"
                    value={newGroup.title}
                    onChange={e => setNewGroup(v => ({...v, title: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">小组描述</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 min-h-[120px] text-sm"
                    style={{borderColor: colors.border}}
                    placeholder="描述小组的学习目标、活动安排等..."
                    value={newGroup.description}
                    onChange={e => setNewGroup(v => ({...v, description: e.target.value}))}
                  />
                </div>
                {/* 专业偏好、学习水平、协作类型 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-700 text-sm font-medium">专业偏好</label>
                    <div className="space-y-2">
                      {Object.entries(majorPreferences).map(([key, pref]) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="majorPreference"
                            value={key}
                            checked={newGroup.majorPreference === key}
                            onChange={e => setNewGroup(v => ({...v, majorPreference: e.target.value as keyof typeof majorPreferences}))}
                            className="text-blue-600"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{pref.label}</div>
                            <div className="text-xs text-gray-500">{pref.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700 text-sm font-medium">学习水平</label>
                    <div className="space-y-2">
                      {Object.entries(studyLevels).map(([key, level]) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="studyLevel"
                            value={key}
                            checked={newGroup.studyLevel === key}
                            onChange={e => setNewGroup(v => ({...v, studyLevel: e.target.value as keyof typeof studyLevels}))}
                            className="text-blue-600"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700 text-sm font-medium">协作类型</label>
                    <div className="space-y-2">
                      {Object.entries(collaborationTypes).map(([key, type]) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="collaborationType"
                            value={key}
                            checked={newGroup.collaborationType === key}
                            onChange={e => setNewGroup(v => ({...v, collaborationType: e.target.value as keyof typeof collaborationTypes}))}
                            className="text-blue-600"
                          />
                          <div className="flex items-center space-x-2">
                            <span>{type.icon}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-700 text-sm">最大人数</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      style={{borderColor: colors.border}}
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
                      style={{borderColor: colors.border}}
                      placeholder="如：每周三晚8点"
                      value={newGroup.meetingTime}
                      onChange={e => setNewGroup(v => ({...v, meetingTime: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-2 mt-6">
                  <button
                    className="px-4 py-1.5 rounded-lg text-gray-600 font-medium border hover:bg-gray-100 transition"
                    style={{borderColor: colors.border}}
                    onClick={() => setShowNewGroup(false)}
                  >
                    取消
                  </button>
                  <button
                    className="px-5 py-1.5 rounded-lg text-white font-medium shadow text-sm transition"
                    style={{background: colors.gradient.primary}}
                    onClick={() => {
                      // 这里可以添加创建小组的逻辑
                      console.log('创建小组:', newGroup);
                      setShowNewGroup(false);
                    }}
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
            <div className="space-y-5">
              {/* 第一行：基础信息 */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <select
                    className="rounded-lg border px-3 py-2 text-sm bg-white min-w-[140px]"
                    style={{borderColor: colors.border, color: colors.text.primary}}
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                  >
                    <option value="all">所有课程</option>
                    <option value={mockCourseData.id.toString()}>{mockCourseData.title}</option>
                  </select>
                  <div className="text-sm text-gray-600 whitespace-nowrap">
                    {activeTab === 'discussion' 
                      ? `共 ${discussions.length} 个讨论`
                      : `共 ${filteredStudyGroups.length} 个学习小组`
                    }
                  </div>
                </div>
                
                {/* 讨论区的筛选选项 */}
                {activeTab === 'discussion' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="whitespace-nowrap">排序：</span>
                      <div className="flex space-x-1">
                        <button className="px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">最新发布</button>
                        <button className="px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">最多回复</button>
                        <button className="px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">最多浏览</button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="whitespace-nowrap">类型：</span>
                      <div className="flex space-x-1">
                        <button className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 whitespace-nowrap">全部</button>
                        <button className="px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">提问</button>
                        <button className="px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">分享</button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 找学习搭子的筛选选项 */}
                {activeTab === 'study-buddy' && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="whitespace-nowrap">筛选：</span>
                    <div className="flex space-x-1">
                      <button className="px-3 py-1 rounded-lg hover:bg-gray-100 whitespace-nowrap">可加入</button>
                      <button className="px-3 py-1 rounded-lg hover:bg-gray-100 whitespace-nowrap">最新创建</button>
                      <button className="px-3 py-1 rounded-lg hover:bg-gray-100 whitespace-nowrap">人数最少</button>
                    </div>
                  </div>
                )}
              </div>

              {/* 学习小组专业筛选 */}
              {activeTab === 'study-buddy' && (
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  {/* 下拉筛选 */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col sm:flex-row gap-2 flex-1">
                      <select
                        className="rounded-lg border px-3 py-2 text-sm bg-white min-w-[140px]"
                        style={{borderColor: colors.border}}
                        value={selectedMajorFilter}
                        onChange={e => setSelectedMajorFilter(e.target.value)}
                      >
                        <option value="all">所有专业</option>
                        {Object.entries(majorCategories).map(([categoryKey, category]) => (
                          <optgroup key={categoryKey} label={category.name}>
                            {category.majors.map(major => (
                              <option key={major.id} value={major.id}>{major.name}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>

                      <select
                        className="rounded-lg border px-3 py-2 text-sm bg-white min-w-[120px]"
                        style={{borderColor: colors.border}}
                        value={majorPreferenceFilter}
                        onChange={e => setMajorPreferenceFilter(e.target.value)}
                      >
                        <option value="all">所有偏好</option>
                        {Object.entries(majorPreferences).map(([key, pref]) => (
                          <option key={key} value={key}>{pref.label}</option>
                        ))}
                      </select>

                      <select
                        className="rounded-lg border px-3 py-2 text-sm bg-white min-w-[120px]"
                        style={{borderColor: colors.border}}
                        value={studyLevelFilter}
                        onChange={e => setStudyLevelFilter(e.target.value)}
                      >
                        <option value="all">所有水平</option>
                        {Object.entries(studyLevels).map(([key, level]) => (
                          <option key={key} value={key}>{level.label}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline whitespace-nowrap"
                      onClick={() => {
                        setSelectedMajorFilter('all');
                        setMajorPreferenceFilter('all');
                        setStudyLevelFilter('all');
                      }}
                    >
                      清除筛选
                    </button>
                  </div>

                  {/* 专业类别快速筛选 */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">快速筛选专业类别：</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(majorCategories).map(([categoryKey, category]) => (
                        <button
                          key={categoryKey}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                            selectedMajorFilter !== 'all' && category.majors.some(m => m.id === selectedMajorFilter)
                              ? 'text-white border-transparent'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                          style={{
                            backgroundColor: selectedMajorFilter !== 'all' && category.majors.some(m => m.id === selectedMajorFilter) 
                              ? category.color 
                              : undefined
                          }}
                          onClick={() => {
                            if (selectedMajorFilter !== 'all' && category.majors.some(m => m.id === selectedMajorFilter)) {
                              setSelectedMajorFilter('all');
                            } else {
                              // 选择该类别的第一个专业作为示例
                              setSelectedMajorFilter(category.majors[0].id);
                            }
                          }}
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

                    {/* 讨论列表 */}
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              {filteredDiscussions.map(discussion => (
                  <div
                    key={discussion.id}
                    className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
                    style={{borderColor: colors.border}}
                    onClick={() => router.push(`/learning_community/discussion/${discussion.id}`)}
                  >
                    {/* 热门标签 */}
                    {isHotPost(discussion) && (
                      <div className="absolute -top-3 -left-3 z-20">
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-xl flex items-center space-x-1 border-2 border-white">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                          </svg>
                          <span>热门</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col">
                      {/* 标题和操作区域 */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors flex-1 pr-4">
                          {discussion.title}
                        </h3>
                        <button
                          className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/learning_community/discussion/${discussion.id}`);
                          }}
                        >
                          查看详情
                        </button>
                      </div>
                      
                      {/* 内容预览 */}
                      <div className="text-gray-600 mb-4 line-clamp-2">
                        {discussion.content}
                      </div>
                      
                      {/* 标签区域 */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {mockCourseData.title}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          discussion.type === 'question' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {discussion.type === 'question' ? '提问' : '分享'}
                        </span>
                      </div>
                      
                      {/* 底部信息区域 */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500">
                          <span>作者：{discussion.author}</span>
                          <span className="hidden sm:inline">发布于：{discussion.timestamp.toLocaleDateString()}</span>
                          <span>最近回复：{discussion.lastReply.toLocaleDateString()}</span>
                        </div>
                        
                        {/* 右下角统计信息 */}
                        <div className="flex items-center space-x-4 text-gray-500 ml-auto">
                          <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors cursor-pointer" title="回复数">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="font-medium">{discussion.replies}</span>
                          </div>
                          <div className="flex items-center space-x-1 hover:text-purple-600 transition-colors cursor-pointer" title="浏览数">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="font-medium">{discussion.views}</span>
                          </div>
                          <div className="flex items-center space-x-1 hover:text-red-500 transition-colors cursor-pointer" title="点赞数">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-medium">{discussion.likes}</span>
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
              {filteredStudyGroups.map(group => (
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
                        
                        {/* 专业和类型标签 */}
                        <div className="space-y-2 mb-3">
                          {/* 专业标签 */}
                          {group.targetMajors.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {group.targetMajors.slice(0, 3).map(majorId => {
                                const majorInfo = getMajorById(majorId);
                                return majorInfo ? (
                                  <span
                                    key={majorId}
                                    className="px-2 py-1 text-xs rounded-full text-white font-medium"
                                    style={{ backgroundColor: majorInfo.categoryColor }}
                                  >
                                    {majorInfo.name}
                                  </span>
                                ) : null;
                              })}
                              {group.targetMajors.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{group.targetMajors.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* 其他标签 */}
                          <div className="flex flex-wrap gap-1">
                            <span
                              className="px-2 py-1 text-xs rounded-full font-medium"
                              style={{ 
                                backgroundColor: majorPreferences[group.majorPreference].color + '20',
                                color: majorPreferences[group.majorPreference].color
                              }}
                            >
                              {majorPreferences[group.majorPreference].label}
                            </span>
                            <span
                              className="px-2 py-1 text-xs rounded-full font-medium"
                              style={{ 
                                backgroundColor: studyLevels[group.studyLevel].color + '20',
                                color: studyLevels[group.studyLevel].color
                              }}
                            >
                              {studyLevels[group.studyLevel].label}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium flex items-center space-x-1">
                              <span>{collaborationTypes[group.collaborationType].icon}</span>
                              <span>{collaborationTypes[group.collaborationType].label}</span>
                            </span>
                          </div>
                          

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
          {activeTab === 'discussion' && filteredDiscussions.length === 0 && (
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

          {activeTab === 'study-buddy' && filteredStudyGroups.length === 0 && (
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
