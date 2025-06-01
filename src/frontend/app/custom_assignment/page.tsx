'use client';

import React, { useState, useRef, useEffect } from 'react';
import { mockUserData } from '../mockdata/courseData';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';
import { colors } from '../theme/colors';

// 假的AI生成题目（每周2-3题，结合mock数据）
const generateFakeQuestions = (weeks: number[]) => {
  return weeks.flatMap(weekNum => {
    const week = mockUserData.course.weeks.find(w => w.weekNumber === weekNum);
    if (!week) return [];
    const questions = [];
    // 题1：本周quiz相关
    if (week.quiz) {
      questions.push({
        id: `${weekNum}-quiz`,
        question: `【第${weekNum}周】${week.quiz.title}：以下哪项最能体现本周测验核心？`,
        options: [
          'A. ' + week.title,
          'B. 课堂讨论',
          'C. 课外阅读',
          'D. 其他学科内容'
        ],
        answer: 0,
        explanation: 'A项为本周测验核心内容。',
        knowledge: week.title
      });
    }
    // 题2：本周作业相关
    if (week.assignments && week.assignments.length > 0) {
      questions.push({
        id: `${weekNum}-ass`,
        question: `【第${weekNum}周】关于作业"${week.assignments[0].title}"，正确的是？`,
        options: [
          'A. 与本周主题紧密相关',
          'B. 可以不完成',
          'C. 与AI无关',
          'D. 只需抄答案'
        ],
        answer: 0,
        explanation: 'A项正确，作业紧扣本周主题。',
        knowledge: week.assignments[0].title
      });
    }
    // 题3：本周总结相关
    if (week.summary) {
      questions.push({
        id: `${weekNum}-sum`,
        question: `【第${weekNum}周】本周课程总结提到：${week.summary.slice(0, 12)}...，下列说法正确的是？`,
        options: [
          'A. 体现本周知识点',
          'B. 与本课程无关',
          'C. 只适合专家',
          'D. 没有实际应用'
        ],
        answer: 0,
        explanation: 'A项正确，体现本周知识点。',
        knowledge: week.title
      });
    }
    return questions;
  });
};

const CustomAssignmentPage = () => {
  const course = mockUserData.course;
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<(number|null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 关闭下拉（点击外部）
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // 选择/取消课程内容
  const handleContentCheck = (weekNum: number) => {
    setSelectedWeeks(prev => prev.includes(weekNum)
      ? prev.filter(w => w !== weekNum)
      : [...prev, weekNum]
    );
  };

  // 选择课程
  const handleCourseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
    setSelectedWeeks([]);
    setQuestions([]);
    setAnswers([]);
    setSubmitted(false);
    setCurrentIdx(0);
  };

  // 刷新按钮
  const handleRefresh = () => {
    setSelectedCourse('');
    setSelectedWeeks([]);
    setQuestions([]);
    setAnswers([]);
    setSubmitted(false);
    setCurrentIdx(0);
  };

  // 生成测评
  const handleGenerate = () => {
    const qs = generateFakeQuestions(selectedWeeks);
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(null));
    setSubmitted(false);
    setCurrentIdx(0);
  };

  // 答题
  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(ans => ans.map((a, i) => i === qIdx ? optIdx : a));
  };

  // 切换题目
  const goPrev = () => setCurrentIdx(idx => Math.max(0, idx - 1));
  const goNext = () => setCurrentIdx(idx => Math.min(questions.length - 1, idx + 1));

  // 提交测评
  const handleSubmit = () => {
    setSubmitted(true);
  };

  // 统计分数
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
  // 错题知识点
  const wrongKnowledges = questions
    .map((q, i) => (answers[i] !== q.answer ? q.knowledge : null))
    .filter(Boolean);

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <span>智能测验</span>
              </h1>
              <p className="text-gray-600 mt-2">AI智能生成个性化测试题目，助您查漏补缺、巩固知识点</p>
            </div>

            {/* AI智能测评说明区+未生成时的引导 */}
            {questions.length === 0 && (
              <div className="space-y-6 mb-8">
                <section className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm border border-blue-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-blue-200 bg-white bg-opacity-50">
                    <h3 className="text-lg font-bold text-blue-700 flex items-center space-x-2">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>AI智能测验</span>
                    </h3>
                  </div>
                  <div className="p-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <video 
                        src="/icons/AI-Animation2.webm" 
                        width={120} 
                        height={120}
                        autoPlay
                        loop
                        muted
                        className="rounded-full shadow-lg shadow-blue-100"
                      />
                    </div>
                    <div className="text-gray-800 text-base leading-relaxed max-w-2xl mx-auto">
                      AI会根据您选择的课程和周次，自动生成专属测试题目，结合课堂知识点、作业与测验内容，
                      帮助您系统化地检验学习成果，精准定位薄弱环节。
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <h3 className="text-lg font-bold text-green-700 flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>测验指南</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm font-bold">1</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">多选周次支持</div>
                            <div className="text-sm text-gray-600">可选择多个学习周次，支持综合性测评</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm font-bold">2</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">智能内容生成</div>
                            <div className="text-sm text-gray-600">基于课堂知识点、作业与测验内容智能出题</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm font-bold">3</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">个性化反馈</div>
                            <div className="text-sm text-gray-600">提交后获得AI个性化复习建议和详细解析</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm font-bold">4</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">随时回顾</div>
                            <div className="text-sm text-gray-600">遇到难题可随时回顾相关课程内容</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* 顶部选择器 */}
            <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
              <div className="space-y-8">
                {/* 课程选择行 */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="font-semibold text-gray-700 flex items-center space-x-2 min-w-[100px]">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>课程：</span>
                  </span>
                  <select
                    className="border border-gray-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[280px] flex-1 max-w-md"
                    value={selectedCourse}
                    onChange={handleCourseSelect}
                  >
                    <option value="" disabled>请选择课程</option>
                    <option value={course.id}>{course.title}</option>
                  </select>
                </div>

                {/* 课程内容选择行 */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4" ref={dropdownRef}>
                  <span className="font-semibold text-gray-700 flex items-center space-x-2 min-w-[100px] sm:mt-3">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>课程内容：</span>
                  </span>
                  <div className="flex-1 max-w-2xl relative">
                    <div
                      className={`border border-gray-200 rounded-lg px-4 py-3 bg-white flex flex-wrap gap-2 items-center min-h-[50px] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${selectedCourse ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                      onClick={() => selectedCourse && setDropdownOpen(open => !open)}
                    >
                      {selectedWeeks.length === 0 ? (
                        <span className="text-gray-400">请选择课程内容</span>
                      ) : (
                        course.weeks.filter(w => selectedWeeks.includes(w.weekNumber)).map(w => (
                          <span key={w.weekNumber} className="bg-blue-100 text-blue-700 rounded-md px-3 py-1.5 text-sm">
                            {w.title}
                          </span>
                        ))
                      )}
                      <svg className="w-5 h-5 ml-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {dropdownOpen && selectedCourse && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {course.weeks.map(w => (
                          <label key={w.weekNumber} className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150">
                            <input
                              type="checkbox"
                              checked={selectedWeeks.includes(w.weekNumber)}
                              onChange={() => handleContentCheck(w.weekNumber)}
                              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-700 text-sm">{w.title}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 按钮操作行 */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 sm:justify-end">
                  <button
                    className="bg-blue-600 text-white px-10 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-base"
                    onClick={handleGenerate}
                    disabled={!selectedCourse || selectedWeeks.length === 0}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>生成智能测验</span>
                  </button>
                  <button
                    className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-3 text-base"
                    onClick={handleRefresh}
                    type="button"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>重置</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 题目区 */}
            {questions.length > 0 && (
              <div className="space-y-6">
                {/* 进度条与题目切换 */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIdx+1)/questions.length)*100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 min-w-[60px] text-right">
                      {currentIdx+1}/{questions.length}
                    </span>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    答题进度：已完成 {answers.filter(a => a !== null).length} 题，剩余 {answers.filter(a => a === null).length} 题
                  </div>
                </div>

                {/* 单题卡片 */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h3 className="text-lg font-bold text-indigo-700 flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>题目 {currentIdx+1}</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-6 text-gray-800 text-lg leading-relaxed">
                      {questions[currentIdx].question}
                    </div>
                    <div className="space-y-3">
                      {questions[currentIdx].options.map((opt: string, optIdx: number) => (
                        <button
                          key={optIdx}
                          className={`block w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                            answers[currentIdx] === optIdx 
                              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                              : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                          disabled={submitted}
                          onClick={() => handleAnswer(currentIdx, optIdx)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    
                    {/* 题目导航按钮 */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t">
                      <button
                        className="px-8 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        onClick={goPrev}
                        disabled={currentIdx === 0}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>上一题</span>
                      </button>
                      
                      {currentIdx < questions.length - 1 ? (
                        <button
                          className="px-8 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                          onClick={goNext}
                        >
                          <span>下一题</span>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        !submitted && answers.every(a => a !== null) ? (
                          <button
                            className="px-8 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                            onClick={handleSubmit}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>提交测验</span>
                          </button>
                        ) : (
                          <button
                            className="px-8 py-3 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed flex items-center space-x-2"
                            disabled
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>请完成所有题目</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* 测评结果 */}
                {submitted && (
                  <section className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-sm border border-green-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-green-200 bg-white bg-opacity-50">
                      <h3 className="text-lg font-bold text-green-700 flex items-center space-x-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>测验结果</span>
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {Math.round(score/questions.length*100)}分
                        </div>
                        <div className="text-gray-700">
                          共 {questions.length} 题，答对 {score} 题
                        </div>
                      </div>
                      
                      {wrongKnowledges.length > 0 ? (
                        <div className="bg-white bg-opacity-70 rounded-lg p-4">
                          <div className="text-sm font-medium text-orange-700 mb-2 flex items-center space-x-1">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>AI 学习建议</span>
                          </div>
                          <div className="text-gray-800 text-sm leading-relaxed">
                            建议重点复习以下知识点：
                            <span className="ml-2">
                              {wrongKnowledges.map((k, i) => (
                                <span key={i} className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs mx-1">
                                  {k}
                                </span>
                              ))}
                            </span>
                            ，通过重复练习和深入理解来提升掌握度。
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center">
                          <div className="text-green-700 font-medium flex items-center justify-center space-x-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>恭喜！全部答对，学习成果优秀！</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* 测评详细报告 */}
                {submitted && (
                  <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-slate-50">
                      <h3 className="text-lg font-bold text-gray-700 flex items-center space-x-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>详细解析</span>
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {questions.map((q, idx) => (
                        <div key={q.id} className={`rounded-lg border p-4 ${
                          answers[idx] === q.answer 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-start space-x-3 mb-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              answers[idx] === q.answer 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {answers[idx] === q.answer ? (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 mb-2">题目{idx+1}：{q.question}</div>
                              <div className="space-y-1 text-sm">
                                <div>
                                  <span className="font-medium text-gray-600">您的答案：</span>
                                  <span className={`font-medium ${
                                    answers[idx] === q.answer ? 'text-green-700' : 'text-red-700'
                                  }`}>
                                    {typeof answers[idx] === 'number' ? q.options[answers[idx] as number] : '未作答'}
                                  </span>
                                </div>
                                {answers[idx] !== q.answer && (
                                  <div>
                                    <span className="font-medium text-gray-600">正确答案：</span>
                                    <span className="text-blue-700 font-medium">{q.options[q.answer]}</span>
                                  </div>
                                )}
                                <div className="mt-2">
                                  <span className="font-medium text-gray-600">解析：</span>
                                  <span className="text-gray-700">{q.explanation}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomAssignmentPage; 