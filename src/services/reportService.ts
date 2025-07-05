import { createAsyncThunk } from "@reduxjs/toolkit";

import type { ReportState, FormData, Company, OperationType, Wallet, Currency, Counterparty } from "../types/types";
import type {
  IInitialDataResponse,
  ISubmitPayload,
} from "@/models/response/ReportResponse";

import { $api } from "@/setup/http/http";

export const fetchInitialData = createAsyncThunk<
  Partial<ReportState>,
  void,
  { rejectValue: string }
>("report/fetchInitialData", async (_, { rejectWithValue }) => {
  try {
    const response = await $api.get<IInitialDataResponse>("/get_form_data");
    const { data } = response;

    const companies = data.companies.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      address: c.address,
      categories: c.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        operation_type_id: cat.operation_type_id,
        articles: cat.articles.map((art) => ({
          id: art.id,
          title: art.title,
        })),
      })),
    }));

    const counterparties = data.counterparties.map((c) => ({
      id: c.id,
      full_name: c.full_name,
    }));

    const operationCategories: Record<string, string[]> = {};
    companies.forEach((company) => {
      company.categories.forEach(
        (category: { operation_type_id: number; name: string }) => {
          const opId = String(category.operation_type_id);
          if (!operationCategories[opId]) {
            operationCategories[opId] = [];
          }
          if (!operationCategories[opId].includes(category.name)) {
            operationCategories[opId].push(category.name);
          }
        }
      );
    });

    const categoryArticles: Record<string, string[]> = {};
    data.companies.forEach((company) => {
      company.categories.forEach(
        (category: { name: string | number; articles: { id: number; title: string }[] }) => {
          categoryArticles[category.name] = category.articles.map(
            (article) => article.title
          );
        }
      );
    });

    return {
      ...data,
      operation_types: data.operation_types,
      companies,
      counterparties,
      wallets: data.wallets.map((w) => ({
        id: w.id,
        name: w.name,
        user_id: w.user_id || 0,
      })),
      categoryArticles,
      operationCategories,
      paymentTypes: data.payment_types.map((pt) => ({
        id: pt.id,
        name: pt.name,
      })),
      currencies: data.currencies.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        symbol: c.symbol,
      })),
    };
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Ошибка загрузки данных"
      );
    }
    return rejectWithValue("Ошибка загрузки данных");
  }
});

export const submitForm = createAsyncThunk<
  void,
  FormData & {
    operation_types: OperationType[];
    wallets: Wallet[];
    companies: Company[];
    currencies: Currency[];
    counterparties: Counterparty[];
    username: string;
  },
  { rejectValue: string }
>(
  "report/submitForm",
  async (
    {
      operation_types,
      wallets,
      companies,
      currencies,
      counterparties,
      username,
      ...formData
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("submitForm called with:", {
        formData,
        operation_types,
        wallets,
        companies,
        currencies,
        counterparties,
        username,
      });

      const operation = operation_types.find(
        (op) => op.id === Number(formData.operation)
      );
      let categoryId: number | null = null;
      let articleId: number | null = null;
      if (formData.category && formData.article) {
        for (const company of companies) {
          const category = company.categories.find(
            (cat) => cat.name === formData.category
          );
          if (category) {
            categoryId = category.id;
            const article = category.articles.find(
              (art) => art.title === formData.article
            );
            if (article) {
              articleId = article.id;
            }
            break;
          }
        }
      }

      const currency = currencies.find((cur) => cur.code === formData.currency);
      const currencyId = currency ? currency.id : null;

      const counterpartyId = formData.counterparty
        ? Number(formData.counterparty)
        : 0;

      const isTransfer = operation?.name === "Перемещение";

      const payload: ISubmitPayload = {
        username: localStorage.getItem("username") || "",
        company_id: formData.company ? Number(formData.company) : 0,
        operation_type_id: formData.operation ? Number(formData.operation) : 0,
        date: formData.date || "",
        amount: parseFloat(formData.amount) || 0,
        category_id: isTransfer ? null : categoryId,
        article_id: isTransfer ? null : articleId,
        finish_date: isTransfer ? "" : formData.date_finish || "",
        payment_type_id: formData.payment_type
          ? Number(formData.payment_type)
          : 0,
        comment: formData.comment || "",
        wallet_id: formData.wallet ? Number(formData.wallet) : 0,
        wallet_from_id: formData.wallet_from ? Number(formData.wallet_from) : 0,
        wallet_to_id: formData.wallet_to ? Number(formData.wallet_to) : 0,
        counterparty_id: counterpartyId,
        currency_id: currencyId,
      };

      if (!payload.currency_id) {
        return rejectWithValue("currency_id обязателен и должен быть числом");
      }

      if (
        (operation?.name === "Выставить счёт" ||
          operation?.name === "Выставить расход") &&
        !payload.counterparty_id
      ) {
        console.error(
          "Validation failed: counterparty_id is missing or invalid for operation",
          operation?.name
        );
        return rejectWithValue(
          "counterparty_id обязателен для операций 'Выставить счёт' и 'Выставить расход'"
        );
      }

      const response = await $api.post<ISubmitPayload, void>(
        "/submit",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("API response:", response);

      return response;
    } catch (error: unknown) {
      console.error("submitForm error:", error);
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return rejectWithValue(
          axiosError.response?.data?.message || "Ошибка при отправке формы"
        );
      }
      return rejectWithValue("Ошибка при отправке формы: " + String(error));
    }
  }
);
