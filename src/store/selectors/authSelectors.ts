import type { RootState } from "../store";

// Базовые селекторы
export const selectAuth = (state: RootState) => state.auth;
export const selectUsername = (state: RootState): string | null => state.auth.username;
export const selectAccessToken = (state: RootState): string | null => state.auth.access_token;
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState): boolean => state.auth.loading;
export const selectAuthError = (state: RootState): string | null => state.auth.error;

// Вычисляемые селекторы
export const selectAuthStatus = (state: RootState) => {
  const isAuthenticated = selectIsAuthenticated(state);
  const loading = selectAuthLoading(state);
  const error = selectAuthError(state);
  
  if (loading) return "loading";
  if (error) return "error";
  if (isAuthenticated) return "authenticated";
  return "unauthenticated";
};

export const selectCanLogin = (state: RootState): boolean => {
  const loading = selectAuthLoading(state);
  const isAuthenticated = selectIsAuthenticated(state);
  
  return !loading && !isAuthenticated;
};

export const selectCanLogout = (state: RootState): boolean => {
  const loading = selectAuthLoading(state);
  const isAuthenticated = selectIsAuthenticated(state);
  
  return !loading && isAuthenticated;
}; 