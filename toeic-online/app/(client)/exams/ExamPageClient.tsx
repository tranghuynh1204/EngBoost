// app/exams/ExamPageClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Exam } from "@/types";
import ExamCard from "@/components/exam/exam-card";
import Link from "next/link";
import { PaginationCustom } from "@/components/pagination-custom";
import { SearchInput } from "@/components/ui/search-input";
import { debounce } from "lodash";
import axios from "axios";

interface ExamPageClientProps {
  initialExams: Exam[];
  initialPage: number;
  initialTotalPages: number;
  initialSearchTerm: string;
  initialTab: string;
}

const ExamPageClient: React.FC<ExamPageClientProps> = ({
  initialExams,
  initialPage,
  initialTotalPages,
  initialSearchTerm,
  initialTab,
}) => {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [loading, setLoading] = useState(false);

  const fetchExams = async (page: number, search: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/search`,
        {
          params: {
            category: "", // Use initialTab if needed
            title: search,
            currentPage: page,
            pageSize: 15,
          },
        }
      );
      setExams(response.data.data || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchTerm(query);
      fetchExams(1, query); // Reset to page 1 on new search
    }, 300),
    []
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchExams(newPage, searchTerm);
  };

  // Sync client state with initial props if they change (e.g., via navigation)
  useEffect(() => {
    setExams(initialExams);
    setCurrentPage(initialPage);
    setTotalPages(initialTotalPages);
    setSearchTerm(initialSearchTerm);
  }, [initialExams, initialPage, initialTotalPages, initialSearchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <main className="container mx-auto px-6 py-6 bg-white shadow-sm rounded-2xl border border-slate-300">
        <div className="flex justify-between items-center pb-6">
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
            <PaginationCustom
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamPageClient;