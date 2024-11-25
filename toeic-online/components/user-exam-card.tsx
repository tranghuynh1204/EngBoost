"use client";

import React from "react";
import Link from "next/link";
import { UserExam } from "@/types";
import { formatTime } from "@/types"; // Replace with the correct path to your `formatTime` function
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { MdOutlineCategory, MdDateRange } from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";

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
    <div className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-center text-[rgb(53,47,68)] flex items-center gap-2">
        {exam.title}
      </h3>
      <p className="text-sm text-gray-600 flex items-center gap-2">
        <HiOutlineClipboardList className="text-blue-400" />
        Sections: {sectionsDisplay}
      </p>
      <p className="text-sm text-gray-600 flex items-center gap-2">
        <FaCheckCircle className="text-blue-400" />
        Result: {result}
      </p>
      <p className="text-sm text-gray-600 flex items-center gap-2">
        <FaClock className="text-blue-400" />
        Duration: {formatTime(duration)}
      </p>
      <p className="text-sm text-gray-600 flex items-center gap-2">
        <MdDateRange className="text-blue-400" />
        Attempted On: {new Date(startTime).toLocaleDateString()}
      </p>
    </div>
  );
};

export default UserExamCard;
