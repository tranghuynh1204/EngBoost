"use client";

import React from "react";
import Link from "next/link";
import { UserExam } from "@/types";
import { formatTime } from "@/types"; // Replace with the correct path to your `formatTime` function
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { MdOutlineCategory, MdDateRange } from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { TbBlockquote, TbClockEdit, TbClockQuestion, TbScoreboard } from "react-icons/tb";
import { Button } from "./ui/button";

interface UserExamCardProps {
  userExam: UserExam;
}

const UserExamCard: React.FC<UserExamCardProps> = ({ userExam }) => {
  const { _id, startTime, duration, result, sections, exam } = userExam;

  // Handle sections display
  const sectionsDisplay =
    typeof sections === "string"
      ? sections // If sections is a string (e.g., "full test")
      : Array.isArray(sections)
      ? sections.map((section) => section.name).join(", ") // If sections is an array
      : "Unknown";

  return (
    <div className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition w-68">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-zinc-600">{exam.title}</h3>
        <span className="text-xs text-zinc-400 flex items-center gap-1">
          <button className="text-emerald-600 bg-emerald-50 px-1 py-1 rounded-lg mr-1 ">
            <TbClockEdit size={15} />
          </button>
          {new Date(startTime).toLocaleDateString()}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <button className="text-emerald-600 bg-emerald-50 px-1 py-1 rounded-lg mr-1 ">
            <TbBlockquote size={15} />
          </button>
          <span className="font-medium">Sections:</span>
          <span>{sectionsDisplay}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <button className="text-emerald-600 bg-emerald-50 px-1 py-1 rounded-lg mr-1 ">
            <TbScoreboard size={15} />
          </button>
          <span className="font-medium">Result:</span>
          <span>{result}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
        <button className="text-emerald-600 bg-emerald-50 px-1 py-1 rounded-lg mr-1 ">
            <TbClockQuestion size={15} />
          </button>
          <span className="font-medium">Duration:</span>
          <span>{formatTime(duration)}</span>
        </p>
      </div>
    </div>
  );
};

export default UserExamCard;
