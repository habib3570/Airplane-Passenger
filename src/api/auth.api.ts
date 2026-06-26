import { apiClient, setTokens, clearTokens } from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest, UserDto } from "../types/dto";

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function getCurrentUser(): Promise<UserDto> {
  const { data } = await apiClient.get<UserDto>("/auth/me");
  return data;
}

export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem("p_refreshToken");
  if (refreshToken) {
    try {
      await apiClient.post("/auth/revoke-token", { token: refreshToken });
    } catch {
      // ignore
    }
  }
  clearTokens();
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post("/auth/forgot-password", { email });
}

export async function resetPassword(
  token: string,
  email: string,
  newPassword: string
): Promise<void> {
  await apiClient.post("/auth/reset-password", { token, email, newPassword });
}

export async function verifyEmail(
  token: string,
  email: string
): Promise<void> {
  await apiClient.post("/auth/verify-email", { token, email });
}