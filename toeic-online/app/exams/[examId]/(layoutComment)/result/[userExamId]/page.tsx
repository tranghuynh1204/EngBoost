"use client";
import { ResultSectionContainer } from "@/components/result/result-section-container";
import { Button } from "@/components/ui/button";
import { setMapGroup, setMapQuestion } from "@/lib/store/data-slice";
import { openModal } from "@/lib/store/modal-slice";
import { UserExamResult } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzJmODVlNzA1MmY2YjhjM2QxODhkN2YiLCJuYW1lIjoibm9hZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwibW9kZXJhdG9yIl0sImlhdCI6MTczMTI0MjIyOSwiZXhwIjoxNzMxODQ3MDI5fQ.-_UYPlJhdXbwuoEO2HhW1oLb_RI0sLsz76IZUOwYLq0`,
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
    return null;
  }
  return (
    <div>
      <h1>Kết quả thi {result.exam.title}</h1>
      <div>
        <div>
          <div>Kết quả bài làm {result.result} câu hỏi</div>
          <div>Thời gian hoàn thành {result.duration}</div>
        </div>
        <div>Trả lời đúng {result.correct} câu hỏi</div>
        <div>trả lời sai {result.incorrect} câu hỏi</div>
        <div>Bỏ qua {result.skipped}</div>
      </div>
      <ResultSectionContainer sections={result.sections} />
      <div>
        <Button variant="link" className="hover:no-underline">
          <Link
            href={`/exams/${params.examId}/result/${params.userExamId}/details`}
          >
            Xem đáp án chi tiết
          </Link>
        </Button>
      </div>
      <div>
        {result.sections.map((section, index) => {
          // Tạo mảng các số từ start đến end trong mỗi section
          const serials = Array.from(
            { length: section.serialEnd - section.serialStart + 1 },
            (_, i) => section.serialStart + i
          );

          return (
            <div key={index}>
              <h1>{section.name}</h1>
              <div>
                {serials.map((serial) => {
                  const question = { ...result.mapQuestion[serial] };
                  question.serial = serial.toString();
                  const group = result.mapGroup[question.group];
                  const answerStatus =
                    question.answer === "" ? (
                      <span>⏭️</span> // Icon "bỏ qua"
                    ) : question.answer === question.correctAnswer ? (
                      <span>✔️</span> // Icon "đúng"
                    ) : (
                      <span>❌</span>
                    ); // Icon "sai"
                  return (
                    <div key={serial}>
                      <span>{serial}</span>
                      <span>{question.correctAnswer}:</span>
                      <span>{question.answer || "chưa trả lời"}</span>
                      <span>{answerStatus}</span>
                      <button
                        onClick={() => {
                          dispatch(
                            openModal({
                              type: "Answer",
                              data: { group, question },
                            })
                          );
                        }}
                      >
                        [chi tiết]
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserExamIdPage;
