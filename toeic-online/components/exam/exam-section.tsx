// ExamSection.jsx
"use client";
import React from "react";

interface ExamSectionProps {
  id: string;
  name: string;
  tags: string[]; // Updated to specify string array
  questionCount: number;
}

export const ExamSection = ({
  id,
  name,
  tags,
  questionCount,
}: ExamSectionProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <span className="text-sm text-gray-600">{questionCount} câu hỏi</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};
