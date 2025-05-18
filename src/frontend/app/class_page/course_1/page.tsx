import DashboardSidebar from "../../main_sidebar/DashboardSidebar";
import { CourseMenu } from "./components/CourseMenu";
import { mockCourseData, mockUserData } from "../../mockdata/courseData";

export default function CoursePage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CourseMenu />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-2 py-4 max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{mockCourseData.title}</h1>
              <p className="text-gray-600 mb-4">{mockCourseData.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">课程进度</h3>
                  <p className="text-xl font-bold text-blue-600">{mockUserData.progress}%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-green-800 mb-1">当前周数</h3>
                  <p className="text-xl font-bold text-green-600">第 {mockUserData.course.currentWeek} 周</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-purple-800 mb-1">总周数</h3>
                  <p className="text-xl font-bold text-purple-600">{mockCourseData.totalWeeks} 周</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">本周学习内容</h2>
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {mockUserData.course.weeks[mockUserData.course.currentWeek - 1].title}
                  </h3>
                  <p className="text-gray-600">
                    {mockUserData.course.weeks[mockUserData.course.currentWeek - 1].summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 