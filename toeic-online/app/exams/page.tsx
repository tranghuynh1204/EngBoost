"use client";

import React, { useEffect, useState } from "react";

import ExamCard from "../../components/exam/exam-card";
import { useSearchParams } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { Exam } from "@/types";
import Link from "next/link";

const ExamPage: React.FC = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const tab = searchParams.get("tab");
  const currentTab = tab || "toeic";

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Số lượng bài thi mỗi lần tải

  // Cấu hình Axios

  // Gọi API khi component mount hoặc khi currentTab, offset thay đổi
  useEffect(() => {
    async function fetchExamData(
      category: string,
      title: string,
      currentPage: number
    ) {
      setLoading(true);
      setError(null);
      try {
        const response: AxiosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/search`,
          {
            params: {
              category,
              title,
              currentPage,
              pageSize: 2,
            },
          }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setExams(response.data.data); // Use response.data.data for the array of exams
        } else {
          setExams([]);
        }
      } catch {
        setError("Lỗi khi gọi API");
      } finally {
        setLoading(false);
      }
    }

    fetchExamData("", "", page);
  }, [currentTab]);

  if (!exams) {
    return;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Danh sách Đề Thi
        </h1>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            // Loading Indicator
            <div className="col-span-full flex justify-center items-center">
              <svg
                className="animate-spin h-10 w-10 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            // Error Message
            <div className="col-span-full text-center text-red-500">
              {error}
            </div>
          ) : exams.length > 0 ? (
            // Exam Cards
            exams.map((exam) => (
              <Link
                key={exam._id}
                href={`/exams/${exam._id}`}
                className="block bg-[#FAF0E6] rounded-md shadow-sm p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <ExamCard exam={exam} />
              </Link>
            ))
          ) : (
            // No Exams Found
            <div className="col-span-full text-center text-gray-500">
              Không có đề thi nào.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExamPage;
