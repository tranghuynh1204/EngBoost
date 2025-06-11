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

  const handleClick = (serial: string) => {
    const question = { ...mapQuestion[serial], serial };
    const group = mapGroup[question.group];
    dispatch(openModal({ type: "Answer", data: { group, question } }));
  };
  const total = correct + incorrect + skipped;
  const accuracy = total ? correct / total : 0;
  const color = accuracy >= 0.85 ? "emerald" : accuracy >= 0.6 ? "amber" : "rose";

  return (
    <TableRow className="hover:bg-slate-100 text-sm">
      <TableCell className="font-semibold text-zinc-600">{tag}</TableCell>
      <TableCell className="text-emerald-600 font-medium">{correct}</TableCell>
      <TableCell className="text-rose-600 font-medium">{incorrect}</TableCell>
      <TableCell className="text-zinc-600 font-medium">{skipped}</TableCell>
      <TableCell>
        <span className={`rounded-full px-2 py-0.5 text-xs bg-${color}-50 text-${color}-700`}>
          {(accuracy * 100).toFixed(0)}%
        </span>
      </TableCell>
      <TableCell className="w-72">
        <div className="flex flex-wrap gap-2">
          {questions?.map(q => (
            <button
              key={q}
              onClick={() => handleClick(q)}
              className={cn(
                "border rounded-xl w-8 h-8 flex items-center justify-center text-xs transition",
                !mapQuestion[q]?.answer
                  ? "border-zinc-600 text-zinc-600 hover:bg-zinc-400 hover:text-white"
                  : mapQuestion[q]?.answer === mapQuestion[q]?.correctAnswer
                  ? "border-emerald-500 text-emerald-600 hover:bg-emerald-400 hover:text-white"
                  : "border-rose-500 text-rose-600 hover:bg-rose-400 hover:text-white"
              )}
            >
              {q}
            </button>
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
};
