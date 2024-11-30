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
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        console.log(error);
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
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-[rgb(250,240,230)] rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[rgb(53,47,68)]">
          {flashcard.title}
        </h1>

        <div className="flex gap-4 mt-4">
          <Button
            className="bg-[rgb(53,47,68)] text-white hover:bg-[rgb(92,84,112)] px-4 py-2 rounded-md shadow-sm"
            onClick={() =>
              dispatch(
                openModal({
                  type: "UpdateFlashcard",
                  data: { flashcard },
                })
              )
            }
          >
            Edit Flashcard
          </Button>
          <Button
            className="bg-[rgb(92,84,112)] text-white hover:bg-[rgb(53,47,68)] px-4 py-2 rounded-md shadow-sm"
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

      {/* Description */}
      {flashcard.description && (
        <div className="mb-6">
          <textarea
            className="w-full border rounded-md p-3 text-[rgb(53,47,68)] bg-white focus:ring-2 focus:ring-[rgb(92,84,112)]"
            defaultValue={flashcard.description}
            readOnly
          />
        </div>
      )}

      {/* Vocabulary Count */}
      <div className="mb-6 text-[rgb(53,47,68)]">
        <strong>Vocabulary Count:</strong> {flashcard.vocabularyCount}
      </div>

      {/* Vocabulary List */}
      <div>
        <VocabularyContainer owner={flashcard.owner} />
      </div>
    </div>
  );
};

export default FlashcardIdPage;
