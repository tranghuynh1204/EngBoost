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
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-semibold text-gray-800">{tag}</TableCell>
      <TableCell className="text-green-600 font-medium">{correct}</TableCell>
      <TableCell className="text-red-600 font-medium">{incorrect}</TableCell>
      <TableCell className="text-yellow-600 font-medium">{skipped}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          {questions?.map((question, index) => (
            <button
              key={index}
              className={cn(
                "border rounded-xl w-10 h-10 flex items-center justify-center text-xs font-medium transition duration-200",
                !mapQuestion[question]?.answer
                  ? "border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white"
                  : mapQuestion[question]?.answer ===
                    mapQuestion[question]?.correctAnswer
                  ? "border-green-400 text-green-600 hover:bg-green-400 hover:text-white"
                  : "border-red-400 text-red-600 hover:bg-red-400 hover:text-white"
              )}
              onClick={() => onclick(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
};
