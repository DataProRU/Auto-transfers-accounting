export interface Wallet {
  id: number;
  name: string;
  user_id: number; // Изменено с username на user_id
}

export interface Company {
  id: number;
  name: string;
  categories: {
    id: number;
    name: string;
    operation_id: number;
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
  operations: { id: number; name: string }[];
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
