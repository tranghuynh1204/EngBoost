"use client";
import { RootState } from "@/lib/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closeModal } from "@/lib/store/modalSlice";

export const AnswerModal = () => {
  const dispatch = useDispatch();
  const { isOpen, data, type } = useSelector((state: RootState) => state.modal);
  const isModalOpen = isOpen && type === "answer";
  if (!data) {
    return null;
  }
  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        dispatch(closeModal());
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đáp án chi tiết # {data.serial}</DialogTitle>
        </DialogHeader>
        <div>
          {data.tags.map((tag, index) => (
            <span key={index}># {tag}</span>
          ))}
        </div>
        <div>{data.content}</div>
        <div>{data.image}</div>
      </DialogContent>
    </Dialog>
  );
};
