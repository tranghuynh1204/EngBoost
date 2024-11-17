// components/ExamCard.tsx
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
// Adjust based on actual shadcn-ui components
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Exam } from "@/types";

interface ExamCardProps {
  exam: Exam; // Define exam as the prop
}
const ExamCard = ({ exam }: ExamCardProps) => {
  return (
    <div>
      <div>{exam.title}</div>
      <div>
        <div>{exam.duration}</div>
        <div>{exam.commentCount}</div>
      </div>
      <div>
        {exam.sectionCount}| {exam.questionCount}
      </div>
      <div>{exam.category}</div>
    </div>
  );
};

export default ExamCard;
