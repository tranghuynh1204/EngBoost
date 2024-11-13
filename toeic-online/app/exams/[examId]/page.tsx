"use client";
import { CommentContainer } from "@/components/comment/comment-container";
import { ExamSection } from "@/components/exam/exam-section";
import { UserExamContainer } from "@/components/user-exam/user-exam-container";
import { Exam } from "@/types"; // Assume you have defined the Exam type here
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ExamIdPage = () => {
  const params = useParams();
  const [exam, setExam] = useState<Exam>();
  const [activeTab, setActiveTab] = useState<string>("info"); // State to manage active tab

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

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            {/* Tab: Thông tin đề thi */}
            <button
              className={`mr-4 pb-2 ${
                activeTab === "info"
                  ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Thông tin đề thi
            </button>
            {/* Tab: Transcript */}
            <button
              className={`pb-2 ${
                activeTab === "transcript"
                  ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("transcript")}
            >
              Transcript
            </button>
          </div>
          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "info" && (
              <div>
                <p className="text-gray-700 mb-2">
                  Thời gian làm bài: <strong>{exam.duration} phút</strong>
                </p>
                <p className="text-gray-700 mb-2">
                  Tổng số câu hỏi: <strong>{exam.questionCount}</strong>
                </p>
                <p className="text-gray-700">
                  Lượt luyện thi: <strong>{exam.userCount}</strong>
                </p>
              </div>
            )}
            {activeTab === "transcript" && (
              <div>
                {/* Assuming you have transcript data in exam.transcript */}
                {exam.transcript ? (
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                    {exam.transcript}
                  </pre>
                ) : (
                  <p className="text-gray-500">Transcript not available.</p>
                )}
              </div>
            )}
          </div>
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
      </div>

      {/* Comments Section */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <CommentContainer examId={params.examId as string} />
      </div>
    </div>
  );
};

export default ExamIdPage;
