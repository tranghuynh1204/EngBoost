"use client";
import { SolutionItem } from "@/components/solution/solution-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserExam } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const DetailResultPage = () => {
  const params = useParams();
  const [userExam, setUserExam] = useState<UserExam>();
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}/result/${params.userExamId}/details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setUserExam(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    if (params.examId && params.userExamId) {
      fetchResult();
    }
  }, [params.examId, params.userExamId]);
  if (!userExam) {
    return null;
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="text-2xl font-bold text-gray-800 mb-4">
        Đáp án/Transcript:{" "}
        <span className="text-indigo-600">{userExam.exam.title}</span>
      </div>

      {/* Tabs Component */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Tabs defaultValue={userExam.sections[0].name} className="space-y-4">
          {/* Tabs List */}
          <TabsList className="flex gap-4 border-b border-gray-200 pb-2">
            {userExam.sections.map((section, index) => (
              <TabsTrigger
                value={section.name}
                key={index}
                className="text-sm font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs Content */}
          {userExam.sections.map((section, index) => (
            <TabsContent
              value={section.name}
              key={index}
              className="mt-4 border-t border-gray-200 pt-4"
            >
              <SolutionItem {...section} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default DetailResultPage;
