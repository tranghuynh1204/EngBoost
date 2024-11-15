// pages/exams/[examId].tsx
"use client";
import { CommentContainer } from "@/components/comment/comment-container";
import { ExamSection } from "@/components/exam/exam-section";
import { UserExamContainer } from "@/components/user-exam/user-exam-container";
import { Exam } from "@/types"; // Assume you have defined the Exam type here
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ExamIdPage = () => {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isEntireExamSelected, setIsEntireExamSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}`
        );
        setExam(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    if (params.examId) {
      fetchExam();
    }
  }, [params.examId]);

  const handleSelectSection = (id: string) => {
    if (selectedSections.includes(id)) {
      setSelectedSections(
        selectedSections.filter((sectionId) => sectionId !== id)
      );
    } else {
      setSelectedSections([...selectedSections, id]);
    }
  };

  const handleSelectEntireExam = () => {
    if (isEntireExamSelected) {
      setIsEntireExamSelected(false);
      setSelectedSections([]);
    } else {
      setIsEntireExamSelected(true);
      if (exam) {
        const allSectionIds = exam.sections.map((section) => section._id);
        setSelectedSections(allSectionIds);
      }
    }
  };

  const handleSubmitSelection = async () => {
    if (!exam) return;

    setIsSubmitting(true);
    setSubmissionResult(null);

    // Prepare query parameters
    const queryParams: any = { id: exam._id };
    if (!isEntireExamSelected && selectedSections.length > 0) {
      queryParams.sectionIds = selectedSections;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/practice`,
        {
          params: queryParams,
        }
      );
      setSubmissionResult("Practice mode started successfully!");

      // Optionally, redirect to the practice session page
      // For example:
      // router.push(`/practice/${response.data.practiceId}`);
    } catch (error: any) {
      console.error("Error submitting selection:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setSubmissionResult(`Error: ${error.response.data.message}`);
      } else {
        setSubmissionResult("Failed to start practice mode. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Thời gian làm bài: {exam.duration} phút | {exam.sectionCount}{" "}
                phần thi | {exam.questionCount} câu hỏi | {exam.commentCount}{" "}
                bình luận
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
              {/* Selection Controls */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={isEntireExamSelected}
                  onChange={handleSelectEntireExam}
                  className="mr-2"
                />
                <label className="text-lg text-gray-700">
                  Chọn toàn bộ đề thi
                </label>
              </div>
              <div className="flex flex-col space-y-4">
                {exam.sections.map((section) => (
                  <ExamSection
                    id={section._id}
                    name={section.name}
                    questionCount={section.questionCount}
                    tags={section.tags}
                    key={section._id}
                    isSelected={selectedSections.includes(section._id)}
                    onSelect={handleSelectSection}
                    disabled={isEntireExamSelected}
                  />
                ))}
              </div>
            </div>
            {/* Submit Button */}
            <div className="mb-6">
              <Button
                onClick={handleSubmitSelection}
                disabled={
                  isSubmitting ||
                  (!isEntireExamSelected && selectedSections.length === 0)
                }
                className="w-full"
              >
                {isSubmitting ? "Đang gửi..." : "Bắt đầu luyện tập"}
              </Button>
              {submissionResult && (
                <p className="mt-4 text-center text-green-600">
                  {submissionResult}
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="2">
            <div>
              <Button variant="link">
                <Link href={`/exams/${params.examId}/solutions`}>
                  Xem đáp án đề thi
                </Link>
              </Button>
            </div>
            <p className="mt-4">Các phần thi:</p>
            <ul className="list-disc list-inside">
              {exam.sections.map((section) => (
                <li key={section._id}>
                  {section.name}:
                  <Button variant="link" className="ml-2">
                    <Link
                      href={`/exams/${params.examId}/parts/${section._id}/solutions`}
                    >
                      Đáp án
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
