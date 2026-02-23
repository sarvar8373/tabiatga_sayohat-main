import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  severity: "success",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || "success";
    },
    closeAlert: (state) => {
      state.open = false;
    },
  },
});

export const { setAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
