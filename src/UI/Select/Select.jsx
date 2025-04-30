import ReactSelect from "react-select";
import styles from "./Select.module.css";

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: "100%",
    padding: "6px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#f9f9f9",
    boxSizing: "border-box",
    transition: "border-color 0.1s, box-shadow 0.1s",
    "&:hover": {
      borderColor: "#007BFF",
    },
    boxShadow: "none",
  }),
  input: (provided) => ({
    ...provided,
    color: "#555",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#555",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#555",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#007BFF"
      : state.isFocused
      ? "#e6f0ff"
      : "#f9f9f9",
    color: state.isSelected ? "#fff" : "#555",
    cursor: "pointer",
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
    <div>
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
