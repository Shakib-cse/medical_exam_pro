import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User, authApi } from "@/lib/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  return {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  };
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getCurrentUser();
      if (res.data?.user) {
        return res.data.user;
      }
      return rejectWithValue("No user found");
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    initializeToken: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
          state.token = token;
          const userStr = localStorage.getItem("auth_user");
          if (userStr) {
            try {
              state.user = JSON.parse(userStr);
              state.isAuthenticated = true;
            } catch {}
          }
        }
      }
    },
    setSession: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("practice_session_update"));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        document.cookie = "auth_token=; path=/; max-age=0;";
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("practice_session_update"));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(action.payload));
        window.dispatchEvent(new Event("storage"));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        if (typeof window !== "undefined" && action.payload) {
          localStorage.setItem("auth_user", JSON.stringify(action.payload));
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("practice_session_update"));
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          document.cookie = "auth_token=; path=/; max-age=0;";
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("practice_session_update"));
        }
      });
  },
});

export const { setSession, logout, setLoading, initializeToken, updateUser } = authSlice.actions;

export default authSlice.reducer;
