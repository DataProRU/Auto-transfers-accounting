import type { FormData, OperationType } from "@/types/types";

export interface SelectOption {
  value: string;
  label: string;
  key: string;
}

// Функция для создания опций из массива объектов
export const createOptions = <T,>(
  items: T[],
  key: keyof T,
  labelFn?: (item: T) => string
): SelectOption[] =>
  items.map((item, index) => ({
    value: String(item[key]),
    label: labelFn ? labelFn(item) : String(item[key]),
    key: `${String(item[key])}-${index}`,
  }));

// Функция для проверки заполнения обязательных полей
export const areRequiredFieldsFilled = (
  formData: FormData,
  operation_types: OperationType[],
  operationId: string
): boolean => {
  try {
    const basicFields = [
      formData.company,
      formData.operation,
      formData.amount,
      formData.currency,
      formData.payment_type,
      formData.date_finish,
    ];

    const basicFieldsFilled = basicFields.every(
      (field) => field && field.trim() !== ""
    );

    if (!basicFieldsFilled) return false;

    const selectedOperation = operation_types.find(
      (op) => op.id === Number(operationId)
    );

    if (selectedOperation?.name === "Перемещение") {
      return (
        Boolean(formData.wallet_from) &&
        Boolean(formData.wallet_to) &&
        formData.wallet_from.trim() !== "" &&
        formData.wallet_to.trim() !== ""
      );
    } else if (
      selectedOperation?.name === "Выставить счёт" ||
      selectedOperation?.name === "Выставить расход"
    ) {
      return Boolean(formData.counterparty) && formData.counterparty.trim() !== "";
    } else if (
      selectedOperation?.name === "Приход" ||
      selectedOperation?.name === "Расход"
    ) {
      return Boolean(formData.wallet) && formData.wallet.trim() !== "";
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const getSelectedOperation = (
  operation_types: OperationType[],
  operationId: string
) => {
  return operation_types.find((op) => op.id === Number(operationId));
};

export const isCounterpartyFieldVisible = (operationName?: string): boolean => {
  return operationName === "Выставить расход" || operationName === "Выставить счёт";
};

export const shouldShowSuccessMessage = (
  success: boolean,
  operationName?: string
): boolean => {
  return (
    success &&
    operationName !== "Выставить счёт" &&
    operationName !== "Выставить расход"
  );
}; 