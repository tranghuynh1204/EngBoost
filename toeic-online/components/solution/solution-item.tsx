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
              <span>{question.serial}</span>
              <RadioGroup defaultValue={question.correctAnswer} disabled>
                {question.options?.map((option, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <RadioGroupItem
                      value={mapOption[index]}
                      id={mapOption[index]}
                    />
                    <Label htmlFor={mapOption[index]}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              <div>
                Đáp án đúng là
                {question.correctAnswer}
              </div>
              {question.answerExplanation && (
                <div
                  className="mb-4 text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: question.answerExplanation,
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
