import styles from "./SuccessMessage.module.css";

function SuccessMessage({
  isVisible = false,
  message = "Данные успешно загружены!",
}) {
  return (
    <div
      className={styles.successMessage}
      style={{ display: isVisible ? "block" : "none" }}
    >
      {message}
    </div>
  );
}

export default SuccessMessage;
