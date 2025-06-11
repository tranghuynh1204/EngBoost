// components/HistoryExams.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
import { HistoryResponse, UserExam } from "@/types"; // Ensure correct import paths
import UserExamCard from "./user-exam-card"; // Ensure correct import path
import { PaginationCustom } from "./pagination-custom";
import { TbHistoryToggle } from "react-icons/tb";
const HistoryExams: React.FC = () => {
  // State variables
  const [loading, setLoading] = useState<boolean>(true);
  const [exams, setExams] = useState<UserExam[]>([]); // Initialize as an empty array
  const [totalExams, setTotalExams] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(12); // Can be made dynamic if needed
  const [error, setError] = useState<string | null>(null);

  // Calculate total pages based on total exams and page size
  const totalPages = Math.ceil(totalExams / pageSize);

  // Function to fetch exams from the backend
  const fetchExams = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await axios.get<HistoryResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/user-exams/history`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            currentPage: page,
            pageSize: pageSize,
          },
        }
      );

      console.log("API Response:", response.data); // For debugging

      // Map API response to frontend expectations
      const fetchedExams = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setExams(fetchedExams);

      // Parse pagination values from strings to numbers
      const parsedCurrentPage = parseInt(response.data.currentPage, 10);
      const parsedPageSize = parseInt(response.data.pageSize, 10);

      setTotalExams(response.data.totalPages * parsedPageSize);
      setCurrentPage(!isNaN(parsedCurrentPage) ? parsedCurrentPage : 1);
    } catch (err: unknown) {
      console.error("Fetch Error:", err);
    
      let errorMessage = "An error occurred while fetching exam history.";
    
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
    
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exams on component mount and when currentPage changes
  useEffect(() => {
    fetchExams(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Handlers for pagination


  // Render loading state
  if (loading) {
    return <Loading />;
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchExams(currentPage)}>Retry</Button>
      </div>
    );
  }

  // Render not found state
  if (exams.length === 0) {
    return <NotFound />;
  }

  // Render exams as cards
  return (
    <div className="bg-white rounded-xl border border-slate-500 p-6 w-[1000px]">
      <div className="mt-5 mb-8">
        <h2 className="text-xl font-bold mb-1 text-gray-800">
          <button className="text-sky-600 bg-sky-50 px-3 py-2 rounded-lg mr-3 ">
            <TbHistoryToggle size={20} />
          </button>
          Exam History
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          Get a detailed overview of your past exam activities, including
          completed exams, scores, and performance trends over time.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
        {exams.map((userExam) => (
          <UserExamCard key={userExam._id} userExam={userExam} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <PaginationCustom currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default HistoryExams;
