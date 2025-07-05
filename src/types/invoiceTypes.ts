interface Invoice {
  id: number;
  company: { id: number; name: string };
  counterparty: { id: number; full_name: string };
  currency: { id: number; code: string; symbol: string };
  operation_type: { id: number; name: string };
  category: { id: number; name: string };
  article: { id: number; title: string };
  payment_type: { id: number; name: string };
  date: string;
  finish_date: string;
  amount: number;
  is_paid: boolean;
  created_at: string;
  comment: string;
}

interface InvoiceResponse {
  items: Invoice[];
  total: number;
}

interface InvoiceState {
  view: "contractors" | "expenses" | null;
  invoices: InvoiceResponse;
  loading: boolean;
  error: string | null;
}

interface Wallet {
  id: number;
  name: string;
  user_id: number;
}

export type { Invoice, InvoiceResponse, InvoiceState, Wallet };
