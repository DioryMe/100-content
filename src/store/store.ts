import { configureStore } from "@reduxjs/toolkit";
import dioryReducer from "./diorySlice";

export const store = configureStore({
  reducer: {
    diory: dioryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
