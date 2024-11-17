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
        {group.audio && <div>{group.audio}</div>}
        {group.image && <div>{group.image}</div>}
        {group.documentText && (
          <div dangerouslySetInnerHTML={{ __html: group.documentText }} />
        )}
        <div>{group.transcript}</div>
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
                  <Label htmlFor={mapOption[index]}>
                    {mapOption[index]}.{option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>Đáp án đúng là {question.correctAnswer}</div>
          <div>{question.answerExplanation}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
