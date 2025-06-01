'use client';

import React, { useState } from 'react';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { colors } from '../theme/colors';
import { CourseMenu } from '../class_page/course_1/components/CourseMenu';

// 假数据：多课程多周
const courses = [
  { id: 1, name: '人工智能基础导论' },
  { id: 2, name: 'AI与社会' },
  { id: 3, name: '机器学习实践' },
  { id: 4, name: 'AI与社会伦理' }
];

const fakeReports: Record<number, Record<number, any>> = {
  1: {
    1: {
      classroom: {
        attendance: { status: '准时出席', level: 'good' },
        participation: { value: '积极回答问题2次', detail: '同学互动' },
        focus: { value: '专注度高', level: 'excellent' },
        interaction: { value: '与同学讨论1次', level: 'good' }
      },
      learning: {
        understanding: {
          good: ['AI基础概念', '机器学习入门'],
          needsReview: ['神经网络原理']
        },
        quiz: {
          score: 85,
          feedback: '概念理解准确，实践应用需要加强'
        }
      },
      highlight: '在课堂讨论中提出了关于AI伦理的独特见解，获得老师表扬',
      improvement: '建议多参与实践环节，加深对神经网络的理解',
      weeklyProgress: {
        attendanceRate: 100,
        participationScore: 90,
        quizAverage: 85,
        focusLevel: 95
      }
    },
    2: {
      classroom: {
        attendance: '全勤',
        participation: '主动分享学习心得',
        focus: '专注听讲',
        interaction: '与同学合作完成小组任务'
      },
      learning: {
        understanding: {
          good: ['AI绘画', 'AI与生活应用'],
          needsReview: ['AI发展史']
        },
        quiz: {
          score: 80,
          feedback: 'AI绘画掌握较好，历史知识需加强'
        }
      },
      highlight: '小组活动中积极发言，带动团队氛围',
      improvement: '建议课后多复习AI发展史相关内容',
      nextWeek: {
        focus: 'AI历史知识梳理',
        action: [
          '课前阅读：AI发展大事记',
          '课堂提问：主动提1个历史问题',
          '课后整理：制作知识卡片'
        ]
      },
      encouragement: '团队精神很棒，继续加油！'
    },
    3: {
      classroom: {
        attendance: '准时到课',
        participation: '积极参与测验',
        focus: '认真听讲',
        interaction: '与同学互相讲解知识点'
      },
      learning: {
        understanding: {
          good: ['AI基本原理'],
          needsReview: ['AI历史事件']
        },
        quiz: {
          score: 100,
          feedback: '全部答对，基础扎实'
        }
      },
      highlight: '测验满分，获得老师表扬',
      improvement: '建议多关注历史事件细节',
      nextWeek: {
        focus: 'AI历史事件复习',
        action: [
          '课前查阅资料',
          '课堂分享1个历史故事',
          '课后复盘错题'
        ]
      },
      encouragement: '满分达人，继续保持！'
    },
    4: {
      classroom: {
        attendance: '全勤',
        participation: '小组合作积极',
        focus: '课堂专注',
        interaction: '与同伴分工协作'
      },
      learning: {
        understanding: {
          good: ['AI小组合作'],
          needsReview: ['AI算法原理']
        },
        quiz: {
          score: 90,
          feedback: '合作题表现优异，算法需加强'
        }
      },
      highlight: '带领小组完成任务',
      improvement: '建议课后多练习算法题',
      nextWeek: {
        focus: 'AI算法练习',
        action: [
          '课前预习算法基础',
          '课堂参与算法讨论',
          '课后完成算法练习'
        ]
      },
      encouragement: '团队小能手，继续努力！'
    },
    5: {
      classroom: {
        attendance: '准时出席',
        participation: '勇于展示',
        focus: '积极参与',
        interaction: '与同学互评演讲'
      },
      learning: {
        understanding: {
          good: ['AI应用展示'],
          needsReview: ['AI技术细节']
        },
        quiz: {
          score: 95,
          feedback: '表达清晰，技术细节需补充'
        }
      },
      highlight: '展示环节表现自信',
      improvement: '建议课后查阅技术资料',
      nextWeek: {
        focus: '技术细节梳理',
        action: [
          '课前查阅资料',
          '课堂提问技术难点',
          '课后整理笔记'
        ]
      },
      encouragement: '表达力很棒，继续自信展示自己！'
    },
    6: {
      classroom: {
        attendance: '全勤',
        participation: '积极参与竞赛',
        focus: '课堂活跃',
        interaction: '与同学组队答题'
      },
      learning: {
        understanding: {
          good: ['AI趣味竞赛'],
          needsReview: ['AI理论知识']
        },
        quiz: {
          score: 98,
          feedback: '竞赛表现优异，理论需加强'
        }
      },
      highlight: '竞赛获胜，团队合作佳',
      improvement: '建议课后复习理论知识',
      nextWeek: {
        focus: '理论知识巩固',
        action: [
          '课前复习理论',
          '课堂参与理论讨论',
          '课后完成理论练习'
        ]
      },
      encouragement: '趣味达人，继续用心学习！'
    },
    7: {
      classroom: {
        attendance: { status: '准时出席', level: 'good' },
        participation: { value: '独立完成项目', detail: '项目展示优秀' },
        focus: { value: '专注投入', level: 'excellent' },
        interaction: { value: '与同学分享经验', level: 'excellent' }
      },
      learning: {
        understanding: {
          good: ['提示词工程设计', 'AI应用开发', '项目管理'],
          needsReview: ['深度学习理论']
        },
        quiz: {
          score: 92,
          feedback: '实践能力强，理论基础需要继续加强'
        }
      },
      highlight: '独立完成提示词工程项目，获得全班最佳创意奖',
      improvement: '建议加强深度学习理论学习，为后续课程打好基础',
      weeklyProgress: {
        attendanceRate: 100,
        participationScore: 95,
        quizAverage: 92,
        focusLevel: 98
      }
    }
  },
  2: {
    1: {
      classroom: {
        attendance: '全勤',
        participation: '积极参与讨论',
        focus: '认真听讲',
        interaction: '与同学分享观点'
      },
      learning: {
        understanding: {
          good: ['AI与医疗'],
          needsReview: ['AI伦理']
        },
        quiz: {
          score: 88,
          feedback: '案例分析到位，伦理需加强'
        }
      },
      highlight: '课堂讨论中提出深刻见解',
      improvement: '建议多关注伦理案例',
      nextWeek: {
        focus: 'AI伦理学习',
        action: [
          '课前阅读伦理案例',
          '课堂参与伦理辩论',
          '课后写学习感悟'
        ]
      },
      encouragement: '思考有深度，继续探索！'
    }
  }
};

const maxWeeks = 7;

const CustomReportPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const reportData = fakeReports[selectedCourse]?.[selectedWeek];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 80) return 'bg-blue-50 border-blue-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: colors.background }}>
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto" style={{ backgroundColor: colors.background }}>
          <div className="container mx-auto px-6 py-8 max-w-5xl">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ background: colors.gradient.primary }}>
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span>智能学习跟踪</span>
              </h1>
              <p className="text-gray-600 mt-2">个性化学习分析报告，助您精准提升学习效果</p>
            </div>

            {/* 顶部选择器 */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-700 flex items-center space-x-2">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>课程：</span>
                  </span>
                  <select
                    className="border border-gray-200 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedCourse}
                    onChange={e => {
                      setSelectedCourse(Number(e.target.value));
                      setSelectedWeek(1);
                    }}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-700 flex items-center space-x-2">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>周：</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(maxWeeks)].map((_, i) => (
                      <button
                        key={i+1}
                        onClick={() => setSelectedWeek(i+1)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedWeek === i+1 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        第{i+1}周
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 内容区 */}
            {reportData ? (
              <div className="space-y-6">
                {/* 课堂表现 */}
                <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-lg font-bold text-blue-700 flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>课堂表现</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">出勤情况</div>
                        <div className="text-lg font-semibold text-green-600">{reportData.classroom.attendance.status}</div>
                        <div className="text-xs text-gray-500 mt-1">专注度</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">准时出席</div>
                        <div className="text-lg font-semibold text-blue-600">{reportData.classroom.participation.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{reportData.classroom.participation.detail}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">专注度高</div>
                        <div className="text-lg font-semibold text-purple-600">{reportData.classroom.focus.value}</div>
                        <div className="text-xs text-gray-500 mt-1">与同学讨论1次</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">同学互动</div>
                        <div className="text-lg font-semibold text-indigo-600">{reportData.classroom.interaction.value}</div>
                        <div className="text-xs text-gray-500 mt-1">良好合作</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 学习效果 */}
                <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                    <h3 className="text-lg font-bold text-purple-700 flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>学习效果</span>
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-3">知识点掌握</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="text-sm font-medium text-green-700 mb-2 flex items-center space-x-1">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>掌握良好</span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {reportData.learning.understanding.good.join('、')}
                          </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="text-sm font-medium text-yellow-700 mb-2 flex items-center space-x-1">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 14.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>需要复习</span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {reportData.learning.understanding.needsReview.join('、')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-3">测验反馈</div>
                      <div className={`rounded-lg border p-4 ${getScoreBg(reportData.learning.quiz.score)}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">得分</span>
                          <span className={`text-2xl font-bold ${getScoreColor(reportData.learning.quiz.score)}`}>
                            {reportData.learning.quiz.score}分
                          </span>
                        </div>
                        <div className="text-gray-700 text-sm">{reportData.learning.quiz.feedback}</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 本周亮点 */}
                <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gradient-to-r from-yellow-50 to-orange-50">
                    <h3 className="text-lg font-bold text-yellow-700 flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span>本周亮点</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="text-gray-800 leading-relaxed">{reportData.highlight}</div>
                  </div>
                </section>

                {/* 需要改进 */}
                <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gradient-to-r from-red-50 to-pink-50">
                    <h3 className="text-lg font-bold text-red-700 flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>需要改进</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="text-gray-800 leading-relaxed">{reportData.improvement}</div>
                  </div>
                </section>

                {/* AI智能建议 */}
                <section className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm border border-blue-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-blue-200 bg-white bg-opacity-50">
                    <h3 className="text-lg font-bold text-blue-700 flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>AI智能建议</span>
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-white bg-opacity-70 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-700 mb-2">个性化学习路径推荐</div>
                      <div className="text-gray-800 text-sm leading-relaxed">
                        基于您的学习表现，建议重点关注深度学习理论基础，可以通过观看相关视频教程、
                        参与在线讨论和完成实践项目来提升理解深度。
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-70 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-700 mb-2">学习效率优化建议</div>
                      <div className="text-gray-800 text-sm leading-relaxed">
                        继续保持当前的学习节奏，适当增加与同学的互动交流，
                        通过讲解给他人的方式来巩固自己的理解。
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无学习数据</h3>
                <p className="text-gray-500">该周的学习报告正在生成中，请稍后查看</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomReportPage;