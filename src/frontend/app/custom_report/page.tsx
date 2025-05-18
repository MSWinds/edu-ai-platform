'use client';

import React, { useState } from 'react';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { colors } from '../theme/colors';
import { CourseMenu } from '../class_page/course_1/components/CourseMenu';

// 假数据：多课程多周
const courses = [
  { id: 1, name: '人工智能基础导论' },
  { id: 2, name: 'AI与社会' }
];

const fakeReports: Record<number, Record<number, any>> = {
  1: {
    1: {
      classroom: {
        attendance: '准时出席',
        participation: '积极回答问题2次',
        focus: '专注度高',
        interaction: '与同学讨论1次'
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
      nextWeek: {
        focus: '加强神经网络原理的学习',
        action: [
          '课前预习：观看神经网络基础视频',
          '课堂参与：主动回答1个问题',
          '课后复习：完成练习题'
        ]
      },
      encouragement: '你的学习态度很积极，继续保持！'
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
        attendance: '准时到课',
        participation: '独立完成项目',
        focus: '专注投入',
        interaction: '与同学分享经验'
      },
      learning: {
        understanding: {
          good: ['AI项目实践'],
          needsReview: ['AI项目报告撰写']
        },
        quiz: {
          score: 97,
          feedback: '项目完成度高，报告需完善'
        }
      },
      highlight: '独立完成项目，条理清晰',
      improvement: '建议课后完善项目报告',
      nextWeek: {
        focus: '项目总结与报告',
        action: [
          '课前梳理项目流程',
          '课堂展示项目成果',
          '课后撰写项目报告'
        ]
      },
      encouragement: '项目达人，继续挑战更高难度！'
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

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-8 max-w-3xl space-y-6">
            {/* 顶部选择 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">课程：</span>
                <select
                  className="border rounded px-3 py-1 text-base"
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
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">周：</span>
                {[...Array(maxWeeks)].map((_, i) => (
                  <button
                    key={i+1}
                    onClick={() => setSelectedWeek(i+1)}
                    className={`px-4 py-1 rounded-full border text-base font-medium transition-all duration-150 select-none
                      ${selectedWeek === i+1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600'}`}
                  >
                    第{i+1}周
                  </button>
                ))}
              </div>
            </div>
            {/* 内容区 */}
            {reportData ? (
              <>
                {/* 课堂表现 */}
                <section className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                  <div className="text-lg font-bold text-blue-700 mb-2">📚 课堂表现</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">出勤情况</span>
                        <span className="font-medium">{reportData.classroom.attendance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">课堂参与</span>
                        <span className="font-medium">{reportData.classroom.participation}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">专注度</span>
                        <span className="font-medium">{reportData.classroom.focus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">同学互动</span>
                        <span className="font-medium">{reportData.classroom.interaction}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 学习效果 */}
                <section className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                  <div className="text-lg font-bold text-blue-700 mb-2">📈 学习效果</div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">知识点掌握</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-xs text-green-600 mb-1">掌握良好</div>
                          <div className="text-sm">{reportData.learning.understanding.good.join('、')}</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <div className="text-xs text-yellow-600 mb-1">需要复习</div>
                          <div className="text-sm">{reportData.learning.understanding.needsReview.join('、')}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">测验反馈</div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">得分</span>
                        <span className="text-lg font-medium text-blue-600">{reportData.learning.quiz.score}分</span>
                      </div>
                      <div className="mt-2 text-gray-800">{reportData.learning.quiz.feedback}</div>
                    </div>
                  </div>
                </section>

                {/* 本周亮点 */}
                <section className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                  <div className="text-lg font-bold text-blue-700 mb-2">🌟 本周亮点</div>
                  <div className="text-gray-800">{reportData.highlight}</div>
                </section>

                {/* 需要改进 */}
                <section className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                  <div className="text-lg font-bold text-blue-700 mb-2">🎯 需要改进</div>
                  <div className="text-gray-800">{reportData.improvement}</div>
                </section>

                {/* 下周建议 */}
                <section className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                  <div className="text-lg font-bold text-blue-700 mb-2">📝 下周建议</div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">重点关注</div>
                      <div className="text-gray-800">{reportData.nextWeek.focus}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">具体行动</div>
                      <ul className="list-disc pl-5 text-gray-800">
                        {reportData.nextWeek.action.map((action: string, i: number) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 鼓励语 */}
                <section className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                  <div className="text-lg font-bold text-blue-700 mb-2">💬 AI助教鼓励</div>
                  <div className="text-gray-800">{reportData.encouragement}</div>
                </section>
              </>
            ) : (
              <div className="text-gray-400 text-center py-12">暂无本周周报数据</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomReportPage;