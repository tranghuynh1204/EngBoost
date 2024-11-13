import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
interface TagItemProps {
  tag: string;
  correct: number;
  incorrect: number;
  skipped: number;
  questions?: string[];
}
export const TagItem = ({
  correct,
  incorrect,
  skipped,
  tag,
  questions,
}: TagItemProps) => {
  return (
    <TableRow>
      <TableCell>{tag}</TableCell>
      <TableCell>{correct}</TableCell>
      <TableCell>{incorrect}</TableCell>
      <TableCell>{skipped}</TableCell>
      <TableCell>
        {questions?.map((question, index) => (
          <span key={index}>{question}|</span>
        ))}
      </TableCell>
    </TableRow>
  );
};
