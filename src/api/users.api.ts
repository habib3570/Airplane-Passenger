import { apiClient } from "./client";
import type { UserDto, UpdateProfileRequest, PassportDto } from "../types/dto";

export async function getMyProfile(): Promise<UserDto> {
  const { data } = await apiClient.get<UserDto>("/users/profile");
  return data;
}

export async function updateProfile(
  payload: UpdateProfileRequest
): Promise<UserDto> {
  const { data } = await apiClient.put<UserDto>("/users/profile", payload);
  return data;
}

export async function updatePassport(payload: PassportDto): Promise<void> {
  await apiClient.put("/users/passport", payload);
}