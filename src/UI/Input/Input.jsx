import styles from "./Input.module.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Russian } from "flatpickr/dist/l10n/ru.js";
import calendarIcon from "../../assets/calendar.svg";
function Input({
  label,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  const handleChange = (date) => {
    const dateStr = date[0] ? date[0].toISOString().split("T")[0] : "";
    onChange(dateStr);
  };

  if (type === "date") {
    return (
      <div className={styles.inputWrapper}>
      
        <div className={styles.dateContainer}>
          <Flatpickr
            id={id}
            name={name}
            value={value || ""}
            onChange={handleChange}
            options={{
              dateFormat: "Y-m-d",
              locale: Russian,
              disableMobile: true,
              allowInput: false,
            }}
            className={`${styles.input} ${styles.dateInput}`}
            placeholder={placeholder || "Выберите дату"}
          />
          <img
            src={calendarIcon}
            alt="Calendar"
            className={styles.calendarIcon}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        required={required}
      />
    </div>
  );
}

export default Input;
