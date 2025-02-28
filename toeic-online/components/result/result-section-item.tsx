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
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="text-sm">
            <TableHead className="font-semibold text-zinc-700">Question classification</TableHead>
            <TableHead className="font-semibold text-zinc-700">Correct answer</TableHead>
            <TableHead className="font-semibold text-zinc-700">Wrong answer</TableHead>
            <TableHead className="font-semibold text-zinc-700">Skipped answer</TableHead>
            <TableHead className="font-semibold text-zinc-700">List question</TableHead>
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
          />
        </TableBody>
      </Table>
    </div>
  );
};
