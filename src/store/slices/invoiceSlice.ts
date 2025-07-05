import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { InvoiceState, InvoiceResponse } from "@/types/invoiceTypes";

import { fetchInvoices as fetchInvoicesService } from "@/services/invoiceService";


interface SetViewPayload {
  view: "contractors" | "expenses" | null;
}

interface SetInvoicesPayload {
  invoices: InvoiceResponse;
}


const initialState: InvoiceState = {
  view: null,
  invoices: { items: [], total: 0 },
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk(
  "invoice/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchInvoicesService();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Не удалось загрузить счета";
      return rejectWithValue(errorMessage);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setView(state, action: PayloadAction<SetViewPayload>) {
      state.view = action.payload.view;
    },
    setInvoices(state, action: PayloadAction<SetInvoicesPayload>) {
      state.invoices = action.payload.invoices;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setView, setInvoices } = invoiceSlice.actions;
export default invoiceSlice.reducer;
