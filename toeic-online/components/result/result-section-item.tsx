import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TagItem } from "./tag-item";
const classify = (acc: number) => {
  if (acc >= 0.85) return { label: "Excellent", color: "emerald" };
  if (acc >= 0.6) return { label: "Good", color: "amber" };
  return { label: "Needs Improvement", color: "rose" };
};
interface ResultSectionItemProps {
  mapTagQuestion: {
    [tag: string]: {
      correct: number;
      incorrect: number;
      skipped: number;
      questions: string[];
    };
  };
  correct: number;
  incorrect: number;
  skipped: number;
}
export const ResultSectionItem = ({
  correct,
  incorrect,
  skipped,
  mapTagQuestion,
}: ResultSectionItemProps) => {
  const total = correct + incorrect + skipped;
  const acc = total ? correct / total : 0;
  const { label, color } = classify(acc);

  return (
    <div>
      <div
        className={`mb-4 inline-block rounded-full bg-${color}-100 px-3 py-1 text-xs text-${color}-700`}
      >
        {label} – {(acc * 100).toFixed(0)}% overall
      </div>
      <Table>
        <TableHeader>
          <TableRow className="text-sm">
            <TableHead className="font-semibold text-zinc-700">Tag</TableHead>
            <TableHead className="font-semibold text-zinc-700">
              Correct
            </TableHead>
            <TableHead className="font-semibold text-zinc-700">Wrong</TableHead>
            <TableHead className="font-semibold text-zinc-700">
              Skipped
            </TableHead>
            <TableHead className="font-semibold text-zinc-700">
              Accuracy
            </TableHead>
            <TableHead className="font-semibold text-zinc-700">
              Question
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(mapTagQuestion).map(
            ([tag, { correct, incorrect, skipped, questions }]) => (
              <TagItem
                key={tag}
                tag={tag}
                correct={correct}
                incorrect={incorrect}
                skipped={skipped}
                questions={questions}
              />
            )
          )}
          <TagItem
            tag="Total"
            correct={correct}
            incorrect={incorrect}
            skipped={skipped}
            questions={[]}
          />
        </TableBody>
      </Table>
    </div>
  );
};
