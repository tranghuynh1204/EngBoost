import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { openModal } from "@/lib/store/modal-slice";
import { cn } from "@/lib/utils";
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
            className={cn(
              "m-2  border-[1px] rounded-full w-8 h-8 flex items-center justify-center",
              mapQuestion[question]?.answer === ""
                ? "border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                : mapQuestion[question]?.answer ===
                  mapQuestion[question]?.correctAnswer
                ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            )}
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
