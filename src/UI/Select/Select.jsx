import ReactSelect from "react-select";
import styles from "./Select.module.css";

// Кастомные стили для react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    width: "100%",
    padding: "6px",
    marginBottom: "0px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",

    fontSize: "14px",
    color: "#000",

    backgroundColor: "#fff",

    cursor: "pointer",

    transition: "border-color 0.3s, box-shadow 0.3s",
  }),
  input: (provided) => ({
    ...provided,
    color: "#000",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#000",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#aaa",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "4px",
    backgroundColor: "#fff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#007BFF"
      : state.isFocused
      ? "#e6f0ff"
      : "#fff",
    color: state.isDisabled ? "#aaa" : state.isSelected ? "#fff" : "#000",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    "&:active": {
      backgroundColor: "#007BFF",
      color: "#fff",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#555",
    padding: "8px",
    svg: {
      width: "12px",
      height: "12px",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

function Select({
  label,
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  isSearchable = false,
}) {
  return (
    <div className={styles.distance}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <ReactSelect
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        styles={customStyles}
        isSearchable={isSearchable}
        required={required}
      />
    </div>
  );
}

export default Select;
