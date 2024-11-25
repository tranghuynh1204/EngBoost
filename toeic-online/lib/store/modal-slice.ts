"use client";

import { Flashcard, Group, Question, Vocabulary } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  type: ModalType; // Kiểu của type, ví dụ: string hoặc null
  data: ModalData;
  isOpen: boolean;
  isReload: boolean;
}
type ModalType =
  | "Answer"
  | "CreateVocabulary"
  | "UpdateVocabulary"
  | "UpdateFlashcard"
  | "CreateFlashcard"
  | null;
interface ModalData {
  question?: Question;
  group?: Group;
  vocabulary?: Vocabulary;
  flashcard?: Flashcard;
}
const initialState: ModalState = {
  type: null,
  data: {},
  isOpen: false,
  isReload: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        type: ModalType;
        data: ModalData;
        isReload?: boolean;
      }>
    ) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data;
      state.isReload = action.payload.isReload || false;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.data = {};
      state.type = null;
      state.isReload = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
