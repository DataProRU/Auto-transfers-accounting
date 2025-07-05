import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";

interface AuthState {
  username: string | null;
  access_token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: localStorage.getItem("username") || null,
  access_token: localStorage.getItem("access_token") || null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return {
        username: credentials.username,
        access_token: response.access_token,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка авторизации";
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verify",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.verify(token);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка проверки токена";
      return rejectWithValue(errorMessage);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refresh();
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка обновления токена";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ username: string; access_token: string }>
    ) {
      state.username = action.payload.username;
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("access_token", action.payload.access_token);
    },
    logout(state) {
      state.username = null;
      state.access_token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("username");
      localStorage.removeItem("access_token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.access_token = action.payload.access_token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("username", action.payload.username);
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Verify
    builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.valid && action.payload.user) {
          state.username = action.payload.user.username;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
          state.username = null;
          state.access_token = null;
          localStorage.removeItem("username");
          localStorage.removeItem("access_token");
        }
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.username = null;
        state.access_token = null;
        state.error = action.payload as string;
        localStorage.removeItem("username");
        localStorage.removeItem("access_token");
      });

    // Refresh
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.access_token = action.payload.access_token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.username = null;
        state.access_token = null;
        state.error = action.payload as string;
        localStorage.removeItem("username");
        localStorage.removeItem("access_token");
      });
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
