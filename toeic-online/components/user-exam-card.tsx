"use client";

import React from "react";
import { UserExam } from "@/types";
import { formatTime } from "@/types";
import { Clock, HelpCircle } from "lucide-react";
import { GiSpellBook } from "react-icons/gi";
import { TbUserStar } from "react-icons/tb";
import { TbClockEdit } from "react-icons/tb";

interface UserExamCardProps {
  userExam: UserExam;
}

const UserExamCard: React.FC<UserExamCardProps> = ({ userExam }) => {
  const { startTime, duration, result, sections, exam } = userExam;

  // Handle sections display
  const sectionsDisplay =
    typeof sections === "string"
      ? sections
      : Array.isArray(sections)
      ? sections.map((section) => section.name).join(", ")
      : "Unknown";

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-400 transition-transform transform hover:scale-105 hover:shadow-lg hover:border-slate-600 duration-300 ease-in-out">
      <div className="flex justify-between mb-3">
        <h2 className="text-md font-semibold text-gray-800">{exam.title}</h2>
        <span className="text-xs text-zinc-500 flex items-center gap-1">
          <TbClockEdit className="text-emerald-600" size={14} />
          {new Date(startTime).toLocaleDateString()}
        </span>
      </div>
      <div className="text-gray-600 text-xs space-y-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-600" />
          <span>
            <span className="font-semibold">Duration:</span>{" "}
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-cyan-600" />
          <span>
            <span className="font-semibold">Result:</span> {result}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <GiSpellBook className="w-4 h-4 text-cyan-600" />
          <span>
            <span className="font-semibold">Sections:</span>{" "}
            {sectionsDisplay || "N/A"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <TbUserStar className="w-4 h-4 text-cyan-600" />
          <span>
            <span className="font-semibold">User:</span> You
          </span>
        </div>
      </div>

      <div className="text-center mt-2">
        <span className="inline-block bg-cyan-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
          {exam.category || "General"}
        </span>
      </div>
    </div>
  );
};

export default UserExamCard;
