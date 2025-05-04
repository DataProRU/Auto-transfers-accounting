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
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.textarea}
      required={required}
    />
  );
}

export default Textarea;
