import DashboardSidebar from "../../../main_sidebar/DashboardSidebar";
import { CourseMenu } from "../components/CourseMenu";
import { mockUserData } from "../../../mockdata/courseData";

export default function AssignmentsPage() {
  // 获取所有作业并按周数分组
  const assignmentsByWeek = mockUserData.course.weeks.map((week) => ({
    weekNumber: week.weekNumber,
    title: week.title,
    assignments: week.assignments,
  }));

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CourseMenu />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-4 max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">作业</h1>
              <div className="space-y-8">
                {assignmentsByWeek.map((week) => (
                  <div key={week.weekNumber} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                    <div className="text-xl font-semibold text-gray-900 mb-3">第 {week.weekNumber} 周：{week.title}</div>
                    <ul className="space-y-2">
                      {week.assignments.length === 0 ? <li className="text-gray-400 text-base">暂无作业</li> : week.assignments.map((assignment) => (
                        <li key={assignment.id} className="flex items-center justify-between text-base bg-white rounded px-4 py-2">
                          <span>{assignment.title}</span>
                          <div className="flex items-center gap-3">
                            {assignment.completed ? (
                              <span className="text-green-600 text-sm">得分：{assignment.score}</span>
                            ) : (
                              <span className="text-gray-400 text-sm">截止日期：{assignment.dueDate}</span>
                            )}
                            <span className={`text-sm ${assignment.completed ? 'text-green-600' : 'text-gray-400'}`}>{assignment.completed ? '已完成' : '未完成'}</span>
                            <button className="px-3 py-1 rounded bg-yellow-50 text-yellow-700 text-sm font-medium hover:bg-yellow-100 transition">{assignment.completed ? '查看' : '去完成'}</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 