"use client";
import { FlashcardItem } from "@/components/flashcard/flashcard-item";
import { PaginationCustom } from "@/components/pagination-custom";
import { openModal } from "@/lib/store/modal-slice";
import { Flashcard } from "@/types";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const FlashcardPage = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/flashcards/search`,
          {
            params: {
              currentPage: page,
              pageSize: 1,
            },

            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setFlashcards(response.data.data);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } catch (error: any) {
        if (error.response.status === 401) {
          router.replace(`/login?next=${pathname}?${searchParams}`);
        }
      }
    };
    fetchFlashcard();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 bg-[rgb(250,240,230)] rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold text-[rgb(53,47,68)]">
          Flashcards
        </h1>
        <button
          onClick={() =>
            dispatch(
              openModal({
                type: "CreateFlashcard",
              })
            )
          }
          className="px-4 py-2 bg-[rgb(53,47,68)] text-white rounded-lg hover:bg-[rgb(92,84,112)] transition-colors"
        >
          Create Flashcard
        </button>
      </div>
      {flashcards && flashcards.length > 0 ? (
        <div className="space-y-4">
          {flashcards.map((flashcard) => (
            <FlashcardItem {...flashcard} key={flashcard._id} />
          ))}
          <PaginationCustom currentPage={currentPage} totalPages={totalPages} />
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No flashcards available.
        </div>
      )}
    </div>
  );
};

export default FlashcardPage;
