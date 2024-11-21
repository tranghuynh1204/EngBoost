"use client";

import { Group, Question, Vocabulary } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  type: ModalType; // Kiểu của type, ví dụ: string hoặc null
  data: ModalData;
  isOpen: boolean;
}
type ModalType = "Answer" | "CreateVocabulary" | "UpdateVocabulary" | null;
interface ModalData {
  length: number;
  question?: Question;
  group?: Group;
  vocabulary?: Vocabulary;
}
const initialState: ModalState = {
  type: null,
  data: {},
  isOpen: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: ModalType; data: ModalData }>
    ) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.data = {};
      state.type = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
