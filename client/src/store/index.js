import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../slice/auth";
import AlertReducer from "../slice/alert";

export default configureStore({
  reducer: {
    auth: AuthReducer,
    alert: AlertReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
