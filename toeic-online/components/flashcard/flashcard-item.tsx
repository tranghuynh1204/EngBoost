import Link from "next/link";
import React from "react";
import { TbBook, TbId } from "react-icons/tb";
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
      <div
        className="
        flex flex-col justify-between
        bg-slate-50
        w-[230px]
        h-[180px]
        rounded-lg
        p-4
        border
        border-slate-400
        hover:border-slate-500
        transition-transform
        transform
        hover:scale-105
        hover:shadow-sm
        duration-200
        ease-in-out
        cursor-pointer
      "
      >
        {/* Icon + Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10  bg-sky-100 rounded-lg">
            <TbId className="text-sky-600" size={20} />
          </div>
          <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        </div>

        {/* Description */}
        <p className="mt-2 text-xs text-gray-500">{description}</p>

        {/* Horizontal rule + word count */}
        <hr className="my-2 border-gray-200" />
        <div className="text-xs text-gray-500 hover:underline">
          {vocabularyCount} words
        </div>
      </div>
    </Link>
  );
};
