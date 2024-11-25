"use client";
import { VocabularyContainer } from "@/components/vocabulary/vocabulary-container";
import { Flashcard } from "@/types";
import axios from "axios";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const FlashcardIdPage = () => {
  const [flashcard, setFlashcard] = useState<Flashcard>();

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
      } catch {}
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
      <div>FlashCards:{flashcard.title}</div>
      {flashcard.description && <div>{flashcard.description}</div>}
      <div>List có {flashcard.vocabularyCount} từ</div>
      <VocabularyContainer owner={flashcard.owner} />
    </div>
  );
};

export default FlashcardIdPage;
