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
import { useToast } from "@/hooks/use-toast";
import { PiExport } from "react-icons/pi";
export const ExamList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null); // State for the file input
  const [updatingId, setUpdatingId] = useState<string | null>(null); // ID for updating an exam

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

  // Handle exam export
  const handleExport = async (examId: string) => {
    setExportingId(examId);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/export/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
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
      toast({
        title: "Export Successful",
        description: "Exam has been exported.",
        variant: "success",
      });
    } catch (err) {
      setError(`Failed to export exam with ID: ${examId}`);
    } finally {
      setExportingId(null);
    }
  };

  // Handle exam import
  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/exams`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setFile(null); // Reset the file input
      fetchExamData(); // Refresh the exam list
      toast({
        title: "Import Successful",
        description: "Exam imported successfully.",
        variant: "success",
      });
    } catch (err) {
      setError("Failed to import exam. Please try again.");
    }
  };

  // Handle exam update
  const handleUpdate = async () => {
    if (!file || !updatingId) {
      setError("Please select a file and select an exam to update.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/${updatingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      alert("Exam updated successfully.");
      setFile(null); // Reset the file input
      setUpdatingId(null); // Clear the updating ID
      fetchExamData(); // Refresh the exam list
    } catch (err) {
      setError("Failed to update exam. Please try again.");
    }
  };

  // Fetch exam data when component mounts or filters change
  useEffect(() => {
    fetchExamData();
  }, [category, title, startDate, endDate, currentPage]);
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        List of Exams
      </h1>

      {/* File Input for Import and Update */}
      <div className="mb-6 flex gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="file-input file-input-bordered file-input-primary"
        />
        <Button
          onClick={handleImport}
          className="text-white bg-gray-700"
          disabled={!file}
        >
          Import Exam
        </Button>
        <Button
          onClick={handleUpdate}
          className="bg-gray-600 text-white "
          disabled={!file || !updatingId}
        >
          Update Exam
        </Button>
      </div>

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
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && exams.length === 0 && (
        <p className="text-gray-600">No exams found.</p>
      )}

      {/* Exam Table */}
      {!loading && !error && exams.length > 0 && (
        <Table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-left">Title</TableHead>
              <TableHead className="px-4 py-3 text-left">Category</TableHead>
              <TableHead className="px-4 py-3 text-left">
                Duration (mins)
              </TableHead>
              <TableHead className="px-4 py-3 text-left">
                Question Count
              </TableHead>
              <TableHead className="px-4 py-3 text-left">Sections</TableHead>
              <TableHead className="px-4 py-3 text-left">Created At</TableHead>
              <TableHead className="px-4 py-3 text-left">Export</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam._id} className="border-t border-gray-100">
                <TableCell className="px-4 py-2">{exam.title}</TableCell>
                <TableCell className="px-4 py-2">{exam.category}</TableCell>
                <TableCell className="px-4 py-2">{exam.duration}</TableCell>
                <TableCell className="px-4 py-2">
                  {exam.questionCount}
                </TableCell>
                <TableCell className="px-4 py-2">{exam.sectionCount}</TableCell>
                <TableCell className="px-4 py-2">
                  {formatDate(
                    exam.createAt?.toString() ||
                      getDateFromObjectId(exam._id).toLocaleString()
                  )}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Button
                    onClick={() => handleExport(exam._id)}
                    disabled={exporting === exam._id}
                    className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:bg-gray-400"
                  >
                    {exporting === exam._id ? (
                      <span>Exporting...</span>
                    ) : (
                      <PiExport className="w-5 h-5" /> // Using the icon here
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} className="px-4 py-3 text-right">
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
