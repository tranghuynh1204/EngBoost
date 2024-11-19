import { Group } from "@/types";
import React from "react";
import { GroupItem } from "../group/group-item";

interface SolutionItemProps {
  groups: Group[];
}

export const SolutionItem = ({ groups }: SolutionItemProps) => {
  return (
    <div className="space-y-6">
      {groups.map((group, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
          {/* Group Content */}
          <GroupItem group={group} />

          {/* Questions and Solutions */}
          <div className="mt-4">
            {group.questions.map((question) => (
              <div key={question.serial} className="mb-4">
                <div className="flex items-center mb-1">
                  <span className="font-semibold mr-2">{question.serial}.</span>
                  <span className="text-lg">
                    Đáp án đúng là: {question.correctAnswer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
