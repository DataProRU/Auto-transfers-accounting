import { $api } from "@/setup/http/http";
import axios, { AxiosError } from "axios";

interface LoginResponse {
  access_token: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface VerifyResponse {
  valid: boolean;
  user?: {
    username: string;
    user_id: number;
    role: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await $api.post(
        `/login_react?username=${encodeURIComponent(
          credentials.username
        )}&password=${encodeURIComponent(credentials.password)}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.access_token;
      localStorage.setItem("access_token", token);
      document.cookie = `token=${token}; path=/;`;

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error("Проверьте имя пользователя и пароль");
        }
        if (
          error.response.data.detail &&
          Array.isArray(error.response.data.detail)
        ) {
          const errorMessages = error.response.data.detail
            .map((err: any) => err.msg)
            .filter(Boolean);
          throw new Error(errorMessages.join(", ") || "Ошибка авторизации");
        }
        throw new Error(
          error.response.data.detail?.[0]?.msg || "Ошибка авторизации"
        );
      }
      throw new Error("Ошибка сети. Попробуйте снова.");
    }
  },

  verify: async (token: string): Promise<VerifyResponse> => {
    try {
      const response = await $api.post("/verify", { access_token: token });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error("Токен недействителен");
        }
        throw new Error("Ошибка проверки токена");
      }
      throw new Error("Ошибка сети при проверке токена");
    }
  },

  refresh: async (): Promise<LoginResponse> => {
    try {
      const response = await $api.post("/refresh");
      const token = response.data.access_token;
      localStorage.setItem("access_token", token);
      document.cookie = `token=${token}; path=/;`;

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new Error("Не удалось обновить токен");
        }
        throw new Error("Ошибка обновления токена");
      }
      throw new Error("Ошибка сети при обновлении токена");
    }
  },
};

export const checkToken = async (token: string) => {
  try {
    return await authService.verify(token);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Unknown error occurred during token check");
  }
};
