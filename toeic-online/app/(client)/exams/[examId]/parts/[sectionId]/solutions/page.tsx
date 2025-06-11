"use client";
import { Exam } from "@/types";
import axios from "axios";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import React, { useEffect, useState } from "react";
import { SolutionItem } from "@/components/solution/solution-item";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";

const SectionIdPage = () => {
  const params = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}/parts/${params.sectionId}/solutions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setExam(response.data);
      } catch (error: unknown)  {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.replace(`/login?next=${pathname}?${searchParams}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.examId) {
      fetchExam();
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (!exam) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-center mb-2">
          Đáp án/Transcript: {exam.title}
        </h1>
        <h2 className="text-xl text-gray-700 text-center">
          {exam.sections[0].name}
        </h2>
      </div>

      {/* Solution Items */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <SolutionItem groups={exam.sections[0].groups} />
      </div>
    </div>
  );
};

export default SectionIdPage;
