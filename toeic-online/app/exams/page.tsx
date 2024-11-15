// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import ExamCard from "../../components/exam/exam-card";
import { useSearchParams } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { Exam } from "@/types";

const ExamPage: React.FC = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const currentTab = tab || "toeic";

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const limit = 10; // Số lượng bài thi mỗi lần tải

  // Cấu hình Axios

  // Gọi API khi component mount hoặc khi currentTab, offset thay đổi
  useEffect(() => {
    async function fetchExamData(
      category: string,
      title: string,
      currentPage = 1,
      pageSize = 10
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
              pageSize,
            },
          }
        );
        console.log(response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setExams(response.data.data); // Use response.data.data for the array of exams
        } else {
          setExams([]);
          console.error("API response data is not an array");
        }
      } catch (error) {
        setError("Lỗi khi gọi API");
        console.error("Lỗi khi gọi API:", error);
        setExams([]); // Reset exams to avoid map error
      } finally {
        setLoading(false);
      }
    }

    fetchExamData("", "", 0, 10);
  }, [currentTab, offset]);

  // Xử lý tìm kiếm
  const handleSearch = (newOffset: number = 0) => {
    setOffset(newOffset);
  };

  // Xử lý phân trang
  const handleNextPage = () => {
    setOffset(offset + limit);
  };

  const handlePrevPage = () => {
    setOffset(Math.max(offset - limit, 0));
  };

  if (!exams) {
    return;
  } else {
    console.log(exams);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

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
              <div
                key={exam._id}
                className="bg-[#FAF0E6] rounded-md shadow-sm p-2 hover:shadow-md transition-shadow duration-300"
                style={{ width: "200px", height: "150px" }}
              >
                <ExamCard exam={exam} />
              </div>
            ))
          ) : (
            // No Exams Found
            <div className="col-span-full text-center text-gray-500">
              Không có đề thi nào.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && exams.length > 0 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={offset === 0}
              className={`px-5 py-2 rounded-md text-white ${
                offset === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition-colors duration-200`}
            >
              Trước
            </button>
            <button
              onClick={handleNextPage}
              disabled={exams.length < limit}
              className={`px-5 py-2 rounded-md text-white ${
                exams.length < limit
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition-colors duration-200`}
            >
              Tiếp theo
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamPage;
