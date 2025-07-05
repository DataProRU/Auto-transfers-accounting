export interface Article {
  id: number;
  title: string;
}

export interface Category {
  id: number;
  name: string;
  operation_type_id: number;
  articles: Article[];
}

export interface Company {
  id: number;
  name: string;
  phone: string;
  address: string;
  categories: Category[];
}

export interface Counterparty {
  id: number;
  full_name: string;
}

export interface Wallet {
  id: number;
  name: string;
  user_id: number;
}

export interface OperationType {
  id: number;
  name: string;
}

export interface PaymentType {
  id: number;
  name: string;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
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
  operation_types: OperationType[];
  wallets: Wallet[];
  categoryArticles: Record<string, string[]>;
  operationCategories: Record<string, string[]>;
  paymentTypes: PaymentType[];
  currencies: Currency[];
  companies: Company[];
  counterparties: Counterparty[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

export interface IInitialDataResponse {
  companies: Company[];
  operation_types: OperationType[];
  payment_types: PaymentType[];
  wallets: Wallet[];
  currencies: Currency[];
  counterparties: Counterparty[];
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
