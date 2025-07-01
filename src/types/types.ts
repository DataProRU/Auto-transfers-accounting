export interface Wallet {
  id: number;
  name: string;
  user_id: number;
}

export interface Company {
  id: number;
  name: string;
  categories: {
    id: number;
    name: string;
    operation_type_id: number; // Изменено с operation_id на operation_type_id
    articles: { id: number; title: string }[];
  }[];
}

export interface Counterparty {
  id: number;
  full_name: string;
}

export interface FormData {
  status: string;
  company: string;
  date: string;
  operation: string;
  wallet_from: string;
  wallet_to: string;
  category: string;
  article: string;
  date_finish: string;
  amount: string;
  payment_type: string;
  comment: string;
  currency: string;
  wallet: string;
  username: string;
  counterparty: string;
  
}

export interface ReportState {
  formData: FormData;
  operation_types: { id: number; name: string }[];
  wallets: Wallet[];
  categoryArticles: Record<string, string[]>;
  operationCategories: Record<string, string[]>;
  paymentTypes: { id: number; name: string }[];
  currencies: ICurrency[];
  companies: Company[];
  counterparties: Counterparty[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

export interface ICurrency {
  id: number;
  code: string;
  name: string;
  symbol: string;
}

export interface IInitialDataResponse {
  username: string;
  operation_types: { id: number; name: string }[];
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
      operation_type_id: number; 
      articles: { id: number; title: string }[];
    }[];
  }[];
  counterparties: { id: number; full_name: string; email: string }[];
}

export interface ISubmitPayload {
  username: string;
  company_id: number;
  operation_id: number;
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
