import type { RootState } from "../store";
import type { Wallet } from "@/types/types";

// Базовые селекторы
export const selectWalletSelection = (state: RootState) => state.walletSelection;
export const selectIsWalletModalOpen = (state: RootState): boolean => state.walletSelection.isOpen;
export const selectWalletModalInvoiceId = (state: RootState): number | null => state.walletSelection.invoiceId;
export const selectWalletModalIsContractor = (state: RootState): boolean => state.walletSelection.isContractor;
export const selectWalletSelectionWallets = (state: RootState): Wallet[] => state.walletSelection.wallets;
export const selectWalletSelectionSelectedWallet = (state: RootState): string => state.walletSelection.selectedWallet;
export const selectWalletLoading = (state: RootState): boolean => state.walletSelection.loading;
export const selectWalletSubmitting = (state: RootState): boolean => state.walletSelection.submitting;
export const selectWalletError = (state: RootState): string | null => state.walletSelection.error;

// Вычисляемые селекторы
export const selectWalletOptions = (state: RootState) => {
  const wallets = selectWalletSelectionWallets(state);
  return wallets.map((wallet: Wallet, index: number) => ({
    value: String(wallet.id),
    label: wallet.name,
    key: `${wallet.id}-${index}`,
  }));
};

export const selectSelectedWalletData = (state: RootState): Wallet | undefined => {
  const selectedWalletId = selectWalletSelectionSelectedWallet(state);
  const wallets = selectWalletSelectionWallets(state);
  return wallets.find((wallet: Wallet) => String(wallet.id) === selectedWalletId);
};

// Селекторы для UI состояния
export const selectCanConfirmWalletSelection = (state: RootState): boolean => {
  const selectedWallet = selectWalletSelectionSelectedWallet(state);
  const loading = selectWalletLoading(state);
  const submitting = selectWalletSubmitting(state);
  
  return Boolean(selectedWallet) && selectedWallet.trim() !== "" && !loading && !submitting;
};

export const selectShowWalletSelectionModal = (state: RootState): boolean => {
  const isOpen = selectIsWalletModalOpen(state);
  const loading = selectWalletLoading(state);
  const submitting = selectWalletSubmitting(state);
  
  return isOpen && !loading && !submitting;
};

export const selectWalletSelectionDisabled = (state: RootState): boolean => {
  const loading = selectWalletLoading(state);
  const submitting = selectWalletSubmitting(state);
  
  return loading || submitting;
}; 