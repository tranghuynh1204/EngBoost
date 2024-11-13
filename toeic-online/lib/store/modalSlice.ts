"use client";

import { QuestionAnswer } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  type: string | null; // Kiểu của type, ví dụ: string hoặc null
  data: QuestionAnswer | null;
  isOpen: boolean;
}

const initialState: ModalState = {
  type: null,
  data: null,
  isOpen: false,
};

export const modalSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ type: string; data: any }>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.data = null;
      state.type = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
