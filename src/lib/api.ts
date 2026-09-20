import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept response errors to format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    let message =
      data?.error?.message || // { error: { message: "..." } }
      data?.message || // { message: "..." }
      (typeof data?.error === "string" ? data.error : null) || // { error: "..." }
      error.message || // Axios error message
      "An unexpected error occurred. Please try again.";

    // Convert technical database / pool / network errors to friendly user messages
    if (
      /pool timeout|failed to retrieve a connection|mariadb|mysql|prisma|ETIMEDOUT|ECONNREFUSED|ECONNRESET|database connection|not allowed to connect|access denied/i.test(
        message
      )
    ) {
      message =
        "Service is temporarily unavailable due to database connectivity. Please try again shortly.";
    } else if (/Network Error/i.test(message)) {
      message =
        "Unable to reach the server. Please check your internet connection.";
    }

    return Promise.reject(new Error(message));
  }
);
