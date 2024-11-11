import React from "react";
interface ExamSectionProps {
  id: string;
  name: string;
  tags: [];
  questionCount: number;
}
export const ExamSection = ({
  id,
  name,
  tags,
  questionCount,
}: ExamSectionProps) => {
  return (
    <div>
      <label>
        {name} ({questionCount} câu hỏi)
      </label>
      <div>
        {tags.map((tag, index) => (
          <span key={index}>
            #[{name}] {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
