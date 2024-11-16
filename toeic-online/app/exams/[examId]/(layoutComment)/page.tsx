// pages/exams/[examId].tsx
"use client";
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
    console.log("Submit button clicked");
    if (!exam) return;

    setIsSubmitting(true);
    setSubmissionResult(null);

    // Prepare the request body
    const requestBody: any = { id: exam._id };
    if (!isEntireExamSelected && selectedSections.length > 0) {
      requestBody.sectionIds = selectedSections;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/practice`,
        requestBody
      );

      // Extract the practiceSessionId from the response
      const practiceSessionId = response.data.practiceSessionId;

      if (!practiceSessionId) {
        setSubmissionResult(
          "Failed to start practice mode. No session ID returned."
        );
        setIsSubmitting(false);
        return;
      }
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
          <TabsList className="border-b border-gray-200 mb-4">
            <TabsTrigger
              value="1"
              className="px-4 py-2 text-lg font-medium text-gray-700 hover:text-blue-300 focus:outline-none focus:ring-2 "
            >
              Thông tin đề thi
            </TabsTrigger>
            <TabsTrigger
              value="2"
              className="px-4 py-2 text-lg font-medium text-gray-700 hover:text-blue-300 focus:outline-none focus:ring-2 "
            >
              Đáp án/Transcript
            </TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Chi tiết đề thi
                </h2>
                <p className="text-gray-700">
                  <span className="font-medium">Thời gian làm bài:</span>
                  {exam.duration} phút
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Phần thi:</span>
                  {exam.sectionCount} phần
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Câu hỏi:</span>
                  {exam.questionCount} câu
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Bình luận:</span>
                  {exam.commentCount} bình luận
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Người luyện:</span>
                  {exam.userCount} người
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
                  // onClick={handleSubmitSelection}
                  disabled={
                    isSubmitting ||
                    (!isEntireExamSelected && selectedSections.length === 0)
                  }
                  className="w-full"
                  variant="link"
                >
                  <Link
                    href={{
                      pathname: `/exams/${params.examId}/practice`,
                      query: {
                        sectionId: selectedSections,
                      },
                    }}
                  >
                    {isSubmitting ? "Đang gửi..." : "Bắt đầu luyện tập"}
                  </Link>
                </Button>
              </div>
              {submissionResult && (
                <p className="mt-4 text-center text-green-600">
                  {submissionResult}
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="2">
            <div className="space-y-4">
              {/* Solutions Overview */}
              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <Button
                  variant="link"
                  className="text-blue-600 hover:underline"
                >
                  <Link href={`/exams/${params.examId}/solutions`}>
                    Xem đáp án đề thi
                  </Link>
                </Button>
              </div>
              {/* Detailed Solutions */}
              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Đáp án Các Phần Thi
                </h2>
                <ul className="space-y-2">
                  {exam.sections.map((section) => (
                    <li
                      key={section._id}
                      className="flex items-center justify-between p-3 border rounded-md bg-white hover:shadow-sm"
                    >
                      <div className="text-gray-700">
                        <span className="font-medium">{section.name}</span>
                      </div>
                      <Button
                        variant="link"
                        className="text-blue-600 hover:underline text-sm font-semibold"
                      >
                        <Link
                          href={`/exams/${params.examId}/parts/${section._id}/solutions`}
                        >
                          Đáp án
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExamIdPage;
