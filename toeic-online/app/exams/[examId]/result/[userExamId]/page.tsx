"use client";
import { ResultSectionContainer } from "@/components/result/result-section-container";
import { setMapGroup, setMapQuestion } from "@/lib/store/data-slice";
import { UserExamResult } from "@/types";
import axios from "axios";
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

  if (!result) {
    return null;
  } else {
    dispatch(setMapQuestion(result.mapQuestion));
    dispatch(setMapGroup(result.mapGroup));
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
    </div>
  );
};

export default UserExamIdPage;
