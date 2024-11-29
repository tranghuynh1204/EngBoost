"use client";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
import { SolutionItem } from "@/components/solution/solution-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserExam } from "@/types";
import axios from "axios";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";

const DetailResultPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [userExam, setUserExam] = useState<UserExam>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}/result/${params.userExamId}/details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setUserExam(response.data);
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
  if (isLoading) {
    return <Loading />;
  }
  if (!userExam) {
    return <NotFound />;
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="text-2xl font-bold text-gray-800 mb-4">
        Đáp án/Transcript:{" "}
        <span className="text-blue-600">{userExam.exam.title}</span>
      </div>

      {/* Tabs Component */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Tabs defaultValue={userExam.sections[0].name} className="space-y-4">
          {/* Tabs List */}
          <TabsList className="flex gap-4 border-b border-gray-200 pb-2">
            {userExam.sections.map((section, index) => (
              <TabsTrigger
                value={section.name}
                key={index}
                className="px-4 py-2 font-medium text-gray-700 hover:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 data-[state=active]:font-bold"
              >
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs Content */}
          {userExam.sections.map((section, index) => (
            <TabsContent
              value={section.name}
              key={index}
              className="mt-4 border-t border-gray-200 pt-4"
            >
              <SolutionItem {...section} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default DetailResultPage;
