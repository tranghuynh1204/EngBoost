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
import { TbCornerRightDown } from "react-icons/tb"
interface UserExamContainerProps {
  examId: string;
}

export const UserExamContainer = ({ examId }: UserExamContainerProps) => {
  const [userExams, setUserExams] = useState<UserExam[] | null>(null);

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
      } catch {
        setUserExams([]);
      }
    };
    fetchComments();
  }, [examId]);

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-slate-100 to-slate-50 p-6 border border-slate-400 rounded-md shadow-sm ">
      <h2 className="font-bold text-gray-800  text-center mb-4">
        Your Test Results
      </h2>
      {userExams && userExams.length > 0 ? (
        <div className="overflow-auto h-[210px]">
          <Table className="w-full text-sm text-left ">
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-white ">
                <TableHead className="px-4 py-2 text-gray-600">Date</TableHead>
                <TableHead className="px-4 py-2 text-gray-600">
                  Result
                </TableHead>
                <TableHead className="px-4 py-2 text-gray-600">
                  Duration
                </TableHead>
                <TableHead className="px-4 py-2 text-gray-600"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userExams.map((userExam, index) => (
                <TableRow
                  key={userExam._id}
                  className={`border-b border-slate-400 ${
                    index % 2 !== 0 ? "bg-white" : "bg-slate-50"
                  }`}
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
                      className="text-cyan-600 text-xs hover:underline"
                    >
                      <Link href={`/exams/${examId}/result/${userExam._id}`}>
                        Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center  h-[230px] py-4">
          <p className="text-gray-700 mt-10 text-sm">
            You have not taken any practice tests for this exam yet.
          </p>
          <Button
            className="mt-3 bg-cyan-700 text-white text-xs px-3 py-0.5 rounded-md hover:bg-cyan-800"
            onClick={() => {
              const sectionElement = document.getElementById("exam-sections");
              sectionElement?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Start Now <TbCornerRightDown></TbCornerRightDown>
          </Button>
        </div>
      )}
    </div>
  );
};
