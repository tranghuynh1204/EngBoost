// app/(client)/history/page.tsx
"use client";

import React from "react";
import HistoryExams from "@/components/history-exam"; // Correct import path

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <HistoryExams />
    </div>
  );
};

export default HistoryPage;
