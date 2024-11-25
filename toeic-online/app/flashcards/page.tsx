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
    <div>
      <button
        onClick={() =>
          dispatch(
            openModal({
              type: "CreateFlashcard",
            })
          )
        }
      >
        tạo list từ
      </button>
      {flashcards && flashcards.length > 0 && (
        <div>
          {flashcards.map((flashcard) => (
            <FlashcardItem {...flashcard} key={flashcard._id} />
          ))}
          <div>
            <PaginationCustom
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardPage;
