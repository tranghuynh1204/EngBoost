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
const HistoryExams: React.FC = () => {
  // State variables
  const [loading, setLoading] = useState<boolean>(true);
  const [exams, setExams] = useState<UserExam[]>([]); // Initialize as an empty array
  const [totalExams, setTotalExams] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // Can be made dynamic if needed
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
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching exam history."
      );
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
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

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
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Exam History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
