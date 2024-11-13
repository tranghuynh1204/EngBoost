import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { openModal } from "@/lib/store/modal-slice";
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
  const mapQuestion = useSelector((state: RootState) => state.data.mapQuestion);
  const mapGroup = useSelector((state: RootState) => state.data.mapGroup);
  const dispatch = useDispatch();
  const onclick = (serial: string) => {
    const question = { ...mapQuestion[serial], serial };
    const group = mapGroup[question.group];
    dispatch(openModal({ type: "Answer", data: { group, question } }));
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
