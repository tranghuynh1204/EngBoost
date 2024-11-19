import { Group, mapOption } from "@/types";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";
import Image from "next/image";
interface SolutionItemProps {
  groups: Group[];
}
export const SolutionItem = ({ groups }: SolutionItemProps) => {
  return (
    <div>
      {groups.map((group, index) => (
        <div key={index}>
          {group.audio && (
            <audio controls>
              <source src={group.audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          {group.image && (
            <Image
              src={group.image}
              width="0"
              height="0"
              sizes="100vw"
              alt="Group Image"
              loading="lazy"
            />
          )}
          {group.documentText && (
            <div dangerouslySetInnerHTML={{ __html: group.documentText }}></div>
          )}
          {group.transcript && (
            <div dangerouslySetInnerHTML={{ __html: group.transcript }}></div>
          )}
          <div>
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
                  <div>
                    Giải thích đáp án
                    {question.answerExplanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
