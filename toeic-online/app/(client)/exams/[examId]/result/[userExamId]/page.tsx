"use client";
import { ResultSectionContainer } from "@/components/result/result-section-container";
import { Button } from "@/components/ui/button";
import { setMapGroup, setMapQuestion } from "@/lib/store/data-slice";
import { openModal } from "@/lib/store/modal-slice";
import { formatTime, UserExamResult } from "@/types";
import axios from "axios";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/solid";
import { GiSpellBook } from "react-icons/gi";
import { CommentContainer } from "@/components/comment/comment-container";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";

const UserExamIdPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [result, setResult] = useState<UserExamResult>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}/result/${params.userExamId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setResult(response.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          router.replace(`/login?next=${pathname}?${searchParams}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.examId && params.userExamId) {
      fetchResult();
    }
  }, []);

  useEffect(() => {
    if (result) {
      dispatch(setMapQuestion(result.mapQuestion));
      dispatch(setMapGroup(result.mapGroup));
    }
  }, [result, dispatch]);

  if (isLoading) {
    return <Loading />;
  }
  if (!result) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container bg-white shadow-sm border border-slate-400 rounded-2xl  mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-xl font-bold text-zinc-800">
          <span className="text-zinc-600">Exam results for </span> {result.exam.title}
          </h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Khung tổng hợp kết quả dưới dạng Todo List */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-8">
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {/* Kết quả bài làm */}
              <li className="flex items-center gap-x-3 justify-center border-b pb-4 mt-9 last:border-b-0">
                <CheckCircleIcon
                  className="h-6 w-6 text-emerald-500"
                  aria-hidden="true"
                />
                <div className="text-left">
                  <span className="block text-xl font-bold mb-1 text-gray-900">
                    {result.result}
                  </span>
                  <span className="text-sm text-gray-500">Correct Answer</span>
                </div>
              </li>

              <li className="flex items-center gap-x-3 justify-center border-b pb-4 last:border-b-0">
                <ClockIcon
                  className="h-6 w-6 text-amber-500"
                  aria-hidden="true"
                />
                <div className="text-left">
                  <span className="block text-xl font-bold mb-1 text-amber-600">
                    {formatTime(result.duration)}
                  </span>
                  <span className="text-sm text-gray-500">Exam Duration</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Trả lời đúng/sai/bỏ qua */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-8">
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {/* Trả lời đúng */}
              <li className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                <CheckCircleIcon
                  className="h-6 w-6 text-emerald-500"
                  aria-hidden="true"
                />
                <div>
                  <span className="text-sm text-gray-500">Correct answer</span>
                  <span className="block text-xl font-bold text-emerald-600">
                    {result.correct} question
                  </span>
                </div>
              </li>

              {/* Trả lời sai */}
              <li className="flex items-center space-x-4 border-b pb-4 last:border-b-0 ">
                <XCircleIcon
                  className="h-6 w-6 text-rose-500"
                  aria-hidden="true"
                />
                <div>
                  <span className="text-sm text-gray-500">Wrong answer</span>
                  <span className="block text-xl font-bold text-rose-600">
                    {result.incorrect} question
                  </span>
                </div>
              </li>

              {/* Bỏ qua */}
              <li className="flex items-center space-x-4">
                <MinusCircleIcon
                  className="h-6 w-6 text-zinc-500"
                  aria-hidden="true"
                />
                <div>
                  <span className="text-sm text-zinc-500">Skip</span>
                  <span className="block text-xl font-bold text-zinc-600">
                    {result.skipped} question
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Phân loại theo section */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-8">
            <ul className="space-y-4">
              {Object.entries(result.mapSectionCategory).map(
                ([category, { correct, questionCount }]) => (
                  <li
                    key={category}
                    className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center h-10 w-10 bg-blue-100 text-emerald-500 rounded-full">
                        <GiSpellBook className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="text-base font-medium text-gray-700">
                        {category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xl font-bold text-emerald-600">
                        {correct}
                      </span>
                      <span className="text-xs text-gray-500">
                        on {questionCount} question
                      </span>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div>
          <Button
            className="bg-emerald-800 text-sm text-white px-3 py-2 rounded-md  mb-5 hover:bg-emerald-900"
            variant="link"
          >
            <Link
              href={`/exams/${params.examId}/result/${params.userExamId}/details`}
            >
              Result Details
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
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold text-black mb-4">
                  {section.name}
                </h2>
                <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
                  {serials.map((serial) => {
                    const isCorrect =
                      result.mapQuestion[serial].answer ===
                      result.mapQuestion[serial].correctAnswer;
                    const isAnswered = !!result.mapQuestion[serial].answer;
                    const userAnswer =
                      result.mapQuestion[serial].answer || "Chưa trả lời";

                    return (
                      <div
                        key={serial}
                        className="flex items-start  text-gray-700 space-x-3"
                      >
                        {/* Số thứ tự câu hỏi */}
                        <span
                          className={`flex items-center justify-center rounded-2xl px-3 py-1 text-white font-semibold text-sm ${
                            isCorrect
                              ? "bg-[rgb(85,124,85)]"
                              : isAnswered
                              ? "bg-[rgb(250,112,112)]"
                              : "bg-gray-400"
                          }`}
                          style={{ width: "48px", height: "32px" }}
                        >
                          {serial}
                        </span>

                        {/* Nội dung câu hỏi và đáp án */}
                        <div className="flex-1">
                          <span>
                            <strong className="text-black">
                              {result.mapQuestion[serial].correctAnswer}
                            </strong>{" "}
                            :{" "}
                            <span
                              className={
                                isAnswered && !isCorrect ? " text-red-600" : ""
                              }
                            >
                              {userAnswer}
                            </span>
                          </span>
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
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-2"
                          >
                            [Chi tiết]
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CommentContainer />
    </div>
  );
};

export default UserExamIdPage;
