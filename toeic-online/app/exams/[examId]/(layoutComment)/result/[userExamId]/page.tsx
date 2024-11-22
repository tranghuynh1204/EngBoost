"use client";
import { ResultSectionContainer } from "@/components/result/result-section-container";
import { Button } from "@/components/ui/button";
import { setMapGroup, setMapQuestion } from "@/lib/store/data-slice";
import { openModal } from "@/lib/store/modal-slice";
import { formatTime, UserExamResult } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CircleStackIcon,
} from "@heroicons/react/24/solid";

const UserExamIdPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [result, setResult] = useState<UserExamResult>();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}/result/${params.userExamId}`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzJmODVlNzA1MmY2YjhjM2QxODhkN2YiLCJuYW1lIjoibm9hZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwibW9kZXJhdG9yIl0sImlhdCI6MTczMjAzMDI2MywiZXhwIjoxNzMyNjM1MDYzfQ.mz-2rj4azAsW_vYmmtRFkItTzZhpO-W_DCEYvctdJ3Q`,
              "Content-Type": "application/json",
            },
          }
        );
        setResult(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    if (params.examId && params.userExamId) {
      fetchResult();
    }
  }, [params.examId, params.userExamId]);

  useEffect(() => {
    if (result) {
      dispatch(setMapQuestion(result.mapQuestion));
      dispatch(setMapGroup(result.mapGroup));
    }
  }, [result, dispatch]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <CircleStackIcon className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-gray-500 text-lg mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans text-gray-800">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-blue-600">
          Kết quả thi {result.exam.title}
        </h1>
      </header>

      {/* Result Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <span className="text-sm text-gray-500">Kết quả bài làm</span>
          <span className="mt-2 text-2xl font-bold text-green-600">
            {result.result} câu hỏi
          </span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <span className="text-sm text-gray-500">Thời gian hoàn thành</span>
          <span className="mt-2 text-2xl font-bold text-yellow-600">
            {formatTime(result.duration)}
          </span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <span className="text-sm text-gray-500">Trả lời đúng</span>
          <span className="mt-2 text-2xl font-bold text-green-600">
            {result.correct} câu hỏi
          </span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <span className="text-sm text-gray-500">Trả lời sai</span>
          <span className="mt-2 text-2xl font-bold text-red-600">
            {result.incorrect} câu hỏi
          </span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <span className="text-sm text-gray-500">Bỏ qua</span>
          <span className="mt-2 text-2xl font-bold text-yellow-600">
            {result.skipped}
          </span>
        </div>
        {Object.entries(result.mapSectionCategory).map(
          ([category, { correct, questionCount }]) => (
            <div
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
              key={category}
            >
              <span className="text-sm text-gray-500">{category}</span>
              <span className="mt-2 text-2xl font-bold text-yellow-600">
                {correct}/{questionCount}
              </span>
            </div>
          )
        )}
      </div>
      <div>
        <Button variant="link">
          <Link
            href={`/exams/${params.examId}/result/${params.userExamId}/details`}
          >
            Xem chi tiết đáp án
          </Link>
        </Button>
      </div>
      {/* Sections and Questions */}
      <ResultSectionContainer sections={result.sections} />

      <div className="mt-8 space-y-8">
        {result.sections.map((section, index) => {
          const serials = Array.from(
            { length: section.serialEnd - section.serialStart + 1 },
            (_, i) => section.serialStart + i
          );

          return (
            <div key={index}>
              <h2 className="text-2xl font-semibold text-indigo-600 mb-4 border-b-2 border-indigo-600 pb-2">
                {section.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {serials.map((serial) => (
                  <div
                    key={serial}
                    className="bg-gray-50 p-5 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-800">
                        Câu {serial}
                      </span>
                      {!result.mapQuestion[serial].answer ? (
                        <ClockIcon
                          className="h-6 w-6 font-medium text-yellow-500"
                          aria-hidden="true"
                        />
                      ) : result.mapQuestion[serial].answer ===
                        result.mapQuestion[serial].correctAnswer ? (
                        <CheckCircleIcon
                          className="h-6 w-6 font-medium text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <XCircleIcon
                          className="h-6 w-6 font-medium text-red-500"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Đáp án đúng:</strong>{" "}
                      {result.mapQuestion[serial].correctAnswer}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <strong>Câu trả lời:</strong>{" "}
                      {result.mapQuestion[serial].answer || "Chưa trả lời"}
                    </div>
                    <button
                      onClick={() =>
                        dispatch(
                          openModal({
                            type: "Answer",
                            data: {
                              group:
                                result.mapGroup[
                                  result.mapQuestion[serial].group
                                ],
                              question: result.mapQuestion[serial],
                            },
                          })
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      [Chi tiết]
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserExamIdPage;
