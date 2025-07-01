import React, { useState, useEffect } from "react";

import type { Wallet } from "@/types/invoiceTypes";
import { Button } from "@/ui/button";
import SelectField from "@/ui/select-field";
import { X } from "lucide-react";
import { fetchWallets, markInvoiceAsPaid } from "@/services/invoiceService";

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: number;
  isContractor: boolean;
  refreshInvoices: () => Promise<void>;
  onConfirm: () => void;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  isOpen,
  onClose,
  invoiceId,
  isContractor,
  refreshInvoices,
  onConfirm,
}) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Отдельное состояние для загрузки при сохранении
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadWallets = async () => {
      setLoading(true);
      try {
        const walletData = await fetchWallets();
        setWallets(walletData);
      } catch (error: any) {
        setError(error.message || "Не удалось загрузить кошельки");
      } finally {
        setLoading(false);
      }
    };
    loadWallets();
  }, [isOpen]);

  const createWalletOptions = (wallets: Wallet[]) =>
    wallets.map((wallet, index) => ({
      value: String(wallet.id),
      label: `${wallet.name}`,
      key: `${wallet.id}-${index}`,
    }));

  const walletOptions = createWalletOptions(wallets);

  const handleChange = (_name: string, value: string) => {
    setSelectedWallet(value);
    setError(null);
  };

  const handleConfirm = async () => {
    if (!selectedWallet) {
      setError("Пожалуйста, выберите кошелек");
      return;
    }

    setSubmitting(true);
    try {
      await markInvoiceAsPaid(invoiceId, parseInt(selectedWallet));
      await refreshInvoices();
      onConfirm();
    } catch (error: any) {
      setError(error.message || "Не удалось отметить счет как оплаченный");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchWallets()
      .then((walletData) => {
        setWallets(walletData);
        setLoading(false);
      })
      .catch((error: any) => {
        setError(error.message || "Не удалось загрузить кошельки");
        setLoading(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800/60 flex items-center justify-center z-[60] px-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Закрыть модальное окно"
          disabled={submitting}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-2 text-gray-900 pr-8">
          Укажите кошелек,
        </h2>
        <p className="text-xl font-bold mb-6 text-gray-900">
          {isContractor
            ? "на который поступили средства"
            : "с которого будут списаны средства"}
        </p>

        {loading ? (
          <p className="text-gray-500 text-center mb-6">
            Загрузка кошельков...
          </p>
        ) : error ? (
          <div className="text-center mb-4">
            <p className="text-red-500">{error}</p>
            <Button
              variant="blue"
              size="default"
              className="mt-2 w-full sm:w-auto font-light"
              onClick={handleRetry}
              disabled={submitting}
            >
              Повторить
            </Button>
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center mb-6">
            <p className="text-gray-500">Кошельки не найдены</p>
            <Button
              variant="blue"
              size="default"
              className="mt-2 w-full sm:w-auto font-light"
              onClick={handleRetry}
              disabled={submitting}
            >
              Повторить
            </Button>
          </div>
        ) : (
          <div className="mb-6">
            <SelectField
              name="wallet"
              value={selectedWallet}
              options={walletOptions}
              placeholder="Выпадающий список"
              onChange={handleChange}
              required
              error={error && !selectedWallet ? "Выберите кошелек" : undefined}
              className="w-full text-sm text-black"
            />
          </div>
        )}

        <Button
          variant="active"
          size="lg"
          className="w-full text-lg"
          onClick={handleConfirm}
          disabled={!selectedWallet || loading || submitting}
        >
          {submitting ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ"}
        </Button>
      </div>
    </div>
  );
};

export default WalletSelectionModal;
