"use client";

import { MapGroup, MapQuestion } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    mapQuestion: {} as MapQuestion,
    mapGroup: {} as MapGroup,
  },
  reducers: {
    setMapQuestion: (state, action: PayloadAction<MapQuestion>) => {
      state.mapQuestion = action.payload;
    },
    setMapGroup: (state, action: PayloadAction<MapGroup>) => {
      state.mapGroup = action.payload;
    },
  },
});

// Export actions và reducer
export const { setMapQuestion, setMapGroup } = dataSlice.actions;
export default dataSlice.reducer;
