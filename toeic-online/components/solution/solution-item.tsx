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
          className="bg-white border border-slate-400 p-6 rounded-xl "
        >
          {/* Group Content */}
          <GroupItem group={group} />

          {/* Questions and Solutions */}
          <div className="mt-6">
            {group.questions.map((question) => (
              <div
                key={question.serial}
                className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-500"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-cyan-600">
                    {question.serial}.
                  </span>
                  <p className="text-sm text-gray-800">
                    Đáp án đúng là:{" "}
                    <span className="font-semibold text-emerald-500">
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
