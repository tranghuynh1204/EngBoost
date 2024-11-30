"use client";

import { ExamChart } from "@/components/chart/exam-chart";
import { UserChart } from "@/components/chart/user-chart";
import { UserExamChart } from "@/components/chart/user-exam";

const AdminPage = () => {
  return (
    <div>
      <UserChart />
      <ExamChart />
      <UserExamChart />
    </div>
  );
};

export default AdminPage;
