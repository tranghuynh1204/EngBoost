import { Group, mapOption } from "@/types";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";
import { GroupItem } from "../group/group-item";
interface SolutionItemProps {
  groups: Group[];
}
export const SolutionItem = ({ groups }: SolutionItemProps) => {
  return (
    <div>
      {groups.map((group, index) => (
        <div key={index}>
          <GroupItem group={group} />
          {group.questions.map((question) => (
            <div key={question.serial}>
              <div>
                {question.serial}
                Đáp án đúng là
                {question.correctAnswer}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
