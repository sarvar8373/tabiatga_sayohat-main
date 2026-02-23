import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem } from "../helpers/persistans";

const initialState = {
  isLoading: false,
  loggedIn: !!getItem("token"),
  error: null,
  user: null,
  Result: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loggedIn = true;
      state.isLoading = false;
      state.user = action.payload.user;
      setItem("token", action.payload.token);
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getUsersStart: (state) => {
      state.isLoading = true;
    },
    getUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.Result = action.payload;
    },
    getUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
