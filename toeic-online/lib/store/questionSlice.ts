"use client";

import { QuestionAnswer } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapQuestion {
  [serial: string]: QuestionAnswer;
}

interface QuestionState {
  questions: MapQuestion;
}

export const questionSlice = createSlice({
  name: "question",
  initialState: {
    questions: {} as MapQuestion,
  } as QuestionState,
  reducers: {
    setQuestions: (state, action: PayloadAction<MapQuestion>) => {
      state.questions = action.payload;
    },
  },
});

// Export actions và reducer
export const { setQuestions } = questionSlice.actions;
export default questionSlice.reducer;
