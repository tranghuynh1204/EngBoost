import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import questionReducer from "./questionSlice";
export const makeStore = () => {
  return configureStore({
    reducer: { modal: modalReducer, question: questionReducer },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
