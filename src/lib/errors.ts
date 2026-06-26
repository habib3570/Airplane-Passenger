import { isAxiosError } from "axios";

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    return (
      err.response?.data?.detail ||
      err.response?.data?.title ||
      err.message ||
      "Something went wrong. Please try again."
    );
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}