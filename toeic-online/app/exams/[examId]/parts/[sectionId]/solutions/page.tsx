"use client";
import { Exam } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { SolutionItem } from "@/components/solution/solution-item";

const SectionIdPage = () => {
  const params = useParams();
  const [exam, setExam] = useState<Exam | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}/parts/${params.sectionId}/solutions`
        );
        setExam(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    if (params.examId) {
      fetchExam();
    }
  }, [params.examId, params.sectionId]);

  if (!exam)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Đáp án/Transcript: {exam.title}
        </h1>
        <h2 className="text-xl text-gray-700 text-center">
          {exam.sections[0].name}
        </h2>
      </div>

      {/* Solution Items */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <SolutionItem groups={exam.sections[0].groups} />
      </div>
    </div>
  );
};

export default SectionIdPage;
