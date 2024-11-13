import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { openModal } from "@/lib/store/modalSlice";
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
  const data = useSelector((state: RootState) => state.question.questions);
  const dispatch = useDispatch();
  const onclick = (serial: string) => {
    dispatch(openModal({ type: "answer", data: { ...data[serial], serial } }));
  };
  return (
    <TableRow>
      <TableCell>{tag}</TableCell>
      <TableCell>{correct}</TableCell>
      <TableCell>{incorrect}</TableCell>
      <TableCell>{skipped}</TableCell>
      <TableCell>
        {questions?.map((question, index) => (
          <button
            className="bg-red-500 m-10"
            onClick={() => onclick(question)}
            key={index}
          >
            {question}
          </button>
        ))}
      </TableCell>
    </TableRow>
  );
};
