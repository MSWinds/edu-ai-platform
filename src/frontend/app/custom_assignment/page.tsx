'use client';

import React, { useState, useRef, useEffect } from 'react';
import { mockUserData } from '../mockdata/courseData';
import DashboardSidebar from '../main_sidebar/DashboardSidebar';

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
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-8 max-w-3xl space-y-6">
            {/* AI智能测评说明区+未生成时的引导和插画 */}
            {questions.length === 0 && (
              <>
                <section className="bg-white rounded-lg shadow p-8 flex flex-col items-center gap-4 mb-2">
                  <div className="text-5xl">🤖</div>
                  <div className="text-xl font-bold text-blue-700">AI智能测评</div>
                  <div className="text-gray-700 text-base text-center max-w-xl">AI会根据你选择的课程和周次，自动为你生成专属测评题，帮助你查漏补缺、巩固知识。请选择下方课程和周次，点击"生成智能测评"按钮开始体验！</div>
                </section>
                <section className="bg-blue-50 rounded-lg shadow p-4 flex flex-col gap-2">
                  <div className="font-semibold text-blue-700 mb-1">测评小贴士</div>
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                    <li>可多选周次，支持综合测评。</li>
                    <li>测评内容结合课堂知识点、作业与测验。</li>
                    <li>提交后将获得AI个性化复习建议。</li>
                    <li>如遇难题，可随时回顾课程内容。</li>
                  </ul>
                </section>
              </>
            )}
            {/* 顶部选择（下拉） */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">课程：</span>
                <select
                  className="border rounded px-3 py-1 text-base min-w-[180px]"
                  value={selectedCourse}
                  onChange={handleCourseSelect}
                >
                  <option value="" disabled>请选择课程</option>
                  <option value={course.id}>{course.title}</option>
                </select>
              </div>
              <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                <span className="font-semibold text-gray-700">课程内容：</span>
                <div className="min-w-[200px]">
                  <div
                    className={`border rounded px-3 py-1 bg-white flex flex-wrap gap-1 items-center min-h-[38px] ${selectedCourse ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                    onClick={() => selectedCourse && setDropdownOpen(open => !open)}
                  >
                    {selectedWeeks.length === 0 ? (
                      <span className="text-gray-400">请选择课程内容</span>
                    ) : (
                      course.weeks.filter(w => selectedWeeks.includes(w.weekNumber)).map(w => (
                        <span key={w.weekNumber} className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs mr-1 mb-1">{w.title}</span>
                      ))
                    )}
                    <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {dropdownOpen && selectedCourse && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-56 overflow-y-auto">
                      {course.weeks.map(w => (
                        <label key={w.weekNumber} className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedWeeks.includes(w.weekNumber)}
                            onChange={() => handleContentCheck(w.weekNumber)}
                            className="mr-2 accent-blue-500"
                          />
                          <span className="text-gray-700 text-sm">{w.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded shadow font-bold hover:bg-blue-700 transition"
                onClick={handleGenerate}
                disabled={!selectedCourse || selectedWeeks.length === 0}
              >
                生成智能测评
              </button>
              <button
                className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded shadow font-bold hover:bg-gray-300 transition"
                onClick={handleRefresh}
                type="button"
              >
                刷新
              </button>
            </div>
            {/* 题目区 */}
            {questions.length > 0 && (
              <div className="space-y-6">
                {/* 进度条与题目切换 */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${((currentIdx+1)/questions.length)*100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{currentIdx+1}/{questions.length}</span>
                </div>
                {/* 单题卡片 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="font-bold text-blue-700 mb-2">题目{currentIdx+1}</div>
                  <div className="mb-4 text-gray-800">{questions[currentIdx].question}</div>
                  <div className="space-y-2">
                    {questions[currentIdx].options.map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        className={`block w-full text-left px-4 py-2 rounded border transition
                          ${answers[currentIdx] === optIdx ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-gray-300 hover:bg-blue-50'}`}
                        disabled={submitted}
                        onClick={() => handleAnswer(currentIdx, optIdx)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {/* 题目切换按钮和提交按钮合并逻辑 */}
                  <div className="flex justify-between mt-6">
                    <button
                      className="px-4 py-1 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                      onClick={goPrev}
                      disabled={currentIdx === 0}
                    >上一题</button>
                    {currentIdx < questions.length - 1 ? (
                      <button
                        className="px-4 py-1 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                        onClick={goNext}
                        disabled={currentIdx === questions.length-1}
                      >下一题</button>
                    ) : (
                      !submitted && answers.every(a => a !== null) ? (
                        <button
                          className="px-4 py-1 rounded bg-green-600 text-white font-bold shadow hover:bg-green-700 transition"
                          onClick={handleSubmit}
                        >提交测评</button>
                      ) : (
                        <button
                          className="px-4 py-1 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                          disabled
                        >提交测评</button>
                      )
                    )}
                  </div>
                </div>
                {/* 测评反馈区 */}
                {submitted && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-4">
                    <div className="font-bold text-blue-700 mb-1">测评结果</div>
                    <div className="mb-1">共{questions.length}题，答对{score}题，得分：{Math.round(score/questions.length*100)}分</div>
                    {wrongKnowledges.length > 0 ? (
                      <div className="text-gray-700 mt-2">
                        <span className="font-semibold">AI建议：</span>建议重点复习：
                        {wrongKnowledges.map((k, i) => <span key={i} className="text-blue-700 font-medium mx-1">{k}</span>)}，查漏补缺，提升掌握度。
                      </div>
                    ) : (
                      <div className="text-green-700 mt-2 font-semibold">恭喜全部答对，继续保持！</div>
                    )}
                  </div>
                )}
                {/* 测评报告区：每题讲解与对错 */}
                {submitted && (
                  <div className="space-y-4 mt-6">
                    <div className="text-lg font-bold text-blue-700 mb-2">📋 测评报告</div>
                    {questions.map((q, idx) => (
                      <div key={q.id} className={`rounded-lg shadow p-4 ${answers[idx] === q.answer ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'}`}>
                        <div className="font-bold text-gray-800 mb-1">题目{idx+1}：{q.question}</div>
                        <div className="mb-1">
                          <span className="font-medium">你的答案：</span>
                          <span className={answers[idx] === q.answer ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                            {typeof answers[idx] === 'number' ? q.options[answers[idx] as number] : '未作答'}
                          </span>
                          {answers[idx] === q.answer ? (
                            <span className="ml-2 text-green-600">✔ 正确</span>
                          ) : (
                            <span className="ml-2 text-red-600">✘ 错误</span>
                          )}
                        </div>
                        {answers[idx] !== q.answer && (
                          <div className="mb-1">
                            <span className="font-medium">正确答案：</span>
                            <span className="text-blue-700 font-bold">{q.options[q.answer]}</span>
                          </div>
                        )}
                        <div className="text-gray-700 text-sm mt-1"><span className="font-medium">讲解：</span>{q.explanation}</div>
                      </div>
                    ))}
                  </div>
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