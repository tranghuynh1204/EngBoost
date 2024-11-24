import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modal-slice";
import dataReducer from "./data-slice";
export const makeStore = () => {
  return configureStore({
    reducer: { modal: modalReducer, data: dataReducer },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
