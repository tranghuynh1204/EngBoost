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
      <div>
        <div>{title}</div>
        <div>{vocabularyCount} từ</div>
        <div>{description}</div>
      </div>
    </Link>
  );
};
