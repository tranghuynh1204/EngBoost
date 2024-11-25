import Link from "next/link";
import React from "react";
export interface FlashcardItemProps {
  _id: string;
  title: string;
  description: string;
  vocabularyCount: number;
}
export const FlashcardItem = ({
  _id,
  description,
  title,
  vocabularyCount,
}: FlashcardItemProps) => {
  return (
    <Link href={`/flashcards/${_id}`}>
      <div className="p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <div className="text-lg font-semibold text-[rgb(53,47,68)]">
          {title}
        </div>
        <div className="text-sm text-gray-500">{vocabularyCount} words</div>
        <div className="text-sm text-gray-700 mt-2">{description}</div>
      </div>
    </Link>
  );
};
