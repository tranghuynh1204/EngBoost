"use client";

import { ExamChart } from "@/components/chart/exam-chart";
import { UserChart } from "@/components/chart/user-chart";
import { UserExamChart } from "@/components/chart/user-exam";

const AdminPage = () => {
  return (
    <div className=" ">
      <main className=" mx-auto px-6 py-6  ">
      <header className="mb-8">
          <h1 className="text-xl text-zinc-700 font-extrabold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            Deliver real-time alerts for new user registrations, exam additions,
            and user exam participation.
          </p>
        </header>
        <section className="bg-white p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <UserChart />
            </div>
            <div>
              <ExamChart />
            </div>
            <div>
              <UserExamChart />
            </div>
          </div>
        </section>
      </main>
     
    </div>
  );
};

export default AdminPage;
