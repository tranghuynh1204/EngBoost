// store/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
}

const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      return {
        isLoggedIn: true,
        accessToken: token,
      };
    }
  }
  return {
    isLoggedIn: false,
    accessToken: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<string>) {
      state.isLoggedIn = true;
      state.accessToken = action.payload;
    },
    setLogout(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
