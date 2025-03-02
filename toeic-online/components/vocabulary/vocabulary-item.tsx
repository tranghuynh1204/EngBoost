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
import {
  TbArrowBack,
  TbArrowForward,
  TbProgressCheck,
  TbStatusChange,
  TbTrash,
} from "react-icons/tb";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";

interface VocabularyItemProps {
  owner: boolean;
  vocabulary: Vocabulary;
}
export const VocabularyItem = ({ owner, vocabulary }: VocabularyItemProps) => {
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const ukAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showDefinition, setShowDefinition] = useState(true);
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
      toast({
        description: (
          <div className="flex items-center space-x-3">
            <TbProgressCheck
              className="text-green-500 flex-shrink-0"
              size={22}
            />
            <div>
              <span className="block font-semibold">Deleted Successfully</span>
              <span className="block text-sm text-gray-600">
                The vocabulary has been deleted.
              </span>
            </div>
          </div>
        ),
        variant: "success",
      });
      // Optionally, wait a moment before reloading so the user sees the toast:
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
    <div
      onDoubleClick={() =>
        dispatch(
          openModal({
            type: "UpdateVocabulary",
            data: { vocabulary },
          })
        )
      }
      className="
      group
      relative 
        flex flex-col justify-between
        bg-slate-50
        w-[290px]
        h-[270px]   
        rounded-lg
        p-2
        border
        hover:border-slate-500
 hover:shadow-md
 transition-shadow
      "
    >
      {/* Header: Image/Icon, Word, Part of Speech, and Audio Controls */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          {vocabulary.image ? (
            <Image
              src={vocabulary.image}
              alt={vocabulary.word ?? "Vocabulary image"}
              width={70}
              height={70}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-[70px] h-[70px] bg-sky-100 rounded-lg">
              {/* Fallback icon or placeholder */}
              <span className="text-sky-600 ">N/A</span>
            </div>
          )}
          <div>
            <div className="text-lg font-bold text-[rgb(53,47,68)]">
              {vocabulary.word}
              {vocabulary.partOfSpeech && (
                <span className="text-sm text-[rgb(92,84,112)] ml-1">
                  ({vocabulary.partOfSpeech})
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1 text-gray-600 text-xs">
              <button
                className="flex items-center space-x-1 text-[rgb(92,84,112)] hover:text-[rgb(92,84,112)]"
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
                className="flex items-center space-x-1 text-[rgb(92,84,112)] hover:text-[rgb(92,84,112)]"
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
        </div>
      </div>

      <div className="mt-3 h-full overflow-hidden grid grid-rows-[1fr_auto]">
        {/* Scrollable Definition/Example Area with Toggle */}
        <div className="relative flex-grow overflow-y-auto pr-2 text-sm text-gray-700 whitespace-pre-wrap scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent text-left">
          {showDefinition ? (
            <div className="mb-2">
              <div>{vocabulary.mean}</div>
            </div>
          ) : (
            <div className="mb-2">
              <div>{vocabulary.example}</div>
            </div>
          )}
        </div>

        {/* Fixed Note Area */}
        {vocabulary.notes && (
          <div className="flex-shrink-0 mt-3 min-h-[40px] pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto">
            <hr className="border-sky-100 mb-2" />
            <div className="text-xs text-gray-500 whitespace-pre-wrap overflow-y-auto max-h-8">
              {vocabulary.notes}
            </div>
          </div>
        )}
      </div>

      {/* Actions: Edit and Delete */}
      {owner && (
        <div className="flex justify-between items-center mt-auto">
          {/* Toggle Button */}
          <button
            onClick={() => setShowDefinition(!showDefinition)}
            className="flex items-center space-x-1 rounded-md text-sky-600 text-xs 
                       opacity-0 pointer-events-none transition-opacity 
                       group-hover:opacity-100 group-hover:pointer-events-auto 
                        hover:bg-blue-50  px-2 py-1"
          >
            {showDefinition ? (
              <>
                <TbArrowForward className="w-4 h-4 inline-block mr-1" />
                Example
              </>
            ) : (
              <>
                <TbArrowBack className="w-4 h-4 inline-block mr-1" />
                Definition
              </>
            )}
          </button>
          <AlertDialog>
            <AlertDialogTrigger
              className="flex items-center space-x-1 rounded-md text-slate-800 
             opacity-0 pointer-events-none transition-opacity 
             group-hover:opacity-100 group-hover:pointer-events-auto 
             hover:text-rose-600 hover:bg-rose-50 hover:underline px-2 py-1"
              disabled={deleting} //prevent shifting layout
            >
              <TbTrash className="w-4 h-4" />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-50 border border-slate-400">
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
