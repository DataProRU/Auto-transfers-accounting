import styles from "./Header.module.css";
import logo from "../../../public/logo.png";
function Header() {
  return (
    <div className={styles.header}>
      <img src={logo} alt="Логотип" />
      <h1>Финансовый отчёт</h1>
    </div>
  );
}

export default Header;
