import styles from "./Header.module.css";

function Header() {
  return (
    <div className={styles.header}>
      <img
        src="https://raw.githubusercontent.com/PavelErsh/images/refs/heads/main/bg.png"
        alt="Логотип"
      />
      <h1>Финансовый отчёт</h1>
    </div>
  );
}

export default Header;
