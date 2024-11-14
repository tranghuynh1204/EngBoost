"use client";
import { Exam } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useEffect, useState } from "react";
import { SolutionItem } from "@/components/solution/solution-item";

const SolutionsPage = () => {
  const params = useParams();
  const [exam, setExam] = useState<Exam>();
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}/solutions`
        );
        setExam(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    if (params.examId) {
      fetchExam();
    }
  }, [params.examId]);
  if (!exam) return null;
  return (
    <div>
      <div>Đáp án/Transcript:{exam.title}</div>
      <div>
        <Tabs defaultValue={exam.sections[0].name}>
          <TabsList>
            {exam.sections.map((section, index) => (
              <TabsTrigger value={section.name} key={index}>
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {exam.sections.map((section, index) => (
            <TabsContent value={section.name} key={index}>
              <SolutionItem {...section} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SolutionsPage;
