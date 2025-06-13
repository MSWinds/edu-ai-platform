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
  type: 'question' | 'share'; // 添加帖子类型
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
    content: '在学习监督学习和无监督学习时遇到了一些困惑，想请教大家。我已经看了课程的前几章，但是对于监督学习和无监督学习的本质区别还是不太理解。\n\n具体来说：\n1. 监督学习一定需要标注数据吗？\n2. 无监督学习是不是就是没有目标的学习？\n3. 半监督学习又是什么概念？\n\n希望有经验的同学能够详细解答一下，最好能举一些具体的例子。谢谢大家！',
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
    content: '关于第三章的练习题，大家有什么想法？特别是第三题，我感觉有点复杂。\n\n题目是要求我们实现一个简单的线性回归算法，但是我在处理数据预处理部分遇到了困难。有没有同学已经做完了，可以分享一下思路吗？\n\n我现在卡在特征标准化这一步，不太确定应该用哪种方法。',
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
    content: '最近发现了一个特别棒的AI画图工具，想和大家分享一下！\n\n**工具名称：** Midjourney\n\n**为什么推荐：**\n1. 操作超级简单，只需要输入文字描述就能生成图片\n2. 画质非常高，生成的图片很有艺术感\n3. 可以用来做课程作业的配图，或者制作PPT\n\n**怎么使用：**\n- 在Discord上添加Midjourney机器人\n- 输入 /imagine + 你想要的图片描述\n- 等几分钟就能看到4张不同的图片\n- 可以选择喜欢的进行放大或者重新生成\n\n**实用场景：**\n- 做课程报告需要配图\n- 制作学习笔记的封面\n- 画一些概念图帮助理解\n- 纯粹觉得好玩想试试\n\n**小贴士：**\n描述越详细，生成的图片越符合你的想法。比如可以加上风格、颜色、构图等关键词。\n\n有同学用过其他AI画图工具吗？欢迎分享经验！',
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
    content: '写英文论文总是头疼语法和表达？给大家推荐一个超实用的AI工具！\n\n**工具名称：** Grammarly + ChatGPT组合\n\n**为什么好用：**\n1. Grammarly负责基础语法检查，ChatGPT负责润色表达\n2. 可以让你的英文论文更地道、更学术\n3. 操作简单，复制粘贴就能用\n\n**具体使用方法：**\n\n**第一步：Grammarly检查**\n- 把论文段落复制到Grammarly\n- 修复所有语法错误和拼写问题\n- 采纳合理的词汇建议\n\n**第二步：ChatGPT润色**\n- 告诉ChatGPT："请帮我润色这段学术英文，让表达更准确和正式"\n- 把修改后的文本粘贴进去\n- 对比原文和润色后的版本，学习改进点\n\n**实用提示词：**\n- "请润色这段英文，保持学术风格"\n- "这段话有没有更地道的表达方式？"\n- "请检查这段话的逻辑和连贯性"\n\n**注意事项：**\n- 不要完全依赖AI，要理解修改的原因\n- 保持自己的写作风格和观点\n- 最好还是找英语好的同学帮忙检查一遍\n\n有同学用过其他英文写作工具吗？一起交流经验！',
    author: '论文小助手',
    timestamp: new Date('2025-03-18T16:30:00'),
    replies: 6,
    lastReply: new Date('2025-03-20T17:30:00'),
    views: 234,
    likes: 31,
    type: 'share'
  }
];

// Mock replies data
const mockReplies: Record<string, Reply[]> = {
  '1': [
    {
      id: 'r1',
      author: '王老师',
      content: '监督学习需要标记数据，而无监督学习则从未标记的数据中发现模式。举个例子，图像分类是监督学习，而聚类分析是无监督学习。\n\n更详细的解释：\n1. 监督学习：需要输入和期望输出的样本对，算法学习输入到输出的映射关系\n2. 无监督学习：只有输入数据，没有期望输出，算法寻找数据中的隐藏模式\n3. 半监督学习：结合少量标注数据和大量未标注数据进行学习',
      timestamp: new Date('2025-03-20T10:30:00')
    },
    {
      id: 'r2',
      author: '李明',
      content: '我补充一下，监督学习就像有老师指导，而无监督学习则是自己探索。\n\n具体例子：\n- 监督学习：垃圾邮件分类（有标注的邮件样本）\n- 无监督学习：客户分群（根据购买行为自动分组）',
      timestamp: new Date('2025-03-20T11:15:00')
    }
  ],
  '2': [
    {
      id: 'r3',
      author: '赵四',
      content: '我觉得第三题比较难，需要用到贝叶斯定理。特征标准化的话，我用的是StandardScaler，也就是Z-score标准化：(x - mean) / std。\n\n这样处理后，所有特征的均值为0，标准差为1，比较适合线性回归。',
      timestamp: new Date('2025-03-19T15:00:00')
    }
  ],
  '3': [
    {
      id: 'r4',
      author: '艺术系小美',
      content: '哇！这个工具我也在用！真的超级好用，我用它给我的课程作业做了好多插图，老师都夸我有创意！\n\n分享一个小技巧：可以在描述后面加上 "--ar 16:9" 来生成宽屏比例的图片，很适合做PPT背景。',
      timestamp: new Date('2025-03-20T09:15:00')
    },
    {
      id: 'r5',
      author: '好奇宝宝',
      content: '请问这个工具收费吗？我是学生，预算有限，有没有免费的替代品？\n\n另外想问一下，生成的图片可以商用吗？',
      timestamp: new Date('2025-03-20T10:45:00')
    },
    {
      id: 'r6',
      author: '设计小白',
      content: '@好奇宝宝 Midjourney有免费试用，但次数有限。推荐你试试Stable Diffusion，完全免费！虽然操作稍微复杂一点，但效果也很不错。\n\n关于商用，建议看一下各个平台的使用条款，不同工具规定不一样。',
      timestamp: new Date('2025-03-20T12:20:00')
    },
    {
      id: 'r7',
      author: '技术达人',
      content: '补充几个其他好用的AI画图工具：\n1. DALL-E 2 - OpenAI出品，质量很高\n2. Stable Diffusion - 开源免费\n3. 文心一格 - 百度的，中文支持更好\n\n每个都有自己的特色，可以都试试看！',
      timestamp: new Date('2025-03-20T14:30:00')
    },
    {
      id: 'r8',
      author: '学霸小王',
      content: '我用AI画图做了整个学期的课程笔记封面，每个科目都有不同的风格，复习的时候看着心情都好了！\n\n推荐大家试试用AI画一些抽象的概念图，比如"数据结构"、"算法思维"这种，很有意思！',
      timestamp: new Date('2025-03-20T15:45:00')
    },
    {
      id: 'r9',
      author: '创意无限',
      content: '哈哈，我用Midjourney画了一个"机器学习"的拟人化形象，结果画出来是个戴眼镜的机器人在看书，太可爱了！\n\n分享一个描述技巧：加上情绪词汇会让图片更生动，比如"happy"、"mysterious"、"energetic"。',
      timestamp: new Date('2025-03-20T16:20:00')
    },
    {
      id: 'r10',
      author: '实用主义者',
      content: '我主要用来做课程报告的配图，效果真的比网上找的素材图好太多了！而且不用担心版权问题。\n\n建议大家保存好自己觉得不错的提示词，下次可以直接复用或者稍微修改一下。',
      timestamp: new Date('2025-03-20T17:10:00')
    },
    {
      id: 'r11',
      author: '省钱小能手',
      content: '@好奇宝宝 我找到了几个免费的替代方案：\n1. Bing Image Creator - 微软出品，免费\n2. Leonardo AI - 每天有免费额度\n3. Playground AI - 也有免费版本\n\n虽然效果可能没有Midjourney那么惊艳，但对学生来说够用了！',
      timestamp: new Date('2025-03-20T18:00:00')
    }
  ],
  '4': [
    {
      id: 'r12',
      author: '英语苦手',
      content: '天哪，这个组合我也在用！特别是ChatGPT，真的能把我的中式英语改得很地道。\n\n我一般会问它："这句话听起来自然吗？"然后它会给出更好的表达方式。',
      timestamp: new Date('2025-03-20T13:15:00')
    },
    {
      id: 'r13',
      author: '研究生小张',
      content: 'Grammarly确实很好用！我用的是免费版本，基本的语法检查就够了。付费版本有更多高级功能，但对学生来说免费版就足够了。\n\n另外推荐一个：DeepL翻译，比Google翻译更准确，特别是学术文本。',
      timestamp: new Date('2025-03-20T14:20:00')
    },
    {
      id: 'r14',
      author: '论文达人',
      content: '我还会用ChatGPT来检查论文的逻辑结构，问它："这段论证有什么问题吗？"或者"这个过渡是否自然？"\n\n不过要注意，AI的建议不一定都对，还是要自己判断。',
      timestamp: new Date('2025-03-20T16:00:00')
    },
    {
      id: 'r15',
      author: '留学生小李',
      content: '作为英语非母语的学生，这些工具真的是救命稻草！我还会用ChatGPT来解释一些学术词汇的细微差别。\n\n比如问它："effect和impact在学术写作中有什么区别？"',
      timestamp: new Date('2025-03-20T17:30:00')
    },
    {
      id: 'r16',
      author: '省钱达人',
      content: '分享几个免费的替代工具：\n1. LanguageTool - 开源的语法检查器\n2. Hemingway Editor - 检查句子复杂度\n3. Quillbot - 改写和润色工具\n\n虽然没有付费工具那么强大，但基本够用了！',
      timestamp: new Date('2025-03-20T18:15:00')
    },
    {
      id: 'r17',
      author: '学术新手',
      content: '请问大家有没有专门针对学术写作的提示词模板？我总是不知道怎么跟ChatGPT说才能得到最好的润色效果。\n\n另外，用AI润色会不会被认为是学术不端？',
      timestamp: new Date('2025-03-20T19:00:00')
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
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex-1">{discussion.title}</h2>
              <div className="flex items-center gap-2 ml-4">
                {/* 热门标签 */}
                {(() => {
                  const hotness = discussion.replies * 5 + discussion.likes * 2 + discussion.views * 0.1;
                  const daysSincePost = (new Date().getTime() - discussion.timestamp.getTime()) / (1000 * 60 * 60 * 24);
                  const finalHotness = hotness - daysSincePost * 0.1;
                  return finalHotness > 10;
                })() && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-400 to-red-500 text-white border border-white shadow-sm flex items-center gap-1">
                    🔥 热门
                  </span>
                )}
                {/* 类型标签 */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  discussion.type === 'question' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {discussion.type === 'question' ? '提问' : '分享'}
                </span>
              </div>
            </div>
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