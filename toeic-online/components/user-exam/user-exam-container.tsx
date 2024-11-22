import { formatTime, UserExam } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzJmODVlNzA1MmY2YjhjM2QxODhkN2YiLCJuYW1lIjoibm9hZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwibW9kZXJhdG9yIl0sImlhdCI6MTczMjAzMDI2MywiZXhwIjoxNzMyNjM1MDYzfQ.mz-2rj4azAsW_vYmmtRFkItTzZhpO-W_DCEYvctdJ3Q`,
            },
          }
        );
        setUserExams(response.data);
      } catch (error) {
        console.log("Error fetching exam data:", error.response.data.message);
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ngày làm</TableHead>
            <TableHead>Kết quả</TableHead>
            <TableHead>Thời gian làm bài</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userExams.map((userExam) => (
            <TableRow key={userExam._id}>
              <TableCell className="font-medium">
                {formatDate(userExam.startTime)}
              </TableCell>
              <TableCell>{userExam.result}</TableCell>
              <TableCell>{formatTime(userExam.duration)}</TableCell>
              <TableCell className="text-right">
                <Button variant="link">
                  <Link href={`/exams/${examId}/result/${userExam._id}`}>
                    Xem chi tiết
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
