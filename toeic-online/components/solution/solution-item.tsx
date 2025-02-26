import { Group } from "@/types";
import React from "react";
import { GroupItem } from "../group/group-item";

interface SolutionItemProps {
  groups: Group[];
}

export const SolutionItem = ({ groups }: SolutionItemProps) => {
  return (
    <div className="space-y-8">
      {groups.map((group, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          {/* Group Content */}
          <GroupItem group={group} />

          {/* Questions and Solutions */}
          <div className="mt-6">
            {group.questions.map((question) => (
              <div
                key={question.serial}
                className="mb-6 p-4 rounded-md bg-gray-50 shadow-sm border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <span className="font-bold text-lg text-blue-600">
                    {question.serial}.
                  </span>
                  <p className="text-gray-800">
                    Đáp án đúng là:{" "}
                    <span className="font-semibold text-green-600">
                      {question.correctAnswer}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
