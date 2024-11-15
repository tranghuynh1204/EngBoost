"use client";
import { SolutionItem } from "@/components/solution/solution-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserExam } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const DetailResultPage = () => {
  const params = useParams();
  const [userExam, setUserExam] = useState<UserExam>();
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams/${params.examId}/result/${params.userExamId}/details`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzJmODVlNzA1MmY2YjhjM2QxODhkN2YiLCJuYW1lIjoibm9hZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwibW9kZXJhdG9yIl0sImlhdCI6MTczMTI0MjIyOSwiZXhwIjoxNzMxODQ3MDI5fQ.-_UYPlJhdXbwuoEO2HhW1oLb_RI0sLsz76IZUOwYLq0`,
              "Content-Type": "application/json",
            },
          }
        );
        setUserExam(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    if (params.examId && params.userExamId) {
      fetchResult();
    }
  }, [params.examId, params.userExamId]);
  if (!userExam) {
    return null;
  }
  return (
    <div>
      <div>Đáp án/Transcript:{userExam.exam.title}</div>
      <div>
        <Tabs defaultValue={userExam.sections[0].name}>
          <TabsList>
            {userExam.sections.map((section, index) => (
              <TabsTrigger value={section.name} key={index}>
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {userExam.sections.map((section, index) => (
            <TabsContent value={section.name} key={index}>
              <SolutionItem {...section} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default DetailResultPage;
