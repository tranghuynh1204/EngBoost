"use client";

import React, { useEffect, useState } from "react";

import ExamCard from "@/components/exam/exam-card";
import { useSearchParams } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { Exam } from "@/types";
import Link from "next/link";
import { PaginationCustom } from "@/components/pagination-custom";

const ExamPage: React.FC = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const tab = searchParams.get("tab");
  const currentTab = tab || "toeic";
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
              pageSize: 15,
            },
          }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setExams(response.data.data);
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
          // Use response.data.data for the array of exams
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
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Exam List
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary border-opacity-75"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-600">{error}</div>
          ) : exams.length > 0 ? (
            exams.map((exam) => (
              <Link key={exam._id} href={`/exams/${exam._id}`} className="block">
                <ExamCard exam={exam} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No exams available.
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-6">
            <PaginationCustom currentPage={currentPage} totalPages={totalPages} />
          </div>
        )}
      </main>
    </div>
  );
};
export default ExamPage;
