import styles from "./FinancialForm.module.css";
import Select from "../../UI/Select/Select";
import Input from "../../UI/Input/Input";
import Textarea from "../../UI/Textarea/Textarea";

function TransferFields({ formData, handleChange, wallets }) {
  return (
    <>
      <div className={styles.horizontalContainer}>
        <div id="wallet_from">
          <Select
            label=""
            id="wallet_from_select"
            name="wallet_from"
            value={formData.walletFrom}
            onChange={handleChange("walletFrom")}
            options={wallets}
            placeholder="Кошелёк (откуда):"
          />
        </div>
        <div id="wallet_to">
          <Select
            label=""
            id="wallet_to_select"
            name="wallet_to"
            value={formData.walletTo}
            onChange={handleChange("walletTo")}
            options={wallets}
            placeholder="Кошелёк (куда):"
          />
        </div>
      </div>

      <Input
        label=""
        id="amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={(e) => handleChange("amount")(e.target.value)}
        placeholder="Сумма"
        required
      />

      <Textarea
        label=""
        id="comment"
        name="comment"
        value={formData.comment}
        onChange={(e) => handleChange("comment")(e.target.value)}
        placeholder="Назначение платежа"
      />
    </>
  );
}

export default TransferFields;
