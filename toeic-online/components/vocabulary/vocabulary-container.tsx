import { Vocabulary } from "@/types";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { VocabularyItem } from "./vocabulary-item";
import { PaginationCustom } from "../pagination-custom";

interface VocabularyContainerProps {
  owner: boolean;
}
export const VocabularyContainer = ({ owner }: VocabularyContainerProps) => {
  const { flashcardId } = useParams();
  const page = Number(useSearchParams().get("page")) || 1;

  const [vocabularies, setVocabularies] = useState<Vocabulary[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVocabularies = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/vocabularies/flashcards/${flashcardId}`,
        {
          params: {
            currentPage: page,
            pageSize: 2,
          },

          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setVocabularies(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch {}
  };
  useEffect(() => {
    if (flashcardId) {
      fetchVocabularies();
    }
  }, [flashcardId]);

  if (!vocabularies) {
    return <div>Không có từ vựng nào</div>;
  }
  return (
    <div>
      {vocabularies.map((vocabulary) => (
        <VocabularyItem
          owner={owner}
          vocabulary={vocabulary}
          key={vocabulary._id}
        />
      ))}
      <div>
        <PaginationCustom currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};
