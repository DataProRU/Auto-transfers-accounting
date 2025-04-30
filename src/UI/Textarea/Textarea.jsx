import styles from "./Textarea.module.css";

function Textarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.textarea}
        required={required}
      />
    </div>
  );
}

export default Textarea;
