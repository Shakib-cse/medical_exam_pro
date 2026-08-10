import { api } from "./api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string;
  status: string;
  bio?: string;
  targetExam?: string;
  role?: {
    id: string;
    name: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  bio?: string;
  targetExam?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
  type: "verify_email" | "reset_password";
}

export interface ResendOtpPayload {
  email: string;
  type: "verify_email" | "reset_password";
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  password: string;
}

export interface AuthResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const res = await api.post<AuthResponse<{ message: string; user: User; token: string }>>(
      "/auth/register",
      payload
    );
    return res.data;
  },

  verifyOtp: async (payload: VerifyOtpPayload) => {
    const res = await api.post<AuthResponse<{ message: string; user?: User; token?: string }>>(
      "/auth/verify-otp",
      payload
    );
    return res.data;
  },

  resendOtp: async (payload: ResendOtpPayload) => {
    const res = await api.post<AuthResponse<{ message: string; otpCode?: string }>>(
      "/auth/resend-otp",
      payload
    );
    return res.data;
  },

  login: async (payload: LoginPayload) => {
    const res = await api.post<AuthResponse<{ message: string; user: User; token: string }>>(
      "/auth/login",
      payload
    );
    return res.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const res = await api.post<AuthResponse<{ message: string }>>(
      "/auth/forgot-password",
      payload
    );
    return res.data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const res = await api.post<AuthResponse<{ message: string }>>(
      "/auth/reset-password",
      payload
    );
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get<AuthResponse<{ message: string; user: User }>>("/auth/me");
    return res.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const res = await api.put<AuthResponse<{ message: string; user: User }>>(
      "/auth/profile",
      payload
    );
    return res.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const res = await api.put<AuthResponse<{ message: string }>>(
      "/auth/change-password",
      payload
    );
    return res.data;
  },
};
