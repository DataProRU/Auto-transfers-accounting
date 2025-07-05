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

export interface OperationType {
  id: number;
  name: string;
}

export interface PaymentType {
  id: number;
  name: string;
}

export interface Wallet {
  id: number;
  name: string;
  user_id: number;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
}

export interface Counterparty {
  id: number;
  full_name: string;
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
