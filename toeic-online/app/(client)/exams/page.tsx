"use client";

import React, { Suspense } from "react";

const ExamPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <main className="container mx-auto px-6 py-6 bg-white shadow-sm rounded-2xl border border-slate-300">
        <h2>Hello World</h2>
      </main>
    </div>
  );
};

const ExamPageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ExamPage />
  </Suspense>
);

export default ExamPageWithSuspense;