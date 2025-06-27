import React from "react";
import { DatePicker } from "@/ui/date-picker";
import SelectField from "@/ui/select-field";
import type { Company } from "@/types/types";

interface NoneTransferFormProps {
  formData: {
    company: string; // Добавляем company в formData
    category: string;
    article: string;
    date_finish: string;
    operation: string;
  };
  operations: { id: number; name: string }[];
  operationCategories: Record<string, string[]>;
  categoryArticles: Record<string, string[]>;
  companies: Company[]; // Добавляем companies в пропсы
  handleChange: (name: string, value: string) => void;
}

const NoneTransferForm: React.FC<NoneTransferFormProps> = ({
  formData,
  operations,
  operationCategories,
  categoryArticles,
  companies,
  handleChange,
}) => {
  const selectedOperation = operations.find(
    (op) => op.id === Number(formData.operation)
  );
  const operationId = selectedOperation ? String(selectedOperation.id) : "";

  // Находим выбранную компанию
  const selectedCompany = companies.find(
    (company) => String(company.id) === formData.company
  );

  // Фильтруем категории только для выбранной компании и операции
  const categoryOptions = selectedCompany
    ? selectedCompany.categories
        .filter((cat) => cat.operation_id === Number(operationId))
        .map((cat, index) => ({
          value: cat.name,
          label: cat.name,
          key: `${cat.name}-${index}`,
        }))
    : [];

  // Формируем опции для статей на основе выбранной категории
  const articleOptions = selectedCompany
    ? selectedCompany.categories
        .find((cat) => cat.name === formData.category)
        ?.articles.map((art, index) => ({
          value: art.title,
          label: art.title,
          key: `${art.title}-${index}`,
        })) || []
    : [];

  const handleDateChange = (selectedDate: Date | undefined) => {
    handleChange(
      "date_finish",
      selectedDate ? selectedDate.toISOString().split("T")[0] : ""
    );
  };

  return (
    <>
      <div className="flex sm:flex-row gap-3 mb-3.5">
        <SelectField
          name="category"
          value={formData.category}
          options={categoryOptions}
          placeholder="Категория"
          onChange={handleChange}
          required
          className="w-full text-sm text-black placeholder:text-gray-400"
        />
        <SelectField
          name="article"
          value={formData.article}
          options={articleOptions}
          placeholder="Статья"
          onChange={handleChange}
          required
          className="w-full text-sm text-black placeholder:text-gray-400"
        />
      </div>
      <div className="date-wrapper mb-3.5">
        <DatePicker
          value={
            formData.date_finish ? new Date(formData.date_finish) : undefined
          }
          onChange={handleDateChange}
        />
      </div>
    </>
  );
};

export default NoneTransferForm;
