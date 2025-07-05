import axios from "axios";

import type { InvoiceResponse } from "@/types/invoiceTypes";
import type { Wallet } from "@/types/types";

import $api from "@/setup/http/http";

export const fetchInvoices = async (): Promise<InvoiceResponse> => {
  try {
    const response = await $api.get("/api/invoices", { withCredentials: true });
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      (axios.isAxiosError(error) && error.response?.data?.message) ||
        "Не удалось загрузить счета"
    );
  }
};

export const fetchInvoicePdf = async (invoiceId: number): Promise<string> => {
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      document.cookie = `token=${token}; path=/;`;
    }
    const response = await $api.get(
      `/api/financial_operation/${invoiceId}/pdf`,
      {
        responseType: "blob",
        withCredentials: true,
        headers: {
          "Content-Type": "application/pdf",
        },
      }
    );
    if (response.data.type !== "application/pdf") {
      throw new Error("Получен неверный формат файла (не PDF)");
    }
    return URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
  } catch (error: unknown) {
    throw new Error(
      (axios.isAxiosError(error) && error.response?.data?.message) ||
        "Не удалось загрузить PDF. Проверьте соединение или сервер."
    );
  }
};

interface WalletResponse {
  id: number;
  name: string;
  user_id: number;
}

export const fetchWallets = async (): Promise<Wallet[]> => {
  try {
    const response = await $api.get<WalletResponse[]>("/wallets_react");
    const { data } = response;
    return data.map((w) => ({
      id: w.id,
      name: w.name,
      user_id: w.user_id || 0,
    }));
  } catch (error: unknown) {
    console.error("fetchWallets error:", error);
    throw new Error(
      (error instanceof Error && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : null) || "Не удалось загрузить кошельки"
    );
  }
};

export const markInvoiceAsPaid = async (
  invoiceId: number,
  walletId: number
): Promise<void> => {
  try {
    await $api.patch(`/api/invoices/${invoiceId}/pay`, {
      is_paid: true,
      wallet_id: walletId,
    });
  } catch (error: unknown) {
    throw new Error(
      (axios.isAxiosError(error) && error.response?.data?.message) ||
        "Не удалось обновить статус счета"
    );
  }
};
