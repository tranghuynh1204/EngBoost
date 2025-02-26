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
import { GroupItem } from "../group/group-item";

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
        aria-labelledby="dialog-title"
        className="w-[900px] max-h-[90vh] max-w-full overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Đáp án chi tiết #{question.serial}
          </DialogTitle>
        </DialogHeader>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="text-[12px] px-2 py-1 rounded bg-[rgb(242,255,233)] text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
        {/* Group Information */}
        <GroupItem group={group} />
        {/* Question Content */}
        <div className="mb-4">
          <strong className="text-gray-900 text-base">
            {question.serial}. {question.content}
          </strong>
        </div>
        {/* Options */}
        <div className="mb-4">
          <RadioGroup defaultValue={question.answer} disabled>
            {question.options.map((option, index) => {
              const isCorrect = mapOption[index] === question.correctAnswer;
              const isUserAnswer = mapOption[index] === question.answer;
              const isWrongAnswer = isUserAnswer && !isCorrect;

              return (
                <div
                  className={`flex items-center space-x-2 ${
                    isCorrect
                      ? "text-[rgb(85,124,85)] font-semibold"
                      : isWrongAnswer
                      ? "text-black"
                      : "text-gray-900"
                  }`}
                  key={index}
                >
                  {/* Nút chọn đáp án */}
                  <RadioGroupItem
                    value={mapOption[index]}
                    id={mapOption[index]}
                    className={`h-4 w-4 rounded-full border-2 ${
                      isCorrect
                        ? "border-[rgb(85,124,85)] bg-black"
                        : isWrongAnswer
                        ? "border-red-600 bg-black "
                        : "border-gray-400 bg-white"
                    }`}
                  />
                  {/* Nội dung đáp án */}
                  <Label
                    htmlFor={mapOption[index]}
                    className={`text-base ${
                      isCorrect
                        ? "text-[rgb(85,124,85)] font-semibold"
                        : isWrongAnswer
                        ? "text-[rgb(250,112,112)]"
                        : "text-gray-900"
                    }`}
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
        {/* Answer Explanation */}
        <div
          className="mb-4 text-gray-700 italic text-sm"
          dangerouslySetInnerHTML={{ __html: question.answerExplanation }}
        ></div>
      </DialogContent>
    </Dialog>
  );
};
