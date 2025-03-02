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
    <div className="py-8 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="container mx-auto px-6 py-6 bg-white shadow-sm border border-slate-400 rounded-2xl p-6">
        <div className="text-xl text-center font-bold text-zinc-600 mb-2">
          Transcript{" "}
          <span className="text-cyan-700">{userExam.exam.title}</span>
        </div>

        {/* Tabs Component */}
        <div className=" rounded-xl p-4">
          <Tabs
            defaultValue={userExam.sections[0].name}
            className="space-y-4 justify-items-center"
          >
            {/* Tabs List */}
            <TabsList className="inline-flex  h-10 border bg-cyan-50 border-slate-400 rounded-lg p-2 ">
              {userExam.sections.map((section, index) => (
                <TabsTrigger
                  value={section.name}
                  key={index}
                  className="flex items-center space-x-2 py-1 px-3 text-sm font-medium text-muted-foreground  hover:text-black focus:outline-none rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-black "
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
                className="mt-4 w-full pt-4"
              >
                <SolutionItem {...section} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DetailResultPage;
