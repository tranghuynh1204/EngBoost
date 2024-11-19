// pages/exams/[examId]/practice/[practiceSessionId]/page.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { Exam, mapOption } from "@/types"; // Define your types accordingly
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionTracker from "@/components/tracker/QuestionTracker";
import { GroupItem } from "@/components/group/group-item";
const PracticeExamPage = () => {
  const { examId } = useParams();
  const searchParams = useSearchParams();
  const sectionIds = useSearchParams().getAll("sectionId");
  const selectedTime = searchParams.get("time");
  const [exam, setExam] = useState<Exam | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Record<string, string>
  >({});

  const [indexSection, setIndexSection] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState<number | null>(
    selectedTime ? parseInt(selectedTime) * 60 : null
  ); // Time in seconds
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const fetchPracticeSession = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/practice`,
          {
            id: examId,
            sectionIds,
          }
        );
        setExam(response.data);
      } catch (error) {
        console.error("Error fetching practice session data:", error);
      }
    };

    if (sectionIds && examId) {
      fetchPracticeSession();
    }
  }, []);
  // Countdown Timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (timeLeft !== null) {
      // Countdown Timer
      if (timeLeft <= 0) {
        onSubmit();
        return;
      }
      timerId = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else {
      // Count-Up Timer for Unlimited Time
      timerId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, [timeLeft]);
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
  const onSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user-exams`,
        {
          exam: examId,
          answers: answeredQuestions,
          sections: sectionIds,
          duration: {
            h: 1,
            m: 2,
            s: 3,
          },
          startTime: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzJmODVlNzA1MmY2YjhjM2QxODhkN2YiLCJuYW1lIjoibm9hZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwibW9kZXJhdG9yIl0sImlhdCI6MTczMTUwODk5MywiZXhwIjoxNzMyMTEzNzkzfQ.uRCQcTvVFsftkViaiGz_w_amjPLj19j21I88V3eACD4`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      // code chuyển đến trang kết quả
    } catch (error) {
      console.log("Error submitting answers:", error);
    }
  };

  if (!exam) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 flex">
      {/* Main Content */}
      <div className="flex-1 mr-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{exam.title}</h1>
        <Tabs
          className="w-full"
          value={exam.sections[indexSection]._id}
          defaultValue={exam.sections[0]._id}
        >
          <TabsList className="mb-4">
            {exam.sections.map((section, index) => (
              <TabsTrigger
                value={section._id}
                key={section._id}
                onClick={() => setIndexSection(index)}
              >
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {exam.sections.map((section) => (
            <TabsContent value={section._id} key={section._id}>
              <h2 className="text-2xl font-semibold mb-4">{section.name}</h2>
              {section.groups.map((group, index) => (
                <div key={index} className="mb-6">
                  <GroupItem group={group} />
                  {group.questions.map((question) => (
                    <div
                      key={question.serial} // Use unique serial as key
                      id={`question-${question.serial}`} // Assign unique ID
                      className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50"
                    >
                      <p className="mb-3 text-lg font-medium">
                        {question.serial}. {question.content}
                      </p>
                      <RadioGroup
                        onValueChange={(value) => {
                          setAnsweredQuestions({
                            ...answeredQuestions,
                            [question.serial]: value,
                          });
                        }}
                      >
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div
                              className="flex items-center space-x-2"
                              key={oIndex}
                            >
                              <RadioGroupItem
                                value={mapOption[oIndex]}
                                id={`${question.serial}-${mapOption[oIndex]}`}
                              />
                              <Label
                                htmlFor={`${question.serial}-${mapOption[oIndex]}`}
                                className="cursor-pointer"
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
              {/* Previous and Next Buttons */}
              <div className="flex justify-between mt-8">
                {indexSection !== 0 && (
                  <Button
                    onClick={() => setIndexSection(indexSection - 1)}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-white hover:bg-black"
                  >
                    Previous
                  </Button>
                )}

                {indexSection < exam.sections.length - 1 && (
                  <Button
                    onClick={() => setIndexSection(indexSection + 1)}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-white hover:bg-black"
                  >
                    Next
                  </Button>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Sidebar: Question Tracker */}
      <div className="w-64 hidden lg:block sticky top-4 self-start">
        <QuestionTracker
          sections={exam.sections}
          answeredQuestions={answeredQuestions}
          onNavigate={handleNavigate}
          onSubmit={onSubmit} // Pass onSubmit function
          timeLeft={timeLeft} // Pass the timeLeft prop
          elapsedTime={elapsedTime}
        />
      </div>
    </div>
  );
};

export default PracticeExamPage;
