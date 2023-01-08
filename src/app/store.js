import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import accountSlice from "slices/accountSlice";
import customerSlice from "slices/customerSlice";

export const store = configureStore({
  reducer: {
    customer: customerSlice,
    account: accountSlice,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
  // devTools: true,
});
