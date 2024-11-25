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
import { Divide, Volume2 } from "lucide-react";

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
    <div className="flex flex-col space-y-4 p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex-1">
          <div className="text-lg font-semibold">
            {vocabulary.word}
            {vocabulary.partOfSpeech && (
              <span className="ml-2 text-gray-500">
                ({vocabulary.partOfSpeech})
              </span>
            )}
          </div>
          {vocabulary.pronunciation && (
            <div className="text-gray-600">
              Pronunciation: {vocabulary.pronunciation}
            </div>
          )}
          <div className="flex items-center space-x-4 mt-2">
            <button
              className="flex items-center space-x-2 hover:text-primary"
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
              className="flex items-center space-x-2 hover:text-primary"
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
          <div className="w-32 h-32 flex-shrink-0">
            <Image
              src={vocabulary.image}
              width={128}
              height={128}
              alt="Vocabulary illustration"
              className="rounded-md"
            />
          </div>
        )}
      </div>
      <div>
        <div className="font-medium">Definition:</div>
        <textarea
          className="w-full border h-20 rounded-md p-2 mt-1 text-sm"
          defaultValue={vocabulary.mean}
          readOnly
        />
      </div>
      {vocabulary.example && (
        <div>
          <div className="font-medium">Example:</div>
          <textarea
            className="w-full h-22 border rounded-md p-2 mt-1 text-sm"
            defaultValue={vocabulary.example}
            readOnly
          />
        </div>
      )}
      {vocabulary.notes && (
        <div>
          <div className="font-medium">Notes:</div>
          <textarea
            className="w-full h-20 border rounded-md p-2 mt-1 text-sm"
            defaultValue={vocabulary.notes}
            readOnly
          />
        </div>
      )}
      {owner && (
        <div className="flex justify-between items-center mt-4">
          <button
            className="text-primary hover:underline"
            onClick={() =>
              dispatch(
                openModal({
                  type: "UpdateVocabulary",
                  data: { vocabulary },
                })
              )
            }
          >
            Edit
          </button>
          <AlertDialog>
            <AlertDialogTrigger
              className="text-red-600 hover:underline"
              disabled={deleting}
            >
              Delete
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
