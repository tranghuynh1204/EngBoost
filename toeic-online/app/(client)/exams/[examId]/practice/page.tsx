// pages/exams/[examId]/practice/[practiceSessionId]/page.tsx

"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Exam, mapOption } from "@/types"; // Define your types accordingly
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionTracker from "@/components/question-tracker";
import { GroupItem } from "@/components/group/group-item";
import { HightLightControl } from "@/components/hight-light-control";
import { Counter } from "@/components/counter";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
interface ChildComponentRef {
  callMe: (serial: string) => void;
}
const PracticeExamPage = () => {
  const { examId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const sectionIds = useSearchParams().getAll("sectionId");
  const selectedTime = Number(searchParams.get("time"));
  const countRef = useRef(0);
  const startTime = new Date();
  const [exam, setExam] = useState<Exam | null>(null);
  const answeredQuestions = useRef<Record<string, string>>({});
  const [indexSection, setIndexSection] = useState<number>(0);
  const childRef = useRef<ChildComponentRef>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countRef.current === selectedTime && selectedTime !== 0) {
        onSubmit();
      }
      countRef.current += 1;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPracticeSession = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/practice`,
          {
            id: examId,
            sectionIds,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Replace with dynamic token if necessary
              "Content-Type": "application/json",
            },
          }
        );
        setExam(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.replace(`/login?next=${pathname}?${searchParams}`);
        }
      }
    };

    if (sectionIds && examId) {
      fetchPracticeSession();
    }
  }, []);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/user-exam-drafts/get`,
          {
            sections: sectionIds,
            selectedTime: selectedTime,
            exam: examId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Replace with dynamic token if necessary
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (data) {
          answeredQuestions.current = data.answers;
          countRef.current = data.duration;
        }
      } catch (error: any) {
      } finally {
        setIsLoading(false);
      }
    };

    if (exam) {
      fetchDraft();
    }
  }, [exam]);

  const handleTabClose = async (event: BeforeUnloadEvent) => {
    event.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user-exam-drafts`,
        {
          exam: examId,
          answers: answeredQuestions.current,
          sections: sectionIds,
          duration: countRef.current,
          startTime,
          selectedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Replace with dynamic token if necessary
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log("Error submitting answers:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  const handleNavigate = useCallback(
    async (questionSerial: string, index: number) => {
      await setIndexSection(index);
      const element = document.getElementById(`question-${questionSerial}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Optionally, highlight the question
        element.classList.add("ring-2", "ring-blue-500");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-blue-500");
        }, 2000);
      }
    },
    []
  );

  // Handler for submitting answers
  const onSubmit = async () => {
    try {
      setIsSubmit(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user-exams`,
        {
          exam: examId,
          answers: answeredQuestions.current,
          sections: sectionIds,
          duration: countRef.current,
          startTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      router.push(`result/${response.data._id}`);
    } catch (error) {
      setIsSubmit(false);
      console.log("Error submitting answers:", error);
    }
  };

  // Handler for navigating to the next section
  const handleNext = () => {
    setIndexSection((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler for navigating to the previous section
  const handlePrevious = () => {
    setIndexSection((prev) => prev - 1);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  if (isLoading) {
    return <Loading />;
  }
  if (!exam) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container bg-white rounded-xl border border-slate-500 mx-auto p-6 flex space-x-6">
        {/* Sidebar or Highlight Control */}
        <HightLightControl />
        <div className="flex-1 overflow-y-auto">
          {/* Exam Title */}
          <h1 className="text-xl font-bold mb-6 text-center text-gray-800">
            {exam.title}
          </h1>

          {/* Tabs for Sections */}
          <Tabs
            className=""
            value={exam.sections[indexSection]._id}
            defaultValue={exam.sections[0]._id}
          >
            {/* Tabs List */}
            <div className="flex justify-center mb-4">
              <TabsList className="inline-flex space-x-2 items-center h-10 border bg-cyan-50 border-slate-400 rounded-lg p-4 w-auto">
                {exam.sections.map((section, index) => (
                  <TabsTrigger
                    value={section._id}
                    key={section._id}
                    onClick={() => setIndexSection(index)}
                    className="flex items-center space-x-2 py-1 px-3 text-sm font-medium text-muted-foreground hover:text-black focus:outline-none rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-black"
                  >
                    {section.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tabs Content */}
            {exam.sections.map((section) => (
              <TabsContent value={section._id} key={section._id}>
                {/* Section Title */}
                <h2 className=" w-full font-semibold mb-4 text-zinc-800">
                  {section.name}
                </h2>

                {/* Groups */}
                {section.groups.map((group, index) => (
                  <div key={index} className="mb-8">
                    <GroupItem group={group} />

                    {/* Questions */}
                    {group.questions.map((question) => (
                      <div
                        key={question.serial}
                        id={`question-${question.serial}`}
                        className="mb-6 mt-4 p-4 border border-slate-500 rounded-xl bg-slate-50"
                      >
                        <p className="mb-4 text-sm font-semibold text-gray-900">
                          {question.serial}. {question.content}
                        </p>
                        <RadioGroup
                          defaultValue={
                            answeredQuestions.current?.[question.serial]
                          }
                          onValueChange={(value) => {
                            if (childRef.current)
                              childRef.current.callMe(question.serial);
                            answeredQuestions.current[question.serial] = value;
                          }}
                        >
                          <div className="space-y-3 text-sm">
                            {question.options.map((option, oIndex) => (
                              <div
                                className="flex items-center space-x-3"
                                key={oIndex}
                              >
                                <RadioGroupItem
                                  value={mapOption[oIndex]}
                                  id={`${question.serial}-${mapOption[oIndex]}`}
                                  className="
        peer
        h-4 w-4
        rounded-full
        border
        border-cyan-600
        text-white
        ring-offset-white
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2
        focus-visible:ring-cyan-400
        data-[state=checked]:bg-cyan-600
        data-[state=checked]:border-cyan-700
      "
                                />

                                <Label
                                  htmlFor={`${question.serial}-${mapOption[oIndex]}`}
                                  className="text-gray-700 cursor-pointer"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Navigation Buttons */}
                <div
                  className={`flex mt-8 ${
                    indexSection !== 0 ? "justify-between" : "justify-end"
                  }`}
                >
                  {indexSection !== 0 && (
                    <Button
                      onClick={handlePrevious}
                      className="px-3 py-2 text-sm  bg-cyan-700 text-white hover:bg-cyan-900 transition"
                    >
                      Previous
                    </Button>
                  )}
                  {indexSection < exam.sections.length - 1 && (
                    <Button
                      onClick={handleNext}
                      className="px-3 py-2 text-sm  bg-cyan-700 text-white hover:bg-cyan-900 transition"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="w-64 hidden lg:block sticky top-20 self-start space-y-6">
          <Counter
            onSubmit={onSubmit}
            isSubmit={isSubmit}
            counter={countRef.current}
          />
          <QuestionTracker
            answeredQuestionsRef={answeredQuestions.current}
            ref={childRef}
            sections={exam.sections}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
};

export default PracticeExamPage;
