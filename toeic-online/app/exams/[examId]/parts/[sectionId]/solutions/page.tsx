"use client";
import { Exam } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { SolutionItem } from "@/components/solution/solution-item";

const SectionIdPage = () => {
  const params = useParams();
  const [exam, setExam] = useState<Exam>();
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
  if (!exam) return null;

  return (
    <div>
      <div>Đáp án/Transcript:{exam.title}</div>
      <div>{exam.sections[0].name}</div>
      <div>
        <SolutionItem {...exam.sections[0]} />
      </div>
    </div>
  );
};

export default SectionIdPage;
