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
          "http://localhost:8080/exams/search",
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

  return (
    <div>
      <Header />

      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4"></h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <ExamCard key={exam._id} exam={exam} />
          ))}
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={offset === 0}
            className={`px-4 py-2 rounded ${
              offset === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Trước
          </button>
          <button
            onClick={handleNextPage}
            disabled={exams.length < limit}
            className={`px-4 py-2 rounded ${
              exams.length < limit
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Tiếp theo
          </button>
        </div>
      </main>
    </div>
  );
};

export default ExamPage;
