"use client";

import React, { useCallback, useEffect, useState } from "react";

import ExamCard from "@/components/exam/exam-card";
import { useSearchParams } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { Exam } from "@/types";
import Link from "next/link";
import { PaginationCustom } from "@/components/pagination-custom";
import { SearchInput } from "@/components/ui/search-input";
import { debounce } from "lodash";


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
  const [searchTerm, setSearchTerm] = useState("");

  const fetchExamData = async (category: string, title: string, currentPage: number) => {
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
      } else {
        setExams([]);
      }
    } catch {
      setError("Error fetching exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamData(currentTab, searchTerm, page); //can be ""
  }, [currentTab, page, searchTerm]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchTerm(query);
    }, 300),
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <main className="container mx-auto px-6 py-8 bg-white shadow-sm rounded-2xl border border-slate-300">
      <div className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-semibold text-slate-700">Exams</h2>
          <SearchInput
            placeholder="Search exams..."
            onChange={(e) => debouncedSearch(e.target.value)}

          />
        </div>
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
