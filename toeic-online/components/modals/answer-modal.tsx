"use client";
import { RootState } from "@/lib/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { closeModal } from "@/lib/store/modal-slice";
import { mapOption } from "@/types";
import Image from "next/image";
export const AnswerModal = () => {
  const dispatch = useDispatch();
  const { isOpen, data, type } = useSelector((state: RootState) => state.modal);
  const { question, group } = data;
  const isModalOpen = isOpen && type === "Answer";
  if (!question || !group) {
    return null;
  }
  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        dispatch(closeModal());
      }}
    >
      <DialogContent
        ria-labelledby="dialog-title"
        className="w-[600px] max-w-full"
      >
        {/* Chỉnh độ dài ở đây nè nhưng tuyệt đối không được bỏ cái max-w-full */}
        <DialogHeader>
          <DialogTitle>Đáp án chi tiết # {question.serial}</DialogTitle>
        </DialogHeader>
        <div>
          {question.tags.map((tag, index) => (
            <span key={index}># {tag}</span>
          ))}
        </div>
        {group.audio && (
          <audio controls className="w-full mb-4">
            <source src={group.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        {group.image && (
          <Image
            src={group.image}
            width="500"
            height="0"
            sizes="100vw"
            className="h-auto mb-4"
            alt="Group Image"
            loading="lazy"
          />
        )}
        {group.documentText && (
          <div
            className="mb-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: group.documentText }}
          ></div>
        )}

        <div>{question.content}</div>
        <div>
          <div>{question.serial}</div>
          <div>
            <RadioGroup defaultValue={question.answer} disabled>
              {question.options.map((option, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem
                    value={mapOption[index]}
                    id={mapOption[index]}
                  />
                  <Label htmlFor={mapOption[index]}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>Đáp án đúng là {question.correctAnswer}</div>
          <div
            className="mb-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: question.answerExplanation }}
          ></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
