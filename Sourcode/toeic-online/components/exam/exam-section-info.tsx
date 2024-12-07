// components/exam/ExamSection.tsx
"use client";
import React from "react";

interface ExamSectionProps {
  id: string;
  name: string;
  tags: string[];
  questionCount: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export const ExamSectionInfo: React.FC<ExamSectionProps> = ({
  id,
  name,
  tags,
  questionCount,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow flex items-center">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(id)}
        className="mr-4"
        disabled={disabled}
      />
      <div className="flex-1">
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
              className="bg-blue-50 text-black text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
