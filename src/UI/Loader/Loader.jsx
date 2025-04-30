import styles from "./Loader.module.css";

function Loader({ isVisible = false }) {
  return (
    <div
      className={styles.loader}
      style={{ display: isVisible ? "block" : "none" }}
    />
  );
}

export default Loader;
