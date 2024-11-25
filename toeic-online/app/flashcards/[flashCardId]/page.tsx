"use client";
import { Button } from "@/components/ui/button";
import { VocabularyContainer } from "@/components/vocabulary/vocabulary-container";
import { openModal } from "@/lib/store/modal-slice";
import { Flashcard } from "@/types";
import axios from "axios";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const FlashcardIdPage = () => {
  const [flashcard, setFlashcard] = useState<Flashcard>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { flashcardId } = useParams();

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/flashcards/${flashcardId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setFlashcard(response.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          router.replace(`/login?next=${pathname}?${searchParams}`);
        }
      }
    };

    if (flashcardId) {
      fetchFlashcard();
    }
  }, [flashcardId]);
  if (!flashcard) {
    return <div>Loading</div>;
  }
  return (
    <div>
      <div>
        <span>FlashCards:{flashcard.title}</span>
        <span>
          <Button
            onClick={() => {
              dispatch(
                openModal({
                  type: "UpdateFlashcard",
                  data: { flashcard },
                })
              );
            }}
          >
            Chỉnh sửa
          </Button>
        </span>
        <span>
          <Button
            onClick={() => {
              dispatch(
                openModal({
                  type: "CreateVocabulary",
                  data: { vocabulary: { flashcard } },
                  isReload: true,
                })
              );
            }}
          >
            Thêm từ mới
          </Button>
        </span>
        {/* <span>
          <Button>Thêm hàng loạt</Button>
        </span> */}
      </div>
      {flashcard.description && <div>{flashcard.description}</div>}
      <div>List có {flashcard.vocabularyCount} từ</div>
      <VocabularyContainer owner={flashcard.owner} />
    </div>
  );
};

export default FlashcardIdPage;
