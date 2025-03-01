"use client";
import { Exam } from "@/types";
import axios from "axios";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useEffect, useState } from "react";
import { SolutionItem } from "@/components/solution/solution-item";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";

const SolutionsPage = () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}/solutions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setExam(response.data);
        console.log(response.data);
      } catch (error: any) {
        if (error.response.status === 401) {
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
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Đáp án/Transcript: {exam.title}
        </h1>
      </div>

      {/* Tabs Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <Tabs defaultValue={exam.sections[0].name} className="w-full">
          {/* Tabs List */}
          <TabsList className="flex flex-wrap justify-center mb-6">
            {exam.sections.map((section, index) => (
              <TabsTrigger
                value={section.name}
                key={index}
                className="px-4 py-2 m-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs Content */}
          {exam.sections.map((section, index) => (
            <TabsContent value={section.name} key={index} className="p-4">
              <SolutionItem groups={section.groups} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SolutionsPage;
