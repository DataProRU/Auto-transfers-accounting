import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { fetchInvoices as fetchInvoicesService } from "@/services/invoiceService";
import type { InvoiceState, InvoiceResponse } from "@/types/invoiceTypes";

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
    } catch (error: any) {
      return rejectWithValue(error.message || "Не удалось загрузить счета");
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setView(state, action: PayloadAction<"contractors" | "expenses" | null>) {
      state.view = action.payload;
    },
    setInvoices(state, action: PayloadAction<InvoiceResponse>) {
      state.invoices = action.payload;
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
