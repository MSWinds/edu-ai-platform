'use client';

import { useState } from 'react';
import { colors } from '../theme/colors';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import PageHeader from '../components/PageHeader';

interface Message {
  id: number;
  course: string;
  box: string;
  date: string;
  sender: string;
  subject: string;
  snippet: string;
  content: string;
  unread: boolean;
}

const courses = [
  { id: 'all', name: '所有课程' },
  { id: 'ai-intro', name: '人工智能基础导论' },
  { id: 'ml-basics', name: '机器学习基础' },
];

const fakeGroups = [
  { group: '老师', members: ['王老师', '李老师'] },
  { group: '同学', members: ['张三', '李明', '赵四', '王五'] },
  { group: '小组1', members: ['张三', '李明'] },
  { group: '小组2', members: ['赵四', '王五'] },
];

const fakeMessages: Message[] = [
  {
    id: 1,
    course: 'ai-intro',
    box: 'inbox',
    date: '2025-03-24',
    sender: '王老师, 李明',
    subject: '关于第二次论文的讨论',
    snippet: '我们能否延长24小时提交时间？',
    content: '老师，我们能否延长24小时提交时间？因为最近有其他课程的冲突...\n谢谢老师！',
    unread: true,
  },
  {
    id: 2,
    course: 'ai-intro',
    box: 'inbox',
    date: '2025-03-21',
    sender: '王老师',
    subject: '第二次论文评阅与下次课安排',
    snippet: '请查收你们的论文反馈，下次课我们将讨论...',
    content: '请查收你们的论文反馈，下次课我们将讨论相关问题。',
    unread: false,
  },
  {
    id: 3,
    course: 'ml-basics',
    box: 'inbox',
    date: '2025-03-21',
    sender: '张三',
    subject: '文献综述选题',
    snippet: '收到，谢谢老师。',
    content: '收到，谢谢老师。',
    unread: false,
  },
  {
    id: 4,
    course: 'ml-basics',
    box: 'sent',
    date: '2025-03-20',
    sender: '我',
    subject: '展示成绩已发布',
    snippet: '请查收你们的展示成绩和反馈。',
    content: '请查收你们的展示成绩和反馈。',
    unread: false,
  },
  {
    id: 5,
    course: 'ai-intro',
    box: 'inbox',
    date: '2025-03-19',
    sender: '李明, 王老师',
    subject: '第二次论文提交提醒',
    snippet: '请在今晚12点前提交论文。',
    content: '同学们，请在今晚12点前提交第二次论文，逾期将无法评分。',
    unread: true,
  },
  {
    id: 6,
    course: 'ml-basics',
    box: 'inbox',
    date: '2025-03-18',
    sender: '赵四',
    subject: '小组讨论安排',
    snippet: '本周五下午进行小组讨论。',
    content: '本周五下午2点在教室A进行小组讨论，请各组提前准备。',
    unread: false,
  },
  {
    id: 7,
    course: 'ai-intro',
    box: 'inbox',
    date: '2025-03-17',
    sender: '王五',
    subject: '课程资料分享',
    snippet: '已上传本周课程资料。',
    content: '大家好，已上传本周课程资料到学习平台，请及时下载。',
    unread: false,
  },
  {
    id: 8,
    course: 'ai-intro',
    box: 'inbox',
    date: '2025-03-16',
    sender: '王老师',
    subject: '下次课时间调整',
    snippet: '下次课时间改为周三上午。',
    content: '因教室调整，下次课时间改为周三上午9点，请大家注意。',
    unread: true,
  },
  {
    id: 9,
    course: 'ml-basics',
    box: 'inbox',
    date: '2025-03-15',
    sender: '李老师',
    subject: '作业批改完成',
    snippet: '本周作业已批改，请查收。',
    content: '本周作业已批改，请在平台查收成绩和反馈。',
    unread: false,
  },
  {
    id: 10,
    course: 'ai-intro',
    box: 'sent',
    date: '2025-03-14',
    sender: '我',
    subject: '请假申请',
    snippet: '因病请假，望批准。',
    content: '老师您好，因病请假一周，望批准。',
    unread: false,
  },
];

export default function MessagesPage() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedBox, setSelectedBox] = useState<'inbox'|'sent'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [newMsg, setNewMsg] = useState<{
    course: string;
    receivers: string[];
    subject: string;
    content: string;
    receiverType?: 'teachers' | 'students' | 'groups';
    selectedGroups?: string[];
  }>({ course: '', receivers: [], subject: '', content: '', selectedGroups: [] });

  // 过滤消息
  const filteredMessages = fakeMessages.filter(msg =>
    (selectedCourse === 'all' || msg.course === selectedCourse) &&
    msg.box === selectedBox
  );

  return (
    <DashboardSidebar>
      <div className="flex-1 bg-gray-50 h-screen flex flex-col">
        {/* 顶部栏 */}
        <div className="bg-white border-b flex-shrink-0" style={{ borderColor: colors.border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <PageHeader
              title="消息"
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 11h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              actions={
                <button
                  className="px-6 py-2 rounded-lg text-white font-medium shadow transition-colors"
                  style={{background: colors.gradient.primary}}
                  onClick={() => setShowNewMsg(true)}
                >
                  新建消息
                </button>
              }
            />
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-[1200px] mx-auto px-4 py-8 flex gap-8">
            {/* 左侧栏 */}
            <div className="w-[340px] bg-white rounded-2xl shadow-md border flex flex-col" style={{borderColor: colors.border}}>
              <div className="p-6 border-b" style={{borderColor: colors.border}}>
                <div className="flex gap-2 items-center">
                  <select
                    className="rounded-lg border px-3 py-2 text-sm bg-white"
                    style={{borderColor: colors.border, color: colors.text.primary}}
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-1 ml-2">
                    <button
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${selectedBox==='inbox' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                      onClick={()=>setSelectedBox('inbox')}
                    >收件箱</button>
                    <button
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${selectedBox==='sent' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                      onClick={()=>setSelectedBox('sent')}
                    >已发送</button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {filteredMessages.length === 0 && (
                  <div className="text-center text-gray-400 py-12">暂无消息</div>
                )}
                {filteredMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`relative group p-4 rounded-xl cursor-pointer transition border flex flex-col shadow-sm ${selectedMessage?.id===msg.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => setSelectedMessage(msg)}
                    style={{ minHeight: '72px' }}
                  >
                    {/* 未读蓝点 */}
                    {msg.unread && selectedBox==='inbox' && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 font-medium">{msg.date}</span>
                    </div>
                    <div className="font-semibold text-sm text-gray-900 truncate mb-0.5">{msg.sender}</div>
                    <div className="font-bold text-base text-gray-900 truncate mb-0.5">{msg.subject}</div>
                    <div className="text-xs text-gray-400 truncate">{msg.snippet}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧详情 */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-md border" style={{borderColor: colors.border}}>
              {!selectedMessage ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <svg className="h-20 w-20 text-gray-200 mb-4" fill="none" viewBox="0 0 64 64" stroke="currentColor">
                    <rect x="8" y="16" width="48" height="32" rx="8" strokeWidth="3" />
                    <polyline points="8,16 32,36 56,16" strokeWidth="3" />
                  </svg>
                  <div className="text-base text-gray-400 font-semibold">未选择消息</div>
                  <div className="text-sm text-gray-300 mt-1">请在左侧选择一条消息进行查看</div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b" style={{borderColor: colors.border}}>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-lg font-bold text-gray-900 mb-0.5 truncate">{selectedMessage.subject}</div>
                        <div className="text-sm text-gray-600 truncate">{selectedMessage.sender}</div>
                      </div>
                      <div className="text-xs text-gray-400 font-medium whitespace-nowrap">{selectedMessage.date}</div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="text-gray-800 whitespace-pre-line text-base leading-7">
                      {selectedMessage.content}
                    </div>
                  </div>
                  {selectedBox === 'inbox' && (
                    <div className="p-6 border-t" style={{borderColor: colors.border}}>
                      {!showReply ? (
                        <button
                          className="px-4 py-2 rounded-lg text-white font-medium shadow transition-colors"
                          style={{background: colors.gradient.primary}}
                          onClick={() => setShowReply(true)}
                        >
                          回复
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block mb-1 text-gray-700 text-sm">收件人</label>
                            <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                              {selectedMessage.sender}
                            </div>
                          </div>
                          <div>
                            <label className="block mb-1 text-gray-700 text-sm">主题</label>
                            <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                              Re: {selectedMessage.subject}
                            </div>
                          </div>
                          <div>
                            <label className="block mb-1 text-gray-700 text-sm">内容</label>
                            <textarea
                              className="w-full border rounded-lg px-3 py-2 min-h-[100px] text-sm"
                              placeholder="输入回复内容..."
                              value={replyContent}
                              onChange={e => setReplyContent(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              className="px-4 py-2 rounded-lg text-gray-600 font-medium border border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
                              onClick={() => {
                                setShowReply(false);
                                setReplyContent('');
                              }}
                            >
                              取消
                            </button>
                            <button
                              className="px-4 py-2 rounded-lg text-white font-medium shadow transition-colors"
                              style={{background: colors.gradient.primary}}
                              onClick={() => {
                                // TODO: 实现发送回复的逻辑
                                setShowReply(false);
                                setReplyContent('');
                              }}
                            >
                              发送
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 新建消息弹窗 */}
        {showNewMsg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowNewMsg(false)}></div>
            <div 
              className="bg-white rounded-2xl shadow-2xl p-6 relative flex flex-col gap-4 my-auto overflow-auto"
              style={{ 
                width: '340px',
                height: '500px',
                minWidth: '340px', 
                minHeight: '500px', 
                maxWidth: '90vw', 
                maxHeight: '90vh',
                resize: 'both',
                overflow: 'auto'
              }}
            >
              <div className="absolute right-0 bottom-0 w-6 h-6 cursor-se-resize flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 21L15 15M15 15L9 21M15 15L15 9M15 15L21 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button
                className="absolute right-3 top-3 text-gray-400 hover:text-white hover:bg-blue-500 transition rounded-full w-8 h-8 flex items-center justify-center text-xl"
                onClick={() => setShowNewMsg(false)}
                title="关闭"
                style={{lineHeight: 1}}
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-2 text-gray-900 text-center">新建消息</h2>
              <div className="space-y-3 mt-2">
                <div>
                  <label className="block mb-1 text-gray-700 text-sm">选择课程</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={newMsg.course}
                    onChange={e => setNewMsg(v => ({...v, course: e.target.value, receivers: []}))}
                  >
                    <option value="">请选择课程</option>
                    {courses.filter(c=>c.id!=='all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {newMsg.course && (
                  <div>
                    <label className="block mb-1 text-gray-700 text-sm">选择收件人类型</label>
                    <div className="flex gap-2 mb-3">
                      <button
                        className={`px-3 py-1 rounded-lg text-sm ${newMsg.receiverType === 'teachers' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setNewMsg(v => ({...v, receiverType: 'teachers', receivers: []}))}
                      >
                        老师
                      </button>
                      <button
                        className={`px-3 py-1 rounded-lg text-sm ${newMsg.receiverType === 'students' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setNewMsg(v => ({...v, receiverType: 'students', receivers: []}))}
                      >
                        学生
                      </button>
                      <button
                        className={`px-3 py-1 rounded-lg text-sm ${newMsg.receiverType === 'groups' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setNewMsg(v => ({...v, receiverType: 'groups', receivers: []}))}
                      >
                        小组
                      </button>
                    </div>
                    {newMsg.receiverType && (
                      <div className="border rounded-lg p-2 max-h-20 overflow-y-auto bg-gray-50">
                        {newMsg.receiverType === 'groups' ? (
                          <div className="space-y-3">
                            {fakeGroups
                              .filter(g => g.group.startsWith('小组'))
                              .map(g => (
                                <div key={g.group} className="mb-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <button
                                      className={`px-2 py-0.5 rounded border text-xs ${newMsg.selectedGroups?.includes(g.group) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                                      onClick={() => {
                                        const isSelected = newMsg.selectedGroups?.includes(g.group);
                                        const newGroups = isSelected 
                                          ? newMsg.selectedGroups?.filter(x => x !== g.group)
                                          : [...(newMsg.selectedGroups || []), g.group];
                                        const newReceivers = isSelected
                                          ? newMsg.receivers.filter(x => !g.members.includes(x))
                                          : [...newMsg.receivers, ...g.members.filter(x => !newMsg.receivers.includes(x))];
                                        setNewMsg(v => ({...v, selectedGroups: newGroups, receivers: newReceivers}));
                                      }}
                                      type="button"
                                    >
                                      {g.group}
                                    </button>
                                    <span className="text-xs text-gray-400">({g.members.length}人)</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2 ml-4">
                                    {g.members.map(m => (
                                      <button
                                        key={m}
                                        className={`px-2 py-0.5 rounded border text-xs ${newMsg.receivers.includes(m) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                                        onClick={() => setNewMsg(v => v.receivers.includes(m) ? {...v, receivers: v.receivers.filter(x=>x!==m)} : {...v, receivers: [...v.receivers, m]})}
                                        type="button"
                                      >
                                        {m}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {fakeGroups
                              .find(g => g.group === (newMsg.receiverType === 'teachers' ? '老师' : '同学'))
                              ?.members.map(m => (
                                <button
                                  key={m}
                                  className={`px-2 py-0.5 rounded border text-xs ${newMsg.receivers.includes(m) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                                  onClick={() => setNewMsg(v => v.receivers.includes(m) ? {...v, receivers: v.receivers.filter(x=>x!==m)} : {...v, receivers: [...v.receivers, m]})}
                                  type="button"
                                >
                                  {m}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="主题"
                  value={newMsg.subject}
                  onChange={e => setNewMsg(v => ({...v, subject: e.target.value}))}
                />
                <textarea
                  className="w-full border rounded-lg px-3 py-2 min-h-[60px] text-sm"
                  placeholder="内容..."
                  value={newMsg.content}
                  onChange={e => setNewMsg(v => ({...v, content: e.target.value}))}
                />
                <div className="flex justify-between gap-2 mt-2">
                  <button
                    className="px-4 py-1.5 rounded-lg text-gray-600 font-medium border border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
                    onClick={() => setShowNewMsg(false)}
                  >
                    取消
                  </button>
                  <button
                    className="px-5 py-1.5 rounded-lg text-white font-medium shadow text-sm bg-blue-600 hover:bg-blue-700 transition"
                    onClick={() => setShowNewMsg(false)}
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardSidebar>
  );
} 