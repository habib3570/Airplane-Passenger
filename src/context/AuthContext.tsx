import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { UserDto, LoginRequest, RegisterRequest } from "../types/dto";
import * as authApi from "../api/auth.api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
    () => !!localStorage.getItem("p_accessToken")
  );

  useEffect(() => {
    const token = localStorage.getItem("p_accessToken");
    if (!token) return;
    let cancelled = false;
    authApi
      .getCurrentUser()
      .then((me) => { if (!cancelled) setUser(me); })
      .catch(() => { if (!cancelled) setUser(null); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function login(payload: LoginRequest) {
    await authApi.login(payload);
    const me = await authApi.getCurrentUser();
    if (me.role === "Admin") {
      await authApi.logout();
      throw new Error("Please use the Admin portal.");
    }
    setUser(me);
  }

  async function register(payload: RegisterRequest) {
    await authApi.register(payload);
    const me = await authApi.getCurrentUser();
    setUser(me);
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}