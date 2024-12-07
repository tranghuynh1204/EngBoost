"use client";

import { ExamChart } from "@/components/chart/exam-chart";
import { UserChart } from "@/components/chart/user-chart";
import { UserExamChart } from "@/components/chart/user-exam";

const AdminPage = () => {
  return (
    <div className="bg-[#F8F9FA] min-h-screen p-6 space-y-6">
      <h1 className="text-[#343A40] text-3xl font-bold mb-4">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <UserChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ExamChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <UserExamChart />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
