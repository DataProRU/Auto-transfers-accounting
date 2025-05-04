import styles from "./FinancialForm.module.css";
import Select from "../../UI/Select/Select";
import Input from "../../UI/Input/Input";
import Textarea from "../../UI/Textarea/Textarea";

function NonTransferFields({
  formData,
  handleChange,
  categories,
  articles,
  currencies,
  paymentTypes,
  wallets,
}) {
  return (
    <>
      <div className={styles.horizontalContainer}>
        <div>
          <Select
            label=""
            id="accounting_type"
            name="accounting_type"
            value={formData.accountingType}
            onChange={handleChange("accountingType")}
            options={categories}
            placeholder="Выберите категорию"
            required
            isSearchable={false}
          />
        </div>
        <div>
          <Select
            label=""
            id="account_type"
            name="account_type"
            value={formData.accountType}
            onChange={handleChange("accountType")}
            options={articles}
            placeholder="Выберите статью"
            required
            isSearchable={false}
          />
        </div>
      </div>

      <Input
        label=""
        id="date_finish"
        name="date_finish"
        type="date"
        value={formData.dateFinish}
        onChange={(value) => handleChange("dateFinish")(value)}
        placeholder="Выберите дату назначения"
        required
      />

      <div className={styles.horizontalContainer}>
        <div>
          <Input
            label=" "
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={(value) => handleChange("amount")(value)}
            placeholder="Введите сумму"
            required
          />
        </div>
        <div>
          <Select
            label=""
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange("currency")}
            options={currencies}
            placeholder="Выберите валюту"
            required
            isSearchable={false}
          />
        </div>
      </div>

      <Select
        label=""
        id="payment_type"
        name="payment_type"
        value={formData.paymentType}
        onChange={handleChange("paymentType")}
        options={paymentTypes}
        placeholder="Выберите тип оплаты"
        required
        isSearchable={false}
      />

      <Textarea
        label=""
        id="comment"
        name="comment"
        value={formData.comment}
        onChange={(e) => handleChange("comment")(e.target.value)}
        placeholder="Введите комментарий"
      />

      <div id="wallet">
        <Select
          label=""
          id="wallet_select"
          name="wallet"
          value={formData.wallet}
          onChange={handleChange("wallet")}
          options={wallets}
          placeholder="Выберите кошелёк"
        />
      </div>
    </>
  );
}

export default NonTransferFields;
