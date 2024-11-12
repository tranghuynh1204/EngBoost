import { UserExam } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface UserExamContainerProps {
  examId: string;
}

export const UserExamContainer = ({ examId }: UserExamContainerProps) => {
  const [userExams, setUserExams] = useState<UserExam[]>();
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user-exams/exam/${examId}`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzJmODVlNzA1MmY2YjhjM2QxODhkN2YiLCJuYW1lIjoibm9hZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwibW9kZXJhdG9yIl0sImlhdCI6MTczMTI0MjIyOSwiZXhwIjoxNzMxODQ3MDI5fQ.-_UYPlJhdXbwuoEO2HhW1oLb_RI0sLsz76IZUOwYLq0`,
            },
          }
        );
        setUserExams(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };
    fetchComments();
  }, [examId]);
  if (!userExams || userExams.length === 0) {
    return null;
  }
  return (
    <div>
      <h2>Kết quả làm bài của bạn:</h2>
      <table>
        <thead>
          <tr>
            <th>Ngày làm</th>
            <th>Kết quả</th>
            <th>Thời gian làm bài</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userExams.map((userExam, index) => (
            <tr key={index}>
              <td>{formatDate(userExam.startTime)}</td>
              <td>{userExam.result}</td>
              <td>{userExam.duration}</td>
              <td>
                <Link href={`/exams/${examId}/result/${userExam._id}`}>
                  Xem chi tiết
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
