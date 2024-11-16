// pages/exams/[examId]/practice/[practiceSessionId]/page.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { Exam, mapOption } from "@/types"; // Define your types accordingly
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PracticeExamPage = () => {
  const { examId } = useParams();
  const ref = useRef<Record<string, string>>({});
  const sectionIds = useSearchParams().getAll("sectionId");
  const [exam, setExam] = useState<Exam | null>(null);
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{exam.title}</h1>
      <Tabs defaultValue={exam.sections[0]._id} className="w-[400px]">
        <TabsList>
          {exam.sections.map((section) => (
            <TabsTrigger value={section._id} key={section._id}>
              {section.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {exam.sections.map((section) => (
          <TabsContent value={section._id} key={section._id}>
            <h2 className="text-xl font-semibold mb-2">{section.name}</h2>
            {section.groups.map((group, index) => (
              <div key={index} className="mb-4">
                {group.audio && (
                  <audio controls>
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
                  />
                )}
                {group.documentText && (
                  <p className="mb-2">{group.documentText}</p>
                )}
                {group.transcript && (
                  <p className="italic text-gray-600 mb-2">
                    {group.transcript}
                  </p>
                )}

                {group.questions.map((question, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <p className="mb-2">{question.content}</p>
                    <RadioGroup
                      onValueChange={(value) => {
                        ref.current[question.serial] = value;
                      }}
                    >
                      {question.options.map((option, index) => (
                        <div
                          className="flex items-center space-x-2"
                          key={index}
                        >
                          <RadioGroupItem
                            value={mapOption[index]}
                            id={mapOption[index]}
                          />
                          <Label htmlFor={mapOption[index]}>
                            {mapOption[index]}.{option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
      <button onClick={onSubmit}>jjjj</button>
    </div>
  );
};

export default PracticeExamPage;
