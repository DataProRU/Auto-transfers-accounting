import { useState, useEffect } from "react";

const operationTypes = [
  { value: "Доход", label: "Доход" },
  { value: "Расход", label: "Расход" },
  { value: "Перемещение", label: "Перемещение" },
];

const wallets = [
  { value: "wallet1", label: "Кошелёк 1 (user1)" },
  { value: "wallet2", label: "Кошелёк 2 (user2)" },
];

const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "RUB", label: "RUB (₽)" },
];

const paymentTypes = [
  { value: "card", label: "Карта" },
  { value: "cash", label: "Наличные" },
];

const operationCategories = {
  Доход: ["Зарплата", "Инвестиции"],
  Расход: ["Продукты", "Транспорт"],
  Перемещение: [],
};

const categoryArticles = {
  Зарплата: ["Основная", "Премия"],
  Инвестиции: ["Дивиденды", "Проценты"],
  Продукты: ["Еда", "Напитки"],
  Транспорт: ["Такси", "Общественный транспорт"],
};

function useFinancialForm() {
  const [formData, setFormData] = useState({
    date: "",
    operationType: null,
    walletFrom: null,
    walletTo: null,
    accountingType: null,
    accountType: null,
    dateFinish: "",
    amount: "",
    currency: null,
    paymentType: null,
    comment: "",
    wallet: null,
  });
  const [isTransfer, setIsTransfer] = useState(false);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      date: today,
    }));
  }, []);

  useEffect(() => {
    const selectedOperation = formData.operationType?.value;
    setIsTransfer(selectedOperation === "Перемещение");

    if (selectedOperation && operationCategories[selectedOperation]) {
      setCategories(
        operationCategories[selectedOperation].map((cat) => ({
          value: cat,
          label: cat,
        }))
      );
    } else {
      setCategories([]);
    }

    if (selectedOperation === "Перемещение") {
      setFormData((prev) => ({
        ...prev,
        accountingType: null,
        accountType: null,
        dateFinish: "",
        paymentType: null,
        currency: null,
        wallet: null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        walletFrom: null,
        walletTo: null,
      }));
    }
  }, [formData.operationType]);

  useEffect(() => {
    const selectedCategory = formData.accountingType?.value;
    if (selectedCategory && categoryArticles[selectedCategory]) {
      setArticles(
        categoryArticles[selectedCategory].map((article) => ({
          value: article,
          label: article,
        }))
      );
    } else {
      setArticles([]);
    }
  }, [formData.accountingType]);

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);

    const submitData = {
      date: formData.date,
      operation_type: formData.operationType?.value,
      wallet_from: formData.walletFrom?.value,
      wallet_to: formData.walletTo?.value,
      accounting_type: formData.accountingType?.value,
      account_type: formData.accountType?.value,
      date_finish: formData.dateFinish,
      amount: formData.amount,
      currency: formData.currency?.value,
      payment_type: formData.paymentType?.value,
      comment: formData.comment,
      wallet: formData.wallet?.value,
    };

    try {
      const response = await fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error("Ошибка при отправке данных");

      setIsLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      setFormData({
        date: new Date().toISOString().split("T")[0],
        operationType: null,
        walletFrom: null,
        walletTo: null,
        accountingType: null,
        accountType: null,
        dateFinish: "",
        amount: "",
        currency: null,
        paymentType: null,
        comment: "",
        wallet: null,
      });
    } catch (error) {
      setIsLoading(false);
      alert("Произошла ошибка: " + error.message);
    }
  };

  return {
    formData,
    isTransfer,
    categories,
    articles,
    isLoading,
    showSuccess,
    handleChange,
    handleSubmit,
    operationTypes,
    wallets,
    currencies,
    paymentTypes,
  };
}

export default useFinancialForm;
