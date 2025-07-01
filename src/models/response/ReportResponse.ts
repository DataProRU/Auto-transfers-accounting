import type { ICurrency } from "@/types/types";

export interface IInitialDataResponse {
  operation_types: { id: number; name: string }[] | undefined;
  username: string;
  operations: { id: number; name: string }[];
  wallets: { id: number; name: string; user_id: number }[];
  category_articles: Record<string, string[]>;
  operation_categories: Record<string, string[]>;
  payment_types: { id: number; name: string }[];
  currencies: ICurrency[];
  companies: {
    id: number;
    name: string;
    categories: {
      id: number;
      name: string;
      operation_id: number;
      articles: { id: number; title: string }[];
    }[];
  }[];
  counterparties: { id: number; full_name: string; email: string }[];
}

export interface ISubmitPayload {
  username: string;
  company_id: number;
  operation_type_id: number;
  date: string;
  amount: number;
  category_id: number | null;
  article_id: number | null;
  finish_date: string;
  payment_type_id: number;
  comment: string;
  wallet_id: number;
  wallet_from_id: number;
  wallet_to_id: number;
  counterparty_id: number;
  currency_id: number | null;
}
