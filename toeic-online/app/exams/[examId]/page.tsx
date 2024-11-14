"use client";
import { CommentContainer } from "@/components/comment/comment-container";
import { ExamSection } from "@/components/exam/exam-section";
import { UserExamContainer } from "@/components/user-exam/user-exam-container";
import { Exam } from "@/types"; // Assume you have defined the Exam type here
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ExamIdPage = () => {
  const params = useParams();
  const [exam, setExam] = useState<Exam>();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}`
        );
        setExam(response.data); // Store data in state
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    if (params.examId) {
      fetchExam();
    }
  }, [params.examId]); // useEffect depends on params.examId

  // Show a loading state if exam data is not yet available
  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* White Frame Container */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Exam Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              #{exam.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {exam.title}
          </h1>
        </div>
        <Tabs defaultValue="1">
          <TabsList>
            <TabsTrigger value="1">Thông tin đề thi</TabsTrigger>
            <TabsTrigger value="2">Đáp án/Transcript</TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <div>
              <p className="text-gray-700 mb-2">
                Thời gian làm bài:
                {exam.duration} phút |{exam.sectionCount} phần thi|
                {exam.questionCount} câu hỏi|
                {exam.commentCount} bình luận
              </p>
              <p className="text-gray-700 mb-2">
                {exam.userCount} người đã luyện đề thi này
              </p>
            </div>
            {/* User Exam Container */}
            <div className="mb-6">
              <UserExamContainer examId={params.examId as string} />
            </div>
            {/* Exam Sections */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Các Phần Thi
              </h2>
              <div className="flex flex-col space-y-4">
                {exam.sections.map((section, index) => (
                  <ExamSection
                    id={section._id}
                    name={section.name}
                    questionCount={section.questionCount}
                    tags={section.tags}
                    key={index}
                  />
                ))}
              </div>
            </div>
            ;{/* Comments Section */}
            <div className="mt-6 bg-white shadow-md rounded-lg p-6">
              <CommentContainer examId={params.examId as string} />
            </div>
            ;
          </TabsContent>
          <TabsContent value="2">
            <div>
              <Button variant="link">
                <Link href={`/exams/${params.examId}/solutions`}>
                  Xem đáp án đề thi
                </Link>
              </Button>
            </div>
            <p>các phần thi</p>
            <ul>
              {exam.sections.map((section, index) => (
                <li key={index}>
                  {section.name}:
                  <Button variant="link">
                    <Link
                      href={`/exams/${params.examId}/parts/${section._id}/solutions`}
                    >
                      Đán án
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExamIdPage;
