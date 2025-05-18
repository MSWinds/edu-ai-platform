import DashboardSidebar from "../../../main_sidebar/DashboardSidebar";
import { CourseMenu } from "../components/CourseMenu";
import { mockUserData } from "../../../mockdata/courseData";

// 合并所有作业和测验为一个表格
const allItems = mockUserData.course.weeks.flatMap((week) => [
  ...week.assignments.map((a) => ({
    type: '作业',
    week: week.weekNumber,
    title: a.title,
    dueDate: a.dueDate || '-',
    submitted: a.completed ? '已提交' : '-',
    status: a.completed ? '已完成' : '未完成',
    score: a.completed ? (a.score !== undefined ? a.score : '-') : '-',
    maxScore: a.score !== undefined ? a.score : '-',
  })),
  week.quiz && {
    type: '堂测',
    week: week.weekNumber,
    title: week.quiz.title,
    dueDate: week.quiz.dueDate || '-',
    submitted: week.quiz.completed ? '已提交' : '-',
    status: week.quiz.completed ? '已完成' : '未完成',
    score: week.quiz.completed ? (week.quiz.score !== undefined ? week.quiz.score : '-') : '-',
    maxScore: week.quiz.score !== undefined ? week.quiz.score : '-',
  },
].filter(Boolean));

export default function GradesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CourseMenu />
        <main className="flex-1 overflow-x-auto bg-gray-100">
          <div className="container mx-auto px-2 py-4 max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">成绩</h1>
              <div className="overflow-x-auto">
                <table className="min-w-full text-base border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-gray-500 font-semibold text-base">
                      <th className="px-4 py-2 text-left">名称</th>
                      <th className="px-4 py-2 text-left">类型</th>
                      <th className="px-4 py-2 text-left">周次</th>
                      <th className="px-4 py-2 text-left">截止时间</th>
                      <th className="px-4 py-2 text-left">提交</th>
                      <th className="px-4 py-2 text-left">状态</th>
                      <th className="px-4 py-2 text-left">得分</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allItems.map((item, idx) => (
                      <tr key={idx} className="bg-gray-50 hover:bg-blue-50 rounded-xl">
                        <td className="px-4 py-2 font-medium text-blue-800 whitespace-nowrap">{item.title}</td>
                        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{item.type}</td>
                        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">第{item.week}周</td>
                        <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{item.dueDate}</td>
                        <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{item.submitted}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.status === '已完成' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>{item.status}</span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.score !== '-' ? (
                            <span className="inline-flex items-center text-base font-bold text-blue-600">{item.score}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 