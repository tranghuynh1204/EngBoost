"use client";

import { MapGroup, MapQuestion } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    mapQuestion: {} as MapQuestion,
    mapGroup: {} as MapGroup,
    isLogin: false,
  },
  reducers: {
    setMapQuestion: (state, action: PayloadAction<MapQuestion>) => {
      state.mapQuestion = action.payload;
    },
    setMapGroup: (state, action: PayloadAction<MapGroup>) => {
      state.mapGroup = action.payload;
    },
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
  },
});

// Export actions và reducer
export const { setMapQuestion, setMapGroup, setIsLogin } = dataSlice.actions;
export default dataSlice.reducer;
