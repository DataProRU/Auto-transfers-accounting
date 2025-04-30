import useFinancialForm from "../../hooks/useFinancialForm";
import Input from "../../UI/Input/Input";
import Select from "../../UI/Select/Select";
import styles from "./FinancialForm.module.css";
import NonTransferFields from "./NonTransferFields";
import TransferFields from "./TransferFields";
import Loader from "../../UI/Loader/Loader";
import Button from "../../UI/Button/Button";
import SuccessMessage from "../../UI/SuccessMessage/SuccessMessage";

function FinancialForm() {
  const {
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
  } = useFinancialForm();

  return (
    <div style={{ position: "relative" }}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Дата:"
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date")(e.target.value)}
          required
        />

        <Select
          label="Вид операции:"
          id="operation_type"
          name="operation_type"
          value={formData.operationType}
          onChange={handleChange("operationType")}
          options={operationTypes}
          placeholder="Выберите вид операции"
          required
          isSearchable={false}
        />

        {isTransfer && (
          <TransferFields
            formData={formData}
            handleChange={handleChange}
            wallets={wallets}
          />
        )}

        {!isTransfer && (
          <NonTransferFields
            formData={formData}
            handleChange={handleChange}
            categories={categories}
            articles={articles}
            currencies={currencies}
            paymentTypes={paymentTypes}
            wallets={wallets}
          />
        )}

        <Button type="submit" disabled={isLoading}>
          Отправить
        </Button>
      </form>

      <Loader isVisible={isLoading} />
      <SuccessMessage isVisible={showSuccess} />
    </div>
  );
}

export default FinancialForm;
