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
          <TableRow>
            <TableHead>Phân loại câu hỏi</TableHead>
            <TableHead>Số câu đúng</TableHead>
            <TableHead>Số câu sai</TableHead>
            <TableHead>Số câu bỏ qua</TableHead>
            <TableHead>Danh sách câu hỏi</TableHead>
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
