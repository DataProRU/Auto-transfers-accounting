import React, { useState } from "react";
import { Button } from "@/ui/button";
import Header from "@/components/Header/Header";
import { Link } from "react-router-dom";

const InvoicePage: React.FC = () => {
  const [view, setView] = useState<"contractors" | "expenses" | null>(null);

  const handleCreateInvoice = () => {
    setView("contractors");
  };

  const handleViewContracts = () => {
    setView("expenses");
  };

  // Мок данных для счетов контрагентов
  const contractorInvoices = {
    issuer: "[XX]",
    amount: "[ХХХ ХХХ] $",
    items: [
      {
        number: 1,
        description: "[№ счета-фактуры 001], [Иван Иванов] от [2025-06-20]",
      },
      {
        number: 2,
        description: "[№ счета-фактуры 002], [Петр Петров] от [2025-06-19]",
      },
    ],
  };

  // Мок данных для счетов по расходам
  const expenseInvoices = {
    issuer: "[YY]",
    amount: "[YYY YYY] $",
    items: [
      {
        number: 1,
        description:
          "[№ расходного ордера 101], [Офисные расходы] от [2025-06-20]",
      },
      {
        number: 2,
        description: "[№ расходного ордера 102], [Транспорт] от [2025-06-18]",
      },
    ],
  };

  // Определяем данные в зависимости от выбранного вида
  const currentData =
    view === "contractors"
      ? contractorInvoices
      : view === "expenses"
      ? expenseInvoices
      : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto p-6 bg-white mt-6 rounded-[13px] shadow">
        {/* Кнопки с динамическим стилем */}
        <div className="flex justify-between mb-6">
          <Button
            onClick={handleCreateInvoice}
            className={`font-semibold py-2 px-4 rounded ${
              view === "contractors"
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-gray-300 text-black hover:bg-gray-200"
            }`}
          >
            Счета контрагентам
          </Button>
          <Button
            onClick={handleViewContracts}
            className={`font-semibold py-2 px-4 rounded ${
              view === "expenses"
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-gray-300 text-black hover:bg-gray-200"
            }`}
          >
            Счета по расходам
          </Button>
        </div>

        {/* Отображение данных */}
        {currentData ? (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Выставлено счёток: {currentData.issuer}
              </h2>
              <p className="text-md">На сумму: {currentData.amount}</p>
            </div>
            <ul className="list-decimal pl-5 mb-6">
              {currentData.items.map((item, index) => (
                <li key={index} className="mb-2 text-sm">
                  {item.description}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Выберите категорию для просмотра данных
          </p>
        )}

        {/* Кнопка "Назад" */}
        <div className="text-center">
          <Link
            to={`/tg_bot_add?username=${
              localStorage.getItem("username") || ""
            }`}
            className="inline-block bg-gray-300 text-black font-semibold py-2 px-4 rounded hover:bg-gray-200"
          >
            Назад
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
