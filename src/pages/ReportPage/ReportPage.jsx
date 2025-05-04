import styles from "./ReportPage.module.css";
import FinancialForm from "../../components/Form/FinancialForm";
import Header from "../../components/Header/Header";
function ReportPage() {
  return (
    <div className={styles.formContainer}>
      <Header />
      <FinancialForm />
    </div>
  );
}

export default ReportPage;
