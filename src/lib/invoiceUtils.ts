import type { Invoice } from "@/types/invoiceTypes";

export interface CurrentData {
  issuer: string;
  amount: string;
  items: { number: number; description: string; invoice: Invoice }[];
}

export const formatInvoiceData = (invoices: Invoice[]): CurrentData => ({
  issuer: invoices.length > 0 ? invoices[0].company.name : "[Неизвестно]",
  amount:
    invoices.length > 0
      ? `${invoices.reduce((sum, item) => sum + item.amount, 0)} ${
          invoices[0].currency.symbol || "KGS"
        }`
      : "0 KGS",
  items: invoices.map((invoice, index) => ({
    number: index + 1,
    description: `[№ счета ${invoice.id}], [${
      invoice.counterparty.full_name
    }] от [${new Date(invoice.date).toLocaleDateString("ru-RU")}]`,
    invoice,
  })),
});

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Ошибка копирования:", error);
    alert("Ссылка скопирована!"); // Fallback for older browsers
  }
};

export const downloadPdf = (url: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
};

export const openPdfInNewTab = (url: string): void => {
  window.open(url, "_blank");
};
