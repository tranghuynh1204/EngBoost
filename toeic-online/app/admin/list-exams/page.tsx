"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDate } from "@/types";
import { Exam } from "@/types";
import { getDateFromObjectId } from "@/lib/utils";
import { PaginationCustom } from "@/components/pagination-custom";
import { TitleSearch } from "@/components/list-exam/title-search";
import { CategoryFilter } from "@/components/list-exam/category-filter";
import { DateFilter } from "@/components/list-exam/date-filter";
import { Button } from "@/components/ui/button";

export const ExamList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [exportingId, setExportingId] = useState<string | null>(null);
  // State management for filters, pagination, and data
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  // Derived state for unique categories
  const uniqueCategories = useMemo(() => {
    return Array.from(
      new Set(exams.map((exam) => exam.category).filter(Boolean))
    );
  }, [exams]);

  // Update query parameters in the URL
  const updateQuery = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      value ? params.set(key, String(value)) : params.delete(key);
    });
    router.push(`?${params.toString()}`);
  };

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/search`,
          {
            params: {
              category,
              title,
              startDate,
              endDate,
              currentPage,
              pageSize: 8,
            },
          }
        );

        if (data?.data) {
          setExams(data.data);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        } else {
          setExams([]);
        }
      } catch (err) {
        setError("Failed to fetch exam data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [category, title, startDate, endDate, currentPage]);

  // Export an exam by its ID
  // Export a specific exam by ID
  const handleExport = async (examId: string) => {
    setExportingId(examId);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/export/${examId}`,
        {
          responseType: "blob", // Ensure response is treated as a file
        }
      );

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `exam_${examId}.xlsx`; // Dynamically name the exported file
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError(`Failed to export exam with ID: ${examId}`);
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="p-6 bg-[#F8F9FA] rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-[#212529] mb-4">
        List of Exams
      </h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <TitleSearch
          onSearch={(searchTitle) =>
            updateQuery({ title: searchTitle, page: 1 })
          }
          initialValue={title}
        />
        <CategoryFilter
          categories={uniqueCategories}
          selectedCategory={category}
          onSelect={(selectedCategory) =>
            updateQuery({ category: selectedCategory, page: 1 })
          }
        />
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onSelect={(start, end) =>
            updateQuery({ startDate: start, endDate: end, page: 1 })
          }
        />
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-gray-600">Loading exams...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && exams.length === 0 && (
        <p className="text-gray-600">No exams found.</p>
      )}

      {/* Exam Table */}
      {!loading && !error && exams.length > 0 && (
        <Table className="bg-white border border-[#E9ECEF]">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration (mins)</TableHead>
              <TableHead>Question Count</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Export</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam._id}>
                <TableCell>{exam.title}</TableCell>
                <TableCell>{exam.category}</TableCell>
                <TableCell>{exam.duration}</TableCell>
                <TableCell>{exam.questionCount}</TableCell>
                <TableCell>{exam.sectionCount}</TableCell>
                <TableCell>
                  {exam.createAt
                    ? formatDate(exam.createAt.toString())
                    : getDateFromObjectId(exam._id).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleExport(exam._id)}
                    disabled={exporting === exam._id}
                    className="px-3 py-1 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:bg-gray-400"
                  >
                    {exporting === exam._id ? "Exporting..." : "Export"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} className="text-right">
                Page {currentPage} of {totalPages}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationCustom currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
};

export default ExamList;
