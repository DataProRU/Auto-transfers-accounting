import axios from "axios";

import type { InvoiceResponse, Wallet } from "@/types/invoiceTypes";
import $api, { API_URL } from "@/setup/http/http";

export const fetchInvoices = async (): Promise<InvoiceResponse> => {
  try {
    const response = await axios.get(`${API_URL}/api/invoices`);
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
    const response = await axios.get(
      `${API_URL}/api/financial_operation/${invoiceId}/pdf`,
      { responseType: "blob" }
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

interface FormDataResponse {
  wallets: { id: number; name: string; user_id: number }[];
}

export const fetchWallets = async (): Promise<Wallet[]> => {
  try {
    const response = await $api.get<FormDataResponse>("/get_form_data");
    const { data } = response;
    console.log("fetchWalletsFromFormData response:", data);
    return data.wallets.map((w) => ({
      id: w.id,
      name: w.name,
      user_id: w.user_id || 0,
    }));
  } catch (error: unknown) {
    console.error("fetchWalletsFromFormData error:", error);
    throw new Error(
      (error instanceof Error && "response" in error
        ? (error as any).response?.data?.message
        : null) || "Не удалось загрузить кошельки"
    );
  }
};

export const markInvoiceAsPaid = async (
  invoiceId: number,
  walletId: number
): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/api/invoices/${invoiceId}/pay`, {
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
