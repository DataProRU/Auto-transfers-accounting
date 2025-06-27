import React, { useEffect, useState } from "react";
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
import TransferForm from "../TransferForm/TransferForm";
import NoneTransferForm from "../NoneTransferForm/NoneTransferForm";
import SuccessMessage from "@/ui/success-message";
import Loader from "@/ui/loader";

const ReportForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    formData,
    operations,
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
  const username = params.get("username") || "admin";

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

  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  useEffect(() => {
    console.log("Counterparties loaded:", counterparties);
    console.log("Wallets loaded:", wallets);
    console.log("Operations loaded:", operations);
    const operation = operations.find(
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
    operations,
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
    if (success) {
      const timer = setTimeout(() => dispatch(setSuccess(false)), 1000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(
        () => dispatch(setFormDataField({ name: "error", value: "" })),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleChange = (name: string, value: string) => {
    dispatch(setFormDataField({ name, value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      handleChange("date", date.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called with formData:", formData);
    console.log("operations:", operations);
    console.log("wallets:", wallets);
    console.log("companies:", companies);
    console.log("currencies:", currencies);
    console.log("counterparties:", counterparties);
    console.log(
      "counterpartyOptions:",
      createOptions(counterparties, "id", (cp) => cp.full_name)
    );

    if (
      !formData.company ||
      !formData.operation ||
      !formData.amount ||
      !formData.currency ||
      !formData.payment_type
    ) {
      console.error("Required fields are missing:", {
        company: formData.company,
        operation: formData.operation,
        amount: formData.amount,
        currency: formData.currency,
        payment_type: formData.payment_type,
      });
      dispatch(
        setFormDataField({
          name: "error",
          value: "Заполните все обязательные поля",
        })
      );
      return;
    }

    const selectedOperation = operations.find(
      (op) => op.id === Number(formData.operation)
    );

    if (!selectedOperation) {
      console.error("No valid operation selected");
      dispatch(
        setFormDataField({
          name: "error",
          value: "Выберите действительную операцию",
        })
      );
      return;
    }

    if (
      (selectedOperation.name === "Выставить счёт" ||
        selectedOperation.name === "Выставить расход") &&
      (!formData.counterparty ||
        !counterparties.find((cp) => String(cp.id) === formData.counterparty))
    ) {
      console.error(
        "Counterparty is required and must be valid for operation:",
        selectedOperation.name
      );
      dispatch(
        setFormDataField({
          name: "error",
          value: "Выберите действительного контрагента для этой операции",
        })
      );
      return;
    }

    if (
      selectedOperation.name === "Перемещение" &&
      (!formData.wallet_from ||
        !formData.wallet_to ||
        !wallets.find((w) => String(w.id) === formData.wallet_from) ||
        !wallets.find((w) => String(w.id) === formData.wallet_to))
    ) {
      console.error(
        "Valid wallet_from and wallet_to are required for Перемещение"
      );
      dispatch(
        setFormDataField({
          name: "error",
          value: "Выберите действительные кошельки для перемещения",
        })
      );
      return;
    }

    if (
      (selectedOperation.name === "Приход" ||
        selectedOperation.name === "Расход") &&
      (!formData.wallet ||
        !wallets.find((w) => String(w.id) === formData.wallet))
    ) {
      console.error(
        "Valid wallet is required for operation:",
        selectedOperation.name
      );
      dispatch(
        setFormDataField({
          name: "error",
          value: "Выберите действительный кошелёк для этой операции",
        })
      );
      return;
    }

    if (selectedOperation.name !== "Перемещение") {
      if (
        formData.category &&
        !operationCategories[String(selectedOperation.id)]?.includes(
          formData.category
        )
      ) {
        console.error(
          "Invalid category selected for operation:",
          selectedOperation.name
        );
        dispatch(
          setFormDataField({
            name: "error",
            value: "Выберите действительную категорию",
          })
        );
        return;
      }

      if (
        formData.article &&
        !categoryArticles[formData.category]?.includes(formData.article)
      ) {
        console.error(
          "Invalid article selected for category:",
          formData.category
        );
        dispatch(
          setFormDataField({
            name: "error",
            value: "Выберите действительную статью",
          })
        );
        return;
      }
    }

    console.log("Submitting payload:", {
      ...formData,
      operation_name: selectedOperation.name,
      username,
    });

    dispatch(
      submitForm({
        ...formData,
        operations,
        wallets,
        companies,
        currencies,
        counterparties,
        username,
      })
    )
      .unwrap()
      .then(() => {
        console.log("Form submission successful");
      })
      .catch((err) => {
        console.error("submitForm error:", err);
        dispatch(setFormDataField({ name: "error", value: String(err) }));
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleViewAccount = () => {
    const selectedCounterparty = counterparties.find(
      (cp) => String(cp.id) === formData.counterparty
    );
    if (selectedCounterparty) {
      setIsModalOpen(true);
    } else {
      alert("Выберите контрагента для просмотра счета.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const operationOptions = createOptions(operations, "id", (op) => op.name);
  const paymentOptions = createOptions(paymentTypes, "id", (pt) => pt.name);
  const walletOptions = createOptions(
    wallets,
    "id",
    (w) => `${w.name} (user_id: ${w.user_id})`
  );
  const currencyOptions = createOptions(currencies, "code", (c) => c.name);
  const companyOptions = createOptions(companies, "id", (c) => c.name);
  const counterpartyOptions = createOptions(
    counterparties,
    "id",
    (cp) => cp.full_name
  );

  const selectedOperation = operations.find(
    (op) => op.id === Number(formData.operation)
  );

  const isCounterpartyFieldVisible =
    selectedOperation?.name === "Выставить расход" ||
    selectedOperation?.name === "Выставить счёт";

  const areRequiredFieldsFilled = (() => {
    if (
      !formData.company ||
      !formData.operation ||
      !formData.amount ||
      !formData.currency ||
      !formData.payment_type
    ) {
      return false;
    }
    if (selectedOperation?.name === "Перемещение") {
      return (
        !!formData.wallet_from &&
        !!formData.wallet_to &&
        wallets.find((w) => String(w.id) === formData.wallet_from) &&
        wallets.find((w) => String(w.id) === formData.wallet_to)
      );
    }
    if (
      selectedOperation?.name === "Выставить счёт" ||
      selectedOperation?.name === "Выставить расход"
    ) {
      return (
        !!formData.counterparty &&
        counterparties.find((cp) => String(cp.id) === formData.counterparty)
      );
    }
    if (
      selectedOperation?.name === "Приход" ||
      selectedOperation?.name === "Расход"
    ) {
      return (
        !!formData.wallet &&
        wallets.find((w) => String(w.id) === formData.wallet)
      );
    }
    return true;
  })();

  const isViewAccountButtonVisible =
    (selectedOperation?.name === "Выставить счёт" ||
      selectedOperation?.name === "Выставить расход") &&
    areRequiredFieldsFilled;

  useEffect(() => {
    // Сбрасываем category и article при смене компании
    dispatch(setFormDataField({ name: "category", value: "" }));
    dispatch(setFormDataField({ name: "article", value: "" }));
  }, [formData.company, dispatch]);
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
        className="mb-3.5 w-full text-sm text-black placeholder:text-gray-400"
      />
      <div className="relative mb-3.5">
        <DatePicker
          value={formData.date ? new Date(formData.date) : undefined}
          onChange={handleDateChange}
          disabled={true}
          className="text-black"
        />
      </div>
      <SelectField
        name="operation"
        value={formData.operation}
        options={operationOptions}
        placeholder="Вид операции *"
        onChange={handleChange}
        required
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
        />
      ) : (
        <NoneTransferForm
          formData={formData}
          operations={operations}
          operationCategories={operationCategories}
          categoryArticles={categoryArticles}
          companies={companies} // Передаём companies
          handleChange={handleChange}
        />
      )}
      <div className="flex sm:flex-row gap-3 sm:gap-5 mb-3.5">
        <Input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          placeholder="Сумма *"
          className="w-1/2"
          required
        />
        <SelectField
          name="currency"
          value={formData.currency}
          options={currencyOptions}
          placeholder="Валюта *"
          onChange={handleChange}
          required
          className="w-1/2 text-sm text-black truncate placeholder:text-gray-400"
        />
      </div>
      <SelectField
        name="payment_type"
        value={formData.payment_type}
        options={paymentOptions}
        placeholder="Способ оплаты *"
        onChange={handleChange}
        required
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
            className="my-3.5 w-full text-sm text-black"
          />
        )
      )}
      {isViewAccountButtonVisible && (
        <Button
          type="button"
          className="mb-3.5 w-full bg-yellow-400 hover:bg-[#25fcf1aa] text-black font-light p-5 rounded-[8px] text-sm sm:text-base"
          onClick={handleViewAccount}
        >
          Посмотреть счет
        </Button>
      )}
      <Button
        type="submit"
        disabled={loading || !areRequiredFieldsFilled}
        className="mb-3.5 w-full bg-[#25fcf1] hover:bg-[#25fcf1aa] text-black font-light p-5 rounded-[8px] text-sm sm:text-base"
      >
        Отправить
      </Button>
      {loading && <Loader />}
      {success && <SuccessMessage />}
      {error && <ErrorMessage />}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800/40 bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-2xl w-11/12 max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Информация о контрагенте
            </h2>
            <div className="space-y-3">
              {counterparties.find(
                (cp) => String(cp.id) === formData.counterparty
              ) && (
                <>
                  <p className="text-gray-700">
                    <strong>Контрагент:</strong>{" "}
                    {
                      counterparties.find(
                        (cp) => String(cp.id) === formData.counterparty
                      )?.full_name
                    }
                  </p>
                  <p className="text-gray-700">
                    <strong>ID:</strong> {formData.counterparty}
                  </p>
                  <p className="text-gray-700">
                    <strong>Сумма:</strong> {formData.amount || "Не указана"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Дата создания:</strong>{" "}
                    {formData.date || "Не указана"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Статус:</strong> {"Ожидает оплаты"}
                  </p>
                </>
              )}
            </div>
            <div className="mt-4 space-x-2 flex">
              <Button
                className=" f sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-light py-2 px-4 rounded-lg"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Ссылка скопирована!");
                }}
              >
                Скопировать ссылку
              </Button>
              <Button
                className=" sm:w-auto bg-green-500 hover:bg-green-600 text-white font-light py-2 px-4 rounded-lg"
                onClick={() => {
                  dispatch(
                    setFormDataField({ name: "status", value: "Оплачен" })
                  );
                  closeModal();
                }}
              >
                Отметить оплаченным
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ReportForm;
