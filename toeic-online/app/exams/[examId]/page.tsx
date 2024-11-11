"use client";
import { CommentSection } from "@/components/comment/comment-section";
import { ExamSection } from "@/components/exam/exam-section";
import { Exam } from "@/types"; // Giả sử bạn đã định nghĩa kiểu Exam ở file này
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ExamIdPage = () => {
  const params = useParams();
  const [exam, setExam] = useState<Exam>(); // Kiểu Exam hoặc null khi chưa có dữ liệu
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}`
        );
        setExam(response.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    if (params.examId) {
      fetchExam();
    }
  }, [params.examId]); // useEffect phụ thuộc vào params.examId

  // Kiểm tra nếu exam không có dữ liệu
  if (!exam) {
    return <div>Loading...</div>; // Hoặc hiển thị một thông báo khi dữ liệu chưa được tải
  }

  return (
    <div>
      <div>
        <div>
          <span>#{exam.category}</span>
        </div>
        <h1>{exam.title}</h1>
        <ul>
          <li>Thông tin đề thi</li>
          <li>Đáp án/transcript</li>
        </ul>
        <div>
          <span></span>
          <span>Thời gian làm bài: {exam.duration} phút</span> |
          <span>{exam.sectionCount} phần thi</span> |
          <span>{exam.questionCount} câu hỏi</span> |
          <span>{exam.commentCount} bình luận</span>
        </div>
        <div>{exam.userCount} người đã luyện tập đề thi này</div>
        <div></div>
        <div>
          {exam.sections.map((section, index) => (
            <ExamSection
              id={section._id}
              name={section.name}
              questionCount={section.questionCount}
              tags={section.tags}
              key={index}
            />
          ))}
        </div>
      </div>
      <div>
        <CommentSection examId={params.examId as string} />
      </div>
    </div>
  );
};

export default ExamIdPage;
