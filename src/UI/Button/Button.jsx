import styles from "./Button.module.css";

function Button({ type = "button", children, disabled = false, onClick }) {
  return (
    <button
      type={type}
      className={styles.button}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
