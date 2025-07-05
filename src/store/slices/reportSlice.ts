import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ReportState, FormData } from "../../types/types";

import { fetchInitialData, submitForm } from "../../services/reportService";

interface SetFormFieldPayload {
  name: keyof FormData;
  value: string;
}

interface SetLoadingPayload {
  loading: boolean;
}

interface SetSuccessPayload {
  success: boolean;
}

const initialFormData: FormData = {
  username: "",
  date: new Date().toISOString().split("T")[0],
  operation: "",
  category: "",
  article: "",
  date_finish: "",
  amount: "",
  currency: "",
  payment_type: "",
  comment: "",
  wallet_from: "",
  wallet_to: "",
  wallet: "",
  company: "",
  counterparty: "",
  status: "",
};

const initialState: ReportState = {
  formData: initialFormData,
  operation_types: [], 
  wallets: [],
  categoryArticles: {},
  operationCategories: {},
  paymentTypes: [],
  currencies: [],
  companies: [],
  counterparties: [],
  loading: false,
  success: false,
  error: null,
  };




const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setFormDataField: (
      state,
      action: PayloadAction<SetFormFieldPayload>
    ) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetFormData: (state) => {
      state.formData = { ...initialFormData };
    },
    resetAccountingFields: (state) => {
      state.formData.category = "";
      state.formData.article = "";
      state.formData.wallet_from = "";
      state.formData.wallet_to = "";
    },
    resetAccountType: (state) => {
      state.formData.article = "";
    },
    setLoading: (state, action: PayloadAction<SetLoadingPayload>) => {
      state.loading = action.payload.loading;
    },
    setSuccess: (state, action: PayloadAction<SetSuccessPayload>) => {
      state.success = action.payload.success;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.loading = false;
        state.operation_types = action.payload.operation_types || [];
        state.wallets = action.payload.wallets || [];
        state.categoryArticles = action.payload.categoryArticles || {};
        state.operationCategories = action.payload.operationCategories || {};
        state.paymentTypes = action.payload.paymentTypes || [];
        state.currencies = action.payload.currencies || [];
        state.companies = action.payload.companies || [];
        state.counterparties = action.payload.counterparties || [];
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitForm.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.formData = { ...initialFormData };
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFormDataField,
  resetFormData,
  resetAccountingFields,
  resetAccountType,
  setLoading,
  setSuccess,
  clearError,
  resetState,
} = reportSlice.actions;

export default reportSlice.reducer;
