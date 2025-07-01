import React, { useState, useEffect, useCallback } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import type { Invoice } from "@/types/invoiceTypes";
import { fetchInvoicePdf } from "@/services/invoiceService";
import { copyToClipboard, downloadPdf } from "@/lib/invoiceUtils";
import PdfViewer from "@/components/PdfViewer/PdfViewer";
import { X } from "lucide-react";
import { Button } from "@/ui/button";
import Toast from "@/ui/toast";
import WalletSelectionModal from "./WalletSelectionModal";
import { setFormDataField } from "@/store/slices/reportSlice";

interface CounterpartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  refreshInvoices: () => Promise<void>;
}

const CounterpartyModal: React.FC<CounterpartyModalProps> = ({
  isOpen,
  onClose,
  invoice,
  refreshInvoices,
}) => {
  const dispatch = useAppDispatch();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent));

    if (!invoice) return;

    const loadPdf = async () => {
      console.log(`Fetching PDF for invoice ${invoice.id}`);
      setPdfLoading(true);
      try {
        const url = await fetchInvoicePdf(invoice.id);
        setPdfUrl(url);
      } catch (error: any) {
        setPdfError(error.message);
      } finally {
        setPdfLoading(false);
      }
    };
    loadPdf();

    return () => {
      if (pdfUrl) {
        console.log(`Revoking PDF URL for invoice ${invoice?.id}`);
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [invoice]);

  const handleCopyLink = useCallback(async () => {
    await copyToClipboard(pdfUrl || window.location.href);
    setShowToast(true);
  }, [pdfUrl]);

  const handleOpenWalletModal = useCallback(() => {
    setIsWalletModalOpen(true);
  }, []);

  const handleWalletModalConfirm = useCallback(() => {
    dispatch(setFormDataField({ name: "status", value: "Оплачен" }));
    setIsWalletModalOpen(false);
    onClose();
  }, [dispatch, onClose]);

  const handleWalletModalClose = useCallback(() => {
    setIsWalletModalOpen(false);
  }, []);

  if (!isOpen || !invoice) return null;

  const isContractor = invoice.operation_type.name === "Выставить счёт";

  return (
    <div
      className="fixed inset-0 bg-gray-800/60 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-black text-2xl"
          onClick={onClose}
          aria-label="Закрыть модальное окно"
        >
          <X className="size-6 bg-white" />
        </button>
        <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900">
          Счет №{invoice.id}
        </h2>
        <PdfViewer
          pdfUrl={pdfUrl}
          pdfError={pdfError}
          pdfLoading={pdfLoading}
          isMobile={isMobile}
        />
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-center">
          <Button
            variant="blue"
            size="default"
            className="w-full sm:w-auto font-light"
            onClick={handleCopyLink}
            disabled={!pdfUrl}
          >
            Скопировать ссылку
          </Button>
          <Button
            variant="gray"
            size="default"
            className="w-full sm:w-auto font-light"
            onClick={() =>
              pdfUrl && downloadPdf(pdfUrl, `invoice-${invoice.id}.pdf`)
            }
            disabled={!pdfUrl}
          >
            Скачать PDF
          </Button>
          <Button
            variant="green"
            size="default"
            className="w-full sm:w-auto font-light"
            onClick={handleOpenWalletModal}
          >
            Отметить оплаченным
          </Button>
        </div>
        <Toast
          message="Ссылка скопирована!"
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
        <WalletSelectionModal
          isOpen={isWalletModalOpen}
          onClose={handleWalletModalClose}
          invoiceId={invoice.id}
          isContractor={isContractor}
          refreshInvoices={refreshInvoices}
          onConfirm={handleWalletModalConfirm}
        />
      </div>
    </div>
  );
};

export default CounterpartyModal;
