"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { fetchCurrentUser, initializeToken } from "./slices/authSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dispatch initializeToken to populate token on client side
    store.dispatch(initializeToken());
    // Dispatch fetchCurrentUser on initial load
    store.dispatch(fetchCurrentUser());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
