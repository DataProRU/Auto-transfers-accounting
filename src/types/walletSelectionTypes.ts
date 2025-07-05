import type { Wallet } from "@/types/types";

export interface OpenWalletSelectionPayload {
  invoiceId: number;
  isContractor: boolean;
}

export interface SetSelectedWalletPayload {
  walletId: string;
}

export interface SetWalletLoadingPayload {
  loading: boolean;
}

export interface SetWalletSubmittingPayload {
  submitting: boolean;
}

export interface SetWalletsPayload {
  wallets: Wallet[];
}

export interface SetWalletErrorPayload {
  error: string;
} 