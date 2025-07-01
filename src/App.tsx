import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./hooks/hooks";
import { logout } from "./store/slices/authSlice";
import ReportFormPage from "./pages/ReportFormPage";
import LoginPage from "./pages/LoginPage";
import { checkToken } from "./services/authService";
import { AxiosError } from "axios";
import InvoicePage from "./pages/InvoicePage";

function App() {
  const { isAuthenticated, username } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const params = new URLSearchParams(location.search);
  const url_name = params.get("username");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    const checkAuth = async () => {
      if (!accessToken) {
        dispatch(logout());
        navigate("/tg_bot_add", { replace: true });
        return;
      }

      try {
        await checkToken(accessToken);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem("access_token");
          dispatch(logout());
          navigate("/tg_bot_add", { replace: true });
        } else {
          console.error("Token check failed:", error);
        }
      }
    };

    checkAuth();
    const intervalId = setInterval(checkAuth, 7 * 60 * 1000); 

    return () => clearInterval(intervalId);
  }, [navigate, dispatch]);

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route
            path="/tg_bot_add"
            element={username === url_name ? <ReportFormPage /> : <LoginPage />}
          />
          <Route path="/tg_bot_add/invoice" element={<InvoicePage />} />
        </>
      ) : (
        <Route path="*" element={<LoginPage />} />
      )}
    </Routes>
  );
}

export default App;
