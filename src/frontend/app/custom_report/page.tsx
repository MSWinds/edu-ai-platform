'use client';

import React, { useState } from 'react';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { colors } from '../theme/colors';
import { CourseMenu } from '../class_page/course_1/components/CourseMenu';

// 假数据：只保留人工智能基础导论
const courses = [
  { id: 1, name: '人工智能基础导论' }
];

const fakeReports: Record<number, Record<number, any>> = {
  1: {
    1: {
      overallGrade: 'B+',
      overallScore: 84,
      courseProgress: 7,
      attendanceRate: 92,
      skillMastery: {
        'AI工具运用': 85,
        '知识理解度': 72,
        '学习投入度': 65,
        '协作表现力': 78
      },
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
      improvement: '建议多参与实践环节，加深对神经网络的理解'
    },
    2: {
      overallGrade: 'A-',
      overallScore: 88,
      courseProgress: 14,
      attendanceRate: 95,
      skillMastery: {
        'AI工具运用': 88,
        '知识理解度': 85,
        '学习投入度': 75,
        '协作表现力': 92
      },
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
      improvement: '建议课后多复习AI发展史相关内容'
    },
    3: {
      overallGrade: 'A',
      overallScore: 92,
      courseProgress: 21,
      attendanceRate: 100,
      skillMastery: {
        'AI工具运用': 95,
        '知识理解度': 88,
        '学习投入度': 85,
        '协作表现力': 90
      },
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
      improvement: '建议多关注历史事件细节'
    },
    4: {
      overallGrade: 'A-',
      overallScore: 89,
      courseProgress: 25,
      attendanceRate: 98,
      skillMastery: {
        'AI工具运用': 90,
        '知识理解度': 82,
        '学习投入度': 88,
        '协作表现力': 95
      },
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
      improvement: '建议课后多练习算法题'
    },
    5: {
      overallGrade: 'A',
      overallScore: 94,
      courseProgress: 32,
      attendanceRate: 100,
      skillMastery: {
        'AI工具运用': 92,
        '知识理解度': 90,
        '学习投入度': 95,
        '协作表现力': 98
      },
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
      improvement: '建议课后查阅技术资料'
    },
    6: {
      overallGrade: 'A+',
      overallScore: 96,
      courseProgress: 39,
      attendanceRate: 100,
      skillMastery: {
        'AI工具运用': 98,
        '知识理解度': 92,
        '学习投入度': 95,
        '协作表现力': 100
      },
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
      improvement: '建议课后复习理论知识'
    },
    7: {
      overallGrade: 'A+',
      overallScore: 98,
      courseProgress: 46,
      attendanceRate: 100,
      skillMastery: {
        'AI工具运用': 100,
        '知识理解度': 95,
        '学习投入度': 98,
        '协作表现力': 100
      },
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
      improvement: '建议加强深度学习理论学习，为后续课程打好基础'
    }
  }
};

const maxWeeks = 7;

// 技能掌握度评判标准
const skillCriteria = {
  'AI工具运用': {
    title: 'AI工具运用',
    description: '评估使用AI工具的熟练程度',
    criteria: [
      '• AI工具使用频率和时长',
      '• 提示词质量和效果',
      '• AI对话成功率',
      '• 工具切换熟练度',
      '• 问题解决效率'
    ]
  },
  '知识理解度': {
    title: '知识理解度',
    description: '评估对AI理论知识的掌握程度',
    criteria: [
      '• 课程内容完成度',
      '• 小测验和堂测得分',
      '• 知识点掌握情况',
      '• 概念理解准确性',
      '• 知识应用能力'
    ]
  },
  '学习投入度': {
    title: '学习投入度',
    description: '评估的学习积极性和投入程度',
    criteria: [
      '• 学习时长统计',
      '• 作业完成质量',
      '• 课程参与度',
      '• 自主学习行为',
      '• 学习持续性'
    ]
  },
  '协作表现力': {
    title: '协作表现力',
    description: '评估的团队合作和沟通能力',
    criteria: [
      '• 小组活动参与度',
      '• 同伴互动频率',
      '• 学习社区贡献度',
      '• 协作效果评价'
    ]
  }
};

// 圆环进度图组件
const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#3B82F6", label, value }: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{value || `${percentage}%`}</span>
        </div>
      </div>
      {label && <span className="text-sm text-gray-600 mt-2 text-center">{label}</span>}
    </div>
  );
};

// 进度条组件
const ProgressBar = ({ label, percentage, color = "#3B82F6", showTooltip = false }: {
  label: string;
  percentage: number;
  color?: string;
  showTooltip?: boolean;
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const criteria = skillCriteria[label as keyof typeof skillCriteria];

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showTooltip && criteria && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {showInfo && (
                <div className="absolute left-0 top-6 z-10 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{criteria.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{criteria.description}</p>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium mb-2">评判标准：</div>
                    {criteria.criteria.map((item, index) => (
                      <div key={index} className="mb-1">{item}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

// 趋势图组件 - 修复版本
const TrendChart = ({ data, color = "#3B82F6" }: {
  data: number[];
  color?: string;
}) => {
  if (data.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
        <span className="text-gray-500 text-sm">暂无趋势数据</span>
      </div>
    );
  }

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  // SVG图表区域尺寸
  const chartWidth = 600;
  const chartHeight = 200;
  const padding = { top: 30, right: 30, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // 生成折线路径点
  const points = data.map((score, index) => {
    const x = padding.left + (index / (data.length - 1)) * innerWidth;
    const y = padding.top + (1 - (score - minValue) / range) * innerHeight;
    return { x, y, score, week: index + 1 };
  });

  // 生成SVG路径字符串
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // 生成填充区域路径
  const areaPath = `M ${padding.left} ${chartHeight - padding.bottom} L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${padding.left + innerWidth} ${chartHeight - padding.bottom} Z`;

  return (
    <div className="w-full">
      {/* 图表容器 */}
      <div className="w-full bg-gray-50 rounded-lg p-4">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-56 mx-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 网格线 */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5"/>
          
          {/* Y轴参考线 */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = padding.top + ratio * innerHeight;
            const value = Math.round(maxValue - ratio * range);
            return (
              <g key={index}>
                <line 
                  x1={padding.left} 
                  y1={y} 
                  x2={padding.left + innerWidth} 
                  y2={y} 
                  stroke="#e5e7eb" 
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text 
                  x={padding.left - 5} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-xs fill-gray-500"
                >
                  {value}
                </text>
              </g>
            );
          })}
          
          {/* 填充区域 */}
          <path
            d={areaPath}
            fill={color}
            fillOpacity="0.1"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* 主折线 */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* 数据点 */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="white"
                stroke={color}
                strokeWidth="3"
                className="transition-all duration-1000 ease-out"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill={color}
                className="transition-all duration-1000 ease-out"
              />
              
              {/* 悬停时显示的数值标签 */}
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-medium"
              >
                {point.score}
              </text>
            </g>
          ))}
          
          {/* X轴标签 */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - 5}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              第{point.week}周
            </text>
          ))}
        </svg>
        
        {/* 图例和统计信息 */}
        <div className="flex justify-between items-center mt-4 px-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-600">学习成绩趋势</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>最低: {minValue}分</span>
            <span>最高: {maxValue}分</span>
            <span>平均: {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}分</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomReportPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const reportData = fakeReports[selectedCourse]?.[selectedWeek];

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return '#10B981';
    if (grade.includes('B')) return '#3B82F6';
    if (grade.includes('C')) return '#F59E0B';
    return '#EF4444';
  };

  // 补齐学习趋势数据，缺失的周补0
  const getFullTrend = (trend: number[] = []) => {
    return Array.from({ length: maxWeeks }, (_, i) => trend[i] ?? 0);
  };

  // 获取累计趋势数据：从第1周到当前选择周
  const getCumulativeTrend = () => {
    const trendData: { week: number; score: number }[] = [];
    
    for (let week = 1; week <= selectedWeek; week++) {
      const weekData = fakeReports[selectedCourse]?.[week];
      if (weekData && weekData.overallScore) {
        trendData.push({ week, score: weekData.overallScore });
      }
    }
    
    return trendData;
  };

  // 静态趋势数据 - 股票样式折线图
  const getStaticTrend = () => {
    // 人工智能基础导论的7周学习趋势
    return [75, 82, 78, 85, 88, 92, 98];
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: colors.background }}>
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto" style={{ backgroundColor: colors.background }}>
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: colors.gradient.primary }}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span>智能学习跟踪系统</span>
              </h1>
              <p className="text-gray-600 mt-2 text-lg">数据驱动的个性化学习分析与进步跟踪</p>
            </div>

            {/* 选择器 */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
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
              <div className="space-y-8">
                {/* 核心指标仪表盘 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 总体成绩 */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border p-6 h-full">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">总体成绩</h3>
                      <div className="flex justify-center">
                        <CircularProgress
                          percentage={reportData.overallScore}
                          size={140}
                          strokeWidth={12}
                          color={getGradeColor(reportData.overallGrade)}
                          value={reportData.overallGrade}
                        />
                      </div>
                      <div className="text-center mt-4">
                        <span className="text-sm text-gray-600">当前分数：{reportData.overallScore}分</span>
                      </div>
                    </div>
                  </div>

                  {/* 右侧指标 */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 课程进度 */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">课程进度</h3>
                      <div className="flex justify-center">
                        <CircularProgress
                          percentage={reportData.courseProgress}
                          size={120}
                          color="#8B5CF6"
                          label="已完成课程"
                        />
                      </div>
                    </div>

                    {/* 出勤率 */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">出勤率</h3>
                      <div className="flex justify-center">
                        <CircularProgress
                          percentage={reportData.attendanceRate}
                          size={120}
                          color="#10B981"
                          label="按时出席"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 技能掌握度 */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>技能掌握度</span>
                    <div className="text-xs text-gray-500 ml-2 flex items-center">
                      
                    </div>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(reportData.skillMastery).map(([skill, percentage]) => (
                      <ProgressBar
                        key={skill}
                        label={skill}
                        percentage={percentage as number}
                        color="#3B82F6"
                        showTooltip={true}
                      />
                    ))}
                  </div>
                </div>

                {/* 学习趋势 */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <span>学习趋势</span>
                  </h3>
                  <TrendChart data={getStaticTrend()} color="#10B981" />
                </div>

                {/* 详细反馈区域 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 本周亮点 */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-sm border border-green-200 p-6">
                    <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span>本周亮点</span>
                    </h3>
                    <div className="text-gray-800 leading-relaxed">{reportData.highlight}</div>
                  </div>

                  {/* 改进建议 */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm border border-blue-200 p-6">
                    <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>AI改进建议</span>
                    </h3>
                    <div className="text-gray-800 leading-relaxed">{reportData.improvement}</div>
                  </div>
                </div>
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