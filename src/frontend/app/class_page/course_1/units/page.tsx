'use client';
import DashboardSidebar from "../../../main_sidebar/DashboardSidebar";
import { CourseMenu } from "../components/CourseMenu";
import { mockUserData } from "../../../mockdata/courseData";
import { useState } from "react";
import VideoPlayerPopup from "./components/VideoPlayerPopup";
import ExercisePopup from "./components/ExercisePopup";

export default function UnitsPage() {
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [isExercisePopupOpen, setIsExercisePopupOpen] = useState(false);
  const [currentExerciseWeek, setCurrentExerciseWeek] = useState<number | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([7]); // 默认展开第7周
  const week7 = mockUserData.course.weeks[6]; // Week 7 is at index 6

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNumber) 
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const handleOpenExercise = (weekNumber: number) => {
    setCurrentExerciseWeek(weekNumber);
    setIsExercisePopupOpen(true);
  };

  const handleCloseExercise = () => {
    setIsExercisePopupOpen(false);
    setCurrentExerciseWeek(null);
  };

  const handleOpenExerciseFromVideo = () => {
    handleOpenExercise(7); // 从视频内容进入第7周课堂练习
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CourseMenu />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-4 max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">学习单元</h1>
              <div className="space-y-4">
                {mockUserData.course.weeks.map((week) => (
                  <div key={week.weekNumber} className="rounded-xl border border-gray-100 bg-gray-50">
                    <div 
                      className="flex items-center justify-between p-6 cursor-pointer"
                      onClick={() => toggleWeek(week.weekNumber)}
                    >
                      <div className="text-xl font-semibold text-gray-900">第 {week.weekNumber} 周：{week.title}</div>
                      <div className="flex items-center gap-4">
                        <span className={`text-base rounded-full px-3 py-1 ${week.completed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                          {week.completed ? '已完成' : '未完成'}
                        </span>
                        <span className="text-sm text-gray-400">进度 {week.progress}%</span>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 text-gray-500 transition-transform ${expandedWeeks.includes(week.weekNumber) ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {expandedWeeks.includes(week.weekNumber) && (
                      <div className="px-6 pb-6">
                        <div className="flex flex-col gap-4">
                          {/* 课程内容 */}
                          <div>
                            <div className="text-lg font-medium text-gray-700 mb-2">课程内容</div>
                            <ul className="space-y-2">
                              {week.videos.length === 0 ? <li className="text-gray-400 text-base">暂无视频</li> : week.videos.map(video => (
                                <li key={video.id} className="flex items-center justify-between text-base bg-white rounded px-4 py-2">
                                  <span>{video.title}</span>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm ${video.completed ? 'text-green-600' : 'text-gray-400'}`}>{video.completed ? '已完成' : '未完成'}</span>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        week.weekNumber === 7 ? setIsVideoPlayerOpen(true) : undefined;
                                      }}
                                      className="px-3 py-1 rounded bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
                                    >
                                      观看
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* 作业 */}
                          <div>
                            <div className="text-lg font-medium text-gray-700 mb-2">作业</div>
                            <ul className="space-y-2">
                              {week.assignments.length === 0 ? <li className="text-gray-400 text-base">暂无作业</li> : week.assignments.map(ass => (
                                <li key={ass.id} className="flex items-center justify-between text-base bg-white rounded px-4 py-2">
                                  <span>{ass.title}</span>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm ${ass.completed ? 'text-green-600' : 'text-gray-400'}`}>{ass.completed ? '已完成' : '未完成'}</span>
                                    <button 
                                      onClick={(e) => e.stopPropagation()}
                                      className="px-3 py-1 rounded bg-yellow-50 text-yellow-700 text-sm font-medium hover:bg-yellow-100 transition"
                                    >
                                      去完成
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* 堂测 */}
                          <div>
                            <div className="text-lg font-medium text-gray-700 mb-2">堂测</div>
                            <ul className="space-y-2">
                              {week.quiz ? (
                                <li className="flex items-center justify-between text-base bg-white rounded px-4 py-2">
                                  <span>{week.quiz.title}</span>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm ${week.quiz.completed ? 'text-green-600' : 'text-gray-400'}`}>{week.quiz.completed ? '已完成' : '未完成'}</span>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenExercise(week.weekNumber);
                                      }}
                                      className="px-3 py-1 rounded bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 transition"
                                    >
                                      开始测验
                                    </button>
                                  </div>
                                </li>
                              ) : <li className="text-gray-400 text-base">暂无堂测</li>}
                            </ul>
                          </div>
                          {/* 学习资料 */}
                          <div>
                            <div className="text-lg font-medium text-gray-700 mb-2">学习资料</div>
                            <ul className="space-y-2">
                              {week.resources.map(res => (
                                <li key={res.id} className="flex items-center justify-between text-base bg-white rounded px-4 py-2">
                                  <span>{res.title}</span>
                                  <button 
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-3 py-1 rounded bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition"
                                  >
                                    下载
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Video Player Popup */}
      {week7.sections && (
        <VideoPlayerPopup
          isOpen={isVideoPlayerOpen}
          onClose={() => setIsVideoPlayerOpen(false)}
          sections={week7.sections}
          onOpenExercise={handleOpenExerciseFromVideo}
        />
      )}

      {/* Exercise Popup */}
      {currentExerciseWeek && (
        <ExercisePopup
          isOpen={isExercisePopupOpen}
          onClose={handleCloseExercise}
          weekNumber={currentExerciseWeek}
          exerciseTitle={mockUserData.course.weeks.find(w => w.weekNumber === currentExerciseWeek)?.quiz?.title || "课堂练习"}
        />
      )}
    </div>
  );
} 