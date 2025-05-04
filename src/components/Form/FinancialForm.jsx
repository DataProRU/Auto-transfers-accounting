import styles from "./FinancialForm.module.css";
import Input from "../../UI/Input/Input";
import Select from "../../UI/Select/Select";
import Button from "../../UI/Button/Button";
import Loader from "../../UI/Loader/Loader";
import SuccessMessage from "../../UI/SuccessMessage/SuccessMessage";
import TransferFields from "./TransferFields";
import NonTransferFields from "./NonTransferFields";
import  useFinancialForm  from "../../hooks/useFinancialForm";

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
          label=""
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={(value) => handleChange("date")(value)}
          placeholder="Выберите дату"
          required
        />

        <Select
          label=""
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
