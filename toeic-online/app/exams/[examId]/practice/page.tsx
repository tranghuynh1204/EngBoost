// pages/exams/[examId]/practice/[practiceSessionId]/page.tsx
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { Exam, mapOption } from "@/types"; // Define your types accordingly
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionTracker from "@/components/tracker/QuestionTracker";
const PracticeExamPage = () => {
  const { examId } = useParams();
  const ref = useRef<Record<string, string>>({});
  const sectionIds = useSearchParams().getAll("sectionId");
  const [exam, setExam] = useState<Exam | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Record<string, boolean>
  >({});
  const [startTime, setStartTime] = useState<Date | null>(null);
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
        setStartTime(new Date());
      } catch (error) {
        console.error("Error fetching practice session data:", error);
      }
    };

    if (sectionIds && examId) {
      fetchPracticeSession();
    }
  }, []);
  useEffect(() => {
    if (!startTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      setElapsedTime(diffInSeconds);
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, [startTime]);
  const handleNavigate = useCallback((questionSerial: string) => {
    const element = document.getElementById(`question-${questionSerial}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Optionally, highlight the question
      element.classList.add("ring-2", "ring-blue-500");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500");
      }, 2000);
    }
  }, []);
  const onSubmit = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user-exam`, {
        exam: examId,
        answers: ref.current,
        sections: sectionIds,
      });
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  if (!exam) {
    return <div>Loading...</div>;
  }
  const allQuestions = exam.sections.flatMap((section) =>
    section.groups.flatMap((group) => group.questions)
  );
  return (
    <div className="container mx-auto p-6 flex">
      {/* Main Content */}
      <div className="flex-1 mr-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{exam.title}</h1>
        <Tabs defaultValue={exam.sections[0]._id} className="w-full">
          <TabsList className="mb-4">
            {exam.sections.map((section) => (
              <TabsTrigger value={section._id} key={section._id}>
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {exam.sections.map((section) => (
            <TabsContent value={section._id} key={section._id}>
              <h2 className="text-2xl font-semibold mb-4">{section.name}</h2>
              {section.groups.map((group, index) => (
                <div key={index} className="mb-6">
                  {group.audio && (
                    <audio controls className="w-full mb-4">
                      <source src={group.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {group.image && (
                    <Image
                      src={group.image}
                      width={500}
                      height={500}
                      alt="Group Image"
                      className="mb-4"
                    />
                  )}
                  {group.documentText && (
                    <p className="mb-4 text-gray-700">{group.documentText}</p>
                  )}
                  {group.transcript && (
                    <p className="italic text-gray-600 mb-4">
                      {group.transcript}
                    </p>
                  )}

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
                          ref.current[question.serial] = value;
                          setAnsweredQuestions((prev) => ({
                            ...prev,
                            [question.serial]: true,
                          }));
                        }}
                        value={ref.current[question.serial] || ""}
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
                                {mapOption[oIndex]}. {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Sidebar: Question Tracker */}
      <div className="w-64 hidden lg:block sticky top-4 self-start">
        <QuestionTracker
          questions={allQuestions}
          answeredQuestions={answeredQuestions}
          onNavigate={handleNavigate}
          onSubmit={onSubmit} // Pass onSubmit function
        />
      </div>
    </div>
  );
};

export default PracticeExamPage;
