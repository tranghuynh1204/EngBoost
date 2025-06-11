"use client";
import { Flashcard, Vocabulary } from "@/types";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { VocabularyItem } from "./vocabulary-item";
import { PaginationCustom } from "../pagination-custom";
import { openModal } from "@/lib/store/modal-slice";
import { useDispatch } from "react-redux";
import { TbPlus } from "react-icons/tb";

interface VocabularyContainerProps {
  owner: boolean;
  flashcard: Flashcard;
}

// Component that uses useSearchParams
const VocabularyContent = ({ owner, flashcard }: VocabularyContainerProps) => {
  const { flashcardId } = useParams();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [vocabularies, setVocabularies] = useState<Vocabulary[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();

  const fetchVocabularies = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/vocabularies/flashcards/${flashcardId}`,
        {
          params: {
            currentPage: page,
            pageSize: 6,
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
    } catch (error) {
      console.error("Error fetching vocabularies:", error);
    }
  };

  useEffect(() => {
    if (flashcardId) {
      fetchVocabularies();
    }
  }, [flashcardId, page]);

  if (!vocabularies) {
    return <div>Không có từ vựng nào</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* "Create Vocabulary" card */}
        <div
          onClick={() =>
            dispatch(
              openModal({
                type: "CreateVocabulary",
                data: { vocabulary: { flashcard } },
                isReload: true,
              })
            )
          }
          className="flex flex-col justify-between bg-slate-50 w-[290px]
          h-[270px] rounded-lg                   
          p-3 border-2 border-dashed border-slate-400 hover:border-slate-500 transition-transform                   
          transform hover:scale-105 hover:shadow-sm duration-200 ease-in-out cursor-pointer"
        >
          {/* Icon + Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-[70px] hover:bg-sky-100 h-[70px] border-2 border-dashed border-sky-200 rounded-lg">
              <TbPlus className="text-gray-500" size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-700">
              Create Vocabulary
            </h2>
          </div>
          {/* Description */}
          <p className="mt-2 text-sm text-gray-500">
            Expand your flashcard collection with new vocabulary.
          </p>
          {/* Horizontal rule + Link-like text */}
          <hr className="my-2 mt-2 border-sky-100" />
          <div className=" text-xs text-gray-500 hover:underline">
            → Import vocabulary now
          </div>
        </div>
        {/* Existing vocabulary items */}
        {vocabularies.map((vocabulary) => (
          <VocabularyItem
            owner={owner}
            vocabulary={vocabulary}
            key={vocabulary._id}
          />
        ))}
      </div>
      <div className="mt-6">
        <PaginationCustom currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

// Loading component for Suspense fallback
const VocabularyLoading = () => (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Loading skeleton for create vocabulary card */}
      <div className="animate-pulse bg-slate-200 w-[290px] h-[270px] rounded-lg"></div>
      {/* Loading skeletons for vocabulary items */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse bg-slate-200 w-[290px] h-[270px] rounded-lg"></div>
      ))}
    </div>
    <div className="mt-6">
      <div className="animate-pulse bg-slate-200 h-10 w-full rounded-md"></div>
    </div>
  </div>
);

// Main component with Suspense boundary
export const VocabularyContainer = ({ owner, flashcard }: VocabularyContainerProps) => {
  return (
    <Suspense fallback={<VocabularyLoading />}>
      <VocabularyContent owner={owner} flashcard={flashcard} />
    </Suspense>
  );
};