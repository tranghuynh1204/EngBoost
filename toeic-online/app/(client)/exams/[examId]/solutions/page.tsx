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
import React, { useEffect, useState, Suspense } from "react";
import { SolutionItem } from "@/components/solution/solution-item";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";

// Component that uses useSearchParams
const SolutionsContent = () => {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, [params.examId, router, pathname, searchParams]);

  if (isLoading) {
    return <Loading />;
  }
  if (!exam) {
    return <NotFound />;
  }

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6 py-6 bg-white shadow-sm border border-slate-400 rounded-2xl p-6">
        <div className="text-xl font-bold text-center text-zinc-600 mb-4">
          Transcript{" "}
          <span className="text-cyan-700">{exam.title}</span>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue={exam.sections[0].name} className="">
          {/* Tabs List */}
          <div className="flex justify-center mb-2">
            <TabsList className="inline-flex h-10 border bg-cyan-50 border-slate-400 rounded-lg p-2">
              {exam.sections.map((section, index) => (
                <TabsTrigger
                  value={section.name}
                  key={index}
                  className="flex items-center space-x-2 py-1 px-3 text-sm font-medium text-muted-foreground hover:text-black focus:outline-none rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-black "
                >
                  {section.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

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

// Main component with Suspense boundary
const SolutionsPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SolutionsContent />
    </Suspense>
  );
};

export default SolutionsPage;