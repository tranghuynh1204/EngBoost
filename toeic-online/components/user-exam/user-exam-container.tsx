import { formatDate, formatTime, UserExam } from "@/types";
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
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setUserExams(response.data);
      } catch (error: unknown) {}
    };
    fetchComments();
  }, [examId]);
  if (!userExams || userExams.length === 0) {
    return null;
  }
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 mt-8">
      <h2 className="font-bold text-gray-800 mb-4">Kết quả làm bài của bạn:</h2>

      <Table className="w-full text-left">
        <TableHeader>
          <TableRow className="border-b border-gray-100">
            <TableHead className="px-4 py-2 text-gray-600">Ngày làm</TableHead>
            <TableHead className="px-4 py-2 text-gray-600">Kết quả</TableHead>
            <TableHead className="px-4 py-2 text-gray-600">
              Thời gian làm bài
            </TableHead>
            <TableHead className="px-4 py-2 text-gray-600"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userExams.map((userExam) => (
            <TableRow
              key={userExam._id}
              className="hover:bg-gray-100 border-b border-gray-200"
            >
              <TableCell className="px-4 py-2 font-medium text-gray-800">
                {formatDate(userExam.startTime)}
              </TableCell>
              <TableCell className="px-4 py-2 text-gray-700">
                {userExam.result}
              </TableCell>
              <TableCell className="px-4 py-2 text-gray-700">
                {formatTime(userExam.duration)}
              </TableCell>
              <TableCell className="px-4 py-2 text-right">
                <Button
                  variant="link"
                  className="text-blue-600 hover:underline"
                >
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
