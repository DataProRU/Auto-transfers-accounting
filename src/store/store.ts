import { configureStore } from "@reduxjs/toolkit";
import reportReducer from "./slices/reportSlice";
import authReducer from "./slices/authSlice";
import invoiceReducer from "./slices/invoiceSlice";

export const store = configureStore({
  reducer: {
    report: reportReducer,
    auth: authReducer,
    invoice: invoiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
