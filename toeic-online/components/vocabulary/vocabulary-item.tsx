import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { openModal } from "@/lib/store/modal-slice";
import { Vocabulary } from "@/types";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Divide, Edit3, Trash2, Volume2 } from "lucide-react";

interface VocabularyItemProps {
  owner: boolean;
  vocabulary: Vocabulary;
}
export const VocabularyItem = ({ owner, vocabulary }: VocabularyItemProps) => {
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const ukAudioRef = useRef<HTMLAudioElement | null>(null);
  const usAudioRef = useRef<HTMLAudioElement | null>(null);
  const onClickDelete = async () => {
    try {
      // thêm dùm cái hỏi có chắc là xoá kh
      setDeleting(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/vocabularies/${vocabulary?._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      window.location.reload();
      //thêm dùm cái thông báo
    } catch {
    } finally {
      setDeleting(false);
    }
  };
  const togglePlayPause = (audio: HTMLAudioElement | null) => {
    try {
      if (audio) {
        if (audio.paused) {
          audio.play().catch();
        } else {
          audio.pause(); // Nếu đang phát, tạm dừng
        }
      }
    } catch {
      console.log("a");
    }
  };
  return (
    <div className="p-4 mb-4 border border-[rgb(185,180,199)] rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
      {/* Header: Word, Part of Speech, and Audio */}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="text-lg font-bold text-[rgb(53,47,68)]">
            {vocabulary.word}
            {vocabulary.partOfSpeech && (
              <span className="text-sm text-[rgb(92,84,112)]">
                ({vocabulary.partOfSpeech})
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 mt-2 text-gray-600">
            <button
              className="text-[rgb(92, 84, 112)] hover:text-[rgb(92,84,112)] flex items-center"
              onClick={() => togglePlayPause(ukAudioRef.current)}
            >
              <Volume2 className="w-4 h-4" />
              <span>UK</span>
              <audio preload="none" ref={ukAudioRef}>
                <source
                  src={`https://dict.youdao.com/dictvoice?audio=${vocabulary.word}&type=1`}
                />
              </audio>
            </button>
            <button
              className="text-[rgb(92, 84, 112)] hover:text-[rgb(92,84,112)] flex items-center"
              onClick={() => togglePlayPause(usAudioRef.current)}
            >
              <Volume2 className="w-4 h-4" />
              <span>US</span>
              <audio preload="none" ref={usAudioRef}>
                <source
                  src={`https://dict.youdao.com/dictvoice?audio=${vocabulary.word}&type=2`}
                />
              </audio>
            </button>
          </div>
        </div>
        {vocabulary.image && (
          <Image
            src={vocabulary.image}
            width={250}
            height={250}
            alt="Vocabulary"
            className="rounded-md object-cover"
          />
        )}
      </div>

      {/* Word + Definition (Compact Line) */}
      <div className="mt-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 text-sm">
            <div className="font-medium text-gray-900">
              <strong>{vocabulary.word}: </strong>
              {vocabulary.mean}
            </div>
          </div>
        </div>
      </div>

      {/* Examples (if any) */}
      {vocabulary.example && (
        <div className="mt-2 text-sm text-[rgb(185, 180, 199)]">
          <strong>Example:</strong> {vocabulary.example}
        </div>
      )}

      {/* Notes (if any) */}
      {vocabulary.notes && (
        <div className="mt-2 text-sm text-[rgb(185,180,199)]">
          <strong>Note:</strong> {vocabulary.notes}
        </div>
      )}

      {/* Actions: Edit and Delete */}
      {owner && (
        <div className="flex justify-end items-center mt-4 space-x-4">
          <button
            className="flex items-center space-x-1 text-blue-600 hover:underline"
            onClick={() =>
              dispatch(
                openModal({
                  type: "UpdateVocabulary",
                  data: { vocabulary },
                })
              )
            }
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <AlertDialog>
            <AlertDialogTrigger
              className="flex items-center space-x-1 text-red-600 hover:underline"
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this vocabulary? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white"
                  onClick={onClickDelete}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};
