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
    <TableRow className="hover:bg-slate-100 text-sm">
      <TableCell className="font-semibold text-zinc-600">{tag}</TableCell>
      <TableCell className="text-emerald-600 font-medium">{correct}</TableCell>
      <TableCell className="text-rose-600 font-medium">{incorrect}</TableCell>
      <TableCell className="text-zinc-600 font-medium">{skipped}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          {questions?.map((question, index) => (
            <button
              key={index}
              className={cn(
                "border rounded-xl w-9 h-9 flex items-center justify-center text-xs transition duration-200",
                !mapQuestion[question]?.answer
                  ? "border-zinc-600 text-zinc-600 hover:bg-zinc-400 hover:text-white"
                  : mapQuestion[question]?.answer ===
                    mapQuestion[question]?.correctAnswer
                  ? "border-emerald-500 text-emerald-600 hover:bg-emerald-400 hover:text-white"
                  : "border-rose-500 text-rose-600 hover:bg-rose-400 hover:text-white"
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
