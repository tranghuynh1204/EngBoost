"use client";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
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
  const [isLoading, setIsLoading] = useState<boolean>();

  const { flashcardId } = useParams();

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/flashcards/${flashcardId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        setFlashcard(response.data);
      } catch (error: any) {
        if (error.response.status === 401) {
          router.replace(`/login?next=${pathname}?${searchParams}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (flashcardId) {
      fetchFlashcard();
    }
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  if (!flashcard) {
    return <NotFound />;
  }
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <div className="text-xl font-bold text-primary mb-2">
          Flashcard: {flashcard.title}
        </div>
        <div className="flex gap-4">
          <Button
            className="bg-primary hover:bg-primary-dark"
            onClick={() =>
              dispatch(
                openModal({
                  type: "UpdateFlashcard",
                  data: { flashcard },
                })
              )
            }
          >
            Edit
          </Button>
          <Button
            className="bg-secondary hover:bg-secondary-dark"
            onClick={() =>
              dispatch(
                openModal({
                  type: "CreateVocabulary",
                  data: { vocabulary: { flashcard } },
                  isReload: true,
                })
              )
            }
          >
            Add Vocabulary
          </Button>
        </div>
      </div>
      {flashcard.description && (
        <div className="mb-6 text-gray-600">{flashcard.description}</div>
      )}
      <div className="mb-6 text-gray-700">
        Vocabulary Count: {flashcard.vocabularyCount}
      </div>
      <VocabularyContainer owner={flashcard.owner} />
    </div>
  );
};

export default FlashcardIdPage;
