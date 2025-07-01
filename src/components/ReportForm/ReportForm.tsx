import React, { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { DatePicker } from "@/ui/date-picker";
import ErrorMessage from "@/ui/error-message";
import SelectField from "@/ui/select-field";
import {
  setFormDataField,
  resetAccountingFields,
  resetAccountType,
  setSuccess,
} from "@/store/slices/reportSlice";
import { fetchInitialData, submitForm } from "@/services/reportService";
import { fetchInvoices } from "@/services/invoiceService";
import TransferForm from "../TransferForm/TransferForm";
import NoneTransferForm from "../NoneTransferForm/NoneTransferForm";
import SuccessMessage from "@/ui/success-message";
import Loader from "@/ui/loader";
import { z } from "zod";
import CounterpartyModal from "../Modals/CounterpartyModal";
import type { Invoice } from "@/types/invoiceTypes";

const baseSchema = z.object({
  company: z.string().min(1, "Компания обязательна"),
  operation: z.string().min(1, "Вид операции обязателен"),
  amount: z
    .string()
    .min(1, "Сумма обязательна")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Сумма должна быть положительным числом",
    }),
  currency: z.string().min(1, "Валюта обязательна"),
  payment_type: z.string().min(1, "Способ оплаты обязателен"),
  date_finish: z.string().min(1, "Дата обязательна"),
  comment: z.string().optional(),
  wallet: z.string().optional(),
  wallet_from: z.string().optional(),
  wallet_to: z.string().optional(),
  category: z.string().optional(),
  article: z.string().optional(),
  counterparty: z.string().optional(),
});

const ReportForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    formData,
    operation_types,
    wallets,
    categoryArticles,
    operationCategories,
    paymentTypes,
    currencies,
    companies,
    counterparties,
    loading,
    success,
    error,
  } = useAppSelector((state) => state.report);

  const params = new URLSearchParams(location.search);
  const username = params.get("username") || "";

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);

  const refreshInvoices = useCallback(async () => {
    try {
      const invoicesResponse = await fetchInvoices();
      if (invoicesResponse && invoicesResponse.items) {
        console.log("Invoices fetched successfully:", invoicesResponse.items);
      } else {
        console.error("Failed to fetch invoices: No items in response");
      }
    } catch (err) {
      console.error("Ошибка обновления счетов:", err);
    }
  }, []);

  const createOptions = <T,>(
    items: T[],
    key: keyof T,
    labelFn?: (item: T) => string
  ) =>
    items.map((item, index) => ({
      value: String(item[key]),
      label: labelFn ? labelFn(item) : String(item[key]),
      key: `${String(item[key])}-${index}`,
    }));

  const getValidationSchema = () => {
    const selectedOperation = operation_types.find(
      (op) => op.id === Number(formData.operation)
    );

    if (selectedOperation?.name === "Перемещение") {
      return z.object({
        company: z.string().min(1, "Компания обязательна"),
        operation: z.string().min(1, "Вид операции обязателен"),
        amount: z
          .string()
          .min(1, "Сумма обязательна")
          .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Сумма должна быть положительным числом",
          }),
        currency: z.string().min(1, "Валюта обязательна"),
        payment_type: z.string().min(1, "Способ оплаты обязателен"),
        date_finish: z.string().min(1, "Дата обязательна"),
        comment: z.string().optional(),
        wallet_from: z.string().min(1, "Кошелёк отправителя обязателен"),
        wallet_to: z.string().min(1, "Кошелёк получателя обязателен"),
        wallet: z.string().optional(),
        category: z.string().optional(),
        article: z.string().optional(),
        counterparty: z.string().optional(),
      });
    } else if (
      selectedOperation?.name === "Выставить счёт" ||
      selectedOperation?.name === "Выставить расход"
    ) {
      return z.object({
        company: z.string().min(1, "Компания обязательна"),
        operation: z.string().min(1, "Вид операции обязателен"),
        amount: z
          .string()
          .min(1, "Сумма обязательна")
          .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Сумма должна быть положительным числом",
          }),
        currency: z.string().min(1, "Валюта обязательна"),
        payment_type: z.string().min(1, "Способ оплаты обязателен"),
        date_finish: z.string().min(1, "Дата обязательна"),
        comment: z.string().optional(),
        counterparty: z
          .string()
          .min(1, "Контрагент обязателен")
          .refine((val) => counterparties.find((cp) => String(cp.id) === val), {
            message: "Выберите действительного контрагента",
          }),
        wallet: z.string().optional(),
        wallet_from: z.string().optional(),
        wallet_to: z.string().optional(),
        category: z.string().optional(),
        article: z.string().optional(),
      });
    } else if (
      selectedOperation?.name === "Приход" ||
      selectedOperation?.name === "Расход"
    ) {
      const baseFields = {
        company: z.string().min(1, "Компания обязательна"),
        operation: z.string().min(1, "Вид операции обязателен"),
        amount: z
          .string()
          .min(1, "Сумма обязательна")
          .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Сумма должна быть положительным числом",
          }),
        currency: z.string().min(1, "Валюта обязательна"),
        payment_type: z.string().min(1, "Способ оплаты обязателен"),
        date_finish: z.string().min(1, "Дата обязательна"),
        comment: z.string().optional(),
        wallet: z
          .string()
          .min(1, "Кошелёк обязателен")
          .refine((val) => wallets.find((w) => String(w.id) === val), {
            message: "Выберите действительный кошелёк",
          }),
        wallet_from: z.string().optional(),
        wallet_to: z.string().optional(),
        counterparty: z.string().optional(),
      };

      const shouldValidateCategory =
        formData.category && formData.category !== "";
      const shouldValidateArticle = formData.article && formData.article !== "";

      if (shouldValidateCategory) {
        const fieldsWithCategory = {
          ...baseFields,
          category: z
            .string()
            .min(1, "Категория обязательна")
            .refine(
              (val) =>
                operationCategories[String(selectedOperation?.id)]?.includes(
                  val
                ),
              { message: "Выберите действительную категорию" }
            ),
        };

        if (shouldValidateArticle) {
          return z.object({
            ...fieldsWithCategory,
            article: z
              .string()
              .min(1, "Статья обязательна")
              .refine(
                (val) => categoryArticles[formData.category]?.includes(val),
                { message: "Выберите действительную статью" }
              ),
          });
        } else {
          return z.object({
            ...fieldsWithCategory,
            article: z.string().optional(),
          });
        }
      } else {
        return z.object({
          ...baseFields,
          category: z.string().optional(),
          article: z.string().optional(),
        });
      }
    }

    return baseSchema;
  };

  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  useEffect(() => {
    const operation = operation_types.find(
      (op) => op.id === Number(formData.operation)
    );
    if (operation && operationCategories[String(operation.id)]) {
      dispatch(resetAccountingFields());
      if (operation.name !== "Перемещение") {
        dispatch(setFormDataField({ name: "wallet_from", value: "" }));
        dispatch(setFormDataField({ name: "wallet_to", value: "" }));
      }
    }
  }, [
    formData.operation,
    operationCategories,
    operation_types,
    dispatch,
    counterparties,
    wallets,
  ]);

  useEffect(() => {
    if (formData.category && categoryArticles[formData.category]) {
      dispatch(resetAccountType());
    }
  }, [formData.category, categoryArticles, dispatch]);

  useEffect(() => {
    const selectedOperation = operation_types.find(
      (op) => op.id === Number(formData.operation)
    );

    if (
      success &&
      (selectedOperation?.name === "Выставить счёт" ||
        selectedOperation?.name === "Выставить расход")
    ) {
      setIsModalOpen(true);
    } else if (success) {
      const timer = setTimeout(() => dispatch(setSuccess(false)), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, operation_types, formData.operation]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(
        () => dispatch(setFormDataField({ name: "error", value: "" })),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(setFormDataField({ name: "category", value: "" }));
    dispatch(setFormDataField({ name: "article", value: "" }));
  }, [formData.company, dispatch]);

  const handleChange = (name: string, value: string) => {
    dispatch(setFormDataField({ name, value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      handleChange("date", date.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationSchema = getValidationSchema();

    const result = validationSchema.safeParse(formData);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      setValidationErrors(
        Object.keys(errors).reduce(
          (acc, key) => ({
            ...acc,
            [key]: (errors as Record<string, string[]>)[key]?.[0] || "",
          }),
          {}
        )
      );
      dispatch(
        setFormDataField({
          name: "error",
          value: "Заполните все обязательные поля корректно",
        })
      );
      return;
    }

    const selectedOperation = operation_types.find(
      (op) => op.id === Number(formData.operation)
    );

    try {
      await dispatch(
        submitForm({
          ...formData,
          operation_types,
          wallets,
          companies,
          currencies,
          counterparties,
          username,
        })
      ).unwrap();

      if (
        selectedOperation?.name === "Выставить счёт" ||
        selectedOperation?.name === "Выставить расход"
      ) {
        const invoiceResponse = await fetchInvoices();
        const invoices = invoiceResponse.items || [];

        const latestInvoice = invoices.reduce(
          (latest: Invoice | null, current: Invoice) => {
            if (!latest || current.id > latest.id) {
              return current;
            }
            return latest;
          },
          null
        );

        if (latestInvoice) {
          setCreatedInvoice(latestInvoice);
          setIsModalOpen(true);
        } else {
          dispatch(
            setFormDataField({
              name: "error",
              value: "Не удалось загрузить созданный счет",
            })
          );
        }

        await refreshInvoices();
      }
    } catch (err) {
      dispatch(setFormDataField({ name: "error", value: String(err) }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCreatedInvoice(null);
    dispatch(setSuccess(false));
  };

  const operationOptions = createOptions(
    operation_types,
    "id",
    (op) => op.name
  );
  const paymentOptions = createOptions(paymentTypes, "id", (pt) => pt.name);
  const walletOptions = createOptions(wallets, "id", (w) => `${w.name} `);
  const currencyOptions = createOptions(currencies, "code", (c) => c.name);
  const companyOptions = createOptions(companies, "id", (c) => c.name);
  const counterpartyOptions = createOptions(
    counterparties,
    "id",
    (cp) => cp.full_name
  );

  const selectedOperation = operation_types.find(
    (op) => op.id === Number(formData.operation)
  );

  const isCounterpartyFieldVisible =
    selectedOperation?.name === "Выставить расход" ||
    selectedOperation?.name === "Выставить счёт";

  const areRequiredFieldsFilled = (() => {
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
        (op) => op.id === Number(formData.operation)
      );

      if (selectedOperation?.name === "Перемещение") {
        return (
          formData.wallet_from &&
          formData.wallet_to &&
          formData.wallet_from.trim() !== "" &&
          formData.wallet_to.trim() !== ""
        );
      } else if (
        selectedOperation?.name === "Выставить счёт" ||
        selectedOperation?.name === "Выставить расход"
      ) {
        return formData.counterparty && formData.counterparty.trim() !== "";
      } else if (
        selectedOperation?.name === "Приход" ||
        selectedOperation?.name === "Расход"
      ) {
        return formData.wallet && formData.wallet.trim() !== "";
      }

      return true;
    } catch (error) {
      return false;
    }
  })();

  const shouldShowSuccessMessage =
    success &&
    selectedOperation?.name !== "Выставить счёт" &&
    selectedOperation?.name !== "Выставить расход";

  return (
    <form
      onSubmit={handleSubmit}
      className="py-10 px-4 bg-white flex flex-col gap-2.5 w-full h-screen mx-auto mt-1.5 rounded-t-[13px]"
    >
      <SelectField
        name="company"
        value={formData.company}
        options={companyOptions} 
        placeholder="Компания *"
        onChange={handleChange}
        required
        error={validationErrors.company}
        className="mb-3.5 w-full text-sm text-black placeholder:text-gray-400"
      />
      <div className="relative mb-3.5">
        <DatePicker
          value={formData.date ? new Date(formData.date) : undefined}
          onChange={handleDateChange}
          className={
            validationErrors.date ? "border-red-500" : "text-black"
          }
        />
        {validationErrors.date && <ErrorMessage />}
      </div>
      <SelectField
        name="operation"
        value={formData.operation}
        options={operationOptions}
        placeholder="Вид операции *"
        onChange={handleChange}
        required
        error={validationErrors.operation}
        className="mb-3.5 w-full text-sm text-black placeholder:text-gray-400"
      />
      {selectedOperation?.name === "Перемещение" ? (
        <TransferForm
          formData={formData}
          wallets={wallets.map((wallet) => ({
            ...wallet,
            username: username || "unknown",
          }))}
          handleChange={handleChange}
          errors={validationErrors}
        />
      ) : (
        <NoneTransferForm
          formData={formData}
          operation_types={operation_types}
          operationCategories={operationCategories}
          categoryArticles={categoryArticles}
          companies={companies}
          handleChange={handleChange}
          errors={validationErrors}
        />
      )}
      <div className="flex sm:flex-row gap-3 sm:gap-5 mb-3.5">
        <Input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          placeholder="Сумма *"
          className="grow text-sm text-black placeholder:text-gray-400"
          required
          error={validationErrors.amount}
        />
        <SelectField
          name="currency"
          value={formData.currency}
          options={currencyOptions}
          placeholder="Валюта *"
          onChange={handleChange}
          required
          error={validationErrors.currency}
          className="text-sm text-black truncate placeholder:text-gray-400"
        />
      </div>
      <SelectField
        name="payment_type"
        value={formData.payment_type}
        options={paymentOptions}
        placeholder="Способ оплаты *"
        onChange={handleChange}
        required
        error={validationErrors.payment_type}
        className="w-full text-sm text-black truncate mb-3.5 placeholder:text-gray-400"
      />
      <Textarea
        name="comment"
        value={formData.comment}
        onChange={(e) => handleChange("comment", e.target.value)}
        placeholder="Назначение платежа"
        className="my-1 min-h-[70px]"
      />
      {isCounterpartyFieldVisible ? (
        <SelectField
          name="counterparty"
          value={formData.counterparty}
          options={counterpartyOptions}
          placeholder="Выберите контрагента *"
          onChange={handleChange}
          required
          error={validationErrors.counterparty}
          className="my-3.5 w-full text-sm text-black placeholder:text-gray-400"
        />
      ) : (
        selectedOperation?.name !== "Перемещение" && (
          <SelectField
            name="wallet"
            value={formData.wallet}
            options={walletOptions}
            placeholder="Кошелёк *"
            onChange={handleChange}
            required={
              selectedOperation?.name === "Приход" ||
              selectedOperation?.name === "Расход"
            }
            error={validationErrors.wallet}
            className="my-3.5 w-full text-sm text-black"
          />
        )
      )}
      <Button
        type="submit"
        disabled={loading || !areRequiredFieldsFilled}
        className="mb-3.5 w-full bg-[#25fcf1] hover:bg-[#25fcf1aa] text-black font-light p-5 rounded-[8px] text-sm sm:text-base"
      >
        Отправить
      </Button>
      {loading && <Loader />}
      {shouldShowSuccessMessage && <SuccessMessage />}
      {error && <ErrorMessage />}
      <CounterpartyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        invoice={createdInvoice}
        refreshInvoices={refreshInvoices}
      />
    </form>
  );
};

export default ReportForm;
