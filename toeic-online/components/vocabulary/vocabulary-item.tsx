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
    <div className="flex space-x-4">
      <div>
        <div>
          <span> {vocabulary.word}</span>
          {vocabulary.partOfSpeech && <span> ({vocabulary.partOfSpeech})</span>}
          {vocabulary.pronunciation && <span> {vocabulary.pronunciation}</span>}

          <span>
            <button onClick={() => togglePlayPause(ukAudioRef.current)}>
              <audio preload="none" ref={ukAudioRef}>
                <source
                  src={`https://dict.youdao.com/dictvoice?audio=${vocabulary.word}&type=1`}
                />
              </audio>
              <Volume2 />
            </button>
            <span>UK</span>
          </span>
          <span>
            <button onClick={() => togglePlayPause(usAudioRef.current)}>
              <audio preload="none" ref={usAudioRef}>
                <source
                  src={`https://dict.youdao.com/dictvoice?audio=${vocabulary.word}&type=2`}
                />
              </audio>
              <Volume2 />
            </button>
            <span>US</span>
          </span>

          {owner && (
            <button
              onClick={() => {
                dispatch(
                  openModal({
                    type: "UpdateVocabulary",
                    data: { vocabulary },
                  })
                );
              }}
            >
              chỉnh sửa
            </button>
          )}
        </div>
        <div>Định nghĩa:</div>
        <textarea defaultValue={vocabulary.mean}></textarea>
        {vocabulary.example && (
          <div>
            <div>Ví dụ:</div>
            <textarea defaultValue={vocabulary.example}></textarea>
          </div>
        )}
        {vocabulary.notes && (
          <div>
            <div>Ghi chú:</div>
            <textarea defaultValue={vocabulary.notes}></textarea>
          </div>
        )}
      </div>
      {vocabulary.image && (
        <div>
          <Image
            src={vocabulary.image}
            width={500}
            height={500}
            alt="Picture of the author"
          />
        </div>
      )}
      <div>
        {owner && (
          <AlertDialog>
            <AlertDialogTrigger disabled={deleting}>Xoá</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc là muốn xoá từ vựng này không?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Từ vựng sau khi bị xoá sẽ không thể khôi phục lại
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClickDelete}>
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};
